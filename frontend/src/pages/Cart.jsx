import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../api/apiService'

export default function Cart() {
    const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, getItemsForOrder } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [ordering, setOrdering] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleOrder = async () => {
        if (!isAuthenticated()) {
            navigate('/login')
            return
        }

        setOrdering(true)
        setError(null)

        try {
            const orderItems = getItemsForOrder()
            const order = await ordersApi.create(orderItems)
            setOrderSuccess(order)
            clearCart()
        } catch (err) {
            setError(err.message || 'Erreur lors de la commande')
            if (err.details) {
                setError(err.details.join(', '))
            }
        } finally {
            setOrdering(false)
        }
    }

    if (orderSuccess) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Commande confirmée !
                </h1>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
                    <p className="text-green-800 dark:text-green-200 font-semibold text-lg mb-2">
                        Référence : {orderSuccess.reference}
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                        Montant total : {orderSuccess.total?.toFixed(2)} €
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                        Statut : {orderSuccess.status}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/profile" className="btn-primary">
                        Voir mes commandes
                    </Link>
                    <Link to="/products" className="btn-secondary">
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Votre panier est vide
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Parcourez nos produits et ajoutez vos articles favoris !
                </p>
                <Link to="/products" className="btn-primary text-lg px-8 py-3">
                    Voir les produits →
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Mon Panier ({items.length} article{items.length > 1 ? 's' : ''})
            </h1>


            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-center space-x-4">

                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            </div>


                            <div className="flex-grow">
                                <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                                    {item.name}
                                </Link>
                                <p className="text-primary-600 dark:text-primary-400 font-bold">
                                    {parseFloat(item.price).toFixed(2)} €
                                </p>
                            </div>


                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                                >
                                    −
                                </button>
                                <span className="px-3 py-1.5 font-semibold text-sm text-gray-900 dark:text-white">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                                >
                                    +
                                </button>
                            </div>


                            <p className="font-bold text-gray-900 dark:text-white min-w-[5rem] text-right">
                                {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                            </p>


                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2"
                                title="Supprimer"
                            >

                            </button>
                        </div>
                    ))}


                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-700 font-medium mt-2"
                    >
                        Vider le panier
                    </button>
                </div>


                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Résumé
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Sous-total</span>
                                <span>{getCartTotal()} €</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Livraison</span>
                                <span className="text-green-600 font-medium">Gratuite</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span className="text-primary-600">{getCartTotal()} €</span>
                                </div>
                            </div>
                        </div>


                        {isAuthenticated() ? (
                            <button
                                onClick={handleOrder}
                                disabled={ordering}
                                className="w-full mt-6 btn-primary py-3 text-lg disabled:opacity-50"
                            >
                                {ordering ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Validation...
                                    </span>
                                ) : (
                                    'Valider la commande'
                                )}
                            </button>
                        ) : (
                            <Link to="/login" className="block w-full mt-6 btn-primary py-3 text-lg text-center">
                                Se connecter pour commander
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
