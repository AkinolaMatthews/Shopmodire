export interface OrderItem {
  product: { id: string; name: string; price: number }
  color: string
  size: string
  quantity: number
}

export interface Order {
  id: string
  stripe_session_id: string | null
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled'
  customer_first_name: string | null
  customer_last_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  created_at: string
}
