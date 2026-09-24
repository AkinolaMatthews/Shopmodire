export interface Product {
  id: string
  name: string
  category: 'Scrubs' | 'Scrub Caps' | 'Joggers'
  price: number
  description: string
  colors: string[]
  sizes: string[]
  image: string
  isNew?: boolean
}

// Replace these placeholder image paths with real product photography
// (e.g. /images/scrub-top-lagos.jpg) once you have shoot assets.
export const products: Product[] = [
  {
    id: 'lagos-print-scrub-top',
    name: 'Lagos Print Scrub Top',
    category: 'Scrubs',
    price: 48,
    description:
      'A relaxed-fit scrub top finished with a bold Lagos-heritage print trim at the collar and cuffs. Soft stretch fabric that moves with a full shift.',
    colors: ['Burgundy', 'Charcoal', 'Ivory'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image: '/images/products/scrub-top-lagos.jpg',
    isNew: true,
  },
  {
    id: 'delta-heritage-scrub-top',
    name: 'Delta Heritage Scrub Top',
    category: 'Scrubs',
    price: 48,
    description:
      'V-neck scrub top with Delta-heritage trim detailing and a hidden utility pocket. Built for long shifts without losing its shape.',
    colors: ['Gold', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: '/images/products/scrub-top-delta.jpg',
  },
  {
    id: 'lagos-print-scrub-pant',
    name: 'Lagos Print Scrub Pant',
    category: 'Scrubs',
    price: 44,
    description:
      'Jogger-cuffed scrub pant with an elastic drawstring waist and side print panelling that matches the Lagos Print Scrub Top.',
    colors: ['Burgundy', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image: '/images/products/scrub-pant-lagos.jpg',
  },
  {
    id: 'lagos-heritage-cap',
    name: 'Lagos Heritage Scrub Cap',
    category: 'Scrub Caps',
    price: 22,
    description:
      'Handmade 100% cotton tie-back scrub cap in our signature Lagos Heritage print. Adjustable fit, breathable all shift long.',
    colors: ['Burgundy/Gold'],
    sizes: ['One Size'],
    image: '/images/products/cap-lagos-heritage.jpg',
    isNew: true,
  },
  {
    id: 'delta-heritage-cap',
    name: 'Delta Heritage Scrub Cap',
    category: 'Scrub Caps',
    price: 22,
    description:
      'Handmade tie-back scrub cap in the Delta Heritage print, with a soft inner sweatband for comfort during long shifts.',
    colors: ['Gold/Charcoal'],
    sizes: ['One Size'],
    image: '/images/products/cap-delta-heritage.jpg',
  },
  {
    id: 'colorful-cuff-jogger',
    name: 'Colorful Cuff Medical Jogger',
    category: 'Joggers',
    price: 46,
    description:
      'Stretch medical jogger with a contrast African-print cuff and waistband. Tapered fit that stays professional on the floor.',
    colors: ['Charcoal', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image: '/images/products/jogger-colorful-cuff.jpg',
  },
  {
    id: 'heritage-waistband-jogger',
    name: 'Heritage Waistband Jogger',
    category: 'Joggers',
    price: 46,
    description:
      'Our most requested jogger — deep pockets, four-way stretch fabric, and a heritage-print waistband peeking through the drawstring.',
    colors: ['Burgundy', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/products/jogger-heritage-waistband.jpg',
    isNew: true,
  },
]

export const categories = ['All', 'Scrubs', 'Scrub Caps', 'Joggers'] as const
