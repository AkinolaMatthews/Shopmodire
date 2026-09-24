-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

-- 1. Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Scrubs', 'Scrub Caps', 'Joggers')),
  price numeric(10,2) not null check (price >= 0),
  description text not null default '',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  image_url text not null default '',
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

-- Anyone (including logged-out shoppers) can read the catalog
create policy "Public can read products"
  on products for select
  using (true);

-- Only logged-in users (your admin account) can write
create policy "Authenticated can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated can delete products"
  on products for delete
  to authenticated
  using (true);

-- 2. Storage bucket for product photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
