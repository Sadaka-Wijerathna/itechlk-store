'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  User,
  Mail,
  Phone,
  Package,
  DollarSign,
  FileText,
  Loader2,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

interface OrderDetails {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentMethod: string
  paymentReceipt: string | null
  invoicePdf: string | null
  adminNotes: string | null
  estimatedTime: string
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    email: string
    whatsappNumber: string | null
  }
  items: Array<{
    id: string
    quantity: number
    months: number
    price: number
    product: {
      name: string
      image: string | null
      category: string
    }
  }>
}

export default function OrderDetailsPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderNumber])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.orderNumber}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
      } else {
        toast.error('Failed to fetch order details')
        router.push('/admin/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Error loading order details')
      router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variants: Record<string, { variant: any; icon: any; text: string; color: string }> = {
      COMPLETED: { variant: 'success', icon: CheckCircle2, text: 'Completed', color: 'text-success-600' },
      PROCESSING: { variant: 'warning', icon: Clock, text: 'Processing', color: 'text-warning-600' },
      PENDING: { variant: 'outline', icon: Clock, text: 'Pending', color: 'text-neutral-600' },
      CANCELLED: { variant: 'error', icon: XCircle, text: 'Cancelled', color: 'text-error-600' },
    }
    const config = variants[status] || variants.PENDING
    const Icon = config.icon
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Badge variant={config.variant as any} className="shadow-sm">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="py-8 sm:py-12">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-lg text-neutral-600 font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="hover:bg-neutral-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <p className="text-neutral-600">
                Placed on {formatDate(new Date(order.createdAt))}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-neutral-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{item.product.name}</h3>
                        <p className="text-sm text-neutral-600">
                          {item.quantity} × {item.months} month{item.months > 1 ? 's' : ''}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.product.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Receipt */}
              {order.paymentReceipt && (
                <Card className="border-2 border-neutral-200 shadow-lg">
                  <CardHeader className="border-b border-neutral-100">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Payment Receipt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative w-full h-64 bg-neutral-100 rounded-xl overflow-hidden">
                      <Image
                        src={order.paymentReceipt}
                        alt="Payment Receipt"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <a
                      href={order.paymentReceipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block"
                    >
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Order Summary & Customer Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Payment Method</span>
                    <Badge variant="outline">{order.paymentMethod}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Delivery Time</span>
                    <span className="text-sm font-medium">{order.estimatedTime}</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                  {order.invoicePdf && (
                    <a href={order.invoicePdf} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" className="w-full mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-600">Name</p>
                      <p className="font-semibold">{order.user.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="font-semibold">{order.user.email}</p>
                    </div>
                  </div>
                  {order.user.whatsappNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-600">WhatsApp</p>
                        <p className="font-semibold">{order.user.whatsappNumber}</p>
                      </div>
                    </div>
                  )}
                  {order.user.whatsappNumber && (
                    <a
                      href={`https://wa.me/${order.user.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full mt-4">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact on WhatsApp
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Admin Notes */}
              {order.adminNotes && (
                <Card className="border-2 border-warning-200 bg-warning-50 shadow-lg">
                  <CardHeader className="border-b border-warning-200">
                    <CardTitle className="flex items-center gap-2 text-warning-900">
                      <FileText className="h-5 w-5" />
                      Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-warning-900">{order.adminNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      

      </div>
  )
}
