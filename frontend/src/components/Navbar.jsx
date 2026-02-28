import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const { user, logout, isAdmin, isAuthenticated } = useAuth()
    const { getCartCount } = useCart()
    const { darkMode, toggleDarkMode } = useTheme()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
        setMenuOpen(false)
    }

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    
                    <Link to="/" className="flex items-center space-x-2 group">

                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            Kuru's Airsofts
                        </span>
                    </Link>

                    
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                            Accueil
                        </Link>
                        <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                            Produits
                        </Link>

                        
                        <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={darkMode ? 'Mode clair' : 'Mode sombre'}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        
                        {isAuthenticated() ? (
                            <div className="flex items-center space-x-4">
                                {isAdmin() && (
                                    <Link to="/admin" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 font-medium transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
                                    {user?.email?.split('@')[0]}
                                </Link>
                                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium">
                                    Connexion
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>

                    
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                
                {menuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium py-2">
                                Accueil
                            </Link>
                            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium py-2">
                                Produits
                            </Link>
                            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium py-2">
                                Panier ({getCartCount()})
                            </Link>

                            <div className="flex items-center space-x-3 py-2">
                                <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
                                </button>
                            </div>

                            {isAuthenticated() ? (
                                <>
                                    {isAdmin() && (
                                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-yellow-600 font-medium py-2">
                                            Panel Admin
                                        </Link>
                                    )}
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium py-2">
                                        Mon Profil
                                    </Link>
                                    <button onClick={handleLogout} className="btn-secondary text-left py-2">
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium py-2">
                                        Connexion
                                    </Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-2">
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
