<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {

        $admin = new User();
        $admin->setEmail('admin@kurus-airsofts.fr');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        $user = new User();
        $user->setEmail('client@example.com');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'client123'));
        $manager->persist($user);

        $categories = [];
        $categoryNames = [
            'Répliques Gaz (GBBR)',
            'Répliques Électriques (AEG)',
            'Répliques Spring',
            'Gaz & CO2',
            'Billes & Munitions',
            'Équipements de Protection',
            'Accessoires & Optiques',
            'Tenues & Vêtements',
        ];

        foreach ($categoryNames as $name) {
            $category = new Category();
            $category->setName($name);
            $manager->persist($category);
            $categories[$name] = $category;
        }

        $products = [
            [
                'name' => 'GBB Saigo MK4 Type Glock23',
                'description' => 'Réplique GBB de poing Saigo MK4 type Glock 23. Système blowback réaliste avec recul puissant. Chargeur 25 billes. Construction polymère renforcé avec glissière métal. Idéale pour le CQB et les parties intérieures.',
                'price' => '89.90',
                'stock' => 15,
                'joules' => '0.90',
                'category' => 'Répliques Gaz (GBBR)',
            ],
            [
                'name' => 'Tokyo Marui Hi-Capa 5.1',
                'description' => 'La référence absolue en GBB. Le Hi-Capa 5.1 de Tokyo Marui offre des performances exceptionnelles et une fiabilité à toute épreuve. Compatible avec un immense catalogue de pièces upgrades. Chargeur 31 billes.',
                'price' => '159.90',
                'stock' => 8,
                'joules' => '0.85',
                'category' => 'Répliques Gaz (GBBR)',
            ],
            [
                'name' => 'WE M9A1 Full Metal',
                'description' => 'Réplique du célèbre Beretta M9A1 en full metal. Finition soignée et blowback puissant. Chargeur 25 billes gaz. Poids réaliste de 980g pour une prise en main authentique.',
                'price' => '119.90',
                'stock' => 12,
                'joules' => '0.95',
                'category' => 'Répliques Gaz (GBBR)',
            ],
            [
                'name' => 'G&G CM16 Raider 2.0',
                'description' => 'AEG polyvalente et fiable, parfaite pour les débutants comme les joueurs confirmés. Canon de 260mm, gearbox V2 renforcée, rail M-LOK. Batterie et chargeur non inclus.',
                'price' => '179.90',
                'stock' => 20,
                'joules' => '1.20',
                'category' => 'Répliques Électriques (AEG)',
            ],
            [
                'name' => 'Specna Arms SA-E10 EDGE',
                'description' => 'AEG haut de gamme avec MOSFET intégré et quick spring change. Canon de précision 6.03mm. Gearbox V2 avec engrenages renforcés. Design M4 compact parfait pour le CQB.',
                'price' => '249.90',
                'stock' => 10,
                'joules' => '1.30',
                'category' => 'Répliques Électriques (AEG)',
            ],
            [
                'name' => 'Cyma AK-47 CM028',
                'description' => 'Réplique AEG de la légendaire AK-47. Construction robuste bois/métal. Gearbox V3 renforcée. Chargeur hi-cap 600 billes inclus. Batterie type mini.',
                'price' => '129.90',
                'stock' => 18,
                'joules' => '1.10',
                'category' => 'Répliques Électriques (AEG)',
            ],
            [
                'name' => 'Well MB4411D Sniper',
                'description' => 'Fusil de précision spring type VSR-10. Canon flûté et bi-pied intégré. Puissance de 1.8 joules en sortie de boîte. Parfait pour le rôle de sniper sur le terrain.',
                'price' => '139.90',
                'stock' => 7,
                'joules' => '1.80',
                'category' => 'Répliques Spring',
            ],
            [
                'name' => 'Bouteille Green Gas Nimrod 1000ml',
                'description' => 'Gaz vert haute performance pour répliques GBBR. Contenance de 1000ml. Fonctionne de manière optimale entre 15°C et 35°C. Lubrifiant intégré pour protéger les joints.',
                'price' => '12.90',
                'stock' => 100,
                'joules' => null,
                'category' => 'Gaz & CO2',
            ],
            [
                'name' => 'Pack 10 Cartouches CO2 12g',
                'description' => 'Pack de 10 capsules de CO2 de 12g pour répliques CO2. Compatible avec la plupart des répliques de poing et revolvers CO2 du marché.',
                'price' => '8.90',
                'stock' => 200,
                'joules' => null,
                'category' => 'Gaz & CO2',
            ],
            [
                'name' => 'BLS Billes 0.25g x5000 Bio',
                'description' => 'Sachet de 5000 billes biodégradables de précision 0.25g. Diamètre certifié 5.95mm ±0.01mm. Billes parfaitement polies pour une trajectoire optimale. Indispensable pour jouer en extérieur.',
                'price' => '14.90',
                'stock' => 150,
                'joules' => null,
                'category' => 'Billes & Munitions',
            ],
            [
                'name' => 'Masque Grillagé DYE i5',
                'description' => 'Masque de protection intégral avec grillage anti-buée. Protection balistique certifiée EN166. Confort optimal avec mousse memory foam. Ventilation active pour éviter la buée.',
                'price' => '49.90',
                'stock' => 25,
                'joules' => null,
                'category' => 'Équipements de Protection',
            ],
            [
                'name' => 'Lunettes Bollé Tactical X800',
                'description' => 'Lunettes de protection balistique Bollé modèle X800. Verre anti-buée traitement platine. Compatibles port de lunettes de vue. Norme MIL-PRF-32432.',
                'price' => '39.90',
                'stock' => 30,
                'joules' => null,
                'category' => 'Équipements de Protection',
            ],
            [
                'name' => 'Red Dot Sight Theta Optics Compact',
                'description' => 'Viseur point rouge compact pour rail Picatinny 20mm. 4 niveaux de luminosité. Point rouge 2 MOA. Construction aluminium anodisé. Livré avec pile CR2032.',
                'price' => '34.90',
                'stock' => 20,
                'joules' => null,
                'category' => 'Accessoires & Optiques',
            ],
            [
                'name' => 'Lampe Tactique LED 1000 Lumens',
                'description' => 'Lampe tactique haute puissance avec fixation rail Picatinny. 1000 lumens, portée 200m. 3 modes (continu, strobe, momentané). Étanche IPX4. Batterie rechargeable USB-C.',
                'price' => '29.90',
                'stock' => 35,
                'joules' => null,
                'category' => 'Accessoires & Optiques',
            ],
            [
                'name' => 'Tenue BDU Multicam Complète',
                'description' => 'Ensemble veste + pantalon en camouflage Multicam. Tissu ripstop renforcé 65/35 polyester/coton. Multiples poches utilitaires. Disponible en tailles S à XXL. Coupe confortable adaptée au terrain.',
                'price' => '59.90',
                'stock' => 40,
                'joules' => null,
                'category' => 'Tenues & Vêtements',
            ],
        ];

        foreach ($products as $productData) {
            $product = new Product();
            $product->setName($productData['name']);
            $product->setDescription($productData['description']);
            $product->setPrice($productData['price']);
            $product->setStock($productData['stock']);
            $product->setCategory($categories[$productData['category']]);

            if ($productData['joules'] !== null) {
                $product->setJoules($productData['joules']);
            }

            $manager->persist($product);
        }

        $manager->flush();
    }
}
