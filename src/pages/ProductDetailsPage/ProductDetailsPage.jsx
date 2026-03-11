import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productAPI } from '../../api/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronLeft, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import './ProductDetailsPage.css'

export default function ProductDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [addingToCart, setAddingToCart] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const { data } = await productAPI.getById(id)
            setProduct(data)
        } catch (err) {
            toast.error('Product not found')
            navigate('/products')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart')
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } })
            return
        }

        try {
            setAddingToCart(true)
            await addToCart(product.id, quantity)
            toast.success('Added to cart!')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add to cart')
        } finally {
            setAddingToCart(false)
        }
    }

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!product) return null

    return (
        <div className="product-details-page">
            <div className="container py-8">
                <Link to="/products" className="back-link mb-8">
                    <ChevronLeft size={20} /> Back to Shop
                </Link>

                <div className="product-grid">
                    <div className="product-gallery animate-fadeInUp">
                        <div className="main-image-wrapper">
                            <img src={product.imageUrl} alt={product.name} className="main-image" />
                            {product.stockQuantity === 0 && (
                                <div className="sold-out-overlay">Sold Out</div>
                            )}
                        </div>
                    </div>

                    <div className="product-info animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div className="product-header">
                            <span className="badge badge-primary mb-2">{product.category}</span>
                            <h1 className="heading-xl">{product.name}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                            className={i < Math.floor(product.rating) ? "text-accent" : "text-gray-300"}
                                        />
                                    ))}
                                    <span className="text-dark font-bold ml-1">{product.rating}</span>
                                </div>
                                <span className="text-muted text-sm border-l pl-4">{product.reviewCount} Reviews</span>
                            </div>
                        </div>

                        <div className="price-section mt-8">
                            <div className="price-lg">₹{product.price.toLocaleString()}</div>
                            <p className="text-muted text-sm mt-1">MRP inclusive of all taxes</p>
                        </div>

                        <div className="product-description mt-8">
                            <h3 className="heading-md mb-3">Product Description</h3>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="product-specs mt-8">
                            <div className="spec-item">
                                <span className="spec-label">Material:</span>
                                <span className="spec-value">{product.material || 'Premium Wood'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Dimensions:</span>
                                <span className="spec-value">{product.dimensions || 'N/A'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Availability:</span>
                                <span className={`spec-value ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`}>
                                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} remaining)` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {product.stockQuantity > 0 && (
                            <div className="purchase-section mt-10">
                                <div className="quantity-selector">
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="qty-value">{quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                        disabled={quantity >= product.stockQuantity}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    className="btn btn-primary btn-lg flex-1"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    <ShoppingCart size={20} />
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        )}

                        <div className="trust-badges mt-12 grid-3">
                            <div className="trust-item">
                                <ShieldCheck size={24} className="text-primary" />
                                <span>Quality Assured</span>
                            </div>
                            <div className="trust-item">
                                <Truck size={24} className="text-primary" />
                                <span>Safe Delivery</span>
                            </div>
                            <div className="trust-item">
                                <RefreshCw size={24} className="text-primary" />
                                <span>Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
