import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Order } from '../types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setOrders([])
    } else {
      setOrders(data as Order[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
    }
    return { error: error?.message ?? null }
  }

  return { orders, loading, error, refresh, updateStatus }
}
