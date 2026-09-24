import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Product } from '../types/product'
import './ProductCard.css'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {product.is_new && <span className="product-card__badge">New</span>}
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
