<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/categories')]
#[OA\Tag(name: 'Catégories')]
class CategoryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_categories_list', methods: ['GET'])]
    #[OA\Get(summary: 'Liste de toutes les catégories')]
    #[OA\Response(response: 200, description: 'Liste des catégories')]
    public function index(): JsonResponse
    {
        $categories = $this->entityManager->getRepository(Category::class)->findAll();

        $data = array_map(function (Category $category) {
            return [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'productCount' => $category->getProducts()->count(),
            ];
        }, $categories);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_categories_show', methods: ['GET'])]
    #[OA\Get(summary: "Détail d'une catégorie")]
    #[OA\Response(response: 200, description: 'Catégorie trouvée')]
    #[OA\Response(response: 404, description: 'Catégorie non trouvée')]
    public function show(int $id): JsonResponse
    {
        $category = $this->entityManager->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'productCount' => $category->getProducts()->count(),
        ]);
    }

    #[Route('', name: 'api_categories_create', methods: ['POST'])]
    #[OA\Post(summary: 'Créer une catégorie (Admin)')]
    #[OA\RequestBody(content: new OA\JsonContent(
        properties: [new OA\Property(property: 'name', type: 'string', example: 'Répliques Gaz (GBBR)')]
    ))]
    #[OA\Response(response: 201, description: 'Catégorie créée')]
    #[OA\Response(response: 400, description: 'Données invalides')]
    public function create(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['name'])) {
            return $this->json(['error' => 'Le champ "name" est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        $category = new Category();
        $category->setName($data['name']);

        $errors = $this->validator->validate($category);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($category);
        $this->entityManager->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_categories_update', methods: ['PUT'])]
    #[OA\Put(summary: 'Modifier une catégorie (Admin)')]
    #[OA\Response(response: 200, description: 'Catégorie mise à jour')]
    #[OA\Response(response: 404, description: 'Catégorie non trouvée')]
    public function update(int $id, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $category = $this->entityManager->getRepository(Category::class)->find($id);
        if (!$category) {
            return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $category->setName($data['name']);
        }

        $errors = $this->validator->validate($category);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ]);
    }

    #[Route('/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Supprimer une catégorie (Admin)')]
    #[OA\Response(response: 204, description: 'Catégorie supprimée')]
    #[OA\Response(response: 404, description: 'Catégorie non trouvée')]
    public function delete(int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $category = $this->entityManager->getRepository(Category::class)->find($id);
        if (!$category) {
            return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_NOT_FOUND);
        }

        if ($category->getProducts()->count() > 0) {
            return $this->json([
                'error' => 'Impossible de supprimer une catégorie qui contient des produits'
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->remove($category);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
