import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

export default function App() {
    return (
        <Routes>
            
            <Route path="/" element={<Layout />}>
                
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                
                <Route path="profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                
                <Route path="admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <Admin />
                    </ProtectedRoute>
                } />

                
                <Route path="*" element={
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Page non trouvée</p>
                    </div>
                } />
            </Route>
        </Routes>
    )
}
