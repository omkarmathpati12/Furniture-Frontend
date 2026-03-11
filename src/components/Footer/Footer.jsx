import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <span>🪑</span>
                            <span className="footer__logo-text">LuxeWood</span>
                        </div>
                        <p className="footer__desc">
                            Crafting timeless furniture that transforms houses into homes.
                            Every piece is designed with love and built to last.
                        </p>
                        <div className="footer__socials">
                            <a href="#" className="footer__social">📘</a>
                            <a href="#" className="footer__social">📸</a>
                            <a href="#" className="footer__social">🐦</a>
                            <a href="#" className="footer__social">▶️</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer__heading">Shop</h4>
                        <ul className="footer__list">
                            <li><Link to="/products?category=SOFA">Sofas & Sectionals</Link></li>
                            <li><Link to="/products?category=BED">Beds & Mattresses</Link></li>
                            <li><Link to="/products?category=TABLE">Dining Tables</Link></li>
                            <li><Link to="/products?category=CHAIR">Chairs & Seating</Link></li>
                            <li><Link to="/products?category=WARDROBE">Wardrobes</Link></li>
                            <li><Link to="/products?category=DESK">Study Desks</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__heading">Help</h4>
                        <ul className="footer__list">
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Shipping Policy</a></li>
                            <li><a href="#">Return & Exchange</a></li>
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Assembly Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__heading">Contact Us</h4>
                        <ul className="footer__contact-list">
                            <li>📍 123 Furniture Ave, Mumbai, MH 400001</li>
                            <li>📞 +91 98765 43210</li>
                            <li>✉️ hello@luxewood.in</li>
                            <li>🕑 Mon–Sat: 10am – 8pm</li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© 2024 LuxeWood. All rights reserved.</p>
                    <div className="footer__bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
