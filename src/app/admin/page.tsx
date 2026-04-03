'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign,
  Package,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  BarChart3,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Stats {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalCustomers: number
  activeSubscriptions: number
  ordersByStatus: Array<{ status: string; _count: number }>
  monthlyRevenue: Record<string, number>
  topProducts: Array<{
    productId: string
    name: string
    sales: number
    revenue: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        toast.error('Failed to fetch statistics')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Error loading statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg text-neutral-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Activity className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-neutral-600 mb-6">Unable to fetch statistics. Please try again.</p>
            <Button onClick={fetchStats} variant="primary" className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">Platform Overview</h1>
            <p className="text-base sm:text-lg text-neutral-600">Monitor your store&apos;s sales and performance</p>
          </div>
          <Badge className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white border-0 text-sm px-4 py-2 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Administrator
          </Badge>
        </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <Card className="border-2 border-neutral-200 hover:border-emerald-200 transition-all hover:shadow-xl min-h-[140px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Total Revenue</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{stats.completedOrders} completed orders</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-neutral-200 hover:border-blue-200 transition-all hover:shadow-xl min-h-[140px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Total Orders</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stats.totalOrders}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-600">
                  <span className="font-medium">{stats.completedOrders} completed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-neutral-200 hover:border-purple-200 transition-all hover:shadow-xl min-h-[140px]">
              <CardContent className="p-6">
                <Link href="/admin/customers" className="block">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-neutral-600 mb-1 font-medium">Total Customers</p>
                      <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stats.totalCustomers}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-600">
                    <span className="font-medium">{stats.activeSubscriptions} active subscriptions</span>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-neutral-200 hover:border-amber-200 transition-all hover:shadow-xl min-h-[140px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Pending Orders</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stats.pendingOrders}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Requires attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products & Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Top Products */}
            <Card className="border-2 border-neutral-200 shadow-xl">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Top Selling Products</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900">{product.name}</h4>
                          <p className="text-sm text-neutral-600">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">{formatPrice(product.revenue)}</p>
                        <p className="text-xs text-neutral-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                  {stats.topProducts.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500 font-medium">No sales data available yet</p>
                      <p className="text-sm text-neutral-400 mt-1">Complete some orders to see top products</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            <Card className="border-2 border-neutral-200 shadow-xl">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-teal-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Orders by Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.ordersByStatus.map((status) => (
                    <div key={status.status} className="text-center p-6 bg-neutral-50 rounded-xl border-2 border-neutral-200 hover:border-teal-200 transition-colors">
                      <p className="text-3xl font-bold text-neutral-900 mb-2">{status._count}</p>
                      <p className="text-sm font-medium text-neutral-600">{status.status}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}
