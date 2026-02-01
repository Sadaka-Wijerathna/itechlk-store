'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { 
  Star, 
  Search, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { products as staticProducts } from '@/lib/products'
import toast from 'react-hot-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)

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
      // Keep using static products as fallback
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (productSlug: string) => {
    if (status === 'loading') {
      return // Wait for session to load
    }
    
    if (!session) {
      toast.error('Please sign in to view product details', {
        icon: '🔒',
        duration: 3000,
      })
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        
        <main className="flex-1">
          {/* Page Header */}
          <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24 border-b border-neutral-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]" />
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <Skeleton variant="rectangular" width={250} height={40} className="mx-auto mb-6 rounded-full" />
                <Skeleton variant="rectangular" width={400} height={60} className="mx-auto mb-6" />
                <Skeleton variant="text" width={500} className="mx-auto" />
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            {/* Search and Filter Skeleton */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
              <div className="max-w-2xl">
                <Skeleton variant="rectangular" height={56} className="rounded-xl" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={80} height={36} className="rounded-lg" />
                ))}
              </div>
              <Skeleton variant="text" width={200} />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="border-2 border-neutral-200 bg-white overflow-hidden flex flex-col h-full">
                  <CardHeader className="text-center pb-2 sm:pb-4 pt-2 sm:pt-6 px-2 sm:px-6">
                    <Skeleton variant="rectangular" className="w-full h-20 sm:h-32 lg:h-36 mb-2 sm:mb-4 rounded-xl" />
                    <Skeleton variant="text" width="80%" height={24} className="mx-auto mb-2" />
                    <Skeleton variant="text" width="60%" className="mx-auto hidden sm:block" />
                  </CardHeader>
                  <CardContent className="space-y-1.5 sm:space-y-3 pb-2 sm:pb-4 flex-1 px-2 sm:px-6">
                    <Skeleton variant="text" width={100} className="mx-auto" />
                    <div className="space-y-2 hidden sm:block">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="90%" />
                    </div>
                    <Skeleton variant="text" width={80} className="mx-auto sm:mx-0" />
                  </CardContent>
                  <div className="mt-auto">
                    <CardContent className="text-center pt-0 pb-1.5 sm:pb-3 px-2 sm:px-6">
                      <Skeleton variant="rectangular" width={100} height={32} className="mx-auto mb-1" />
                      <Skeleton variant="text" width={80} className="mx-auto" />
                    </CardContent>
                    <CardFooter className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
                      <Skeleton variant="rectangular" className="w-full h-7 sm:h-10 rounded-lg" />
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24 border-b border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 mb-6">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">12 Premium Products Available</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Premium <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                Choose from our wide range of premium subscription accounts
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Search and Filter */}
          <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            {/* Search */}
            <div className="max-w-2xl">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 sm:h-5 sm:w-5" />}
                className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="capitalize text-xs sm:text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
              <Info className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Showing {filteredProducts.length} of {products.length} products</span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {filteredProducts.map((product, index) => (
              <div key={product.id}>
                <Card className="group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border-2 hover:border-primary-200 bg-white overflow-hidden flex flex-col h-full">
                  {/* Badges */}
                  <div className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
                    {product.isPopular && (
                      <Badge variant="primary" className="shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">Popular</span>
                        <span className="sm:hidden">Pop</span>
                      </Badge>
                    )}
                    {product.stock < 10 && (
                      <Badge variant="warning" className="shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        <AlertCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">Low Stock</span>
                        <span className="sm:hidden">Low</span>
                      </Badge>
                    )}
                    {product.requiresAge && (
                      <Badge variant="error" className="shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        18+
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="text-center pb-2 sm:pb-4 pt-2 sm:pt-6 px-2 sm:px-6">
                    <div className="relative w-full h-20 sm:h-32 lg:h-36 mb-2 sm:mb-4 flex items-center justify-center bg-neutral-50 rounded-lg sm:rounded-xl p-2 sm:p-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={140}
                        height={140}
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        loading={index < 8 ? 'eager' : 'lazy'}
                        priority={index < 4}
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 120px, 140px"
                      />
                    </div>
                    <CardTitle className="text-xs sm:text-lg lg:text-xl line-clamp-2 sm:line-clamp-none">{product.name}</CardTitle>
                    <CardDescription className="text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-1.5 sm:space-y-3 pb-2 sm:pb-4 flex-1 px-2 sm:px-6">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="h-2.5 w-2.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] sm:text-sm font-medium text-neutral-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-neutral-500">({product.reviewCount || product.reviews || 0})</span>
                    </div>

                    {/* Features - Hidden on mobile */}
                    <div className="space-y-1.5 sm:space-y-2 hidden sm:block">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-success-500 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-600 line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stock indicator */}
                    <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-[10px] sm:text-sm">
                      <div className={`h-1 w-1 sm:h-2 sm:w-2 rounded-full ${
                        product.stock === 0 ? 'bg-error-500' : product.stock > 10 ? 'bg-success-500' : 'bg-warning-500'
                      }`} />
                      <span className="text-neutral-600">
                        {product.stock === 0 ? 'Out of Stock' : product.stock > 10 ? 'In Stock' : `${product.stock} left`}
                      </span>
                    </div>
                  </CardContent>

                  {/* Price and Button Section */}
                  <div className="mt-auto">
                    <CardContent className="text-center pt-0 pb-1.5 sm:pb-3 px-2 sm:px-6">
                      <div className="text-base sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-[10px] sm:text-sm text-neutral-500">per month</div>
                    </CardContent>

                    <CardFooter className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
                      <Button 
                        variant="primary" 
                        className="w-full group-hover:shadow-lg transition-shadow text-[10px] sm:text-sm h-7 sm:h-10 px-2 sm:px-4"
                        onClick={() => handleViewDetails(product.slug)}
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                        <ArrowRight className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">Try adjusting your search or filter criteria</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
