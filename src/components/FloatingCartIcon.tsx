import { ShoppingBag } from 'lucide-react'

/** Small floating decorative cart used in the hero — subtle motion only. */
export default function FloatingCartIcon() {
  return (
    <div className="floating-cart" aria-hidden="true">
      <div className="floating-cart__badge">
        <ShoppingBag size={26} color="var(--white)" strokeWidth={1.75} />
      </div>
      <span className="sparkle sparkle--1">✦</span>
      <span className="sparkle sparkle--2">✦</span>
      <span className="sparkle sparkle--3">✦</span>
    </div>
  )
}
