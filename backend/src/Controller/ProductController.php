<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/products')]
#[OA\Tag(name: 'Produits')]
class ProductController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ProductRepository $productRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_products_list', methods: ['GET'])]
    #[OA\Get(summary: 'Liste des produits avec pagination et filtres')]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'limit', in: 'query', schema: new OA\Schema(type: 'integer', default: 12))]
    #[OA\Parameter(name: 'category', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'minPrice', in: 'query', schema: new OA\Schema(type: 'number'))]
    #[OA\Parameter(name: 'maxPrice', in: 'query', schema: new OA\Schema(type: 'number'))]
    #[OA\Response(response: 200, description: 'Liste paginée des produits')]
    public function index(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 12)));
        $categoryId = $request->query->get('category') ? (int) $request->query->get('category') : null;
        $search = $request->query->get('search');
        $minPrice = $request->query->get('minPrice') ? (float) $request->query->get('minPrice') : null;
        $maxPrice = $request->query->get('maxPrice') ? (float) $request->query->get('maxPrice') : null;

        $result = $this->productRepository->findWithFilters(
            $page, $limit, $categoryId, $search, $minPrice, $maxPrice
        );

        $productsData = array_map(function (Product $product) {
            return $this->serializeProduct($product);
        }, $result['data']);

        return $this->json([
            'data' => $productsData,
            'pagination' => [
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit'],
                'totalPages' => $result['totalPages'],
            ]
        ]);
    }

    #[Route('/{id}', name: 'api_products_show', methods: ['GET'])]
    #[OA\Get(summary: "Détail d'un produit")]
    #[OA\Response(response: 200, description: 'Produit trouvé')]
    #[OA\Response(response: 404, description: 'Produit non trouvé')]
    public function show(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeProduct($product));
    }

    #[Route('', name: 'api_products_create', methods: ['POST'])]
    #[OA\Post(summary: 'Créer un nouveau produit (Admin)')]
    #[OA\RequestBody(content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'name', type: 'string'),
            new OA\Property(property: 'description', type: 'string'),
            new OA\Property(property: 'price', type: 'number'),
            new OA\Property(property: 'stock', type: 'integer'),
            new OA\Property(property: 'categoryId', type: 'integer'),
            new OA\Property(property: 'joules', type: 'number'),
        ]
    ))]
    #[OA\Response(response: 201, description: 'Produit créé')]
    #[OA\Response(response: 400, description: 'Données invalides')]
    #[OA\Response(response: 403, description: 'Accès refusé')]
    public function create(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
        }

        $category = $this->entityManager->getRepository(Category::class)
            ->find($data['categoryId'] ?? 0);

        if (!$category) {
            return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_BAD_REQUEST);
        }

        $product = new Product();
        $product->setName($data['name'] ?? '');
        $product->setDescription($data['description'] ?? '');
        $product->setPrice((string) ($data['price'] ?? 0));
        $product->setStock($data['stock'] ?? 0);
        $product->setCategory($category);

        if (isset($data['joules'])) {
            $product->setJoules((string) $data['joules']);
        }

        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $this->json($this->serializeProduct($product), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_products_update', methods: ['PUT'])]
    #[OA\Put(summary: 'Modifier un produit (Admin)')]
    #[OA\Response(response: 200, description: 'Produit mis à jour')]
    #[OA\Response(response: 404, description: 'Produit non trouvé')]
    public function update(int $id, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $product = $this->productRepository->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        if (isset($data['price'])) {
            $product->setPrice((string) $data['price']);
        }
        if (isset($data['stock'])) {
            $product->setStock($data['stock']);
        }
        if (isset($data['joules'])) {
            $product->setJoules((string) $data['joules']);
        }
        if (isset($data['categoryId'])) {
            $category = $this->entityManager->getRepository(Category::class)->find($data['categoryId']);
            if (!$category) {
                return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_BAD_REQUEST);
            }
            $product->setCategory($category);
        }

        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeProduct($product));
    }

    #[Route('/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Supprimer un produit (Admin)')]
    #[OA\Response(response: 204, description: 'Produit supprimé')]
    #[OA\Response(response: 404, description: 'Produit non trouvé')]
    public function delete(int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $product = $this->productRepository->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function serializeProduct(Product $product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => (float) $product->getPrice(),
            'stock' => $product->getStock(),
            'joules' => $product->getJoules() ? (float) $product->getJoules() : null,
            'category' => [
                'id' => $product->getCategory()->getId(),
                'name' => $product->getCategory()->getName(),
            ],
        ];
    }
}
