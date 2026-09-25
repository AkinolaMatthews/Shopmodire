import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Header.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" onClick={() => setOpen(false)}>
          Shop <span>Modire</span>
        </Link>

        <nav className="site-header__nav site-header__nav--desktop">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link to="/cart" className="cart-button" aria-label="View cart">
            <ShoppingBag size={20} strokeWidth={1.75} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="site-header__nav--mobile">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
