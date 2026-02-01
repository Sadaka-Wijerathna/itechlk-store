'use client'

import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Lock } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r from-primary-100 to-secondary-100 mb-6">
              <ShoppingBag className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Your cart is empty</h2>
            <p className="text-neutral-600 mb-8 text-lg">Add some premium products to get started!</p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                <Sparkles className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Shopping Cart</h1>
            <p className="text-lg text-neutral-600">
              {items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                      <div className="flex items-start gap-4 sm:gap-6 flex-1">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center p-2">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-contain"
                              priority
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">{item.name}</h3>
                          
                          {/* Price - Mobile Only */}
                          <div className="sm:hidden mb-3">
                            <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {formatPrice(item.price)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price - Desktop Only */}
                      <div className="hidden sm:block text-right flex-shrink-0">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Delete Button - Mobile Optimized */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-neutral-700">
                          Qty:
                        </label>
                        <div className="inline-flex items-center border-2 border-neutral-300 rounded-lg overflow-hidden bg-white shadow-sm hover:border-primary-400 transition-colors">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-none hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed border-r border-neutral-200"
                          >
                            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <div className="w-12 sm:w-14 h-9 sm:h-10 flex items-center justify-center">
                            <span className="text-sm sm:text-base font-semibold text-neutral-900">{item.quantity}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-none hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed border-l border-neutral-200"
                          >
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-9 sm:h-10 px-3 sm:px-4 text-error-500 hover:text-error-700 hover:bg-error-50 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base font-medium">Remove</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-neutral-200 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-900">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Items</span>
                      <span className="font-semibold text-neutral-900">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery</span>
                      <Badge variant="success" className="text-xs">
                        5-15 minutes
                      </Badge>
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-neutral-900">Total</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button variant="primary" size="lg" className="w-full mb-3 shadow-lg hover:shadow-xl">
                      <Lock className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" size="default" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Security Info */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-700">
                        <p className="font-semibold mb-2">Secure Checkout</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Fast delivery (5-15 minutes)</li>
                          <li>• 24/7 WhatsApp support</li>
                          <li>• Secure bank transfer</li>
                          <li>• Money-back guarantee</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
