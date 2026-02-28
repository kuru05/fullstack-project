import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                            <span>🎯</span>
                            <span>Kuru's Airsofts</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Votre boutique en ligne spécialisée dans l'Airsoft.
                            Répliques, gaz, équipements et accessoires de qualité
                            pour tous les passionnés.
                        </p>
                    </div>

                    
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Navigation
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Tous les produits
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Mon panier
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Mon compte
                                </Link>
                            </li>
                        </ul>
                    </div>

                    
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Informations
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>📧 contact@kurus-airsofts.fr</li>
                            <li>📞 01 23 45 67 89</li>
                            <li>📍 Paris, France</li>
                            <li className="pt-2 text-xs">
                                Projet étudiant - 3ème année Dev Informatique
                            </li>
                        </ul>
                    </div>
                </div>

                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Kuru's Airsofts. Tous droits réservés.</p>
                    <p className="mt-1 text-xs">Projet fullstack Symfony + React</p>
                </div>
            </div>
        </footer>
    )
}
