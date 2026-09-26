import { useState, FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Heart, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Account.css'

export default function Account() {
  const { session, signIn, signUp, signInWithGoogle, signInWithApple, signOut } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    return (
      <section className="section account-page">
        <div className="container account-page__signed-in">
          <span className="eyebrow">My Account</span>
          <h1>Welcome back</h1>
          <p>{session.user.email}</p>
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
    } else if (mode === 'signup') {
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