'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Sparkles, LogOut, Search, Package, Phone, HelpCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useHydratedCartStore } from '@/store/cartStore'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session, status } = useSession()
  const { getTotalItems } = useHydratedCartStore()
  
  const isLoggedIn = status === 'authenticated'
  const cartItemsCount = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled 
          ? "bg-white/90 backdrop-blur-2xl border-b border-neutral-200/50 shadow-lg shadow-neutral-900/5" 
          : "bg-white border-b border-neutral-100"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="py-2">
            <Image
              src="/logo.png"
              alt="iTechLK Logo"
              width={225}
              height={225}
              className="h-36 w-36 md:h-42 md:w-42 lg:h-48 lg:w-48 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-neutral-700 hover:text-primary-600'
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Button - Desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex hover:bg-neutral-100 transition-all duration-300"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-neutral-100 transition-all duration-300 group"
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-[10px] text-white flex items-center justify-center font-bold shadow-lg animate-scale-in ring-2 ring-white">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-neutral-100 transition-all duration-300 px-3"
                  >
                    {session?.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-sm">{session?.user?.name || 'Account'}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-error-50 hover:text-error-600 transition-all duration-300"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin" className="hidden lg:block">
                <Button 
                  variant="outline" 
                  size="default"
                  className="border-2 hover:bg-neutral-50 transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-neutral-100 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        {searchOpen && (
          <div className="hidden lg:block py-4 border-t border-neutral-100 animate-fade-in-down">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-300 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 animate-fade-in-down border-t border-neutral-100 mt-2">
            {/* Search - Mobile */}
            <div className="px-2 pb-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 mx-2',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-neutral-700 hover:text-primary-600'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-4 px-2 space-y-2 border-t border-neutral-100 mt-4">
              {!isLoggedIn ? (
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="default" className="w-full shadow-lg">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                    {session?.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900">{session?.user?.name}</p>
                      <p className="text-sm text-neutral-600">{session?.user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="default" className="w-full">
                      <User className="h-4 w-4" />
                      My Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="default" 
                    className="w-full text-error-600 hover:bg-error-50"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
