import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/apiService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('jwt_token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            authApi.getProfile()
                .then((userData) => {
                    setUser(userData)
                })
                .catch(() => {
                    localStorage.removeItem('jwt_token')
                    localStorage.removeItem('user')
                    setToken(null)
                    setUser(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [token])

    const login = async (email, password) => {
        const data = await authApi.login(email, password)
        const jwtToken = data.token

        localStorage.setItem('jwt_token', jwtToken)
        setToken(jwtToken)

        const userData = await authApi.getProfile()
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))

        return userData
    }

    const logout = () => {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    const register = async (email, password) => {
        await authApi.register(email, password)
        return login(email, password)
    }

    const isAdmin = () => {
        return user?.roles?.includes('ROLE_ADMIN') || false
    }

    const isAuthenticated = () => {
        return !!token && !!user
    }

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAdmin,
        isAuthenticated,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider')
    }
    return context
}

export default AuthContext
