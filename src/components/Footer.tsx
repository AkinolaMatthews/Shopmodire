import { Link } from 'react-router-dom'
import { Instagram, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-brand">
          <h3>Shop Modire</h3>
          <p>African-inspired medical wear made for confidence.</p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop">Scrubs</Link>
          <Link to="/shop">Scrub Caps</Link>
          <Link to="/shop">Joggers</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/contact">Shipping</Link>
          <Link to="/contact">Returns</Link>
          <Link to="/contact">Privacy</Link>
        </div>

        <div className="footer-col">
          <h4>Follow</h4>
          <a href="#" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a>
          <a href="https://www.etsy.com/shop/ShopModire" target="_blank" rel="noreferrer"><ExternalLink size={16} /> Etsy</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Shop Modire. All rights reserved.</span>
        <Link to="/admin" className="footer-bottom__admin">Admin</Link>
      </div>
    </footer>
  )
}
