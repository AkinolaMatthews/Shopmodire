import { useState } from 'react'
import './FAQ.css'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'What products does Shop Modire offer?',
    answer:
      'Shop Modire offers African-inspired medical scrubs, scrub pants, handmade scrub caps, and jogger pants. Each piece combines professional comfort with colorful African-inspired details.',
  },
  {
    question: 'What are the scrubs made from?',
    answer:
      'Our scrub fabric is made from 72% polyester, 21% rayon, and 7% spandex at 200 GSM. The fabric is soft, durable, flexible, and designed to provide comfort throughout a full work shift.',
  },
  {
    question: 'How do I choose the right size?',
    answer:
      'Please check our size information before placing your order. If you are between sizes or need help choosing the right fit, contact us and we will be happy to assist you.',
  },
  {
    question: 'Are the scrub caps handmade?',
    answer:
      'Yes. Our scrub caps are handmade with care, tie by tie. They also feature an inner sweatband designed to improve comfort and help keep you comfortable throughout the day.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Shipping times depend on your location and the delivery option selected at checkout. You will receive the available shipping information when placing your order.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer:
      'Yes, eligible items may be returned or exchanged according to our return policy. Please make sure the item meets the return requirements before sending it back.',
  },
  {
    question: 'Can I place a custom or bulk order?',
    answer:
      'Yes. We welcome bulk and special orders where available. If you are ordering for a medical team, organization, event, or group, please contact us with your requirements.',
  },
  {
    question: 'How can I contact Shop Modire?',
    answer:
      'You can reach us through our Contact page. Send us your name, email address, and message, and our team will get back to you as soon as possible.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="faq-page">

      {/* HERO */}
      <section className="faq-hero">
        <div className="container faq-hero__inner">
          <span className="faq-eyebrow">Need to know?</span>

          <h1>Frequently Asked Questions</h1>

          <p>
            Everything you need to know about our products, sizing, shipping,
            returns, and ordering from Shop Modire.
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="faq-section">
        <div className="container faq-container">

          <div className="faq-intro">
            <span>SHOP MODIRE</span>

            <h2>How can we help?</h2>

            <p>
              We know you may have a few questions before placing your order.
              Here are some of the things our customers ask us most often.
            </p>
          </div>

          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  className={`faq-item ${isOpen ? 'is-open' : ''}`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>

                    <span className="faq-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`faq-answer ${
                      isOpen ? 'faq-answer--open' : ''
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              )
            })}
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

    </main>
  )
}