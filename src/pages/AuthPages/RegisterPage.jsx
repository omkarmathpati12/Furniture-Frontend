import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UserPlus, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: '',
        address: ''
    })
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await register(formData)
            toast.success('Registration successful! Please login.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fadeInUp">
                <div className="auth-card__header">
                    <div className="auth-logo">🪑</div>
                    <h1 className="heading-lg">Create Account</h1>
                    <p className="text-muted">Join LuxeWood today and start shopping.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <div className="input-with-icon">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group span-2">
                            <label className="form-label">Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    className="form-input"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group span-2">
                            <label className="form-label">Address</label>
                            <div className="input-with-icon">
                                <MapPin size={18} className="input-icon" />
                                <textarea
                                    className="form-input"
                                    rows="2"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full mt-6" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'} <UserPlus size={18} />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="text-muted">
                        Already have an account? <Link to="/login" className="text-primary font-bold">Sign in</Link>
                    </p>
                </div>
            </div>

            <div className="auth-visual">
                <div className="auth-visual__overlay"></div>
                <div className="auth-visual__content">
                    <h2 className="heading-xl">Join the <br /> Excellence.</h2>
                    <p>Get exclusive early access to our seasonal collections.</p>
                </div>
            </div>
        </div>
    )
}
