import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addToCart = (product, quantity = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id)

            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            return [...currentItems, {
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                quantity: quantity,
            }]
        })
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: quantity }
                    : item
            )
        )
    }

    const removeFromCart = (productId) => {
        setItems(currentItems =>
            currentItems.filter(item => item.id !== productId)
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const getCartCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getCartTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    }

    const getItemsForOrder = () => {
        return items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
        }))
    }

    const value = {
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
        getItemsForOrder,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart doit être utilisé dans un CartProvider')
    }
    return context
}

export default CartContext
