import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    const isInStock = product.stock > 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        if (isInStock) {
            addToCart(product)
        }
    }

    return (
        <div className="card group animate-fade-in">

            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                    src={`/images/products/${product.id}.png`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none' }}
                />


                {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Plus que {product.stock} !
                    </span>
                )}


                {!isInStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Rupture de stock</span>
                    </div>
                )}


                {product.joules && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.joules}J
                    </span>
                )}
            </div>


            <div className="p-4">

                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider mb-1">
                    {product.category?.name}
                </p>


                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                </Link>


                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {product.description}
                </p>


                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
                        {parseFloat(product.price).toFixed(2)} €
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
              ${isInStock
                                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow hover:shadow-md active:scale-95'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isInStock ? 'Ajouter' : 'Épuisé'}
                    </button>
                </div>
            </div>
        </div>
    )
}
