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
  Calendar, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function SubscriptionsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/subscriptions')
    } else if (status === 'authenticated') {
      fetchSubscriptions()
    }
  }, [status, router])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/dashboard/subscriptions')
      if (res.ok) {
        const data = await res.json()
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600">Loading your subscriptions...</p>
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
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Subscriptions</h1>
            <p className="text-lg text-neutral-600">Manage your active subscriptions</p>
          </div>

          {/* Subscriptions List */}
          {subscriptions.length === 0 ? (
            <Card className="border-2 border-neutral-200">
              <CardContent className="p-12 text-center">
                <Package className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No active subscriptions</h3>
                <p className="text-neutral-600 mb-6">Purchase a subscription to get started</p>
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <Card key={sub.id} className={`border-2 transition-all hover:shadow-xl ${
                  sub.daysLeft <= 3 
                    ? 'border-warning-300 bg-warning-50' 
                    : 'border-neutral-200 hover:border-success-200'
                }`}>
                  <CardHeader className="border-b border-neutral-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{sub.product}</CardTitle>
                        {sub.isActive ? (
                          <Badge variant={sub.daysLeft <= 3 ? 'warning' : 'success'}>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="error">
                            Expired
                          </Badge>
                        )}
                      </div>
                      {sub.productImage && (
                        <Image 
                          src={sub.productImage} 
                          alt={sub.product}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Subscription Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Start Date</span>
                        <span className="font-medium text-neutral-900">
                          {formatDate(new Date(sub.startDate))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">End Date</span>
                        <span className="font-medium text-neutral-900">
                          {formatDate(new Date(sub.endDate))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Days Left</span>
                        <span className={`font-bold ${
                          sub.daysLeft <= 3 ? 'text-warning-600' : 'text-success-600'
                        }`}>
                          {sub.daysLeft} days
                        </span>
                      </div>
                    </div>

                    {/* Warning for expiring soon */}
                    {sub.daysLeft <= 3 && sub.isActive && (
                      <div className="bg-warning-100 border-2 border-warning-300 rounded-lg p-3 mb-4">
                        <p className="text-sm text-warning-900 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          Expiring soon! Renew now to continue service.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      {sub.isActive ? (
                        <Link href="/products">
                          <Button variant="primary" size="sm" className="w-full">
                            <Clock className="h-4 w-4 mr-2" />
                            Renew Subscription
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/products">
                          <Button variant="outline" size="sm" className="w-full">
                            <Package className="h-4 w-4 mr-2" />
                            Reactivate
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card */}
          {subscriptions.length > 0 && (
            <Card className="mt-8 border-2 border-primary-200 bg-primary-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Subscription Management</h3>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      <li>• Renew your subscriptions before they expire to avoid service interruption</li>
                      <li>• You&apos;ll receive reminders 3 days before expiration</li>
                      <li>• Contact support if you need help with your subscriptions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
