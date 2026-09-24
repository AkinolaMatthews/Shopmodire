import { useParams, Navigate } from 'react-router-dom'
import { useProduct } from '../../hooks/useProducts'
import ProductForm from '../../components/admin/ProductForm'
import '../../styles/admin.css'

export default function AdminProductEdit() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)

  if (loading) return <div className="admin-page"><p>Loading…</p></div>
  if (error || !product) return <Navigate to="/admin" replace />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Edit Product</h1>
        </div>
      </div>
      <ProductForm existing={product} />
    </div>
  )
}
