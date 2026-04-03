import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  months: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateMonths: (id: string, months: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Product images mapping - Real images from CDNs
export const productImages: Record<string, string> = {
  'picsart': 'https://play-lh.googleusercontent.com/YdGJHSYcbAVBjYgFLpVLJAxPnVqPLdJjCCcxhxGZqVgOmLPem-wOqDcxF-qKqVqLaA=w240-h480-rw',
  'chatgpt-plus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
  'netflix': 'https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg',
  'capcut-pro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/CapCut_logo.svg/800px-CapCut_logo.svg.png',
  'photoshop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'canva-pro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/1200px-Canva_Logo.svg.png',
  'premium-adult': 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },

      updateMonths: (id, months) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, months } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

// Hook to prevent hydration mismatch with persisted store
export function useHydratedCartStore() {
  const [hydrated, setHydrated] = useState(false)
  const store = useCartStore()

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated ? store : { ...store, items: [] }
}
