import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsApi, categoriesApi } from '../api/apiService'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        page: parseInt(searchParams.get('page') || '1'),
    })

    useEffect(() => {
        categoriesApi.getAll()
            .then(data => setCategories(data || []))
            .catch(err => console.error('Erreur chargement catégories:', err))
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const params = {
                    page: filters.page,
                    limit: 12,
                }

                if (filters.category) params.category = filters.category
                if (filters.search) params.search = filters.search
                if (filters.minPrice) params.minPrice = filters.minPrice
                if (filters.maxPrice) params.maxPrice = filters.maxPrice

                const data = await productsApi.getAll(params)
                setProducts(data.data || [])
                setPagination(data.pagination || {})
            } catch (error) {
                console.error('Erreur chargement produits:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [filters])

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 }
        setFilters(newFilters)

        const params = new URLSearchParams()
        if (newFilters.search) params.set('search', newFilters.search)
        if (newFilters.category) params.set('category', newFilters.category)
        if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice)
        if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice)
        setSearchParams(params)
    }

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetFilters = () => {
        setFilters({ search: '', category: '', minPrice: '', maxPrice: '', page: 1 })
        setSearchParams({})
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Nos Produits
            </h1>

            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rechercher
                        </label>
                        <input
                            type="text"
                            placeholder="Nom du produit..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catégorie
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="input-field"
                        >
                            <option value="">Toutes</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Prix min (€)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Prix max (€)
                        </label>
                        <input
                            type="number"
                            placeholder="999"
                            min="0"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>

                
                <div className="mt-4 flex justify-end">
                    <button onClick={resetFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            
            {!loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {pagination.total || 0} produit{(pagination.total || 0) > 1 ? 's' : ''} trouvé{(pagination.total || 0) > 1 ? 's' : ''}
                </p>
            )}

            
            {loading ? (
                <ProductGridSkeleton count={12} />
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Essayez de modifier vos filtres de recherche
                    </p>
                    <button onClick={resetFilters} className="btn-primary">
                        Réinitialiser les filtres
                    </button>
                </div>
            )}

            
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-10">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page <= 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        ← Précédent
                    </button>

                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors 
                ${page === filters.page
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page >= pagination.totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Suivant →
                    </button>
                </div>
            )}
        </div>
    )
}
