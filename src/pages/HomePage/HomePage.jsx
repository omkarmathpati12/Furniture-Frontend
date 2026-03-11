import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ShieldCheck, Truck, Clock, Award } from 'lucide-react'
import { productAPI } from '../../api/api'
import './HomePage.css'

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeatured()
    }, [])

    const fetchFeatured = async () => {
        try {
            const { data } = await productAPI.getFeatured()
            setFeaturedProducts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { name: 'Sofas', icon: '🛋️', slug: 'SOFA', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
        { name: 'Beds', icon: '🛏️', slug: 'BED', image: 'https://images.unsplash.com/photo-15056933c0346-bb7d1f93f13c?w=400' },
        { name: 'Dining', icon: '🪑', slug: 'TABLE', image: 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=400' },
        { name: 'Storage', icon: '🚪', slug: 'WARDROBE', image: 'https://images.unsplash.com/photo-1595428773149-dbbde9a1b89d?w=400' },
    ]

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__overlay"></div>
                <div className="container hero__content animate-fadeInUp">
                    <span className="section-tag" style={{ color: 'var(--color-accent)' }}>New Collection 2024</span>
                    <h1 className="heading-hero">Elevate Your Living <br /> Experience</h1>
                    <p className="hero__subtitle">
                        Discover a curated collection of premium furniture designed to bring
                        comfort, elegance, and soul to your home.
                    </p>
                    <div className="hero__actions">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Explore Collection <ArrowRight size={20} />
                        </Link>
                        <Link to="/products?category=SOFA" className="btn btn-secondary btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                            View Sofas
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="features-bar">
                <div className="container flex-between flex-wrap gap-8">
                    <div className="feature-item">
                        <ShieldCheck className="feature-item__icon" />
                        <div>
                            <p className="feature-item__title">Premium Quality</p>
                            <p className="feature-item__desc">Crafted from top-tier materials</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <Truck className="feature-item__icon" />
                        <div>
                            <p className="feature-item__title">Free Delivery</p>
                            <p className="feature-item__desc">On orders above ₹50,000</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <Clock className="feature-item__icon" />
                        <div>
                            <p className="feature-item__title">24/7 Support</p>
                            <p className="feature-item__desc">Dedicated customer care</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <Award className="feature-item__icon" />
                        <div>
                            <p className="feature-item__title">Warranty</p>
                            <p className="feature-item__desc">5-year warranty on all furniture</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section bg-light">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Browse Categories</span>
                        <h2 className="heading-xl">Elegant Solutions for Every Room</h2>
                    </div>

                    <div className="grid-4 categories-grid">
                        {categories.map((cat, idx) => (
                            <Link to={`/products?category=${cat.slug}`} key={idx} className="category-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="category-card__img-wrapper">
                                    <img src={cat.image} alt={cat.name} />
                                </div>
                                <div className="category-card__content">
                                    <span className="category-card__icon">{cat.icon}</span>
                                    <h3 className="heading-md">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="container">
                    <div className="flex-between mb-12">
                        <div>
                            <span className="section-tag">Our Favorites</span>
                            <h2 className="heading-xl">Featured Pieces</h2>
                        </div>
                        <Link to="/products" className="btn btn-secondary">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid-4">
                            {featuredProducts.map((product, idx) => (
                                <Link to={`/products/${product.id}`} key={product.id} className="product-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="product-card__img-wrapper">
                                        <img src={product.imageUrl} alt={product.name} />
                                    </div>
                                    <div className="product-card__content">
                                        <span className="text-muted text-xs uppercase tracking-wider">{product.category}</span>
                                        <h3 className="heading-md mt-1">{product.name}</h3>
                                        <div className="flex-between mt-4">
                                            <span className="price-sm">₹{product.price.toLocaleString()}</span>
                                            <div className="stars">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-bold text-dark ml-1">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section className="section about-home bg-dark text-white">
                <div className="container grid-2">
                    <div className="about-home__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800" alt="About us" className="rounded-lg shadow-xl" />
                    </div>
                    <div className="flex flex-column justify-center gap-6">
                        <span className="section-tag" style={{ color: 'var(--color-primary-light)' }}>Our Story</span>
                        <h2 className="heading-xl">The Art of Living Well</h2>
                        <p className="text-muted-light">
                            At LuxeWood, we believe that your home is a reflection of your personality.
                            Our craftsmen use sustainable wood and premium fabrics to create furniture
                            that blends modern aesthetics with timeless comfort.
                        </p>
                        <p className="text-muted-light">
                            Since 2010, we've helped over 50,000 families create spaces they love coming
                            back to. Each piece is rigorously tested for durability and quality.
                        </p>
                        <div className="flex gap-8 mt-4">
                            <div>
                                <h4 className="heading-md text-white">10+</h4>
                                <p className="text-xs uppercase tracking-widest text-muted">Years Experience</p>
                            </div>
                            <div>
                                <h4 className="heading-md text-white">5k+</h4>
                                <p className="text-xs uppercase tracking-widest text-muted">Unique Designs</p>
                            </div>
                            <div>
                                <h4 className="heading-md text-white">100%</h4>
                                <p className="text-xs uppercase tracking-widest text-muted">Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
