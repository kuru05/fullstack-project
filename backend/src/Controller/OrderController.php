<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/orders')]
#[OA\Tag(name: 'Commandes')]
class OrderController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private OrderRepository $orderRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_orders_list', methods: ['GET'])]
    #[OA\Get(summary: "Liste des commandes de l'utilisateur")]
    #[OA\Response(response: 200, description: 'Liste des commandes')]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if ($this->isGranted('ROLE_ADMIN')) {
            $orders = $this->orderRepository->findBy([], ['createdAt' => 'DESC']);
        } else {
            $orders = $this->orderRepository->findBy(
                ['user' => $user],
                ['createdAt' => 'DESC']
            );
        }

        $data = array_map(function (Order $order) {
            return $this->serializeOrder($order);
        }, $orders);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_orders_show', methods: ['GET'])]
    #[OA\Get(summary: "Détail d'une commande")]
    #[OA\Response(response: 200, description: 'Commande trouvée')]
    #[OA\Response(response: 403, description: 'Accès refusé')]
    #[OA\Response(response: 404, description: 'Commande non trouvée')]
    public function show(int $id): JsonResponse
    {
        $order = $this->orderRepository->find($id);

        if (!$order) {
            return $this->json(['error' => 'Commande non trouvée'], Response::HTTP_NOT_FOUND);
        }

        if (!$this->isGranted('ROLE_ADMIN') && $order->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        return $this->json($this->serializeOrder($order, true));
    }

    #[Route('', name: 'api_orders_create', methods: ['POST'])]
    #[OA\Post(summary: 'Créer une nouvelle commande')]
    #[OA\RequestBody(content: new OA\JsonContent(
        properties: [
            new OA\Property(
                property: 'items',
                type: 'array',
                items: new OA\Items(
                    properties: [
                        new OA\Property(property: 'productId', type: 'integer'),
                        new OA\Property(property: 'quantity', type: 'integer'),
                    ]
                )
            )
        ]
    ))]
    #[OA\Response(response: 201, description: 'Commande créée')]
    #[OA\Response(response: 400, description: 'Panier vide ou stock insuffisant')]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['items']) || empty($data['items'])) {
            return $this->json([
                'error' => 'Le panier est vide. Ajoutez des produits avant de commander.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $itemsToProcess = [];
        $stockErrors = [];

        foreach ($data['items'] as $itemData) {
            if (!isset($itemData['productId']) || !isset($itemData['quantity'])) {
                return $this->json([
                    'error' => 'Chaque item doit avoir un "productId" et une "quantity"'
                ], Response::HTTP_BAD_REQUEST);
            }

            $product = $this->entityManager->getRepository(Product::class)->find($itemData['productId']);

            if (!$product) {
                return $this->json([
                    'error' => sprintf('Produit #%d non trouvé', $itemData['productId'])
                ], Response::HTTP_BAD_REQUEST);
            }

            $quantity = (int) $itemData['quantity'];
            if ($quantity <= 0) {
                return $this->json([
                    'error' => 'La quantité doit être supérieure à 0'
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!$product->hasEnoughStock($quantity)) {
                $stockErrors[] = sprintf(
                    'Stock insuffisant pour "%s" (demandé: %d, disponible: %d)',
                    $product->getName(), $quantity, $product->getStock()
                );
            }

            $itemsToProcess[] = [
                'product' => $product,
                'quantity' => $quantity,
            ];
        }

        if (!empty($stockErrors)) {
            return $this->json([
                'error' => 'Stock insuffisant',
                'details' => $stockErrors
            ], Response::HTTP_BAD_REQUEST);
        }

        $order = new Order();
        $order->setUser($user);
        $order->setReference($this->orderRepository->generateReference());
        $order->setStatus(Order::STATUS_PENDING);

        foreach ($itemsToProcess as $item) {
            $product = $item['product'];
            $quantity = $item['quantity'];

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($quantity);
            $orderItem->setPrice($product->getPrice());

            $order->addOrderItem($orderItem);

            $product->decreaseStock($quantity);
        }

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $this->json($this->serializeOrder($order, true), Response::HTTP_CREATED);
    }

    #[Route('/{id}/status', name: 'api_orders_update_status', methods: ['PUT'])]
    #[OA\Put(summary: "Modifier le statut d'une commande (Admin)")]
    #[OA\RequestBody(content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'status', type: 'string', example: 'PAID')
        ]
    ))]
    #[OA\Response(response: 200, description: 'Statut mis à jour')]
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $order = $this->orderRepository->find($id);
        if (!$order) {
            return $this->json(['error' => 'Commande non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['status'])) {
            return $this->json(['error' => 'Le champ "status" est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        $order->setStatus($data['status']);

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeOrder($order));
    }

    private function serializeOrder(Order $order, bool $withItems = false): array
    {
        $data = [
            'id' => $order->getId(),
            'reference' => $order->getReference(),
            'status' => $order->getStatus(),
            'total' => $order->getTotal(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
            'user' => [
                'id' => $order->getUser()->getId(),
                'email' => $order->getUser()->getEmail(),
            ],
        ];

        if ($withItems) {
            $data['items'] = array_map(function (OrderItem $item) {
                return [
                    'id' => $item->getId(),
                    'quantity' => $item->getQuantity(),
                    'price' => (float) $item->getPrice(),
                    'subTotal' => $item->getSubTotal(),
                    'product' => [
                        'id' => $item->getProduct()->getId(),
                        'name' => $item->getProduct()->getName(),
                    ],
                ];
            }, $order->getOrderItems()->toArray());
        }

        return $data;
    }
}
