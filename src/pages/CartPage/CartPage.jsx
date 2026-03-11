import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import './CartPage.css'

export default function CartPage() {
    const { cart, cartLoading, updateItem, removeItem, clearCart } = useCart()
    const navigate = useNavigate()

    const handleUpdateQty = async (itemId, newQty) => {
        try {
            if (newQty < 1) {
                await removeItem(itemId)
                toast.success('Item removed')
            } else {
                await updateItem(itemId, newQty)
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update failed')
        }
    }

    const handleRemove = async (itemId) => {
        try {
            await removeItem(itemId)
            toast.success('Item removed')
        } catch (err) {
            toast.error('Failed to remove item')
        }
    }

    if (cartLoading && !cart) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container py-20">
                    <div className="empty-cart-state animate-fadeInUp">
                        <div className="empty-cart-icon">🛒</div>
                        <h1 className="heading-lg mt-6">Your cart is currently empty</h1>
                        <p className="text-muted mt-2 max-w-md mx-auto">
                            Look like you haven't added anything to your cart yet.
                            Discover our latest collection and find something you love.
                        </p>
                        <Link to="/products" className="btn btn-primary btn-lg mt-10">
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="heading-xl">Your Shopping Cart</h1>
                    <p className="text-muted mt-2">You have {cart.totalItems} items in your basket</p>
                </div>
            </div>

            <div className="container py-12">
                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-main">
                        <div className="cart-header-row">
                            <span>Product Details</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                        </div>

                        <div className="cart-items-list">
                            {cart.items.map((item) => (
                                <div key={item.id} className="cart-item animate-fadeIn">
                                    <div className="cart-item__product">
                                        <img src={item.productImageUrl} alt={item.productName} className="cart-item__img" />
                                        <div className="cart-item__details">
                                            <Link to={`/products/${item.productId}`} className="cart-item__name">
                                                {item.productName}
                                            </Link>
                                            <p className="cart-item__price">₹{item.productPrice.toLocaleString()}</p>
                                            <button className="cart-item__remove-btn" onClick={() => handleRemove(item.id)}>
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__qty">
                                        <div className="qty-control">
                                            <button className="qty-btn-sm" onClick={() => handleUpdateQty(item.id, item.quantity - 1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-text">{item.quantity}</span>
                                            <button className="qty-btn-sm" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__subtotal">
                                        ₹{item.subtotal.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer mt-8">
                            <Link to="/products" className="btn btn-secondary btn-sm">
                                <ShoppingBag size={16} /> Continue Shopping
                            </Link>
                            <button className="text-danger font-bold text-sm" onClick={clearCart}>
                                Clear Entire Cart
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <aside className="cart-summary animate-fadeInRight">
                        <div className="summary-card">
                            <h3 className="heading-md mb-6 pb-4 border-bottom">Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cart.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Tax (18% GST)</span>
                                <span>Included</span>
                            </div>

                            <div className="summary-divider my-6"></div>

                            <div className="summary-row summary-total">
                                <span>Total Amount</span>
                                <span>₹{cart.totalAmount.toLocaleString()}</span>
                            </div>

                            <button
                                className="btn btn-primary btn-lg w-full mt-8"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout <ArrowRight size={20} />
                            </button>

                            <div className="payment-icons mt-6 flex-center gap-4 grayscale opacity-50">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="12" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="15" alt="Paypal" />
                            </div>
                        </div>

                        <div className="security-note mt-6">
                            <ShieldCheck size={18} />
                            <span>100% Secure SSL Encrypted Checkout</span>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
