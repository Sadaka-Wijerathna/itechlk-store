'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Mail, Calendar, Shield, Search, ArrowLeft, Package, TrendingUp, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Customer {
  id: string
  name: string | null
  email: string
  image: string | null
  isAdmin: boolean
  createdAt: string
  _count: {
    orders: number
    subscriptions: number
  }
}

export default function CustomersPage() {
  const router = useRouter()
  const { status } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg text-neutral-600 font-medium">Loading customers...</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="hover:bg-neutral-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Customer Management</h1>
                <p className="text-neutral-600 mt-1">View and manage all registered customers</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-4 py-2 shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              {customers.length} Total
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <Card className="border-2 border-neutral-200 hover:border-purple-200 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Total Customers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{customers.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">All registered users</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-neutral-200 hover:border-emerald-200 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Active Subscriptions</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">
                      {customers.reduce((sum, c) => sum + c._count.subscriptions, 0)}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Currently active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-neutral-200 hover:border-blue-200 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1 font-medium">Total Orders</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">
                      {customers.reduce((sum, c) => sum + c._count.orders, 0)}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <span className="font-medium">All time orders</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6 border-2 border-neutral-200 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search customers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="mt-4 text-sm text-neutral-600 font-medium">
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
              </div>
            </CardContent>
          </Card>

          {/* Customers List */}
          <Card className="border-2 border-neutral-200 shadow-xl">
            <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl">All Customers ({filteredCustomers.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">No customers found</h3>
                    <p className="text-neutral-600">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 sm:p-6 border-2 border-neutral-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        {customer.image ? (
                          <Image
                            src={customer.image}
                            alt={customer.name || 'User'}
                            width={56}
                            height={56}
                            className="rounded-full ring-2 ring-neutral-200"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-neutral-900 text-lg">{customer.name || 'No Name'}</p>
                            {customer.isAdmin && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs shadow-md">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1 font-medium">Orders</p>
                          <p className="text-xl font-bold text-blue-600">{customer._count.orders}</p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-xs text-emerald-700 mb-1 font-medium">Subscriptions</p>
                          <p className="text-xl font-bold text-emerald-600">{customer._count.subscriptions}</p>
                        </div>
                        <div className="text-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <p className="text-xs text-neutral-700 mb-1 font-medium">Joined</p>
                          <p className="text-sm font-bold text-neutral-900">
                            {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
