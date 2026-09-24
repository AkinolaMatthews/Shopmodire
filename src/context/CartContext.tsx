import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { Product } from '../types/product'

export interface CartItem {
  product: Product
  color: string
  size: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, color: string, size: string, quantity: number) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const lineKey = (productId: string, color: string, size: string) => `${productId}__${color}__${size}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopmodire_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('shopmodire_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, color: string, size: string, quantity: number) => {
    setItems(prev => {
      const key = lineKey(product.id, color, size)
      const existing = prev.find(i => lineKey(i.product.id, i.color, i.size) === key)
      if (existing) {
        return prev.map(i =>
          lineKey(i.product.id, i.color, i.size) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, color, size, quantity }]
    })
    setCartOpen(true)
  }

  const removeItem = (key: string) => {
    setItems(prev => prev.filter(i => lineKey(i.product.id, i.color, i.size) !== key))
  }

  const updateQuantity = (key: string, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        lineKey(i.product.id, i.color, i.size) === key
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    )
  }

  const clearCart = () => setItems([])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  )
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount, isCartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

export { lineKey }
