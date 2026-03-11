import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api/api'
import { Users, Package, ShoppingBag, TrendingUp, ChevronRight, LayoutDashboard, PlusCircle } from 'lucide-react'
import './AdminPages.css'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const { data } = await adminAPI.getStats()
            setStats(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        { label: 'Total Customers', value: stats.totalUsers, icon: <Users />, color: 'blue' },
        { label: 'Total Products', value: stats.totalProducts, icon: <Package />, color: 'orange' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag />, color: 'green' },
        { label: 'Total Revenue', value: '₹2.4L', icon: <TrendingUp />, color: 'purple', mock: true },
    ]

    if (loading) return <div className="page-loader"><div className="spinner"></div></div>

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header flex-between mb-10">
                    <div>
                        <h1 className="heading-lg">Admin Dashboard</h1>
                        <p className="text-muted">Welcome back, Administrator</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/admin/products" className="btn btn-primary">
                            <PlusCircle size={18} /> Manage Products
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className={`stat-card stat-card--${stat.color} animate-fadeInUp`} style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="stat-card__icon">{stat.icon}</div>
                            <div className="stat-card__content">
                                <p className="stat-card__label">{stat.label}</p>
                                <h3 className="stat-card__value">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid-2 mt-10">
                    <div className="admin-card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div className="admin-card__header flex-between">
                            <h3 className="heading-md">Management</h3>
                        </div>
                        <div className="admin-menu-list">
                            <Link to="/admin/products" className="admin-menu-item">
                                <div className="flex items-center gap-4">
                                    <div className="item-icon bg-orange"><Package size={20} /></div>
                                    <div>
                                        <p className="font-bold">Product Catalog</p>
                                        <p className="text-xs text-muted">Add, edit or remove products</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-muted" />
                            </Link>

                            <Link to="/admin/orders" className="admin-menu-item">
                                <div className="flex items-center gap-4">
                                    <div className="item-icon bg-green"><ShoppingBag size={20} /></div>
                                    <div>
                                        <p className="font-bold">Customer Orders</p>
                                        <p className="text-xs text-muted">Manage shipping and statuses</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-muted" />
                            </Link>
                        </div>
                    </div>

                    <div className="admin-card animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <div className="admin-card__header">
                            <h3 className="heading-md">System Health</h3>
                        </div>
                        <div className="p-6">
                            <div className="health-item flex-between mb-4">
                                <span className="text-sm font-semibold">Server Status</span>
                                <span className="badge badge-success">Online</span>
                            </div>
                            <div className="health-item flex-between mb-4">
                                <span className="text-sm font-semibold">Database Connection</span>
                                <span className="badge badge-success">Stable</span>
                            </div>
                            <div className="health-item flex-between">
                                <span className="text-sm font-semibold">API Performance</span>
                                <span className="text-sm text-primary font-bold">99.8% Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
