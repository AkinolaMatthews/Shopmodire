import { useState, FormEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LogOut, Check, User, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMyOrders } from '../hooks/useMyOrders'
import './Account.css'

type Tab = 'account' | 'orders'

function MyDetailsForm() {
  const { session, updateProfile } = useAuth()
  const meta = session?.user.user_metadata ?? {}

  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(meta.full_name ?? '')
  const [phone, setPhone] = useState(meta.phone ?? '')
  const [address, setAddress] = useState(meta.address ?? '')
  const [city, setCity] = useState(meta.city ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFullName(meta.full_name ?? '')
    setPhone(meta.phone ?? '')
    setAddress(meta.address ?? '')
    setCity(meta.city ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error } = await updateProfile({ full_name: fullName, phone, address, city })
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setEditing(false)
    }
  }

  if (!editing) {
    return (
      <div className="account-panel">
        <div className="account-panel__header">
          <h2>Contact Information</h2>
        </div>
        <p className="account-detail-name">{meta.full_name || 'No name on file'}</p>
        <p className="account-detail-sub">{session?.user.email}</p>
        {meta.phone && <p className="account-detail-sub">{meta.phone}</p>}
        {(meta.address || meta.city) && (
          <p className="account-detail-sub">{[meta.address, meta.city].filter(Boolean).join(', ')}</p>
        )}
        <button className="account-edit-link" onClick={() => setEditing(true)}>Edit</button>
      </div>
    )
  }

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <h2>Edit Contact Information</h2>
      </div>
      <form onSubmit={handleSave}>
        {error && <div className="admin-auth__error">{error}</div>}

        <label className="account-field">
          Full name
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="account-field">
          Phone
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
        </label>
        <label className="account-field">
          Address
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" />
        </label>
        <label className="account-field">
          City
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
        </label>

        <div className="account-form__actions">
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : <><Check size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}

function MyOrdersPanel() {
  const { orders, loading } = useMyOrders()

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <h2>My Orders</h2>
      </div>
      {loading && <p>Loading…</p>}
      {!loading && orders.length === 0 && <p className="account-detail-sub">No orders yet.</p>}
      {!loading && orders.length > 0 && (
        <div className="account-orders">
          {orders.map(o => (
            <div className="account-order" key={o.id}>
              <div>
                <p className="account-detail-name">
                  {o.items.length} item{o.items.length === 1 ? '' : 's'} — ${o.total.toFixed(2)}
                </p>
                <p className="account-detail-sub">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`account-order__status account-order__status--${o.status}`}>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AccountDashboard() {
  const { session, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('account')

  return (
    <section className="section account-page">
      <div className="container account-dashboard">
        <h1 className="account-dashboard__title">My Shop Modire Account</h1>

        <div className="account-dashboard__grid">
          <aside className="account-sidebar">
            <button
              className={`account-sidebar__link${tab === 'account' ? ' account-sidebar__link--active' : ''}`}
              onClick={() => setTab('account')}
            >
              <User size={16} /> My Account
            </button>
            <button
              className={`account-sidebar__link${tab === 'orders' ? ' account-sidebar__link--active' : ''}`}
              onClick={() => setTab('orders')}
            >
              <Package size={16} /> My Orders
            </button>
            <Link to="/wishlist" className="account-sidebar__link">
              <Heart size={16} /> My Wishlist
            </Link>
            <button className="account-sidebar__link account-sidebar__link--signout" onClick={signOut}>
              <LogOut size={16} /> Sign Out
            </button>
          </aside>

          <div className="account-content">
            {tab === 'account' ? <MyDetailsForm /> : <MyOrdersPanel />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Account() {
  const { session, signIn, signUp, signInWithGoogle, signInWithApple } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    return <AccountDashboard />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      setSubmitting(false)
      if (error) setError(error)
      return
    }

    const { error, needsConfirmation } = await signUp(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
    } else if (needsConfirmation) {
      setNotice('Account created — check your email to confirm, then sign in.')
      setMode('signin')
    }
  }

  return (
    <section className="section account-page">
      <div className="container account-page__inner">
        <span className="eyebrow">My Account</span>
        <h1>Welcome to Shop Modire</h1>
        <p className="account-page__sub">Sign in to track orders and check out faster.</p>

        <div className="account-card">
          <button type="button" className="oauth-btn" onClick={signInWithGoogle}>
            Continue with Google
          </button>
          <button type="button" className="oauth-btn" onClick={signInWithApple}>
             Continue with Apple
          </button>

          <div className="account-card__divider">or use your email</div>

          <div className="account-tabs">
            <button
              type="button"
              className={`account-tabs__btn${mode === 'signin' ? ' account-tabs__btn--active' : ''}`}
              onClick={() => setMode('signin')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`account-tabs__btn${mode === 'signup' ? ' account-tabs__btn--active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="admin-auth__error">{error}</div>}
            {notice && <div className="account-card__notice">{notice}</div>}

            <label className="account-field">
              Email
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="account-field">
              Password
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>

            <button className="btn btn-primary account-submit" type="submit" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="account-page__help">
          Need help with an order? <Link to="/contact">Contact us</Link>.
        </p>
      </div>
    </section>
  )
}