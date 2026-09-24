import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { categories } from '../types/product'
import { useProducts } from '../hooks/useProducts'
import './Shop.css'

export default function Shop() {
  const [active, setActive] = useState<typeof categories[number]>('All')
  const { products, loading, error } = useProducts()

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter(p => p.category === active)),
    [active, products]
  )

  return (
    <section className="section shop">
      <div className="container">
        <span className="eyebrow">Full collection</span>
        <h1 className="shop__title">Shop the Collection</h1>

        <div className="shop__filters">
          {categories.map(c => (
            <button
              key={c}
              className={`filter-pill${active === c ? ' filter-pill--active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="shop__empty">Loading the collection…</p>}
        {error && <p className="shop__empty">Couldn't load products: {error}</p>}

        {!loading && !error && (
          <div className="product-grid product-grid--shop">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="shop__empty">Nothing here yet — check back soon.</p>
        )}
      </div>
    </section>
  )
}
