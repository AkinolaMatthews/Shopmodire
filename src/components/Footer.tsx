import { Link } from 'react-router-dom'
import { Instagram, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop">Scrubs</Link>
          <Link to="/shop">Scrub Caps</Link>
          <Link to="/shop">Joggers</Link>
        </div>

        <div className="footer-col">
          <h4>Order Info</h4>
          <Link to="/contact">Shipping &amp; Returns</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms of Use</Link>
        </div>

        <div className="footer-col footer-col--contact">
          <h4>Contact</h4>
          <a href="mailto:shopmodire@gmail.com">shopmodire@gmail.com</a>
          <a href="tel:+5128872404">+512-887-2404</a>

          <div className="footer-socials">
            <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://www.etsy.com" target="_blank" rel="noreferrer" aria-label="Etsy shop">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Shop Modire. All rights reserved.</span>
        <Link to="/admin" className="footer-bottom__admin">Admin</Link>
      </div>
    </footer>
  )
}