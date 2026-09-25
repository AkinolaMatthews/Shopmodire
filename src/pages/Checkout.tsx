import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, lineKey } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import './Checkout.css'

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
}

const SHIPPING_FLAT_RATE = 8

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', country: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const shipping = items.length ? SHIPPING_FLAT_RATE : 0
  const total = subtotal + shipping

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Record the order first so it always shows up in Admin -> Sales,
      // even if the Stripe backend below isn't wired up yet.
      const { error: orderError } = await supabase.from('orders').insert({
        customer_first_name: form.firstName,
        customer_last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        items,
        subtotal,
        shipping,
        total,
        status: 'pending',
      })
      if (orderError) console.error('Failed to record order:', orderError.message)

      // Stripe requires a server: this calls YOUR backend, which creates a
      // Checkout Session with the Stripe secret key and returns its URL.
      // See the README for a minimal server example.
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer: form }),
      })
      if (!res.ok) throw new Error('checkout session request failed')
      const { url } = await res.json()
      if (url) {
        window.location.href = url
        return
      }
      throw new Error('no redirect url returned')
    } catch (err) {
      console.error(err)
      // Fallback while the Stripe backend isn't wired up yet, so the flow is
      // still demoable and the order above is still saved for the Sales page.
      alert('Order placed! (Connect a backend — see README — to take real payment via Stripe.)')
      clearCart()
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="section checkout-empty">
        <div className="container">
          <h1>Nothing to check out</h1>
          <p>Your cart is empty right now.</p>
          <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section checkout-page">
      <div className="container checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h1>Checkout</h1>

          <h4 className="checkout-subheading">Customer Information</h4>
          <div className="checkout-row">
            <input required placeholder="First name" value={form.firstName} onChange={update('firstName')} />
            <input required placeholder="Last name" value={form.lastName} onChange={update('lastName')} />
          </div>
          <div className="checkout-row">
            <input required type="email" placeholder="Email" value={form.email} onChange={update('email')} />
            <input required type="tel" placeholder="Phone" value={form.phone} onChange={update('phone')} />
          </div>

          <h4 className="checkout-subheading">Shipping Address</h4>
          <input required placeholder="Address" value={form.address} onChange={update('address')} />
          <div className="checkout-row checkout-row--three">
            <input required placeholder="City" value={form.city} onChange={update('city')} />
            <input required placeholder="State" value={form.state} onChange={update('state')} />
            <input required placeholder="Country" value={form.country} onChange={update('country')} />
          </div>

          <button className="btn btn-primary checkout-submit" type="submit" disabled={submitting}>
            {submitting ? 'Redirecting to payment…' : 'Continue to Payment'}
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary__items">
            {items.map(item => (
              <div className="checkout-summary__item" key={lineKey(item.product.id, item.color, item.size)}>
                <img src={item.product.image_url} alt={item.product.name} />
                <div>
                  <p className="checkout-summary__name">{item.product.name}</p>
                  <p className="checkout-summary__meta">{item.color} · {item.size} · Qty {item.quantity}</p>
                </div>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-summary__divider" />
          <div className="checkout-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="checkout-summary__row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="checkout-summary__divider" />
          <div className="checkout-summary__row checkout-summary__total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </aside>
      </div>
    </section>
  )
}
