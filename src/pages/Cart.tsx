import { Link } from 'react-router-dom'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useCart, lineKey } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <section className="section cart-empty">
        <div className="container cart-empty__inner">
          <ShoppingBag size={40} strokeWidth={1.25} />
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-grid">
          <div className="cart-list">
            {items.map(item => {
              const key = lineKey(item.product.id, item.color, item.size)
              return (
                <div className="cart-row" key={key}>
                  <img src={item.product.image_url} alt={item.product.name} className="cart-row__image" />
                  <div className="cart-row__info">
                    <h3>{item.product.name}</h3>
                    <p>{item.color} · {item.size}</p>
                    <span className="cart-row__price">${item.product.price.toFixed(2)}</span>
                  </div>
                  <div className="cart-row__qty">
                    <div className="qty-stepper">
                      <button onClick={() => updateQuantity(key, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(key, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-row__subtotal">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="cart-row__remove" onClick={() => removeItem(key)} aria-label="Remove item">
                    <X size={18} />
                  </button>
                </div>
              )
            })}
            <Link to="/shop" className="btn btn-ghost">Continue Shopping</Link>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary cart-summary__cta">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
