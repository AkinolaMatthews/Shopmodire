import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { products: allProducts } = useProducts()
  const { addItem } = useCart()

  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    if (product) {
      setColor(product.colors[0] ?? '')
      setSize(product.sizes[0] ?? '')
      setActiveImage(product.image_url)
    }
  }, [product])

  if (loading) return <section className="section product-detail"><div className="container">Loading…</div></section>
  if (error || !product) return <Navigate to="/shop" replace />

  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAdd = () => {
    addItem(product, color, size, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="section product-detail">
      <div className="container">
        <div className="pd-breadcrumb">
          <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="pd-grid">
          <div className="pd-image-col">
            <div className="pd-image">
              <img src={activeImage || product.image_url} alt={product.name} />
            </div>
            {[product.image_url, ...product.gallery_urls].filter(Boolean).length > 1 && (
              <div className="pd-thumbs">
                {[product.image_url, ...product.gallery_urls].filter(Boolean).map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    className={`pd-thumb${activeImage === url ? ' pd-thumb--active' : ''}`}
                    onClick={() => setActiveImage(url)}
                  >
                    <img src={url} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="pd-price">${product.price.toFixed(2)}</p>
            <p className="pd-description">{product.description}</p>

            <div className="pd-option">
              <span className="pd-option__label">Color</span>
              <div className="pd-option__values">
                {product.colors.map(c => (
                  <button
                    key={c}
                    className={`chip${color === c ? ' chip--active' : ''}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pd-option">
              <span className="pd-option__label">Size</span>
              <div className="pd-option__values">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`chip${size === s ? ' chip--active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pd-option">
              <span className="pd-option__label">Quantity</span>
              <div className="qty-stepper">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button className="btn btn-primary pd-add" onClick={handleAdd}>
              {added ? <><Check size={18} /> Added to cart</> : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>

            <div className="pd-fabric">
              <h4>Fabric &amp; Care</h4>
              <p>72% Polyester · 21% Rayon · 7% Spandex — 200 GSM stretch construction. Soft, durable and built to move through a full shift.</p>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="pd-similar">
            <h2 className="pd-similar__title">Similar Products</h2>
            <div className="product-grid">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}