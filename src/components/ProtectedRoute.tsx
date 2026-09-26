import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIsAdmin } from '../hooks/useIsAdmin'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const { isAdmin, checked } = useIsAdmin()

  if (loading || (session && !checked)) {
    return <div className="admin-loading">Loading…</div>
  }
  if (!session) {
    return <Navigate to="/admin/login" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}