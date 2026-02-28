import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi, categoriesApi } from '../api/apiService'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

export default function Home() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productsApi.getAll({ limit: 6 }),
                    categoriesApi.getAll(),
                ])
                setProducts(productsData.data || [])
                setCategories(categoriesData || [])
            } catch (error) {
                console.error('Erreur lors du chargement:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="animate-fade-in">
            <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(34,197,94,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34,197,94,0.2) 0%, transparent 50%)'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary-400 to-green-300 bg-clip-text text-transparent">
                                Kuru's Airsofts
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
                            Votre boutique en ligne spécialisée Airsoft
                        </p>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Répliques, gaz, billes, équipements de protection et accessoires.
                            Tout ce dont vous avez besoin pour vos parties.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products" className="btn-primary text-lg px-8 py-3">
                                Voir les produits
                            </Link>
                            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 41.7C1248 40 1344 40 1392 40H1440V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
                            className="fill-gray-50 dark:fill-gray-950" />
                    </svg>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
                    Nos Catégories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                        >

                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {category.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {category.productCount} produit{category.productCount > 1 ? 's' : ''}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-100 dark:bg-gray-900/50 rounded-3xl mx-4 mb-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Produits Populaires
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Découvrez notre sélection de produits les plus demandés
                    </p>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={6} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link to="/products" className="btn-primary text-lg px-8 py-3">
                        Voir tous les produits
                    </Link>
                </div>
            </section>
        </div>
    )
}
