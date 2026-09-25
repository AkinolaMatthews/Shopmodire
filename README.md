# Shop Modire

African-inspired professional medical workwear — scrubs, scrub caps and joggers.
Built with React + TypeScript + Vite, React Router, a cart on Context + localStorage,
and a Supabase-backed product catalog with an admin panel for managing products.

## 1. Set up Supabase (one-time)

1. Create a free project at https://supabase.com
2. In your project, go to **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and click **Run**. This creates the `products` table,
   its security policies, and a public `product-images` storage bucket.
3. Optional: also run `supabase/seed.sql` to pre-fill the 7 starter products
   (with blank photos you can fill in from the admin panel).
   **Already ran schema.sql before?** If your Supabase project was set up
   before the photo gallery and Sales page existed, also run
   `supabase/migration-2-gallery-and-orders.sql` once — it adds the
   `gallery_urls` column and the `orders` table without touching your
   existing products.
4. Go to **Authentication → Users → Add user** and create your own admin
   login (email + password). This is the only account that will exist —
   there's no public sign-up form in the app.
5. Go to **Authentication → Settings** and turn **off** "Allow new users to
   sign up", since this app has no sign-up page and you don't want it enabled
   at the project level either.
6. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key**.

## 2. Configure the app

Copy `.env.example` to `.env` and paste in the two values from step 6:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

`.env` is already git-ignored — never commit real keys.

## 3. Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 for the storefront, and http://localhost:5173/admin
for the admin panel (there's also a small "Admin" link in the footer). Sign in
with the account you created in step 4.

## Using the admin panel

- **Add Product** — fill in name, category, price, description, colors/sizes
  (comma separated), a cover photo (shown on product cards and in the cart),
  and optional gallery photos — add as many as you like, they show as a
  thumbnail strip on the product page. Mark it "New" to show the badge.
  Photos upload straight to Supabase Storage and the product appears on the
  storefront immediately.
- **Edit** (pencil icon) — change any field, replace the cover photo, or
  add/remove gallery photos.
- **Delete** (trash icon) — asks for confirmation, then removes the product
  and it disappears from the storefront right away.
- **Sales** (top nav) — every completed checkout is recorded here
  automatically, with the customer's info, items, and total. Revenue and
  order-count totals sit at the top. Each order starts as "pending" — update
  the status dropdown to "paid", "fulfilled", or "cancelled" as you process
  it. This is manual for now, since order status isn't yet auto-confirmed
  by Stripe; once you wire up a Stripe webhook (see below) you can have it
  flip an order to "paid" automatically.

Products and orders are stored in Supabase, not in the codebase — you don't
need to edit code or redeploy to add a product or check on sales.

## Wiring up Stripe (checkout)

The Stripe **secret key** can never live in frontend code. `src/pages/Checkout.tsx`
already calls `POST /api/create-checkout-session` and redirects to the returned
Stripe Checkout URL. You need a tiny backend to create that session. Minimal
Node/Express example:

```js
// server.js
import express from 'express'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const app = express()
app.use(express.json())

app.post('/api/create-checkout-session', async (req, res) => {
  const { items } = req.body
  const line_items = items.map(i => ({
    price_data: {
      currency: 'usd',
      product_data: { name: `${i.product.name} (${i.color}, ${i.size})` },
      unit_amount: Math.round(i.product.price * 100),
    },
    quantity: i.quantity,
  }))
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${process.env.SITE_URL}/?success=true`,
    cancel_url: `${process.env.SITE_URL}/checkout`,
  })
  res.json({ url: session.url })
})

app.listen(3001)
```

Deploy this as a Vercel Serverless Function (`/api/create-checkout-session.ts`) so it
lives alongside your Vercel-hosted frontend — no separate server needed.

## Deploying

- **GitHub**: push this folder to `AkinolaMatthews/Shopmodire`
- **Vercel**: import the repo (framework preset "Vite"). In the Vercel project's
  **Settings → Environment Variables**, add `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` with the same values from your `.env` — Vercel doesn't
  read your local `.env` file, so this step is required or the live site won't
  be able to reach Supabase.

## Project structure

```
src/
  components/       Header, Footer, ProductCard, decorative background + hero cart
  components/admin/ ProductForm (shared by Add and Edit), AdminNav
  context/          CartContext (localStorage) and AuthContext (Supabase session)
  hooks/            useProducts / useProduct and useOrders — read from Supabase
  lib/              supabase.ts — the Supabase client
  pages/            Home, Shop, ProductDetail, Cart, Checkout, About, Contact
  pages/admin/      AdminLogin, AdminDashboard, AdminProductNew, AdminProductEdit, AdminOrders (Sales)
  types/            Product and Order types shared across the app
supabase/
  schema.sql                        Full schema for a fresh Supabase project — run this first
  migration-2-gallery-and-orders.sql  Run instead if you already had schema.sql set up before
  seed.sql                          Optional starter catalog
```
