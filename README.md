# Kuru's Airsofts — Plateforme E-Commerce

> **Projet Fullstack** — 3ème année de Développement Informatique  
> Application e-commerce spécialisée dans l'Airsoft (répliques, gaz, équipements)

---

## Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [Endpoints API](#endpoints-api)
- [Modèle de données (MLD)](#modèle-de-données-mld)
- [Fonctionnalités](#fonctionnalités)

- [Comptes de test](#comptes-de-test)

---

## Architecture

Architecture **client-serveur stricte** avec séparation totale du backend et du frontend :

```
┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │  HTTP   │   BACKEND       │
│   React + Vite  │ ◄─────► │   Symfony API   │
│   Tailwind CSS  │  JSON   │   REST + JWT    │
│   Port 3000     │         │   Port 8080     │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │    MySQL 8.0    │
                            │    Port 3306    │
                            └─────────────────┘
```

- **Backend** : API REST pure en Symfony (aucun templating Twig)
- **Frontend** : Application React monopage (SPA)
- **Communication** : Échanges exclusivement en JSON via `fetch`
- **Sécurité** : Authentification JWT (JSON Web Token)

---

## Technologies

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| PHP | 8.2+ | Langage serveur |
| Symfony | 7.0 | Framework MVC |
| Doctrine ORM | 2.17 | Mapping objet-relationnel |
| LexikJWT | 2.20 | Authentification JWT |
| NelmioCors | 2.4 | Gestion du CORS |
| NelmioApiDoc | 4.19 | Documentation Swagger |
| MySQL | 8.0 | Base de données |

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 18.2 | Bibliothèque UI |
| Vite | 5.0 | Bundler de développement |
| Tailwind CSS | 3.4 | Framework CSS utilitaire |
| React Router | 6.21 | Navigation SPA |

---

## Prérequis

- **PHP** 8.2 ou supérieur avec les extensions `pdo_mysql`, `mbstring`, `xml`, `zip`
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** 18+ et **npm**
- **MySQL** 8.0 ou supérieur
- **Symfony CLI** (optionnel, recommandé)
- **OpenSSL** (pour la génération des clés JWT)

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd Full-Stack
```

### 2. Installation du Backend

```bash
cd backend

# Installation des dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env .env.local

# Modifier les variables dans .env.local (voir section Variables d'environnement)
nano .env.local

# Générer les clés JWT (RSA)
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
# (Entrer la passphrase définie dans JWT_PASSPHRASE)

# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Charger les données de test (fixtures)
php bin/console doctrine:fixtures:load
```

### 3. Installation du Frontend

```bash
cd ../frontend

# Installation des dépendances Node.js
npm install
```

---

## Variables d'environnement

### Backend (`backend/.env.local`)

| Variable | Description | Exemple |
|---|---|---|
| `APP_ENV` | Environnement Symfony | `dev` ou `prod` |
| `APP_SECRET` | Clé secrète Symfony (32 car.) | `votre_secret_ici` |
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@127.0.0.1:3306/kurus_airsofts` |
| `JWT_SECRET_KEY` | Chemin clé privée RSA | `%kernel.project_dir%/config/jwt/private.pem` |
| `JWT_PUBLIC_KEY` | Chemin clé publique RSA | `%kernel.project_dir%/config/jwt/public.pem` |
| `JWT_PASSPHRASE` | Passphrase des clés JWT | `kurus_airsofts_jwt_passphrase` |
| `CORS_ALLOW_ORIGIN` | Origines CORS autorisées | `^https?://localhost(:[0-9]+)?$` |

---

## Lancement

### Mode Développement

**Terminal 1 — Backend :**
```bash
cd backend
symfony server:start
# ou : php -S localhost:8080 -t public/
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# Application accessible sur http://localhost:3000
```

### Mode Production

```bash
# Backend
cd backend
APP_ENV=prod composer install --no-dev --optimize-autoloader
php bin/console cache:clear --env=prod

# Frontend
cd frontend
npm run build
# Les fichiers sont générés dans le dossier dist/
```



---

## Structure du projet

```
Full-Stack/
├── backend/                          # API REST Symfony
│   ├── config/
│   │   ├── packages/
│   │   │   ├── doctrine.yaml         # Config Doctrine ORM
│   │   │   ├── security.yaml         # Config sécurité + JWT
│   │   │   ├── lexik_jwt_authentication.yaml
│   │   │   ├── nelmio_cors.yaml      # Config CORS
│   │   │   └── nelmio_api_doc.yaml   # Config Swagger
│   │   ├── routes.yaml
│   │   └── services.yaml
│   ├── src/
│   │   ├── Controller/
│   │   │   ├── AuthController.php    # Inscription + profil
│   │   │   ├── ProductController.php # CRUD produits + filtres
│   │   │   ├── CategoryController.php# CRUD catégories
│   │   │   └── OrderController.php   # Commandes + logique métier
│   │   ├── Entity/
│   │   │   ├── User.php              # Utilisateur (JWT)
│   │   │   ├── Category.php          # Catégories
│   │   │   ├── Product.php           # Produits (stock, joules)
│   │   │   ├── Order.php             # Commandes
│   │   │   └── OrderItem.php         # Lignes de commande
│   │   ├── Repository/               # Requêtes personnalisées
│   │   ├── EventListener/            # Gestion globale des erreurs
│   │   └── DataFixtures/             # Données de test
│   └── composer.json
│
├── frontend/                         # Application React
│   ├── src/
│   │   ├── api/
│   │   │   └── apiService.js         # Service API centralisé
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Barre de navigation
│   │   │   ├── Footer.jsx            # Pied de page
│   │   │   ├── Layout.jsx            # Layout principal
│   │   │   ├── ProductCard.jsx       # Carte produit
│   │   │   ├── Skeleton.jsx          # Loaders skeleton
│   │   │   └── ProtectedRoute.jsx    # Route protégée
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Gestion auth JWT
│   │   │   ├── CartContext.jsx       # Gestion du panier
│   │   │   └── ThemeContext.jsx      # Dark mode
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Page d'accueil
│   │   │   ├── Products.jsx          # Liste + filtres
│   │   │   ├── ProductDetail.jsx     # Détail produit
│   │   │   ├── Cart.jsx              # Panier + commande
│   │   │   ├── Login.jsx             # Connexion
│   │   │   ├── Register.jsx          # Inscription
│   │   │   ├── Profile.jsx           # Profil + commandes
│   │   │   └── Admin.jsx             # Panel admin
│   │   ├── App.jsx                   # Router principal
│   │   ├── main.jsx                  # Point d'entrée
│   │   └── index.css                 # Styles Tailwind
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md                         # Ce fichier
```

---

## Endpoints API

### Authentification
| Méthode | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/register` | Inscription | Public |
| `POST` | `/api/login_check` | Connexion (retourne JWT) | Public |
| `GET` | `/api/me` | Profil utilisateur | JWT |

### Produits
| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/products` | Liste (pagination, filtres) | Public |
| `GET` | `/api/products/{id}` | Détail produit | Public |
| `POST` | `/api/products` | Créer un produit | Admin |
| `PUT` | `/api/products/{id}` | Modifier un produit | Admin |
| `DELETE` | `/api/products/{id}` | Supprimer un produit | Admin |

**Paramètres de filtrage :** `?page=1&limit=12&category=1&search=glock&minPrice=50&maxPrice=200`

### Catégories
| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/categories` | Liste des catégories | Public |
| `POST` | `/api/categories` | Créer une catégorie | Admin |
| `PUT` | `/api/categories/{id}` | Modifier | Admin |
| `DELETE` | `/api/categories/{id}` | Supprimer | Admin |

### Commandes
| Méthode | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/orders` | Mes commandes | JWT |
| `GET` | `/api/orders/{id}` | Détail commande | JWT |
| `POST` | `/api/orders` | Créer une commande | JWT |
| `PUT` | `/api/orders/{id}/status` | Modifier le statut | Admin |

### Documentation
| Route | Description |
|---|---|
| `/api/doc` | Interface Swagger UI |
| `/api/doc.json` | Schéma OpenAPI JSON |

---

## Modèle de données (MLD)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    user       │       │   category   │       │   product    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ name         │       │ category_id  │──► category
│ password     │       └──────────────┘       │ name         │
│ roles (JSON) │                              │ description  │
│ created_at   │                              │ price        │
└──────┬───────┘                              │ stock        │
       │                                       │ joules       │
       │ 1..n                                  └──────────────┘
       │                                              │
┌──────▼───────┐       ┌──────────────┐               │
│    order     │       │  order_item  │               │
├──────────────┤       ├──────────────┤               │
│ id (PK)      │       │ id (PK)      │               │
│ user_id (FK) │       │ order_id (FK)│──► order      │
│ reference    │       │ product_id   │──► product ◄──┘
│ status       │       │ quantity     │
│ created_at   │       │ price        │   (prix figé)
└──────────────┘       └──────────────┘
```

### Relations
- **User** → **Order** : OneToMany (un utilisateur a plusieurs commandes)
- **Category** → **Product** : OneToMany (une catégorie contient plusieurs produits)
- **Order** → **OrderItem** : OneToMany (une commande a plusieurs lignes)
- **Product** → **OrderItem** : OneToMany (un produit peut apparaître dans plusieurs commandes)

---

## Fonctionnalités

### Logique métier
- Gestion de stock avec validation avant commande
- Décrémentation atomique du stock lors de la validation
- Génération de référence unique (format `CMD-YYYY-MM-DDA`)
- Prix figé au moment de la commande (historique préservé)
- Validation des données côté serveur (Symfony Validator)

### Sécurité
- Authentification JWT (token dans le header `Authorization: Bearer`)
- Hashage bcrypt des mots de passe
- Contrôle d'accès par rôles (ROLE_USER, ROLE_ADMIN)
- Routes protégées côté frontend (ProtectedRoute)
- Gestion cohérente des erreurs HTTP (400, 401, 403, 404, 500)
- CORS configuré pour le frontend

### Frontend
- Dark mode (persiste dans le localStorage)
- Skeleton loaders pendant le chargement
- Formulaires contrôlés avec validation côté client
- Panier persistant (localStorage)
- Design responsive mobile-first
- Pagination et filtres sur les produits
- Panel admin complet (CRUD produits, catégories, gestion commandes)

### API
- CRUD complet sur Produits et Catégories
- Pagination avec query params (`page`, `limit`)
- Filtres : catégorie, recherche texte, fourchette de prix
- Documentation Swagger/OpenAPI

---

## Comptes de test

Les **fixtures** créent automatiquement les comptes suivants :

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@kurus-airsofts.fr` | `admin123` | Administrateur |
| `client@example.com` | `client123` | Utilisateur |

---

## Licence

Projet étudiant — 3ème année Développement Informatique  
© 2026 Kuru's Airsofts
