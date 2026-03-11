import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Package, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { user, logout } = useAuth()
    const { cartCount } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    const isHome = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
        setUserMenuOpen(false)
    }, [location])

    const handleLogout = async () => {
        await logout()
        toast.success('Logged out successfully')
        navigate('/')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const navClass = `navbar ${scrolled || !isHome ? 'navbar--solid' : 'navbar--transparent'}`

    return (
        <header className={navClass}>
            <div className="container navbar__inner">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">🪑</span>
                    <div>
                        <span className="navbar__logo-main">LuxeWood</span>
                        <span className="navbar__logo-sub">Premium Furniture</span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="navbar__links">
                    <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/products" className={`navbar__link ${location.pathname.startsWith('/products') ? 'active' : ''}`}>Shop</Link>
                    <Link to="/products?category=SOFA" className="navbar__link">Sofas</Link>
                    <Link to="/products?category=BED" className="navbar__link">Beds</Link>
                    <Link to="/products?category=TABLE" className="navbar__link">Tables</Link>
                </nav>

                {/* Right Actions */}
                <div className="navbar__actions">
                    {/* Search */}
                    <button
                        className="navbar__icon-btn"
                        onClick={() => setSearchOpen(!searchOpen)}
                        title="Search"
                    >
                        <Search size={20} />
                    </button>

                    {/* Cart */}
                    {user && (
                        <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" title="Cart">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="navbar__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                            )}
                        </Link>
                    )}

                    {/* User Menu */}
                    {user ? (
                        <div className="navbar__user-menu">
                            <button
                                className="navbar__user-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="navbar__avatar">
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="navbar__username">{user.fullName?.split(' ')[0]}</span>
                            </button>

                            {userMenuOpen && (
                                <div className="navbar__dropdown">
                                    <div className="navbar__dropdown-header">
                                        <p className="navbar__dropdown-name">{user.fullName}</p>
                                        <p className="navbar__dropdown-email">{user.email}</p>
                                    </div>
                                    <hr className="navbar__dropdown-divider" />
                                    <Link to="/orders" className="navbar__dropdown-item">
                                        <Package size={16} />
                                        My Orders
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link to="/admin" className="navbar__dropdown-item">
                                            <LayoutDashboard size={16} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <hr className="navbar__dropdown-divider" />
                                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="navbar__auth-btns">
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="navbar__mobile-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {searchOpen && (
                <div className="navbar__search-bar">
                    <form onSubmit={handleSearch} className="navbar__search-form">
                        <Search size={18} className="navbar__search-icon" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search furniture..."
                            className="navbar__search-input"
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                        <button type="button" className="navbar__search-close" onClick={() => setSearchOpen(false)}>
                            <X size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="navbar__mobile-menu">
                    <nav className="navbar__mobile-links">
                        <Link to="/" className="navbar__mobile-link">Home</Link>
                        <Link to="/products" className="navbar__mobile-link">Shop All</Link>
                        <Link to="/products?category=SOFA" className="navbar__mobile-link">Sofas</Link>
                        <Link to="/products?category=BED" className="navbar__mobile-link">Beds</Link>
                        <Link to="/products?category=TABLE" className="navbar__mobile-link">Tables</Link>
                        <Link to="/products?category=CHAIR" className="navbar__mobile-link">Chairs</Link>
                        {user ? (
                            <>
                                <Link to="/cart" className="navbar__mobile-link">Cart ({cartCount})</Link>
                                <Link to="/orders" className="navbar__mobile-link">My Orders</Link>
                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" className="navbar__mobile-link">Admin</Link>
                                )}
                                <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="navbar__mobile-link">Login</Link>
                                <Link to="/register" className="navbar__mobile-link">Sign Up</Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
