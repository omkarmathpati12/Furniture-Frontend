import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

import HomePage from './pages/HomePage/HomePage'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage'
import LoginPage from './pages/AuthPages/LoginPage'
import RegisterPage from './pages/AuthPages/RegisterPage'
import CartPage from './pages/CartPage/CartPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage'

import AdminDashboard from './pages/AdminPages/AdminDashboard'
import AdminProducts from './pages/AdminPages/AdminProducts'
import AdminOrders from './pages/AdminPages/AdminOrders'

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth()

    if (loading) return <div className="page-loader"><div className="spinner"></div></div>

    if (!user) return <Navigate to="/login" />

    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />

    return children
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="app-wrapper">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductListPage />} />
                                <Route path="/products/:id" element={<ProductDetailsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />

                                <Route path="/cart" element={
                                    <ProtectedRoute>
                                        <CartPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/checkout" element={
                                    <ProtectedRoute>
                                        <CheckoutPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders" element={
                                    <ProtectedRoute>
                                        <OrderHistoryPage />
                                    </ProtectedRoute>
                                } />

                                <Route path="/admin" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/products" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminProducts />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/orders" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminOrders />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            className: 'custom-toast',
                            duration: 3000,
                            style: {
                                background: '#333',
                                color: '#fff',
                                borderRadius: '12px',
                                padding: '12px 24px',
                            },
                        }}
                    />
                </Router>
            </CartProvider>
        </AuthProvider>
    )
}

export default App
