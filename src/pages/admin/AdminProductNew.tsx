import ProductForm from '../../components/admin/ProductForm'
import '../../styles/admin.css'

export default function AdminProductNew() {
  return (
    <div className="admin-page">
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
