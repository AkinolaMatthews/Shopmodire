import { useState, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Product } from '../types/product'
import { useWishlist } from '../context/WishlistContext'
import './ProductCard.css'

export default function ProductCard({ product }: { product: Product }) {
  const images = [product.image_url, ...product.gallery_urls].filter(Boolean)
  const [index, setIndex] = useState(0)
  const hasMultiple = images.length > 1
  const { has, toggle } = useWishlist()
  const liked = has(product.id)

  const goPrev = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i - 1 + images.length) % images.length)
  }

  const goNext = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i + 1) % images.length)
  }

  const handleLike = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={images[index]} alt={product.name} loading="lazy" />
        {product.is_new && <span className="product-card__badge">New</span>}

        <button
          type="button"
          className={`product-card__like${liked ? ' product-card__like--active' : ''}`}
          onClick={handleLike}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              className="product-card__arrow product-card__arrow--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="product-card__arrow product-card__arrow--next"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
            <div className="product-card__dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`product-card__dot${i === index ? ' product-card__dot--active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <span className="product-card__view">
            View <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  )
}