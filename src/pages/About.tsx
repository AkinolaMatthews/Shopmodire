import { Link } from 'react-router-dom'
import BackgroundBlobs from '../components/BackgroundBlobs'
import './About.css'

export default function About() {
  return (
    <>
      <section className="section about-hero">
        <BackgroundBlobs />
        <div className="container about-hero__inner">
          <span className="eyebrow">Our story</span>
          <h1>Where Culture Meets Professionalism</h1>
          <p>
            Shop Modire started with a simple observation: medical uniforms rarely reflected
            the people wearing them. We design scrubs, caps and joggers that carry African
            heritage prints into hospitals and clinics — proof that professional workwear
            doesn't have to erase identity.
          </p>
        </div>
      </section>

      <section className="section about-values">
        <div className="container about-values__grid">
          <div>
            <h3>Comfortable Fabric</h3>
            <p>72% polyester, 21% rayon, 7% spandex at 200 GSM — soft, durable and flexible enough for a full shift on your feet.</p>
          </div>
          <div>
            <h3>African-Inspired Design</h3>
            <p>Every print and trim is rooted in African heritage, from Lagos to the Niger Delta, reimagined for the workplace.</p>
          </div>
          <div>
            <h3>Handmade Details</h3>
            <p>Our scrub caps are handmade, tie by tie, with an inner sweatband so comfort never comes second.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <h2>Ready to wear the culture?</h2>
          <p>Explore the full collection of scrubs, caps and joggers.</p>
          <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
        </div>
      </section>
    </>
  )
}
