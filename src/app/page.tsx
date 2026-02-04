import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Testimonials } from '@/components/Testimonials'
import { TrustBadges } from '@/components/TrustBadges'
import { FAQ } from '@/components/FAQ'
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from '@/components/StructuredData'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { products as allProducts } from '@/lib/products'
import { 
  Zap, 
  Shield, 
  Clock, 
  Star, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Package,
  Headphones,
  Rocket,
  Heart,
  Target
} from 'lucide-react'

export default function HomePage() {
  // Get featured products for homepage
  const products = allProducts.filter(p => p.isPopular).slice(0, 4)

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Delivery',
      description: 'Get your account details within 5-15 minutes after payment verification',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Safe',
      description: 'All transactions are secure and your data is protected',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Best Prices',
      description: 'Affordable premium accounts at the lowest prices in Sri Lanka',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'WhatsApp support available anytime you need help',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Choose Your Product',
      description: 'Browse our collection and select the premium account you need',
      icon: <Package className="h-6 w-6" />,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      number: '02',
      title: 'Sign In & Checkout',
      description: 'Login with Google and complete your order details',
      icon: <Users className="h-6 w-6" />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      number: '03',
      title: 'Make Payment',
      description: 'Transfer to our bank account and upload the receipt',
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: 'from-orange-600 to-red-600'
    },
    {
      number: '04',
      title: 'Get Your Account',
      description: 'Receive account details via WhatsApp within 15 minutes',
      icon: <Rocket className="h-6 w-6" />,
      color: 'from-green-600 to-emerald-600'
    },
  ]

  const stats = [
    {
      value: '1000+',
      label: 'Happy Customers',
      icon: <Users className="h-5 w-5" />,
      gradient: 'from-primary-600 to-secondary-600'
    },
    {
      value: '10+',
      label: 'Premium Products',
      icon: <Package className="h-5 w-5" />,
      gradient: 'from-secondary-600 to-accent-600'
    },
    {
      value: '15min',
      label: 'Avg. Delivery',
      icon: <Clock className="h-5 w-5" />,
      gradient: 'from-accent-600 to-primary-600'
    },
    {
      value: '24/7',
      label: 'Support',
      icon: <Headphones className="h-5 w-5" />,
      gradient: 'from-success-600 to-primary-600'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Apple/Stripe Style */}
        <section className="relative overflow-hidden">
          {/* Background Gradient Mesh */}
          <div className="absolute inset-0 gradient-mesh" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.05),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-4 sm:mb-8 animate-fade-in-down">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                <span className="text-xs sm:text-sm font-medium text-neutral-700">Trusted by 1000+ customers</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 animate-fade-in-up">
                <span className="block whitespace-nowrap">Premium Accounts at</span>
                <span className="block whitespace-nowrap bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  Unbeatable Prices
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-sm sm:text-lg lg:text-xl text-neutral-600 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Get access to Netflix, ChatGPT Plus, Canva Pro, and more premium services 
                at the most affordable prices in Sri Lanka. Fast delivery guaranteed!
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link href="/products">
                  <Button variant="primary" size="default" className="group w-full sm:w-auto">
                    Browse Products
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="default" className="w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                    1000+
                  </div>
                  <div className="text-[10px] sm:text-sm text-neutral-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent mb-1">
                    15min
                  </div>
                  <div className="text-[10px] sm:text-sm text-neutral-600">Avg. Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-1">
                    24/7
                  </div>
                  <div className="text-[10px] sm:text-sm text-neutral-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-16 sm:py-20 lg:py-32 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-4">
                <Target className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Everything You Need in <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">One Place</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
                We provide the best service with unmatched quality and support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group border-2 border-neutral-200 hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardHeader className="relative pb-6">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-neutral-900 transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <p className="text-sm text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Products Section */}
        <section className="py-16 sm:py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-4">
                <Package className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Featured Products</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Most <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Popular</span> Accounts
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
                Choose from our wide range of premium subscription accounts
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {products.map((product) => (
                <Card key={product.id} className="group hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl border-2 hover:border-primary-300 bg-white overflow-hidden flex flex-col relative">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500 pointer-events-none" />
                  
                  {product.isPopular && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="primary" className="shadow-xl text-xs px-3 py-1 animate-pulse">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 px-4 relative">
                    <div className="relative w-full h-24 sm:h-32 mb-4 flex items-center justify-center bg-neutral-50 rounded-2xl p-4 group-hover:bg-white transition-colors duration-300">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-contain group-hover:scale-125 transition-transform duration-500"
                      />
                    </div>
                    <CardTitle className="text-sm sm:text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">{product.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2 mt-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-4 flex-1 px-4 relative">
                    <div className="inline-flex items-center gap-1 text-sm text-neutral-600 mb-3 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-neutral-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                      <span className="text-neutral-500">({product.reviews || 0})</span>
                    </div>
                  </CardContent>
                  
                  {/* Price and Button Section */}
                  <div className="mt-auto relative">
                    <CardContent className="text-center pt-0 pb-3 px-4">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                        LKR {product.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">per month</div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-6 px-4">
                      <Link href={`/products/${product.slug}`} className="w-full">
                        <Button variant="primary" className="w-full group-hover:shadow-xl transition-all text-sm h-11 whitespace-nowrap">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button variant="outline" size="lg" className="group">
                  View All Products
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-4">
                <Rocket className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Get Started in <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">4 Easy Steps</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
                Simple, fast, and secure process to get your premium account
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200" style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />
              
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="border-2 border-neutral-200 hover:border-primary-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50 group-hover:to-secondary-50 transition-all duration-500" />
                    
                    <CardContent className="p-8 text-center relative">
                      {/* Step number badge */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white text-2xl font-bold mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                        <div className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                          {step.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">{step.title}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/how-it-works">
                <Button variant="primary" size="lg" className="group">
                  Learn More
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* Enhanced CTA Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Heart className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">Join Our Community</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied customers and get your premium account today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-2xl hover:shadow-3xl transition-all group">
                  <Package className="h-5 w-5 mr-2" />
                  Browse Products Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  <Headphones className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
