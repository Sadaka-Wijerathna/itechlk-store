'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { config } from '@/lib/config'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false) // Track if order was placed
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string>('')

  // Check for empty cart in useEffect to avoid redirect during navigation
  useEffect(() => {
    // Only redirect to cart if items are empty AND order was NOT just placed
    if (items.length === 0 && !orderPlaced) {
      const timer = setTimeout(() => {
        router.push('/cart')
      }, 500) // Small delay to allow navigation to complete
      return () => clearTimeout(timer)
    }
  }, [items.length, router, orderPlaced])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.whatsappNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!receiptFile) {
      toast.error('Please upload payment receipt')
      return
    }

    setLoading(true)

    try {
      // Upload receipt to Cloudinary first
      let receiptUrl = ''
      
      if (receiptFile) {
        try {
          const formDataToSend = new FormData()
          formDataToSend.append('file', receiptFile)
          formDataToSend.append('upload_preset', 'payment_receipts')
          
          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dub9yowqj'}/image/upload`,
            {
              method: 'POST',
              body: formDataToSend,
            }
          )
          
          if (cloudinaryRes.ok) {
            const cloudinaryData = await cloudinaryRes.json()
            receiptUrl = cloudinaryData.secure_url
            console.log('✅ Receipt uploaded:', receiptUrl)
          } else {
            const errorData = await cloudinaryRes.json()
            console.error('❌ Cloudinary upload failed:', errorData)
            toast.error('Receipt upload failed, but order will still be created')
            // Continue with order creation even if upload fails
            receiptUrl = 'Upload failed - receipt will be requested via WhatsApp'
          }
        } catch (uploadError) {
          console.error('❌ Receipt upload error:', uploadError)
          toast.error('Receipt upload failed, but order will still be created')
          receiptUrl = 'Upload failed - receipt will be requested via WhatsApp'
        }
      }

      // Create order
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          months: item.months,
          price: item.price,
        })),
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
        },
        paymentReceipt: receiptUrl,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (res.ok) {
        const data = await res.json()
        setOrderPlaced(true) // Mark order as placed to prevent cart redirect
        toast.success('Order placed successfully! Redirecting...')
        // Redirect BEFORE clearing cart to avoid the empty cart check
        router.push(`/order-confirmation/${data.orderNumber}`)
        // Clear cart after a short delay to ensure navigation happens first
        setTimeout(() => {
          clearCart()
        }, 100)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-4">
              <Lock className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Secure Checkout</span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Checkout</h1>
            <p className="text-lg text-neutral-600">Complete your order in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Information */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <CardTitle className="text-xl">Customer Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name <span className="text-error-500">*</span>
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      icon={<User className="h-5 w-5" />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address <span className="text-error-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      icon={<Mail className="h-5 w-5" />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      WhatsApp Number <span className="text-error-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="+94 XX XXX XXXX"
                      icon={<Phone className="h-5 w-5" />}
                      required
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      We&apos;ll send your account details to this number
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Bank Details */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <CardTitle className="text-xl">Bank Transfer Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Commercial Bank */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">{config.bank.commercial.name}</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-white/70 mb-1">Account Number</div>
                          <div className="text-2xl font-bold tracking-wider">{config.bank.commercial.accountNumber}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-white/70 mb-1">Branch</div>
                            <div className="font-semibold">{config.bank.commercial.branch}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/70 mb-1">Account Name</div>
                            <div className="font-semibold text-sm">{config.bank.commercial.accountName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank of Ceylon */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-600 to-secondary-700 p-6 text-white shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">{config.bank.boc.name}</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-white/70 mb-1">Account Number</div>
                          <div className="text-2xl font-bold tracking-wider">{config.bank.boc.accountNumber}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-white/70 mb-1">Branch</div>
                            <div className="font-semibold">{config.bank.boc.branch}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/70 mb-1">Account Name</div>
                            <div className="font-semibold text-sm">{config.bank.boc.accountName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-warning-50 border-2 border-warning-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-warning-900">
                        <p className="font-semibold mb-2">Important:</p>
                        <ul className="space-y-1">
                          <li>• Transfer the exact amount: <strong>{formatPrice(getTotalPrice())}</strong></li>
                          <li>• Take a screenshot or photo of the receipt</li>
                          <li>• Upload the receipt in the next step</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Upload Receipt */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <CardTitle className="text-xl">Upload Payment Receipt</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors bg-neutral-50">
                    {receiptPreview ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="max-h-64 rounded-xl shadow-lg"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-success-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Receipt uploaded successfully</span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReceiptFile(null)
                            setReceiptPreview('')
                          }}
                        >
                          Change Receipt
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-100 to-secondary-100 mb-4">
                          <ImageIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <p className="text-neutral-700 font-medium mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-neutral-500 mb-4">
                          PNG, JPG up to 5MB
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="max-w-xs mx-auto cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || !receiptFile}
                variant="primary"
                size="xl"
                className="w-full shadow-xl hover:shadow-2xl"
                isLoading={loading}
              >
                {!loading && <Lock className="h-5 w-5 mr-2" />}
                {loading ? 'Processing Order...' : 'Place Order'}
                {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
              </Button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{item.name}</div>
                          <div className="text-neutral-500">
                            {item.quantity}x × {item.months} month{item.months > 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="font-semibold text-neutral-900">
                          {formatPrice(item.price * item.quantity * item.months)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-neutral-900">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-success-900">
                        <p className="font-semibold mb-1">Fast Delivery</p>
                        <p>Account details will be sent to your WhatsApp within 5-15 minutes after payment verification</p>
                      </div>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="text-center text-sm text-neutral-600 pt-4 border-t border-neutral-200">
                    <p className="mb-2">Need help?</p>
                    <a
                      href={config.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Phone className="h-4 w-4" />
                      Contact us on WhatsApp
                    </a>
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
