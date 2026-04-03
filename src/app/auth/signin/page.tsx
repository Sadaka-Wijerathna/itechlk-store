'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Zap, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">


        {/* Sign In Section */}
        <section className="py-16 sm:py-20 lg:py-32 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Right Side - Sign In Card - First on mobile */}
              <Card className="border-2 border-neutral-200 shadow-xl lg:order-2 lg:sticky lg:top-24">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-bold text-neutral-900 mb-2">Sign In</CardTitle>
                  <CardDescription className="text-base text-neutral-600">
                    Sign in with your Google account to continue
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 px-6 pb-8">
                  {/* Google Sign In Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full h-14 text-base bg-white hover:bg-neutral-50 text-neutral-900 hover:text-neutral-900 border-2 border-neutral-300 hover:border-neutral-400 shadow-sm hover:shadow-md transition-all"
                    variant="outline"
                  >
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-neutral-500 font-medium">
                        Quick Access
                      </span>
                    </div>
                  </div>

                  {/* Quick Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">Instant order tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">Download invoices anytime</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">24/7 support access</span>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-4 text-center text-sm text-neutral-600">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Left Side - Benefits - Second on mobile */}
              <div className="space-y-8 lg:order-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                    Why Sign In?
                  </h2>
                  <p className="text-lg text-neutral-600">
                    Get access to exclusive features and manage your account with ease
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-2 border-neutral-200 hover:border-primary-200 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 mb-1">Track Orders</h3>
                          <p className="text-neutral-600">Monitor your order status and delivery in real-time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-neutral-200 hover:border-success-200 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-success-100 to-success-200 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-success-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 mb-1">Manage Subscriptions</h3>
                          <p className="text-neutral-600">View and manage all your active subscriptions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-neutral-200 hover:border-secondary-200 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-secondary-100 to-secondary-200 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-secondary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 mb-1">Exclusive Offers</h3>
                          <p className="text-neutral-600">Get access to special deals and discounts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
