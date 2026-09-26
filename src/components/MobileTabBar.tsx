import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './MobileTabBar.css'

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/shop', label: 'Shop', icon: LayoutGrid },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/account', label: 'Account', icon: User },
]

export default function MobileTabBar() {
  const { itemCount } = useCart()

  return (
    <nav className="mobile-tabbar">
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `mobile-tabbar__item${isActive ? ' mobile-tabbar__item--active' : ''}`}
        >
          <span className="mobile-tabbar__icon-wrap">
            <tab.icon size={20} strokeWidth={1.75} />
            {tab.to === '/cart' && itemCount > 0 && (
              <span className="mobile-tabbar__badge">{itemCount}</span>
            )}
          </span>
          <span className="mobile-tabbar__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}