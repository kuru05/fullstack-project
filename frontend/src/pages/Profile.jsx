import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../api/apiService'

export default function Profile() {
    const { user, logout } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersApi.getAll()
                setOrders(data || [])
            } catch (error) {
                console.error('Erreur chargement commandes:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { class: 'badge-pending', label: '⏳ En attente' },
            PAID: { class: 'badge-paid', label: 'Payée' },
            SHIPPED: { class: 'badge-shipped', label: 'Expédiée' },
            DELIVERED: { class: 'badge-delivered', label: 'Livrée' },
            CANCELLED: { class: 'badge-cancelled', label: 'Annulée' },
        }
        const info = statusMap[status] || { class: 'badge-pending', label: status }
        return <span className={info.class}>{info.label}</span>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Mon Profil
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                                {user?.roles?.includes('ROLE_ADMIN') && (
                                    <span className="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        Administrateur
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">
                                    Inscrit le {user?.createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-secondary">
                        Déconnexion
                    </button>
                </div>
            </div>

            
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Mes commandes ({orders.length})
                </h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="flex justify-between">
                                    <div className="h-5 skeleton w-40" />
                                    <div className="h-5 skeleton w-24" />
                                </div>
                                <div className="h-4 skeleton w-32 mt-3" />
                            </div>
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                                            {order.reference}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.status)}
                                        <p className="font-bold text-primary-600 text-lg mt-2">
                                            {order.total?.toFixed(2)} €
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Aucune commande
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Vous n'avez pas encore passé de commande
                        </p>
                        <Link to="/products" className="btn-primary">
                            Parcourir les produits
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
