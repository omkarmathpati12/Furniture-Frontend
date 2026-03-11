import { useState, useEffect } from 'react'
import { adminAPI } from '../../api/api'
import { Eye, Clock, MapPin, Package, RefreshCw, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import './AdminPages.css'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)

    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data } = await adminAPI.getAllOrders()
            setOrders(data)
        } catch (err) {
            toast.error('Failed to fetch orders')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setUpdatingId(id)
            await adminAPI.updateOrderStatus(id, newStatus)
            toast.success(`Order #${id} updated to ${newStatus}`)
            fetchOrders()
        } catch (err) {
            toast.error('Failed to update status')
        } finally {
            setUpdatingId(null)
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return 'badge-warning'
            case 'CONFIRMED': return 'badge-primary'
            case 'PROCESSING': return 'badge-info'
            case 'SHIPPED': return 'badge-info'
            case 'DELIVERED': return 'badge-success'
            case 'CANCELLED': return 'badge-danger'
            default: return 'badge-gray'
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header mb-8">
                    <h1 className="heading-lg">Order Management</h1>
                    <p className="text-muted">Process and track customer orders</p>
                </div>

                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order Info</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <div className="spinner mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <p className="text-muted">No orders placed yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <div className="order-cell">
                                                    <p className="font-bold">Order #{order.id}</p>
                                                    <p className="text-xs text-muted">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <div className="flex gap-1 mt-1">
                                                        {order.items.slice(0, 3).map((item, i) => (
                                                            <img key={i} src={item.productImageUrl} className="mini-thumb" title={item.productName} />
                                                        ))}
                                                        {order.items.length > 3 && <span className="mini-more">+{order.items.length - 3}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="customer-cell">
                                                    <p className="font-bold text-sm">{order.userFullName}</p>
                                                    <p className="text-xs text-muted flex items-center gap-1">
                                                        <MapPin size={10} /> {order.shippingAddress}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                                <p className="text-xs text-muted uppercase">{order.paymentMethod}</p>
                                            </td>
                                            <td>
                                                <div className="status-cell">
                                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-cell">
                                                    <div className="status-dropdown">
                                                        <select
                                                            className="form-select status-select"
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            disabled={updatingId === order.id}
                                                        >
                                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        {updatingId === order.id && <RefreshCw size={14} className="spin status-loader" />}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
