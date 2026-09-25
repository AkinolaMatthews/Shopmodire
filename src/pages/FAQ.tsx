import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import BackgroundBlobs from '../components/BackgroundBlobs'
import './FAQ.css'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What sizes do you carry?',
    answer:
      'Most scrubs and joggers run from XS to XXL. Scrub caps are one size and tie-adjustable. Exact sizes available vary by product — check the size options on each product page.',
  },
  {
    question: 'What is your fabric made of?',
    answer:
      'Our scrubs and joggers use a 72% polyester, 21% rayon, 7% spandex blend at 200 GSM — soft, durable and stretchy enough to move with you through a full shift.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Orders typically ship within 2–3 business days and arrive within 5–10 business days depending on your location. You\'ll get a confirmation email once your order is on its way.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Unworn items in original condition can be returned within 14 days of delivery. Scrub caps are handmade to order and are final sale. Reach out to us to start a return.',
  },
  {
    question: 'Are the scrub caps really handmade?',
    answer:
      'Yes — every scrub cap is handmade from 100% cotton with an inner sweatband, tied by tie, in small batches. That\'s part of why they\'re final sale.',
  },
  {
    question: 'Do you offer wholesale or bulk orders?',
    answer:
      'We do. Reach out through the Contact page or email us directly with the quantities and styles you\'re interested in, and we\'ll follow up with pricing.',
  },
  {
    question: 'How do I care for my Shop Modire pieces?',
    answer:
      'Machine wash cold with like colors and tumble dry low. Avoid bleach and high heat to keep the prints vibrant and the stretch fabric intact.',
  },
  {
    question: 'How can I contact you?',
    answer:
      'Email shopmodire@gmail.com or call +512-887-2404. You can also reach us through the Contact page.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  return (
    <>
      <section className="section faq-page">
      <BackgroundBlobs />
      <div className="container faq-page__inner">
        <span className="eyebrow">Got questions?</span>
        <h1>Frequently Asked Questions</h1>
        <p className="faq-page__sub">
          Everything you need to know about sizing, fabric, shipping and returns.
          Can't find your answer? <Link to="/contact">Get in touch</Link>.
        </p>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div className={`faq-item${openIndex === i ? ' faq-item--open' : ''}`} key={item.question}>
              <button
                className="faq-item__question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} className="faq-item__chevron" />
              </button>
              {openIndex === i && (
                <p className="faq-item__answer">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      </section>

      {/* CONTACT CTA */}
      <section className="faq-cta">
        <div className="container faq-cta__inner">

          <div>
            <span className="faq-cta__label">STILL HAVE QUESTIONS?</span>

            <h2>We're happy to help.</h2>

            <p>
              Can't find what you're looking for? Send us a message and we'll
              be glad to assist you.
            </p>
          </div>

          <a
            href="/contact"
            className="faq-cta__button"
          >
            Contact Us
          </a>

        </div>
      </section>

    </>
  )
}