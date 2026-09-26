import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import './Shop.css'
import './Cart.css'

export default function Wishlist() {
  const { products, loading } = useProducts()
  const { ids } = useWishlist()
  const liked = products.filter(p => ids.includes(p.id))

  return (
    <section className="section shop">
      <div className="container">
        <span className="eyebrow">Saved for later</span>
        <h1 className="shop__title">My Wishlist</h1>

        {loading && <p className="shop__empty">Loading…</p>}

        {!loading && liked.length === 0 && (
          <div className="cart-empty__inner">
            <Heart size={40} strokeWidth={1.25} />
            <h2>Your wishlist is empty</h2>
            <p>Tap the heart on any product to save it here.</p>
            <Link to="/shop" className="btn btn-primary">Browse the Collection</Link>
          </div>
        )}

        {!loading && liked.length > 0 && (
          <div className="product-grid product-grid--shop">
            {liked.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}