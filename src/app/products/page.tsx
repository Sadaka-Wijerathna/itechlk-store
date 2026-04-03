'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { 
  Star, 
  Search, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  X
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { products as staticProducts } from '@/lib/products'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
}

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categories = ['all', 'AI', 'Design', 'Video', 'Entertainment', 'Software', 'VPN', 'Adult']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (productSlug: string) => {
    if (status === 'loading') return
    
    if (!session) {
      toast.error('Please sign in to view product details', { icon: '🔒', duration: 3000 })
      router.push('/auth/signin?callbackUrl=/products/' + productSlug)
      return
    }
    router.push(`/products/${productSlug}`)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Loading skeleton state...
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50/50">
        <Header />
        <main className="flex-1">
          <section className="relative bg-white py-12 lg:py-24 border-b border-neutral-200">
            <div className="container mx-auto px-4"><Skeleton className="h-12 w-64 mx-auto mb-4" /><Skeleton className="h-6 w-96 mx-auto" /></div>
          </section>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="hidden lg:block lg:col-span-1 space-y-4">
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />
      
      <main className="flex-1">
        {/* Page Header (Kept the same since it looks decent, maybe tweaked gradients) */}
        <section className="relative bg-white py-12 sm:py-16 lg:py-20 border-b border-neutral-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-transparent" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Premium Digital Subscriptions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
                Discover Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Elevate your digital experience instantly with our premium tier accounts and tools.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Desktop Sidebar Filter Sticky */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
              <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xl shadow-neutral-200/40">
                <h3 className="font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-neutral-500" /> Filters
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-neutral-700 mb-3 block">Search</label>
                    <Input
                      type="text"
                      placeholder="e.g. Canva or VPN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search className="h-4 w-4 text-neutral-400" />}
                      className="bg-neutral-50 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-neutral-700 mb-3 block">Categories</label>
                    <div className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selectedCategory === category
                              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="capitalize">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-white border-neutral-300"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters & Search
              </Button>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-neutral-900/40 z-50 lg:hidden"
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <motion.div
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl p-6 z-50 lg:hidden h-[80vh] flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl">Filters</h3>
                      <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-neutral-100 rounded-full">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search className="h-5 w-5" />}
                      className="h-12"
                    />
                    <div className="flex-1 overflow-y-auto">
                      <h4 className="font-semibold text-neutral-700 mb-3">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                              selectedCategory === category
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-neutral-700 border-neutral-300'
                            }`}
                          >
                            <span className="capitalize">{category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button variant="primary" className="w-full py-6 text-base" onClick={() => setMobileFiltersOpen(false)}>
                      Show {filteredProducts.length} Results
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Products Grid */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-6 hidden lg:flex">
                <p className="text-neutral-500 font-medium">
                  Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> products
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200 shadow-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
                  <p className="text-sm text-neutral-500 mb-4">We couldn&apos;t find anything matching your criteria.</p>
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                     <motion.div variants={itemVariants} key={product.id} className="h-full">
                       <Card className="group relative bg-white border border-neutral-200 rounded-3xl hover:border-primary-300 transition-all duration-500 flex flex-col h-full overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                         {/* Badges Overlay */}
                         <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                           {product.isPopular && (
                             <Badge className="bg-white/90 backdrop-blur text-primary-700 border border-primary-100 shadow-sm hover:bg-white text-xs px-2.5 py-1">
                               <TrendingUp className="h-3 w-3 mr-1 text-primary-500" /> Popular
                             </Badge>
                           )}
                           {product.stock < 10 && (
                             <Badge className="bg-warning-50 text-warning-700 border border-warning-200 hover:bg-warning-100 text-xs px-2.5 py-1 shadow-sm">
                               Low Stock
                             </Badge>
                           )}
                         </div>

                         <CardHeader className="p-0 text-center relative pt-8 pb-4">
                           {/* Gradient backdrop for image */}
                           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-50/50 to-transparent" />
                           <div className="relative w-[140px] h-[140px] mx-auto flex items-center justify-center transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 will-change-transform">
                             <Image
                               src={product.image}
                               alt={product.name}
                               fill
                               className="object-contain drop-shadow-xl"
                               priority={index < 4}
                               sizes="140px"
                             />
                           </div>
                         </CardHeader>

                         <CardContent className="px-6 py-4 flex-1 flex flex-col">
                           <div className="flex items-center justify-center gap-1 mb-3">
                             <div className="flex bg-yellow-100/50 px-2 py-0.5 rounded-full items-center">
                               <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500 mr-1" />
                               <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
                             </div>
                             <span className="text-xs text-neutral-400">({product.reviews})</span>
                           </div>

                           <CardTitle className="text-lg lg:text-xl font-bold text-neutral-900 line-clamp-1 mb-2 text-center group-hover:text-primary-600 transition-colors">
                             {product.name}
                           </CardTitle>
                           <CardDescription className="text-sm text-neutral-500 line-clamp-2 text-center mb-5">
                             {product.description}
                           </CardDescription>

                           {/* Features hidden on tight displays, block on normal */}
                           <div className="space-y-2 mt-auto pb-4">
                             {product.features.slice(0, 2).map((feat, idx) => (
                               <div key={idx} className="flex items-start text-xs text-neutral-600">
                                 <CheckCircle2 className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                                 <span className="line-clamp-1">{feat}</span>
                               </div>
                             ))}
                           </div>
                         </CardContent>

                         <div className="px-6 pb-6 pt-4 border-t border-neutral-100 bg-neutral-50/50 group-hover:bg-primary-50/30 transition-colors duration-500">
                           <div className="flex items-center justify-between mb-4">
                             <div>
                               <div className="text-2xl font-extrabold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                 {formatPrice(product.price)}
                               </div>
                               <div className="text-xs text-neutral-500 font-medium">per month</div>
                             </div>
                             <div className="flex items-center gap-1.5">
                               <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                               <span className="text-xs font-semibold text-neutral-700">{product.stock > 0 ? 'In Stock' : 'Out'}</span>
                             </div>
                           </div>

                           <Button 
                             onClick={() => handleViewDetails(product.slug)}
                             className="w-full rounded-xl bg-neutral-900 text-white hover:bg-primary-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 h-12"
                           >
                             <span className="font-semibold">View Details</span>
                             <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                           </Button>
                         </div>
                       </Card>
                     </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
