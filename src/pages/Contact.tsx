import { useState, FormEvent } from 'react'
import { Mail, Phone, ExternalLink } from 'lucide-react'
import './Contact.css'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Wire this up to an email service (e.g. Formspree, Resend) or your own
    // backend endpoint — this currently just confirms locally.
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section className="section contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <span className="eyebrow">Get in touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p>Questions about sizing, an order, or a wholesale inquiry — reach out any time.</p>

          <div className="contact__detail">
            <Mail size={18} />
            <a href="mailto:shopmodire@gmail.com">shopmodire@gmail.com</a>
          </div>
          <div className="contact__detail">
            <Phone size={18} />
            <a href="tel:+5128872404">+512-887-2404</a>
          </div>
          <div className="contact__detail">
            <ExternalLink size={18} />
            <a href="https://www.etsy.com" target="_blank" rel="noreferrer">ShopModire on Etsy</a>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <textarea
            required
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          />
          <button className="btn btn-primary" type="submit">
            {sent ? 'Message sent — thank you!' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
