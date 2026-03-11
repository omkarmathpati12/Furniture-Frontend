import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../../api/api'
import { Package, ChevronRight, Clock, MapPin, Search } from 'lucide-react'
import './OrderHistoryPage.css'

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data } = await orderAPI.getMyOrders()
            setOrders(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'badge-warning'
            case 'CONFIRMED': return 'badge-primary'
            case 'SHIPPED': return 'badge-info'
            case 'DELIVERED': return 'badge-success'
            case 'CANCELLED': return 'badge-danger'
            default: return 'badge-gray'
        }
    }

    if (loading) {
        return <div className="page-loader"><div className="spinner"></div></div>
    }

    return (
        <div className="orders-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="heading-xl">Order History</h1>
                    <p className="text-muted mt-2">Track and manage your recent orders</p>
                </div>
            </div>

            <div className="container py-12">
                {orders.length === 0 ? (
                    <div className="empty-state animate-fadeInUp">
                        <Package size={60} />
                        <h2 className="heading-md">No orders yet</h2>
                        <p className="text-muted mt-2">Looks like you haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-primary mt-6">Shop Furnitures</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card animate-fadeInUp">
                                <div className="order-card__header flex-between flex-wrap gap-4">
                                    <div className="order-meta">
                                        <span className="order-no">Order #{order.id}</span>
                                        <span className="order-date">
                                            <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                                        <span className="font-bold text-dark">₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="order-card__body">
                                    <div className="order-items-preview">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="preview-item">
                                                <img src={item.productImageUrl} alt={item.productName} className="preview-img" title={item.productName} />
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="preview-more">+{order.items.length - 3} more</div>
                                        )}
                                    </div>

                                    <div className="order-shipping">
                                        <MapPin size={16} className="text-muted" />
                                        <p className="text-xs text-muted truncate">{order.shippingAddress}</p>
                                    </div>
                                </div>

                                <div className="order-card__footer">
                                    <div className="order-summary-text">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in total
                                    </div>
                                    <Link to={`/products`} className="btn-link flex items-center gap-2 text-primary font-bold">
                                        View Details <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
