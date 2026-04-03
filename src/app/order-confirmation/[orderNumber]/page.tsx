'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Clock,
  Package,
  Mail,
  Phone,
  Loader2,
  ArrowRight,
  Download,
  MessageCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { config } from '@/lib/config'
import { printInvoiceHTML } from '@/lib/invoice'

export default function OrderConfirmationPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (params.orderNumber) {
      // Fetch order details
      fetchOrderDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderNumber])

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderNumber}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        console.log('Order fetched:', data.order)
      } else {
        console.error('Failed to fetch order:', res.status)
        // Even if fetch fails, stop loading to show the page
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = () => {
    if (order) {
      // Use the new HTML-based invoice (CraxsHub style)
      const invoiceData = {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        customerName: order.user?.name || 'Valued Customer',
        customerEmail: order.user?.email || 'customer@example.com',
        whatsappNumber: order.user?.whatsappNumber || 'Not provided',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: order.items.map((item: any) => ({
          productName: item.product.name,
          quantity: item.quantity,
          months: item.months,
          price: item.price,
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Online Payment',
      }
      printInvoiceHTML(invoiceData)
    } else {
      // Generate a basic invoice with order number only
      printInvoiceHTML({
        orderNumber: params.orderNumber as string,
        createdAt: new Date(),
        customerName: 'Customer',
        customerEmail: 'customer@example.com',
        whatsappNumber: 'Not provided',
        items: [],
        totalAmount: 0,
        status: 'PENDING',
        paymentMethod: 'Bank Transfer',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600 font-medium">Loading your order...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          {/* Success Animation & Message */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-success-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-success-500 to-success-600 shadow-2xl shadow-success-500/50">
                <CheckCircle2 className="h-14 w-14 text-white animate-bounce" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-3 flex-wrap">
              <Sparkles className="h-10 w-10 text-primary-600 animate-pulse" />
              Order Placed Successfully!
              <Sparkles className="h-10 w-10 text-primary-600 animate-pulse" />
            </h1>
            <p className="text-xl text-neutral-600 mb-6 max-w-2xl mx-auto">
              Thank you for choosing <span className="font-bold text-primary-600">iTechLK Store</span>! We&apos;re processing your payment now.
            </p>
            
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-full shadow-xl border-2 border-primary-200 hover:border-primary-300 transition-all">
              <Package className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-semibold text-neutral-600">Order Number:</span>
              <span className="font-mono font-bold text-primary-600 text-xl">{params.orderNumber}</span>
            </div>
          </div>

          {/* Important Notice */}
          <Card className="border-0 bg-gradient-to-br from-warning-50 to-warning-100 mb-8 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-warning-500 flex items-center justify-center shadow-lg">
                    <Clock className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-warning-900 mb-3">
                    ⏰ Please Wait 5-15 Minutes
                  </h3>
                  <p className="text-base text-warning-800 mb-4 leading-relaxed">
                    Our team is currently verifying your payment. You will receive your account credentials via WhatsApp within the next 5-15 minutes.
                  </p>
                  <div className="flex items-center gap-2 px-4 py-3 bg-warning-200/50 rounded-xl border border-warning-300">
                    <MessageCircle className="h-5 w-5 text-warning-700" />
                    <p className="text-sm font-medium text-warning-900">
                      Make sure your WhatsApp is active to receive the credentials instantly!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Contact Seller */}
            <a 
              href={`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="border-2 border-success-200 hover:border-success-400 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 bg-white h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-lg mb-1">Contact Seller</h3>
                  <p className="text-sm text-neutral-600">Get instant support via WhatsApp</p>
                </CardContent>
              </Card>
            </a>
            
            {/* View Orders */}
            <Link href="/dashboard/orders" className="group block">
              <Card className="border-2 border-success-200 hover:border-success-400 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 bg-white h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Package className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-lg mb-1">View Orders</h3>
                  <p className="text-sm text-neutral-600">Track your order status</p>
                </CardContent>
              </Card>
            </Link>
            
            {/* Download Invoice */}
            <button
              onClick={handleDownloadInvoice}
              className="group w-full block"
            >
              <Card className="border-2 border-neutral-200 hover:border-neutral-400 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 bg-white h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Download className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-lg mb-1">Download Invoice</h3>
                  <p className="text-sm text-neutral-600">Print or save for records</p>
                </CardContent>
              </Card>
            </button>
          </div>

          {/* What's Next - Timeline */}
          <Card className="border-0 bg-white shadow-xl mb-10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                What Happens Next?
              </h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-white text-xl">1</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-bold text-neutral-900 text-lg mb-2">Payment Verification</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Our team will carefully verify your payment receipt within 5-15 minutes to ensure everything is correct and secure.
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="ml-7 h-8 w-0.5 bg-gradient-to-b from-primary-300 to-primary-200"></div>

                {/* Step 2 */}
                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-white text-xl">2</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-bold text-neutral-900 text-lg mb-2">Account Details Delivery</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      You&apos;ll receive your account credentials directly via WhatsApp message. Keep your phone nearby and WhatsApp active!
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="ml-7 h-8 w-0.5 bg-gradient-to-b from-success-300 to-success-200"></div>

                {/* Step 3 */}
                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-white text-xl">3</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-bold text-neutral-900 text-lg mb-2">Start Using Your Subscription</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Log in with the provided credentials and enjoy your premium subscription immediately! No waiting, no hassle.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Section - Enhanced */}
          <Card className="border-0 bg-white shadow-xl mb-10">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Need Help?</h3>
              </div>
              
              <p className="text-neutral-700 mb-8 leading-relaxed">
                Our support team is ready to assist you with any questions or concerns!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href={`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-success-200 hover:border-success-400 transition-all hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center group-hover:bg-success-200 transition-colors">
                      <Phone className="h-6 w-6 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 mb-1">WhatsApp Support</p>
                      <p className="text-sm text-neutral-600 font-medium">{config.contact.whatsapp}</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="mailto:support@itechlk.store"
                  className="group"
                >
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-success-200 hover:border-success-400 transition-all hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 mb-1">Email Support</p>
                      <p className="text-sm text-neutral-600 font-medium">support@itechlk.store</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping CTA */}
          <div className="text-center">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 text-white px-10 py-7 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 rounded-2xl"
              >
                <ShoppingBag className="h-6 w-6 mr-3" />
                Continue Shopping
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
