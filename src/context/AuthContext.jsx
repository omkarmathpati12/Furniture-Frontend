import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/api'

const AuthContext = createContext(null)

/**
 * AuthProvider: Handles the global user state for the application.
 * This simplified version stores user data in localStorage so that
 * the user stays "logged in" even after refreshing the page.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // On startup, check if we have a user in localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            // Optionally verify with backend
            checkAuth(parsedUser.username)
        } else {
            setLoading(false)
        }
    }, [])

    const checkAuth = async (username) => {
        try {
            // Updated to pass username because we removed sessions
            const { data } = await authAPI.me(username)
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
        } catch (err) {
            console.error("Auth check failed", err)
            setUser(null)
            localStorage.removeItem('user')
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        const { data } = await authAPI.login(credentials)
        setUser(data)
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data))
        return data
    }

    const register = async (userData) => {
        const { data } = await authAPI.register(userData)
        // Typically we don't automatically login after register in simple apps,
        // but let's just return the data.
        return data
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch { }
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
