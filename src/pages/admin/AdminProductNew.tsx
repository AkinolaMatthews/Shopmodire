import ProductForm from '../../components/admin/ProductForm'
import AdminNav from '../../components/admin/AdminNav'
import '../../styles/admin.css'

export default function AdminProductNew() {
  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Add Product</h1>
        </div>
      </div>
      <ProductForm />
    </div>
  )
}
