import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { productAPI } from '../../api/api'
import { Filter, Search, Grid, List as ListIcon, Star, ArrowRight } from 'lucide-react'
import './ProductListPage.css'

export default function ProductListPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const location = useLocation()

    // Get query params
    const query = new URLSearchParams(location.search)
    const categoryParam = query.get('category') || ''
    const keywordParam = query.get('keyword') || ''

    useEffect(() => {
        fetchProducts()
    }, [location.search])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data } = await productAPI.getAll({
                category: categoryParam,
                keyword: keywordParam
            })
            setProducts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { label: 'All Furniture', value: '' },
        { label: 'Sofas', value: 'SOFA' },
        { label: 'Beds', value: 'BED' },
        { label: 'Tables', value: 'TABLE' },
        { label: 'Chairs', value: 'CHAIR' },
        { label: 'Wardrobes', value: 'WARDROBE' },
        { label: 'Shelves', value: 'SHELF' },
        { label: 'Desks', value: 'DESK' },
    ]

    return (
        <div className="products-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="heading-xl">
                        {categoryParam ? `${categoryParam.charAt(0) + categoryParam.slice(1).toLowerCase()}s` : 'All Collection'}
                    </h1>
                    {keywordParam && <p className="text-muted mt-2">Showing results for "{keywordParam}"</p>}
                </div>
            </div>

            <div className="container py-12">
                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className="products-sidebar">
                        <div className="filter-section">
                            <h3 className="heading-md mb-4">Categories</h3>
                            <div className="filter-list">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.value}
                                        to={cat.value ? `/products?category=${cat.value}` : '/products'}
                                        className={`filter-item ${categoryParam === cat.value ? 'active' : ''}`}
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section mt-8">
                            <h3 className="heading-md mb-4">Price Range</h3>
                            <div className="price-inputs">
                                <input type="number" placeholder="Min" className="form-input" />
                                <span>-</span>
                                <input type="number" placeholder="Max" className="form-input" />
                            </div>
                            <button className="btn btn-primary btn-sm w-full mt-4">Apply Filter</button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="products-main">
                        <div className="products-toolbar flex-between mb-8">
                            <div className="text-muted">
                                Showing <strong>{products.length}</strong> products
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="view-modes">
                                    <button
                                        className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <ListIcon size={18} />
                                    </button>
                                </div>
                                <select className="form-select text-sm py-2" style={{ width: 'auto' }}>
                                    <option>Sort by: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex-center py-20">
                                <div className="spinner"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <Search size={48} />
                                <h2 className="heading-md">No products found</h2>
                                <p className="text-muted mt-2">Try adjusting your filters or search terms.</p>
                                <Link to="/products" className="btn btn-primary mt-6">Clear All Filters</Link>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'grid-3' : 'list-view'}>
                                {products.map((product) => (
                                    <Link
                                        to={`/products/${product.id}`}
                                        key={product.id}
                                        className={`product-card ${viewMode === 'list' ? 'product-card--list' : ''} animate-fadeIn`}
                                    >
                                        <div className="product-card__img-wrapper">
                                            <img src={product.imageUrl} alt={product.name} />
                                            <div className="product-card__badge">
                                                {product.stockQuantity < 5 && product.stockQuantity > 0 && <span className="badge-warning px-2 py-1 rounded text-xs font-bold text-white">Low Stock</span>}
                                                {product.stockQuantity === 0 && <span className="badge-danger px-2 py-1 rounded text-xs font-bold text-white">Out of Stock</span>}
                                            </div>
                                        </div>
                                        <div className="product-card__content">
                                            <div className="flex-between">
                                                <span className="text-muted text-xs uppercase tracking-wider">{product.category}</span>
                                                <div className="stars">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="text-xs font-bold ml-1">{product.rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="heading-md mt-1">{product.name}</h3>
                                            {viewMode === 'list' && (
                                                <p className="text-muted text-sm mt-2 line-clamp-2">{product.description}</p>
                                            )}
                                            <div className="flex-between mt-4">
                                                <span className="price-sm">₹{product.price.toLocaleString()}</span>
                                                {viewMode === 'list' && (
                                                    <button className="btn btn-primary btn-sm">View Details</button>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
