import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export interface MyOrder {
  id: string
  created_at: string
  items: { product: { name: string }; quantity: number }[]
  total: number
  status: string
}

export function useMyOrders() {
  const { session } = useAuth()
  const [orders, setOrders] = useState<MyOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user.email) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('orders')
      .select('id, created_at, items, total, status')
      .eq('email', session.user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as MyOrder[]) ?? [])
        setLoading(false)
      })
  }, [session?.user.email])

  return { orders, loading }
}