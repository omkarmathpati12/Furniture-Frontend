import { useState, useEffect } from 'react'
import { adminAPI } from '../../api/api'
import { Plus, Edit, Trash2, X, Save, Search, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import './AdminPages.css'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'SOFA',
        imageUrl: '',
        material: '',
        dimensions: ''
    })

    const categories = ['SOFA', 'BED', 'TABLE', 'CHAIR', 'WARDROBE', 'SHELF', 'DESK', 'OTHER']

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data } = await adminAPI.getProducts()
            setProducts(data)
        } catch (err) {
            toast.error('Failed to fetch products')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (product) => {
        setCurrentProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            category: product.category,
            imageUrl: product.imageUrl,
            material: product.material || '',
            dimensions: product.dimensions || ''
        })
        setModalOpen(true)
    }

    const handleAddNew = () => {
        setCurrentProduct(null)
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            category: 'SOFA',
            imageUrl: '',
            material: '',
            dimensions: ''
        })
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this product?')) {
            try {
                await adminAPI.deleteProduct(id)
                toast.success('Product deactivated')
                fetchProducts()
            } catch (err) {
                toast.error('Failed to delete product')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (currentProduct) {
                await adminAPI.updateProduct(currentProduct.id, formData)
                toast.success('Product updated successfully')
            } else {
                await adminAPI.createProduct(formData)
                toast.success('Product added successfully')
            }
            setModalOpen(false)
            fetchProducts()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed')
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header flex-between mb-8">
                    <div>
                        <h1 className="heading-lg">Product Management</h1>
                        <p className="text-muted">Manage your furniture catalog</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10">
                                            <div className="spinner mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10">
                                            <div className="empty-state">
                                                <AlertCircle size={40} className="text-muted" />
                                                <p className="mt-2">No products found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <img src={product.imageUrl} alt={product.name} className="table-img" />
                                                    <div>
                                                        <p className="font-bold text-sm">{product.name}</p>
                                                        <p className="text-xs text-muted">ID: #{product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-primary">{product.category}</span></td>
                                            <td><span className="font-bold">₹{product.price.toLocaleString()}</span></td>
                                            <td>
                                                <span className={product.stockQuantity < 5 ? 'text-danger font-bold' : ''}>
                                                    {product.stockQuantity}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button className="action-btn edit" onClick={() => handleEdit(product)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
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

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scaleIn">
                        <div className="modal-header">
                            <h3 className="heading-md">{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="grid-2">
                                <div className="form-group span-2">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text" className="form-input" required
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number" className="form-input" required
                                        value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock Quantity</label>
                                    <input
                                        type="number" className="form-input" required
                                        value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Material</label>
                                    <input
                                        type="text" className="form-input"
                                        value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text" className="form-input" required
                                        value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label className="form-label">Dimensions</label>
                                    <input
                                        type="text" className="form-input" placeholder="e.g. 200cm x 100cm x 75cm"
                                        value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                    />
                                </div>
                                <div className="form-group span-2">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input" rows="4" style={{ resize: 'none' }}
                                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer mt-8">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> {currentProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
