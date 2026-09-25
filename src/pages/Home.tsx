import { Link } from 'react-router-dom'
import { Sparkles, Shirt, ShieldCheck, Hand } from 'lucide-react'
import BackgroundBlobs from '../components/BackgroundBlobs'
import FloatingCartIcon from '../components/FloatingCartIcon'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import './Home.css'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter(p => p.is_new).slice(0, 4)
  const featuredList = featured.length >= 3 ? featured : products.slice(0, 4)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <BackgroundBlobs variant="hero" />
        <div className="container hero__inner">
          <div className="hero__copy reveal">
            <span className="eyebrow">African-inspired professional workwear</span>
            <h1 className="hero__headline">Wear Your Culture With Confidence</h1>
            <p className="hero__sub">
              Shop Modire designs medical scrubs, scrub caps and joggers that carry African
              heritage prints into the workplace — soft, stretch fabric built for a full shift,
              styled like it belongs on a runway.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
              <Link to="/about" className="btn btn-secondary">Our Story</Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__video-frame">
              <video
                className="hero__video"
                src="/videos/hero-loop.mp4"
                poster="/images/hero-model.jpg"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <FloatingCartIcon />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories">
        <div className="container">
          <span className="eyebrow">Shop by category</span>
          <h2 className="section-title">Three ways to wear the culture</h2>
          <div className="category-grid">
            <Link to="/shop" className="category-card">
              <Shirt size={28} strokeWidth={1.5} />
              <h3>Medical Scrubs</h3>
              <p>Print-trimmed tops and pants in stretch fabric.</p>
            </Link>
            <Link to="/shop" className="category-card category-card--accent">
              <Sparkles size={28} strokeWidth={1.5} />
              <h3>Scrub Caps</h3>
              <p>Handmade cotton tie caps in heritage prints.</p>
            </Link>
            <Link to="/shop" className="category-card">
              <Hand size={28} strokeWidth={1.5} />
              <h3>Joggers</h3>
              <p>Comfortable medical joggers, colorful cuffs.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section featured">
        <div className="container">
          <div className="featured__header">
            <div>
              <span className="eyebrow">New arrivals</span>
              <h2 className="section-title">Featured pieces</h2>
            </div>
            <Link to="/shop" className="btn btn-ghost">View all</Link>
          </div>
          <div className="product-grid">
            {loading
              ? <p>Loading…</p>
              : featuredList.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section why">
        <BackgroundBlobs />
        <div className="container">
          <span className="eyebrow">Why Shop Modire</span>
          <h2 className="section-title">Built for the shift, styled for you</h2>
          <div className="why-grid">
            <div className="why-card">
              <ShieldCheck size={24} strokeWidth={1.5} />
              <h4>Comfortable Fabric</h4>
              <p>72% polyester, 21% rayon, 7% spandex at 200 GSM — soft, durable and flexible through a full shift.</p>
            </div>
            <div className="why-card">
              <Sparkles size={24} strokeWidth={1.5} />
              <h4>African-Inspired Design</h4>
              <p>Every piece carries a print or trim rooted in African heritage — Lagos and Delta among them.</p>
            </div>
            <div className="why-card">
              <Shirt size={24} strokeWidth={1.5} />
              <h4>Built for Professionals</h4>
              <p>Designed for people who need to look sharp while staying comfortable, shift after shift.</p>
            </div>
            <div className="why-card">
              <Hand size={24} strokeWidth={1.5} />
              <h4>Handmade Details</h4>
              <p>Our scrub caps are handmade, one tie at a time, with an inner sweatband for comfort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="section brand-story">
        <div className="container brand-story__grid">
          <div className="brand-story__image">
            <img src="/images/brand-story.jpg" alt="Shop Modire brand story" />
          </div>
          <div className="brand-story__copy">
            <span className="eyebrow">Our story</span>
            <h2 className="section-title">Where Culture Meets Professionalism</h2>
            <p>
              Shop Modire started with a simple observation: medical uniforms rarely reflected
              the people wearing them. We set out to change that — pairing hospital-grade comfort
              with the prints, colors and craftsmanship of African fashion, so the people who care
              for others can bring their whole selves to work.
            </p>
            <p>
              Every scrub, cap and jogger is designed to do two jobs at once: perform through a
              twelve-hour shift, and carry an identity worth being proud of.
            </p>
            <Link to="/about" className="btn btn-secondary">Read more</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__inner">
          <h2>Ready to wear the culture?</h2>
          <p>New heritage prints drop in limited runs — shop the current collection before it's gone.</p>
          <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
        </div>
      </section>
    </>
  )
}
