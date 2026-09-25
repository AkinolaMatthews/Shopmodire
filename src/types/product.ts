export interface Product {
  id: string
  name: string
  category: 'Scrubs' | 'Scrub Caps' | 'Joggers'
  price: number
  description: string
  colors: string[]
  sizes: string[]
  image_url: string
  gallery_urls: string[]
  is_new: boolean
  created_at?: string
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>

export const categories = ['All', 'Scrubs', 'Scrub Caps', 'Joggers'] as const
