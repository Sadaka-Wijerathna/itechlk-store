'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Download,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { printInvoiceHTML } from '@/lib/invoice'
import Link from 'next/link'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/orders')
    } else if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/dashboard/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDownloadInvoice = (order: any) => {
    const invoiceData = {
      orderNumber: order.orderNumber,
      createdAt: order.date,
      customerName: session?.user?.name || 'Valued Customer',
      customerEmail: session?.user?.email || 'customer@example.com',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whatsappNumber: (session?.user as any)?.whatsappNumber || 'Not provided',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: order.items.map((item: any) => ({
        productName: item.name,
        quantity: item.quantity,
        months: item.months,
        price: item.price,
      })),
      totalAmount: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Online Payment',
    }
    printInvoiceHTML(invoiceData)
  }

  const getStatusBadge = (status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variants: Record<string, { variant: any; icon: any; text: string; color: string }> = {
      COMPLETED: { variant: 'success', icon: CheckCircle2, text: 'Completed', color: 'text-success-600' },
      PROCESSING: { variant: 'warning', icon: Clock, text: 'Processing', color: 'text-warning-600' },
      PENDING: { variant: 'outline', icon: AlertCircle, text: 'Pending', color: 'text-neutral-600' },
      CANCELLED: { variant: 'error', icon: XCircle, text: 'Cancelled', color: 'text-error-600' },
      REFUNDED: { variant: 'error', icon: XCircle, text: 'Refunded', color: 'text-error-600' },
    }
    const config = variants[status] || variants.PENDING
    const Icon = config.icon
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Badge variant={config.variant as any}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600">Loading your orders...</p>
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Orders</h1>
            <p className="text-lg text-neutral-600">View and manage all your orders</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card className="border-2 border-neutral-200">
              <CardContent className="p-12 text-center">
                <Package className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No orders yet</h3>
                <p className="text-neutral-600 mb-6">Start shopping to see your orders here</p>
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="border-2 border-neutral-200 hover:border-primary-200 transition-colors shadow-lg">
                  <CardHeader className="border-b border-neutral-100 bg-neutral-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{order.orderNumber}</CardTitle>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(new Date(order.date))}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            {order.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Online Payment'}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-neutral-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                            <div>
                              <p className="font-medium text-neutral-900">{item.name}</p>
                              <p className="text-sm text-neutral-600">
                                Quantity: {item.quantity} × {item.months} month{item.months > 1 ? 's' : ''}
                              </p>
                            </div>
                            <p className="font-semibold text-neutral-900">{formatPrice(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center pt-4 border-t-2 border-neutral-200">
                      <span className="text-lg font-semibold text-neutral-900">Total Amount</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                      {order.status === 'COMPLETED' && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
