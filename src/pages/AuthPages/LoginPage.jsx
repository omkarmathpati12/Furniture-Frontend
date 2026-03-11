import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogIn, User, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(formData)
            toast.success('Welcome back!')
            navigate(from, { replace: true })
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fadeInUp">
                <div className="auth-card__header">
                    <div className="auth-logo">🪑</div>
                    <h1 className="heading-lg">Welcome Back</h1>
                    <p className="text-muted">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your username"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex-between text-sm mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-primary" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-primary font-bold">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full mt-6" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'} <LogIn size={18} />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="text-muted">
                        Don't have an account? <Link to="/register" className="text-primary font-bold">Sign up for free</Link>
                    </p>
                </div>
            </div>

            <div className="auth-visual">
                <div className="auth-visual__overlay"></div>
                <div className="auth-visual__content">
                    <h2 className="heading-xl">Premium Wood. <br /> Timeless Design.</h2>
                    <p>Join our community of 50,000+ happy homeowners.</p>
                </div>
            </div>
        </div>
    )
}
