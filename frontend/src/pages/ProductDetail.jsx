import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productsApi } from '../api/apiService'
import { useCart } from '../context/CartContext'
import { ProductDetailSkeleton } from '../components/Skeleton'

export default function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const data = await productsApi.getById(id)
                setProduct(data)
            } catch (err) {
                setError(err.message || 'Produit non trouvé')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        if (product && product.stock >= quantity) {
            addToCart(product, quantity)
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
        }
    }

    if (loading) return <ProductDetailSkeleton />

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Produit non trouvé</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/products" className="btn-primary">← Retour aux produits</Link>
            </div>
        )
    }

    if (!product) return null

    const isInStock = product.stock > 0

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

            <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Link to="/" className="hover:text-primary-600">Accueil</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-primary-600">Produits</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 dark:text-white">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden h-96 lg:h-[500px] relative">
                    <img
                        src={`/images/products/${product.id}.png`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />

                    {product.joules && (
                        <span className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1.5 rounded-full font-bold text-sm">
                            {product.joules} Joules
                        </span>
                    )}

                    {!isInStock && (
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl bg-red-600 px-6 py-3 rounded-lg">
                                Rupture de stock
                            </span>
                        </div>
                    )}
                </div>


                <div className="flex flex-col">

                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
                        {product.category?.name}
                    </span>


                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {product.name}
                    </h1>


                    <div className="flex items-baseline space-x-3 mb-6">
                        <span className="text-4xl font-extrabold text-primary-700 dark:text-primary-400">
                            {parseFloat(product.price).toFixed(2)} €
                        </span>
                    </div>


                    <div className="mb-6">
                        {isInStock ? (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold 
                ${product.stock <= 5
                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                {product.stock <= 5
                                    ? `Plus que ${product.stock} en stock`
                                    : `En stock (${product.stock} disponibles)`
                                }
                            </span>
                        ) : (
                            <span className="badge-cancelled">Rupture de stock</span>
                        )}
                    </div>


                    {product.joules && (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Caractéristiques</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Puissance</span>
                                    <p className="font-semibold text-gray-900 dark:text-white">{product.joules} Joules</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Catégorie</span>
                                    <p className="font-semibold text-gray-900 dark:text-white">{product.category?.name}</p>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="mb-8">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description}
                        </p>
                    </div>


                    {isInStock && (
                        <div className="mt-auto space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="font-medium text-gray-700 dark:text-gray-300">Quantité :</label>
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 
                  ${addedToCart
                                        ? 'bg-green-500 text-white scale-95'
                                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                                    }`}
                            >
                                {addedToCart ? 'Ajouté au panier !' : `Ajouter au panier — ${(parseFloat(product.price) * quantity).toFixed(2)} €`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
