import { useState, FormEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LogOut, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Account.css'

function AccountDashboard() {
  const { session, signOut, updateProfile } = useAuth()
  const meta = session?.user.user_metadata ?? {}

  const [fullName, setFullName] = useState(meta.full_name ?? '')
  const [phone, setPhone] = useState(meta.phone ?? '')
  const [address, setAddress] = useState(meta.address ?? '')
  const [city, setCity] = useState(meta.city ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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
    setSaved(false)
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      address,
      city,
    })
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <section className="section account-page">
      <div className="container account-page__signed-in">
        <span className="eyebrow">My Account</span>
        <h1>Welcome back</h1>
        <p>{session?.user.email}</p>

        <div className="account-card account-card--dashboard">
          <h3 className="account-card__title">My Details</h3>
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

            <button className="btn btn-primary account-submit" type="submit" disabled={saving}>
              {saving ? 'Saving…' : saved ? <><Check size={16} /> Saved</> : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="account-page__links">
          <Link to="/wishlist" className="btn btn-secondary">
            <Heart size={16} /> My Wishlist
          </Link>
          <button className="btn btn-ghost" onClick={signOut}>
            <LogOut size={16} /> Sign Out
          </button>
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