import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { supabase } from '../../lib/supabase'
import AdminNav from '../../components/admin/AdminNav'
import '../../styles/admin.css'

export default function AdminDashboard() {
  const { products, loading, error, refresh } = useProducts()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return
    setDeletingId(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      alert(`Couldn't delete: ${error.message}`)
      return
    }
    refresh()
  }

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Product Catalog</h1>
        </div>
        <div className="admin-page__header-actions">
          <Link to="/admin/products/new" className="btn btn-primary">
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {loading && <p>Loading products…</p>}
      {error && <p className="admin-auth__error">{error}</p>}

      {!loading && products.length === 0 && (
        <p>No products yet — add your first one.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>New</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image_url} alt={p.name} className="admin-table__thumb" />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.is_new ? 'Yes' : '—'}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/products/${p.id}/edit`} className="icon-btn" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deletingId === p.id}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
