import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../api/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { user } = useAuth()
    const [cart, setCart] = useState(null)
    const [cartLoading, setCartLoading] = useState(false)

    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            setCart(null)
        }
    }, [user])

    const fetchCart = async () => {
        try {
            setCartLoading(true)
            const { data } = await cartAPI.getCart()
            setCart(data)
        } catch {
            setCart(null)
        } finally {
            setCartLoading(false)
        }
    }

    const addToCart = async (productId, quantity = 1) => {
        const { data } = await cartAPI.addToCart(productId, quantity)
        setCart(data)
        return data
    }

    const updateItem = async (itemId, quantity) => {
        const { data } = await cartAPI.updateItem(itemId, quantity)
        setCart(data)
        return data
    }

    const removeItem = async (itemId) => {
        const { data } = await cartAPI.removeItem(itemId)
        setCart(data)
        return data
    }

    const clearCart = async () => {
        await cartAPI.clearCart()
        setCart(prev => prev ? { ...prev, items: [], totalAmount: 0, totalItems: 0 } : null)
    }

    const cartCount = cart?.totalItems || 0

    return (
        <CartContext.Provider value={{ cart, cartLoading, cartCount, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
