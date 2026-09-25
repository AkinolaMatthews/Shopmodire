-- Run this once in your Supabase SQL Editor if your project was already
-- set up from the original schema.sql before the photo gallery and sales
-- tracking features existed. Safe to run even if parts are already in place.

-- 1. Photo gallery: extra images per product, in addition to the single
--    "cover" photo (image_url) used on cards and in the cart.
alter table products
  add column if not exists gallery_urls text[] not null default '{}';

-- 2. Orders table -- one row per checkout, used by the admin Sales page.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_first_name text not null,
  customer_last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  country text not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Shoppers checking out (using the public anon key, not logged in) can
-- create an order, but cannot read orders back -- that keeps every other
-- customer's order private. This lets Sales tracking work immediately,
-- before you've wired up a Stripe webhook (see README for upgrading this
-- to a server-confirmed "paid" status later).
drop policy if exists "Anyone can create an order" on orders;
create policy "Anyone can create an order"
  on orders for insert
  to anon, authenticated
  with check (true);

-- Only your logged-in admin account can view or update orders.
drop policy if exists "Authenticated can read orders" on orders;
create policy "Authenticated can read orders"
  on orders for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update orders" on orders;
create policy "Authenticated can update orders"
  on orders for update
  to authenticated
  using (true);
