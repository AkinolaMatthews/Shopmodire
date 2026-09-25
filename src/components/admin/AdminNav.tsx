import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/admin.css'

export default function AdminNav() {
  const { signOut } = useAuth()
  return (
    <div className="admin-nav">
      <NavLink to="/admin" end className={({ isActive }) => `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`}>
        Products
      </NavLink>
      <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`}>
        Sales
      </NavLink>
      <button className="admin-nav__signout" onClick={signOut}>
        <LogOut size={15} /> Sign Out
      </button>
    </div>
  )
}
