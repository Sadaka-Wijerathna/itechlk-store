'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Package,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  items: Array<{
    product: {
      name: string
    }
    quantity: number
    months: number
  }>
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error loading orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (orderNumber: string) => {
    if (!confirm(`Are you sure you want to permanently delete order ${orderNumber}?\n\nThis will delete:\n- Order record\n- Order items\n- Related subscriptions\n- All associated data\n\nThis action CANNOT be undone!`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Order deleted successfully!')
        fetchOrders() // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Error deleting order')
    }
  }

  const getStatusBadge = (status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variants: Record<string, { variant: any; icon: any; text: string }> = {
      COMPLETED: { variant: 'success', icon: CheckCircle2, text: 'Completed' },
      PROCESSING: { variant: 'warning', icon: Clock, text: 'Processing' },
      PENDING: { variant: 'outline', icon: Clock, text: 'Pending' },
      CANCELLED: { variant: 'error', icon: XCircle, text: 'Cancelled' },
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg text-neutral-600 font-medium">Loading orders...</p>
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
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Order Management</h1>
                <p className="text-neutral-600 mt-1">View and manage customer orders</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-2 border-neutral-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-5 w-5" />}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'ALL' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('ALL')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'PENDING' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('PENDING')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'COMPLETED' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('COMPLETED')}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={statusFilter === 'CANCELLED' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('CANCELLED')}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600 font-medium">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-2 border-neutral-200 hover:border-primary-200 transition-all hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 mb-1">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {order.user.name || 'Guest'} • {order.user.email}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-success-50 p-3 rounded-lg border border-success-200">
                          <p className="text-xs text-success-700 mb-1 font-medium">Total Amount</p>
                          <p className="text-lg font-bold text-success-600">{formatPrice(order.totalAmount)}</p>
                        </div>
                        <div className="bg-primary-50 p-3 rounded-lg border border-primary-200">
                          <p className="text-xs text-primary-700 mb-1 font-medium">Items</p>
                          <p className="text-lg font-bold text-primary-600">{order.items.length}</p>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                          <p className="text-xs text-neutral-700 mb-1 font-medium">Order Date</p>
                          <p className="text-sm font-bold text-neutral-900">{formatDate(new Date(order.createdAt))}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                            <span className="text-sm font-medium text-neutral-900">
                              {item.product.name}
                            </span>
                            <span className="text-sm text-neutral-600">
                              x{item.quantity} • {item.months} month{item.months > 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => router.push(`/admin/orders/${order.orderNumber}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 lg:flex-none text-success-600 hover:text-success-700 hover:bg-success-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 lg:flex-none text-error-600 hover:text-error-700 hover:bg-error-50 border border-error-200"
                        onClick={() => handleDeleteOrder(order.orderNumber)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card className="border-2 border-neutral-200 shadow-xl">
              <CardContent className="p-12 text-center">
                <Package className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No orders found</h3>
                <p className="text-neutral-600">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
