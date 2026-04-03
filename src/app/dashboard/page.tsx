'use client'

import React, { useState, useEffect } from 'react'
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
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  type StatusVariant = 'success' | 'warning' | 'outline' | 'error'
  interface StatusConfig { variant: StatusVariant; icon: React.ElementType; text: string }
  const getStatusBadge = (status: string) => {
    const variants: Record<string, StatusConfig> = {
      COMPLETED: { variant: 'success', icon: CheckCircle2, text: 'Completed' },
      PROCESSING: { variant: 'warning', icon: Clock, text: 'Processing' },
      PENDING: { variant: 'outline', icon: AlertCircle, text: 'Pending' },
      CANCELLED: { variant: 'error', icon: XCircle, text: 'Cancelled' },
    }
    const config = variants[status] || variants.PENDING
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="shadow-sm">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  // Mini timeline helper for orders
  const renderOrderTimeline = (status: string) => {
    let progress = 0;
    if (status === 'PENDING') progress = 10;
    if (status === 'PROCESSING') progress = 50;
    if (status === 'COMPLETED') progress = 100;
    if (status === 'CANCELLED') return null; // no timeline for cancelled

    return (
      <div className="mt-4 mb-2">
        <div className="flex justify-between text-[10px] text-neutral-500 mb-1.5 px-1 font-medium">
          <span>Pending</span>
          <span className={progress >= 50 ? 'text-primary-600' : ''}>Processing</span>
          <span className={progress === 100 ? 'text-success-600' : ''}>Completed</span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              progress === 100 ? 'bg-success-500' : 'bg-primary-500'
            }`}
          />
        </div>
      </div>
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
                <Card key={i} className="border-2 border-neutral-200 min-h-[120px]">
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
      
      <main className="flex-1 py-12 lg:py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-100 shadow-[0_2px_10px_rgb(0,0,0,0.04)] mb-5">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight">Your Portfolio</h1>
            <p className="text-lg text-neutral-500">Overview of your activity and active subscriptions.</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {/* Total Orders */}
            <motion.div variants={itemVariants}>
              <Card className="border border-neutral-100 bg-white hover:border-blue-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[120px] rounded-3xl overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-400 mb-1">Total Orders</p>
                      <p className="text-4xl font-extrabold text-neutral-900">{stats.totalOrders}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 group-hover:bg-blue-500 flex items-center justify-center transition-colors duration-500">
                      <Package className="h-7 w-7 text-blue-500 group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div variants={itemVariants}>
              <Card className="border border-neutral-100 bg-white hover:border-emerald-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[120px] rounded-3xl overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-400 mb-1">Active Plans</p>
                      <p className="text-4xl font-extrabold text-neutral-900">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-500 flex items-center justify-center transition-colors duration-500">
                      <TrendingUp className="h-7 w-7 text-emerald-500 group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Spent */}
            <motion.div variants={itemVariants}>
              <Card className="border border-neutral-100 bg-white hover:border-purple-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[120px] rounded-3xl overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-400 mb-1">Total Value</p>
                      <p className="text-4xl font-extrabold text-neutral-900">
                        {formatPrice(stats.totalSpent)}
                      </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-purple-50 group-hover:bg-purple-500 flex items-center justify-center transition-colors duration-500">
                      <DollarSign className="h-7 w-7 text-purple-500 group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Recent Orders */}
            <div>
              <Card className="border border-neutral-200 shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    <Link href="/dashboard/orders">
                      <Button variant="ghost" size="sm" className="group text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
                      <p className="text-neutral-500 mb-4 font-medium">No orders yet</p>
                      <Link href="/products">
                        <Button variant="primary" className="rounded-xl shadow-md cursor-pointer">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                    <div key={order.id} className="border border-neutral-100 rounded-2xl p-5 hover:border-neutral-300 transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">{order.orderNumber}</p>
                          <p className="text-xs font-medium text-neutral-400">{formatDate(order.date)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="space-y-1 mb-2 mt-3 p-3 bg-neutral-50 rounded-xl">
                        {order.items.map((item: { name: string; quantity: number; months: number }, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-neutral-700">{item.name}</span>
                            <span className="text-xs text-neutral-500 font-mono bg-white px-2 py-0.5 rounded border border-neutral-200">×{item.quantity} ({item.months}m)</span>
                          </div>
                        ))}
                      </div>

                      {renderOrderTimeline(order.status)}

                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                        <span className="text-lg font-extrabold text-neutral-900">
                          {formatPrice(order.total)}
                        </span>
                        {order.invoicePdf ? (
                          <a href={order.invoicePdf} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs font-semibold hover:bg-neutral-100">
                              <Download className="h-3 w-3 mr-1.5" /> Receipt
                            </Button>
                          </a>
                        ) : (
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Processing receipt</span>
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
              <Card className="border border-neutral-200 shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Active Subscriptions</CardTitle>
                    <Link href="/dashboard/subscriptions">
                      <Button variant="ghost" size="sm" className="group text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
                    <div key={sub.id} className="border border-neutral-100 rounded-2xl p-5 hover:border-emerald-200 transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">{sub.product}</p>
                          <p className="text-xs font-medium text-neutral-500 flex items-center gap-1.5 mt-1">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                            Expires: {formatDate(sub.endDate)}
                          </p>
                        </div>
                        <Badge variant={sub.daysLeft <= 3 ? 'warning' : 'success'} className="shadow-sm">
                          {sub.daysLeft} days left
                        </Badge>
                      </div>

                      {sub.daysLeft <= 3 && (
                        <div className="bg-warning-50 border border-warning-100 rounded-xl p-3 mb-4">
                          <p className="text-xs font-medium text-warning-900 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-warning-500 flex-shrink-0" />
                            Expiring very soon! Renewing is advised.
                          </p>
                        </div>
                      )}

                      <Link href="/products">
                        <Button variant="outline" size="sm" className="w-full rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                          Renew Subscription
                        </Button>
                      </Link>
                    </div>
                  )))
                  }
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <Card className="border border-neutral-100 shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="border-b border-neutral-50 bg-neutral-50/30">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/products">
                    <Button variant="primary" size="lg" className="w-full group rounded-xl shadow-md h-14 bg-neutral-900 hover:bg-primary-600 transition-colors">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Browse Products
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/orders">
                    <Button variant="outline" size="lg" className="w-full rounded-xl h-14 border-neutral-200 hover:bg-neutral-50 font-bold text-neutral-600">
                      <Package className="h-5 w-5 mr-2 text-neutral-400" />
                      View All Orders
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="lg" className="w-full rounded-xl h-14 border-neutral-200 hover:bg-neutral-50 font-bold text-neutral-600">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
