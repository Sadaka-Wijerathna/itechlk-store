import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Badge removed
import Link from 'next/link'
import {
  ShoppingCart,
  CreditCard,
  Upload,
  MessageCircle,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  User,
  Package
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: <ShoppingCart className="h-8 w-8" />,
      title: 'Browse & Select',
      description: 'Browse our collection of premium accounts and add your desired products to cart. Choose the duration (1-3 months) that suits you best.',
      details: [
        'View all available products',
        'Check features and pricing',
        'Select subscription duration',
        'Add multiple items to cart'
      ]
    },
    {
      number: '02',
      icon: <User className="h-8 w-8" />,
      title: 'Sign In & Checkout',
      description: 'Sign in with your Google account for a secure experience. Fill in your details and proceed to checkout.',
      details: [
        'Quick Google sign-in',
        'Enter your information',
        'Review your order',
        'Proceed to payment'
      ]
    },
    {
      number: '03',
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Make Payment',
      description: 'Transfer the exact amount to our bank account. We accept payments via Commercial Bank or Bank of Ceylon.',
      details: [
        'View bank details',
        'Transfer exact amount',
        'Take payment screenshot',
        'Keep receipt ready'
      ]
    },
    {
      number: '04',
      icon: <Upload className="h-8 w-8" />,
      title: 'Upload Receipt',
      description: 'Upload your payment receipt through our secure platform. We accept images up to 5MB.',
      details: [
        'Upload payment receipt',
        'Verify details are clear',
        'Submit your order',
        'Get confirmation email'
      ]
    },
    {
      number: '05',
      icon: <Clock className="h-8 w-8" />,
      title: 'Payment Verification',
      description: 'Our team will verify your payment within 5-15 minutes. You\'ll receive updates via email.',
      details: [
        'Quick verification process',
        'Email notifications',
        'Track order status',
        'Contact support if needed'
      ]
    },
    {
      number: '06',
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Receive Account',
      description: 'Once verified, you\'ll receive your premium account details via WhatsApp. Start enjoying your subscription immediately!',
      details: [
        'Account details via WhatsApp',
        'Login instructions included',
        'Instant access',
        '24/7 support available'
      ]
    },
  ]

  const faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'Typically 5-15 minutes after payment verification. During peak hours, it may take up to 30 minutes.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers to Commercial Bank and Bank of Ceylon. Online payment options coming soon!'
    },
    {
      question: 'Can I extend my subscription?',
      answer: 'Yes! Simply place a new order before your current subscription expires.'
    },
    {
      question: 'What if I have issues with my account?',
      answer: 'Contact us immediately via WhatsApp at +94 74 257 0943. We provide 24/7 support.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer refunds within 24 hours if the account doesn\'t work as described.'
    },
    {
      question: 'Can I buy multiple accounts?',
      answer: 'Absolutely! Add as many products as you need to your cart and checkout once.'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-32 border-b border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 mb-6">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Simple & Fast Process</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              How It <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Works</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Get your premium account in 6 simple steps. Fast, secure, and hassle-free!
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <Card key={index} className="group border-2 border-neutral-200 hover:border-primary-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500" />
                    
                    <CardContent className="p-6 relative">
                      {/* Step Number Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200">
                          <span className="text-xs font-bold text-primary-700">STEP</span>
                          <span className="text-sm font-bold text-primary-600">{step.number}</span>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center text-primary-600 group-hover:border-primary-300 group-hover:scale-110 transition-all duration-300">
                          {step.icon}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Details List */}
                      <div className="space-y-2.5">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                            <CheckCircle2 className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
                Why Choose Us?
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We make it easy, fast, and secure to get your premium accounts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="group border-2 border-neutral-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden hover:-translate-y-2">
                <CardContent className="p-8 text-center relative">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-orange-600 transition-colors">Fast Delivery</h3>
                  <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors">Get your account within 5-15 minutes after payment verification</p>
                </CardContent>
              </Card>

              <Card className="group border-2 border-neutral-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden hover:-translate-y-2">
                <CardContent className="p-8 text-center relative">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">Secure Process</h3>
                  <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors">Your data and payments are protected with bank-level security</p>
                </CardContent>
              </Card>

              <Card className="group border-2 border-neutral-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden hover:-translate-y-2">
                <CardContent className="p-8 text-center relative">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-green-600 transition-colors">24/7 Support</h3>
                  <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors">WhatsApp support available anytime you need assistance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-32 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Got questions? We&apos;ve got answers!
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-2 border-neutral-200 hover:border-primary-200 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.question}</h3>
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Browse our products and get your premium account today!
            </p>
            <Link href="/products">
              <Button size="xl" className="bg-white text-primary-600 hover:bg-neutral-50 shadow-2xl hover:shadow-3xl transition-all">
                <Package className="h-5 w-5 mr-2" />
                Browse Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
