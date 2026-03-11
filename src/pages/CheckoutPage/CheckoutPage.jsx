import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderAPI } from '../../api/api'
import { CreditCard, Truck, MapPin, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import './CheckoutPage.css'

export default function CheckoutPage() {
    const { cart, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        shippingAddress: user?.address || '',
        phone: user?.phone || '',
        paymentMethod: 'Cash on Delivery'
    })
    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)

    if (!cart || cart.items.length === 0) {
        if (!orderPlaced) return <Navigate to="/cart" />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await orderAPI.placeOrder(formData)
            setOrderPlaced(true)
            toast.success('Order placed successfully!', { duration: 5000 })
            clearCart()
            setTimeout(() => navigate('/orders'), 3000)
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to place order')
        } finally {
            setLoading(false)
        }
    }

    if (orderPlaced) {
        return (
            <div className="checkout-page flex-center py-20">
                <div className="success-card animate-scaleIn">
                    <div className="success-icon">
                        <CheckCircle size={80} className="text-success" />
                    </div>
                    <h1 className="heading-lg mt-6">Order Placed!</h1>
                    <p className="text-muted mt-2">
                        Your furniture is on its way. We've sent the confirmation to {user.email}.
                    </p>
                    <p className="mt-4 font-bold">Redirecting to order history...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="checkout-page">
            <div className="container py-12">
                <button onClick={() => navigate('/cart')} className="back-link mb-8 btn-link">
                    <ArrowLeft size={18} /> Back to Cart
                </button>

                <h1 className="heading-xl mb-10">Checkout</h1>

                <div className="checkout-layout">
                    <form onSubmit={handleSubmit} className="checkout-main animate-fadeInLeft">
                        <div className="checkout-section">
                            <div className="section-header-compact">
                                <MapPin size={24} className="text-primary" />
                                <h2 className="heading-md">Shipping Information</h2>
                            </div>

                            <div className="form-grid mt-6">
                                <div className="form-group span-2">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-input" value={user.fullName} readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" value={user.email} readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label className="form-label">Shipping Address</label>
                                    <textarea
                                        className="form-input"
                                        required
                                        rows="3"
                                        value={formData.shippingAddress}
                                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-section mt-8">
                            <div className="section-header-compact">
                                <CreditCard size={24} className="text-primary" />
                                <h2 className="heading-md">Payment Method</h2>
                            </div>

                            <div className="payment-options mt-6">
                                <label className={`payment-option ${formData.paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash on Delivery"
                                        checked={formData.paymentMethod === 'Cash on Delivery'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    />
                                    <div className="payment-option__info">
                                        <span className="payment-option__title">Cash on Delivery</span>
                                        <p className="text-xs text-muted">Pay when your furniture arrives at your door.</p>
                                    </div>
                                </label>

                                <label className={`payment-option disabled ${formData.paymentMethod === 'Credit/Debit Card' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Credit/Debit Card"
                                        disabled
                                    />
                                    <div className="payment-option__info">
                                        <span className="payment-option__title">Credit / Debit Card</span>
                                        <p className="text-xs text-muted">Online payment is currently unavailable.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full mt-10" disabled={loading}>
                            {loading ? 'Processing Order...' : `Pay ₹${cart.totalAmount.toLocaleString()}`}
                        </button>
                    </form>

                    <aside className="checkout-sidebar animate-fadeInRight">
                        <div className="summary-card">
                            <h3 className="heading-md mb-6">Order Items</h3>
                            <div className="checkout-items-list">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="checkout-item-mini">
                                        <img src={item.productImageUrl} alt={item.productName} className="checkout-item-mini__img" />
                                        <div className="checkout-item-mini__details">
                                            <p className="checkout-item-mini__name">{item.productName}</p>
                                            <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="checkout-item-mini__price">₹{item.subtotal.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider my-6"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cart.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <div className="summary-divider my-6"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>₹{cart.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="trust-card mt-6">
                            <div className="flex gap-4 items-start">
                                <Truck size={20} className="text-primary mt-1" />
                                <div>
                                    <p className="font-bold text-sm">Estimated Delivery</p>
                                    <p className="text-xs text-muted">3-7 business days depending on location.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
