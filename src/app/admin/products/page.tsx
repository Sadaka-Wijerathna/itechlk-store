'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Save,
  X,
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  duration: number
  availableMonths: number[]
  monthlyPricing?: Record<number, { price: number; discount: number }>
  image: string | null
  category: string
  features: string[]
  stock: number
  isActive: boolean
  isPopular: boolean
  requiresAge: boolean
  _count?: {
    orderItems: number
    subscriptions: number
  }
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if (!editingProduct) return

    // Validate that at least one month is selected
    if (!editingProduct.availableMonths || editingProduct.availableMonths.length === 0) {
      toast.error('Please select at least one subscription duration')
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product updated successfully!')
        setShowEditModal(false)
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error updating product')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product deleted successfully!')
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  const toggleProductVisibility = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${name} is now ${!currentStatus ? 'visible' : 'hidden'} on the products page`)
        fetchProducts()
      } else {
        toast.error(data.error || 'Failed to update product visibility')
      }
    } catch (error) {
      console.error('Error toggling product visibility:', error)
      toast.error('Error updating product visibility')
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg text-neutral-600 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="hover:bg-neutral-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Product Management</h1>
                <p className="text-neutral-600 mt-1">Manage your product catalog</p>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <Card className="mb-6 border-2 border-neutral-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-5 w-5" />}
                  className="w-full sm:w-96"
                />
                <div className="text-sm text-neutral-600 font-medium">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border-2 border-neutral-200 hover:border-primary-200 transition-all hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-white rounded-xl border-2 border-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0 p-4 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={128}
                          height={128}
                          className="object-contain p-2"
                          sizes="128px"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="h-12 w-12 text-neutral-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-neutral-600">{product.description}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {product.isActive ? (
                            <Badge variant="success" className="shadow-sm">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="error" className="shadow-sm">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {product.isPopular && (
                            <Badge className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-primary-50 p-3 rounded-lg border border-primary-200">
                          <p className="text-xs text-primary-700 mb-1 font-medium">Price</p>
                          <p className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${product.stock === 0 ? 'bg-error-50 border-error-200' : 'bg-success-50 border-success-200'}`}>
                          <p className={`text-xs mb-1 font-medium ${product.stock === 0 ? 'text-error-700' : 'text-success-700'}`}>Stock</p>
                          <p className={`text-lg font-bold ${product.stock === 0 ? 'text-error-600' : 'text-success-600'}`}>
                            {product.stock}
                            {product.stock === 0 && (
                              <AlertCircle className="inline h-4 w-4 ml-1" />
                            )}
                          </p>
                        </div>
                        <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                          <p className="text-xs text-secondary-700 mb-1 font-medium">Category</p>
                          <Badge variant="outline" className="mt-1">{product.category}</Badge>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <p className="text-xs text-neutral-700 mb-1 font-medium">Available Months</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.availableMonths && product.availableMonths.length > 0 ? (
                              product.availableMonths.map((month) => (
                                <Badge key={month} variant="outline" className="text-xs px-2 py-0.5">
                                  {month}M
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-neutral-500">{product.duration}M (legacy)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {product._count && (
                        <div className="flex gap-6 text-sm text-neutral-600 mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-primary-600" />
                            <span className="font-medium">{product._count.orderItems} orders</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-secondary-600" />
                            <span className="font-medium">{product._count.subscriptions} subscriptions</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Visibility Toggle - Simple Button Only */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleProductVisibility(product.id, product.isActive, product.name)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              product.isActive
                                ? 'bg-success-500 hover:bg-success-600 focus:ring-success-500 shadow-md'
                                : 'bg-neutral-300 hover:bg-neutral-400 focus:ring-neutral-400'
                            }`}
                            title={product.isActive ? 'Click to hide from customers' : 'Click to show to customers'}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                product.isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-1">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="shadow-md hover:shadow-lg flex-1 sm:flex-none"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error-600 hover:text-error-700 hover:bg-error-50 border border-error-200 flex-1 sm:flex-none"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="border-2 border-neutral-200 shadow-xl">
              <CardContent className="p-12 text-center">
                <Package className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600">Try adjusting your search query or check back later</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-neutral-200 animate-scale-in">
            <CardHeader className="border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Edit Product: {editingProduct.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditModal(false)}
                  className="hover:bg-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Price (LKR)
                </label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                  }
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-neutral-500 mt-1">Current: {formatPrice(editingProduct.price)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })
                  }
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {editingProduct.stock === 0 ? 'Product will be unavailable' : `${editingProduct.stock} units available`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Monthly Pricing & Discounts
                </label>
                <p className="text-xs text-neutral-600 mb-4">Set custom prices and discount percentages for each subscription duration:</p>
                <div className="space-y-4">
                  {[1, 3, 6, 12].map((month) => {
                    const isAvailable = editingProduct.availableMonths?.includes(month)
                    const pricing = editingProduct.monthlyPricing as any || {}
                    const monthData = pricing[month] || { price: editingProduct.price * month, discount: 0 }
                    
                    return (
                      <div
                        key={month}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isAvailable
                            ? 'bg-white border-primary-300'
                            : 'bg-neutral-50 border-neutral-200 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-neutral-900">
                            {month === 12 ? '1 Year' : `${month} ${month === 1 ? 'Month' : 'Months'}`}
                          </span>
                          {!isAvailable && (
                            <Badge variant="outline" className="text-xs">Not Available</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Price (LKR)
                            </label>
                            <Input
                              type="number"
                              value={monthData.price}
                              onChange={(e) => {
                                const newPricing = { ...pricing }
                                newPricing[month] = { ...monthData, price: parseFloat(e.target.value) || 0 }
                                setEditingProduct({ ...editingProduct, monthlyPricing: newPricing })
                              }}
                              disabled={!isAvailable}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Discount (%)
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={monthData.discount}
                              onChange={(e) => {
                                const newPricing = { ...pricing }
                                newPricing[month] = { ...monthData, discount: parseFloat(e.target.value) || 0 }
                                setEditingProduct({ ...editingProduct, monthlyPricing: newPricing })
                              }}
                              disabled={!isAvailable}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        {isAvailable && monthData.discount > 0 && (
                          <div className="mt-2 text-xs text-success-600 font-medium">
                            Final: {formatPrice(monthData.price - (monthData.price * monthData.discount / 100))} 
                            (Save {formatPrice(monthData.price * monthData.discount / 100)})
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Available Subscription Months
                </label>
                <p className="text-xs text-neutral-600 mb-3">Select which subscription durations customers can choose:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 3, 6, 12].map((month) => (
                    <label
                      key={month}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        editingProduct.availableMonths?.includes(month)
                          ? 'bg-primary-50 border-primary-500 shadow-md'
                          : 'bg-white border-neutral-300 hover:border-primary-300 hover:bg-primary-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editingProduct.availableMonths?.includes(month) || false}
                        onChange={(e) => {
                          const currentMonths = editingProduct.availableMonths || []
                          if (e.target.checked) {
                            setEditingProduct({
                              ...editingProduct,
                              availableMonths: [...currentMonths, month].sort((a, b) => a - b)
                            })
                          } else {
                            setEditingProduct({
                              ...editingProduct,
                              availableMonths: currentMonths.filter(m => m !== month)
                            })
                          }
                        }}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-neutral-900">
                        {month === 12 ? '1 Year' : `${month} ${month === 1 ? 'Month' : 'Months'}`}
                      </span>
                    </label>
                  ))}
                </div>
                {(!editingProduct.availableMonths || editingProduct.availableMonths.length === 0) && (
                  <p className="text-xs text-error-600 mt-2 font-medium">⚠️ Please select at least one subscription duration</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm"
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-neutral-900">Active (visible to customers)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPopular}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isPopular: e.target.checked })
                    }
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-neutral-900">Mark as Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <Button 
                  variant="primary" 
                  onClick={handleSave} 
                  className="flex-1 h-12 text-base font-bold shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-12 text-base font-semibold border-2"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
