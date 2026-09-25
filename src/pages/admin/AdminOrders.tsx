import { Fragment, useMemo, useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import AdminNav from '../../components/admin/AdminNav'
import { Order } from '../../types/order'
import '../../styles/admin.css'

const STATUS_OPTIONS: Order['status'][] = ['pending', 'paid', 'fulfilled', 'cancelled']

export default function AdminOrders() {
  const { orders, loading, error, updateStatus } = useOrders()
  const [expanded, setExpanded] = useState<string | null>(null)

  const stats = useMemo(() => {
    const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
    return {
      revenue,
      orderCount: orders.length,
      pendingCount: orders.filter(o => o.status === 'pending').length,
    }
  }, [orders])

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-page__header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Sales</h1>
        </div>
      </div>

      {!loading && !error && (
        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat__label">Total Revenue</span>
            <span className="admin-stat__value">${stats.revenue.toFixed(2)}</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat__label">Orders</span>
            <span className="admin-stat__value">{stats.orderCount}</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat__label">Pending</span>
            <span className="admin-stat__value">{stats.pendingCount}</span>
          </div>
        </div>
      )}

      {loading && <p>Loading orders…</p>}
      {error && <p className="admin-auth__error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p>No orders yet — sales will show up here once customers check out.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o.id}>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>{o.customer_first_name} {o.customer_last_name}<br /><span className="admin-table__sub">{o.email}</span></td>
                    <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost admin-table__expand"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      >
                        {expanded === o.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="admin-table__details-row" key={`${o.id}-details`}>
                      <td colSpan={6}>
                        <div className="admin-order-details">
                          <div>
                            <h4>Items</h4>
                            <ul>
                              {o.items.map((item, i) => (
                                <li key={i}>
                                  {item.quantity} × {item.product.name} ({item.color}, {item.size}) — ${(item.product.price * item.quantity).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4>Shipping</h4>
                            <p>{o.address}, {o.city}, {o.state}, {o.country}</p>
                            <p>{o.phone}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
