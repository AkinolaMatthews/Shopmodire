import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Server-side only: these two env vars are NOT prefixed with VITE_, so they
// never ship to the browser bundle. Set them in Vercel's Environment
// Variables settings, not in the frontend .env.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

interface CheckoutItem {
  product: { id: string; name: string; price: number }
  color: string
  size: string
  quantity: number
}

const SHIPPING_FLAT_RATE = 8

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { items, customer } = req.body as { items: CheckoutItem[]; customer: Record<string, string> }

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'No items in cart' })
      return
    }

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    const shipping = SHIPPING_FLAT_RATE
    const total = subtotal + shipping

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: `${i.product.name} (${i.color}, ${i.size})` },
        unit_amount: Math.round(i.product.price * 100),
      },
      quantity: i.quantity,
    }))
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping' },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    })

    const siteUrl = process.env.SITE_URL ?? `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: customer.email,
      success_url: `${siteUrl}/?order=success`,
      cancel_url: `${siteUrl}/checkout`,
    })

    // Record the order as "pending" now, using the cart snapshot from the
    // browser. The webhook flips it to "paid" once Stripe confirms payment
    // -- that's the only trustworthy signal a sale actually happened.
    const { error: insertError } = await supabaseAdmin.from('orders').insert({
      stripe_session_id: session.id,
      status: 'pending',
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      country: customer.country,
      items,
      subtotal,
      shipping,
      total,
    })

    if (insertError) {
      // Don't block checkout over a logging failure -- log it and continue.
      console.error('Failed to record pending order:', insertError.message)
    }

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Checkout failed' })
  }
}
