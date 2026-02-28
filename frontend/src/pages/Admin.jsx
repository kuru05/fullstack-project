import { useState, useEffect } from 'react'
import { productsApi, categoriesApi, ordersApi } from '../api/apiService'

export default function Admin() {
    const [activeTab, setActiveTab] = useState('products')
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', stock: '', categoryId: '', joules: ''
    })

    const [categoryName, setCategoryName] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [productsData, categoriesData, ordersData] = await Promise.all([
                productsApi.getAll({ limit: 50 }),
                categoriesApi.getAll(),
                ordersApi.getAll(),
            ])
            setProducts(productsData.data || [])
            setCategories(categoriesData || [])
            setOrders(ordersData || [])
        } catch (err) {
            setError('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const showSuccess = (msg) => {
        setSuccess(msg)
        setTimeout(() => setSuccess(''), 3000)
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await productsApi.create({
                name: productForm.name,
                description: productForm.description,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock),
                categoryId: parseInt(productForm.categoryId),
                joules: productForm.joules ? parseFloat(productForm.joules) : null,
            })
            setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', joules: '' })
            showSuccess('Produit créé avec succès !')
            fetchData()
        } catch (err) {
            setError(err.message || 'Erreur lors de la création')
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
        try {
            await productsApi.delete(id)
            showSuccess('Produit supprimé')
            fetchData()
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression')
        }
    }

    const handleCreateCategory = async (e) => {
        e.preventDefault()
        if (!categoryName.trim()) return
        try {
            await categoriesApi.create(categoryName)
            setCategoryName('')
            showSuccess('Catégorie créée !')
            fetchData()
        } catch (err) {
            setError(err.message || 'Erreur lors de la création')
        }
    }

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Supprimer cette catégorie ?')) return
        try {
            await categoriesApi.delete(id)
            showSuccess('Catégorie supprimée')
            fetchData()
        } catch (err) {
            setError(err.message || err.error || 'Impossible de supprimer (elle contient peut-être des produits)')
        }
    }

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await ordersApi.updateStatus(orderId, newStatus)
            showSuccess('Statut mis à jour')
            fetchData()
        } catch (err) {
            setError(err.message || 'Erreur de mise à jour')
        }
    }

    const tabs = [
        { id: 'products', label: 'Produits', count: products.length },
        { id: 'categories', label: 'Catégories', count: categories.length },
        { id: 'orders', label: 'Commandes', count: orders.length },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Panel Administrateur
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
                Gérez les produits, catégories et commandes
            </p>

            
            {success && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                    <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
            )}

            
            <div className="flex space-x-2 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all 
              ${activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <>
                    
                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Ajouter un produit
                                </h2>
                                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nom du produit" value={productForm.name}
                                        onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                                        className="input-field" required />
                                    <select value={productForm.categoryId}
                                        onChange={(e) => setProductForm(p => ({ ...p, categoryId: e.target.value }))}
                                        className="input-field" required>
                                        <option value="">Catégorie</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <input type="number" step="0.01" placeholder="Prix (€)" value={productForm.price}
                                        onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                                        className="input-field" required />
                                    <input type="number" placeholder="Stock" value={productForm.stock}
                                        onChange={(e) => setProductForm(p => ({ ...p, stock: e.target.value }))}
                                        className="input-field" required />
                                    <input type="number" step="0.01" placeholder="Joules (optionnel)" value={productForm.joules}
                                        onChange={(e) => setProductForm(p => ({ ...p, joules: e.target.value }))}
                                        className="input-field" />
                                    <textarea placeholder="Description du produit" value={productForm.description}
                                        onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                                        className="input-field md:col-span-2" rows={3} required />
                                    <div className="md:col-span-2">
                                        <button type="submit" className="btn-primary">
                                            Ajouter le produit
                                        </button>
                                    </div>
                                </form>
                            </div>

                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Produit</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Catégorie</th>
                                                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Prix</th>
                                                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                                                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {products.map(product => (
                                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{product.category?.name}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-primary-600">{parseFloat(product.price).toFixed(2)} €</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={product.stock <= 5 ? 'text-orange-600 font-bold' : 'text-gray-700 dark:text-gray-300'}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    
                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Ajouter une catégorie
                                </h2>
                                <form onSubmit={handleCreateCategory} className="flex gap-3">
                                    <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="Nom de la catégorie" className="input-field flex-grow" required />
                                    <button type="submit" className="btn-primary whitespace-nowrap">
                                        Ajouter
                                    </button>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map(category => (
                                    <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {category.productCount} produit{category.productCount > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <button onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-500 hover:text-red-700 p-2">
                                            
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">Aucune commande</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">{order.reference}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Client : {order.user?.email} — {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                                <p className="font-semibold text-primary-600 mt-1">{order.total?.toFixed(2)} €</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    className="input-field py-2 text-sm w-auto"
                                                >
                                                    <option value="PENDING">⏳ En attente</option>
                                                    <option value="PAID">Payée</option>
                                                    <option value="SHIPPED">Expédiée</option>
                                                    <option value="DELIVERED">Livrée</option>
                                                    <option value="CANCELLED">Annulée</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
