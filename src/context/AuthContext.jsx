import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            checkAuth(parsedUser.username)
        } else {
            setLoading(false)
        }
    }, [])

    const checkAuth = async (username) => {
        try {
            const { data } = await authAPI.me(username)
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
        } catch (err) {
            setUser(null)
            localStorage.removeItem('user')
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        const { data } = await authAPI.login(credentials)
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        return data
    }

    const register = async (userData) => {
        const { data } = await authAPI.register(userData)
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
