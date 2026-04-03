'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  Shield,
  TrendingUp,
  AlertCircle,
  Package,
  Zap,
  Award,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  duration?: number
  availableMonths: number[]
  image: string | null
  category: string
  features: string[]
  stock: number
  isActive?: boolean
  isPopular: boolean
  requiresAge: boolean
  rating: number
  reviewCount: number
  deliveryTime?: string
  warranty?: string
  longDescription?: string
  whatsIncluded?: string[]
  compatibility?: string[]
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const { status } = useSession()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Allowed casual browsing, checkout will prompt for login.
  
  // Check if product is lifetime (Software category)
  const isLifetime = product?.category === 'Software'
  
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      // Try to fetch from API first
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        if (data.product) {
          // Add default values for missing fields
          const productData = {
            ...data.product,
            deliveryTime: '5-15 minutes',
            warranty: '30 days',
            longDescription: data.product.description,
            whatsIncluded: data.product.features || [],
            compatibility: ['All devices supported'],
            rating: data.product.rating || 4.5,
            reviewCount: data.product.reviewCount || 0,
          }
          setProduct(productData)
          setRelatedProducts(getRelatedProducts(productData.id, productData.category, 4, productData.slug))
          
          // Set initial selected duration to first available month
          if (productData.availableMonths && productData.availableMonths.length > 0) {
            setSelectedDuration(productData.availableMonths[0])
          }
          setLoading(false)
          return
        }
      }
      
      // Fallback to static products
      const staticProduct = getProductBySlug(params.slug)
      if (staticProduct) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sp = staticProduct as any
        const productData = {
          ...staticProduct,
          availableMonths: sp.availableMonths || [1, 2, 3],
          rating: sp.rating || 4.5,
          reviewCount: sp.reviews || 0,
        } as Product
        setProduct(productData)
        setRelatedProducts(getRelatedProducts(productData.id, productData.category, 4, productData.slug))
        setLoading(false)
      } else {
        notFound()
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      // Fallback to static products
      const staticProduct = getProductBySlug(params.slug)
      if (staticProduct) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sp = staticProduct as any
        const productData = {
          ...staticProduct,
          availableMonths: sp.availableMonths || [1, 2, 3],
          rating: sp.rating || 4.5,
          reviewCount: sp.reviews || 0,
        } as Product
        setProduct(productData)
        setRelatedProducts(getRelatedProducts(productData.id, productData.category, 4, productData.slug))
      }
      setLoading(false)
    }
  }


  const handleAddToCart = () => {
    if (!product) return
    
    // Check stock
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!', {
        icon: '❌',
        duration: 3000,
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      months: selectedDuration,
    })
    
    // Update quantity if more than 1
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          months: selectedDuration,
        })
      }
    }
    
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    
    // Check stock
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!', {
        icon: '❌',
        duration: 3000,
      })
      return
    }

    // Add to cart first
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      months: selectedDuration,
    })
    
    // Update quantity if more than 1
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          months: selectedDuration,
        })
      }
    }
    
    // Redirect to cart
    router.push('/cart')
  }

  // Calculate pricing based on duration (only for non-lifetime products)
  const getPricing = (months: number) => {
    if (!product || isLifetime) {
      return { basePrice: product?.price || 0, discount: 0, discountedPrice: product?.price || 0, savings: 0 }
    }
    const basePrice = product.price * months
    let discount = 0
    if (months === 3) discount = 5
    if (months === 6) discount = 10
    if (months === 12) discount = 15
    const discountedPrice = basePrice - (basePrice * discount / 100)
    return { basePrice, discount, discountedPrice, savings: basePrice - discountedPrice }
  }

  const currentPricing = getPricing(selectedDuration)
  const totalPrice = currentPricing.discountedPrice * quantity

  // Get available duration options based on product's availableMonths
  const getAvailableDurationOptions = () => {
    if (!product || !product.availableMonths || product.availableMonths.length === 0) {
      return []
    }
    
    return product.availableMonths.map(month => {
      let discount = 0
      if (month === 3) discount = 5
      if (month === 6) discount = 10
      if (month === 12) discount = 15
      
      return {
        months: month,
        label: month === 12 ? '1 Year' : `${month} ${month === 1 ? 'Month' : 'Months'}`,
        discount
      }
    })
  }

  const durationOptions = getAvailableDurationOptions()

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg text-neutral-600 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  // Let unauthenticated users view the product

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-600">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-neutral-900 font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Left Column - Image */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-neutral-200 p-6 sm:p-8 lg:p-12 aspect-square flex items-center justify-center group overflow-hidden">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex flex-col gap-1.5 sm:gap-2">
                    {product.isPopular && (
                      <Badge className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">Popular</span>
                        <span className="sm:hidden">Pop</span>
                      </Badge>
                    )}
                    {product.stock < 10 && (
                      <Badge variant="warning" className="shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        <AlertCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">Only {product.stock} left</span>
                        <span className="sm:hidden">{product.stock} left</span>
                      </Badge>
                    )}
                    {product.requiresAge && (
                      <Badge variant="error" className="shadow-lg text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        18+ Only
                      </Badge>
                    )}
                  </div>

                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <Package className="h-24 w-24 text-neutral-300" />
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <Card className="text-center p-2 sm:p-4 border-2">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary-600 mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs font-semibold text-neutral-900">Fast Delivery</p>
                    <p className="text-[9px] sm:text-xs text-neutral-600 hidden sm:block">{product.deliveryTime}</p>
                  </Card>
                  <Card className="text-center p-2 sm:p-4 border-2">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-success-600 mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs font-semibold text-neutral-900">Secure</p>
                    <p className="text-[9px] sm:text-xs text-neutral-600">100% Safe</p>
                  </Card>
                  <Card className="text-center p-2 sm:p-4 border-2">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-secondary-600 mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs font-semibold text-neutral-900">Warranty</p>
                    <p className="text-[9px] sm:text-xs text-neutral-600 hidden sm:block">{product.warranty}</p>
                  </Card>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Category */}
                <div>
                  <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-neutral-900 mb-2 sm:mb-3 lg:mb-4">
                    {product.name}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 pb-4 sm:pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5",
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-900">{product.rating}</span>
                  </div>
                  <div className="h-4 sm:h-6 w-px bg-neutral-300 hidden sm:block" />
                  <span className="text-xs sm:text-sm lg:text-base text-neutral-600">{product.reviewCount} reviews</span>
                  <div className="h-4 sm:h-6 w-px bg-neutral-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                      product.stock === 0 ? 'bg-error-500' : product.stock > 10 ? 'bg-success-500' : 'bg-warning-500'
                    }`} />
                    <span className="text-xs sm:text-sm lg:text-base text-neutral-600">
                      {product.stock === 0 ? 'Out of Stock' : product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                    </span>
                  </div>
                </div>

                {/* Duration Selection - Only for non-lifetime products and if there are available months */}
                {!isLifetime && durationOptions.length > 0 && (
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Select Duration</h3>
                    <div className={`grid gap-2 sm:gap-3 lg:gap-4 ${durationOptions.length === 1 ? 'grid-cols-1' : durationOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {durationOptions.map((option) => {
                      const pricing = getPricing(option.months)
                      const isSelected = selectedDuration === option.months
                      return (
                        <button
                          key={option.months}
                          onClick={() => setSelectedDuration(option.months)}
                          className={cn(
                            "relative p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left",
                            isSelected
                              ? "border-primary-600 bg-primary-50 shadow-lg"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          )}
                        >
                          {option.discount > 0 && (
                            <Badge className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-error-500 text-white text-[9px] sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1">
                              Save {option.discount}%
                            </Badge>
                          )}
                          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-neutral-900 mb-0.5 sm:mb-1">{option.label}</div>
                          <div className="text-xs sm:text-base lg:text-2xl font-bold text-primary-600 break-words">
                            {formatPrice(pricing.discountedPrice)}
                          </div>
                          {option.discount > 0 && (
                            <div className="text-[9px] sm:text-xs text-neutral-500 line-through break-words">
                              {formatPrice(pricing.basePrice)}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                )}

                {/* Lifetime Badge - Only for lifetime products */}
                {isLifetime && (
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                        <Award className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-900">Lifetime License</h3>
                        <p className="text-xs sm:text-sm text-neutral-600">One-time purchase, use forever</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Quantity</h3>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center border-2 border-neutral-300 rounded-lg sm:rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 sm:p-3 hover:bg-neutral-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <div className="px-4 py-2 sm:px-6 sm:py-3 font-semibold text-base sm:text-lg border-x-2 border-neutral-300">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="p-2 sm:p-3 hover:bg-neutral-100 transition-colors"
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-600">Max 10</span>
                  </div>
                </div>

                {/* Price Summary */}
                <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-neutral-700">{isLifetime ? 'Lifetime License:' : 'Price per unit:'}</span>
                        <span className="text-sm sm:text-base font-semibold text-neutral-900">
                          {formatPrice(currentPricing.discountedPrice)}
                        </span>
                      </div>
                      {currentPricing.savings > 0 && (
                        <div className="flex items-center justify-between text-success-600">
                          <span className="text-xs sm:text-sm">You save:</span>
                          <span className="text-sm sm:text-base font-semibold">
                            {formatPrice(currentPricing.savings * quantity)}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 sm:pt-3 border-t-2 border-primary-200 flex items-center justify-between">
                        <span className="text-base sm:text-lg font-semibold text-neutral-900">Total:</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {product.stock === 0 ? (
                  <Card className="bg-error-50 border-2 border-error-200">
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-error-500 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-error-900 mb-2">Out of Stock</h3>
                      <p className="text-sm text-error-700">This product is currently unavailable. Please check back later or contact us for more information.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full text-sm sm:text-base lg:text-lg h-11 sm:h-12 lg:h-14 border-2 border-neutral-300 hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      variant="primary"
                      size="default"
                      className="w-full text-sm sm:text-base lg:text-lg h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                      onClick={handleBuyNow}
                    >
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-pulse" />
                      Buy Now
                    </Button>
                  </div>
                )}

                {/* Delivery Info */}
                <Card className="border-2 border-neutral-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-neutral-900 mb-1 sm:mb-2">Fast Delivery</h4>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          Get your account details within <strong>{product.deliveryTime}</strong> after payment verification via WhatsApp.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Product Information Tabs */}
        <section className="py-6 sm:py-8 lg:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
                <TabsTrigger value="description" className="text-xs sm:text-sm lg:text-lg whitespace-nowrap">Description</TabsTrigger>
                <TabsTrigger value="features" className="text-xs sm:text-sm lg:text-lg whitespace-nowrap">Features</TabsTrigger>
                {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                  <TabsTrigger value="included" className="text-xs sm:text-sm lg:text-lg whitespace-nowrap">What&apos;s Included</TabsTrigger>
                )}
                {product.compatibility && product.compatibility.length > 0 && (
                  <TabsTrigger value="compatibility" className="text-xs sm:text-sm lg:text-lg whitespace-nowrap">Compatibility</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="mt-4 sm:mt-6 lg:mt-8">
                <div className="max-w-4xl">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4 lg:mb-6">About {product.name}</h2>
                  <p className="text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed mb-4 sm:mb-6">
                    {product.longDescription}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
                    <Card className="text-center p-3 sm:p-4 lg:p-6 border-2">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary-600 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-neutral-900 mb-1 sm:mb-2">Instant Access</h3>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-600">Start using immediately after delivery</p>
                    </Card>
                    <Card className="text-center p-3 sm:p-4 lg:p-6 border-2">
                      <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-success-600 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-neutral-900 mb-1 sm:mb-2">Secure Payment</h3>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-600">Bank transfer with receipt verification</p>
                    </Card>
                    <Card className="text-center p-3 sm:p-4 lg:p-6 border-2">
                      <Award className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-secondary-600 mx-auto mb-2 sm:mb-3" />
                      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-neutral-900 mb-1 sm:mb-2">Quality Guarantee</h3>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-600">{product.warranty}</p>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-4 sm:mt-6 lg:mt-8">
                <div className="max-w-4xl">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4 lg:mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-success-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm lg:text-base text-neutral-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                <TabsContent value="included" className="mt-4 sm:mt-6 lg:mt-8">
                  <div className="max-w-4xl">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4 lg:mb-6">What&apos;s Included</h2>
                    <div className="space-y-3 sm:space-y-4">
                      {product.whatsIncluded.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
                          <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base lg:text-lg text-neutral-900">{item}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {product.compatibility && product.compatibility.length > 0 && (
                <TabsContent value="compatibility" className="mt-4 sm:mt-6 lg:mt-8">
                  <div className="max-w-4xl">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4 lg:mb-6">System Requirements</h2>
                    <div className="space-y-3 sm:space-y-4">
                      {product.compatibility.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200">
                          <CheckCircle2 className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base lg:text-lg text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-8 sm:py-12 lg:py-16 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-neutral-900 mb-2 sm:mb-4">
                  Related Products
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-600">
                  You might also be interested in these products
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    image={relatedProduct.image}
                    description={relatedProduct.description}
                    category={relatedProduct.category}
                    popular={relatedProduct.isPopular}
                    rating={relatedProduct.rating}
                    reviews={relatedProduct.reviews}
                    inStock={relatedProduct.stock > 0}
                    href={`/products/${relatedProduct.slug}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
