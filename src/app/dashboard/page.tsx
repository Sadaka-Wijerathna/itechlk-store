'use client'

import { useState, useEffect } from 'react'
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
  Calendar,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
    } else if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [ordersRes, subscriptionsRes, statsRes] = await Promise.all([
        fetch('/api/dashboard/orders'),
        fetch('/api/dashboard/subscriptions'),
        fetch('/api/dashboard/stats'),
      ])
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }
      
      if (subscriptionsRes.ok) {
        const subsData = await subscriptionsRes.json()
        setSubscriptions(subsData.subscriptions || [])
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; text: string }> = {
      COMPLETED: { variant: 'success', icon: CheckCircle2, text: 'Completed' },
      PROCESSING: { variant: 'warning', icon: Clock, text: 'Processing' },
      PENDING: { variant: 'outline', icon: AlertCircle, text: 'Pending' },
      CANCELLED: { variant: 'error', icon: XCircle, text: 'Cancelled' },
    }
    const config = variants[status] || variants.PENDING
    const Icon = config.icon
    return (
      <Badge variant={config.variant as any}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  // Show loading state with skeleton
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header Skeleton */}
            <div className="mb-10">
              <Skeleton variant="rectangular" width={200} height={40} className="mb-4" />
              <Skeleton variant="rectangular" width={300} height={48} className="mb-2" />
              <Skeleton variant="text" width={250} />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2 border-neutral-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton variant="text" width={120} height={16} className="mb-2" />
                        <Skeleton variant="rectangular" width={80} height={40} />
                      </div>
                      <Skeleton variant="rectangular" width={56} height={56} className="rounded-2xl" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders Skeleton */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="rectangular" width={150} height={28} />
                    <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-2 border-neutral-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Skeleton variant="text" width={150} height={20} className="mb-1" />
                          <Skeleton variant="text" width={100} height={16} />
                        </div>
                        <Skeleton variant="rectangular" width={90} height={24} className="rounded-full" />
                      </div>
                      <div className="space-y-2 mb-3">
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                        <Skeleton variant="rectangular" width={80} height={28} />
                        <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Subscriptions Skeleton */}
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="rectangular" width={180} height={28} />
                    <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-2 border-neutral-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Skeleton variant="text" width={150} height={20} className="mb-2" />
                          <Skeleton variant="text" width={120} height={16} />
                        </div>
                        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
                      </div>
                      <Skeleton variant="rectangular" width="100%" height={40} className="rounded-lg" />
                    </div>
                  ))}
                </CardContent>
              </Card>
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
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-4">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!</span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Dashboard</h1>
            <p className="text-lg text-neutral-600">Manage your orders and subscriptions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Orders - Blue/Indigo */}
            <Card className="border-2 border-neutral-200 hover:border-blue-200 transition-colors hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
                    <p className="text-4xl font-bold text-neutral-900">{stats.totalOrders}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Subscriptions - Green/Emerald */}
            <Card className="border-2 border-neutral-200 hover:border-emerald-200 transition-colors hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Active Subscriptions</p>
                    <p className="text-4xl font-bold text-neutral-900">{stats.activeSubscriptions}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Spent - Purple/Violet */}
            <Card className="border-2 border-neutral-200 hover:border-purple-200 transition-colors hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Total Spent</p>
                    <p className="text-4xl font-bold text-neutral-900">
                      {formatPrice(stats.totalSpent)}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div>
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Recent Orders</CardTitle>
                    <Link href="/dashboard/orders">
                      <Button variant="ghost" size="sm" className="group">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-2">No orders yet</p>
                      <p className="text-sm text-neutral-500 mb-4">Start shopping to see your orders here</p>
                      <Link href="/products">
                        <Button variant="primary" size="sm">
                          Browse Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                    <div key={order.id} className="border-2 border-neutral-200 rounded-xl p-4 hover:border-primary-200 transition-colors hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                          <p className="text-sm text-neutral-500">{formatDate(order.date)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        {order.items.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-neutral-600">
                            {item.name} × {item.quantity} ({item.months} month{item.months > 1 ? 's' : ''})
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {formatPrice(order.total)}
                        </span>
                        {order.invoicePdf ? (
                          <a href={order.invoicePdf} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Invoice
                            </Button>
                          </a>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <Download className="h-4 w-4 mr-2" />
                            No Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  )))
                  }
                </CardContent>
              </Card>
            </div>

            {/* Active Subscriptions */}
            <div>
              <Card className="border-2 border-neutral-200 shadow-lg">
                <CardHeader className="border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Active Subscriptions</CardTitle>
                    <Link href="/dashboard/subscriptions">
                      <Button variant="ghost" size="sm" className="group">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-2">No active subscriptions</p>
                      <p className="text-sm text-neutral-500 mb-4">Purchase a subscription to get started</p>
                      <Link href="/products">
                        <Button variant="primary" size="sm">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    subscriptions.map((sub) => (
                    <div key={sub.id} className="border-2 border-neutral-200 rounded-xl p-4 hover:border-success-200 transition-colors hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-neutral-900">{sub.product}</p>
                          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Expires: {formatDate(sub.endDate)}
                          </p>
                        </div>
                        <Badge variant={sub.daysLeft <= 3 ? 'warning' : 'success'}>
                          {sub.daysLeft} days left
                        </Badge>
                      </div>

                      {sub.daysLeft <= 3 && (
                        <div className="bg-warning-50 border-2 border-warning-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-warning-900 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            Expiring soon! Renew now to continue service.
                          </p>
                        </div>
                      )}

                      <Link href="/products">
                        <Button variant="outline" size="sm" className="w-full">
                          Renew Subscription
                        </Button>
                      </Link>
                    </div>
                  )))
                  }
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 border-2 border-neutral-200 shadow-lg">
            <CardHeader className="border-b border-neutral-100">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="w-full group">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Browse Products
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="lg" className="w-full">
                    <Package className="h-5 w-5 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="lg" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
