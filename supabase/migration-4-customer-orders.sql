-- Lets a signed-in customer see their OWN past orders (matched by email),
-- for the "My Orders" section on the account page. Admins can still see
-- every order via the policy from migration-3.

drop policy if exists "Customers can read their own orders" on orders;
create policy "Customers can read their own orders"
  on orders for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));