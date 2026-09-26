import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface WishlistContextValue {
  ids: string[]
  has: (productId: string) => boolean
  toggle: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopmodire_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('shopmodire_wishlist', JSON.stringify(ids))
  }, [ids])

  const has = (productId: string) => ids.includes(productId)

  const toggle = (productId: string) => {
    setIds(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]))
  }

  return (
    <WishlistContext.Provider value={{ ids, has, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}