import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'

/** Public read of the catalog, used by Home / Shop / ProductDetail. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setProducts([])
    } else {
      setProducts(data as Product[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { products, loading, error, refresh }
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setError(error.message)
          setProduct(null)
        } else {
          setProduct(data as Product)
        }
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}
