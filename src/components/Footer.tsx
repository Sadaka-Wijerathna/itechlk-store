import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react'
import { config } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/#faq' },
  ]

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Track Order', href: '/dashboard' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
  ]

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/itechlkstore', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/itechlkstore', color: 'hover:bg-pink-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/itechlkstore', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/itechlkstore', color: 'hover:bg-blue-700' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@itechlkstore', color: 'hover:bg-red-600' },
  ]

  return (
    <footer className="bg-neutral-50 text-neutral-700 relative overflow-hidden border-t border-neutral-200">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/50 via-neutral-50 to-neutral-100/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.02),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-8 lg:gap-10">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link href="/" className="hidden">
                <Image
                  src="/logo-footer.png"
                  alt="iTechLK Logo"
                  width={200}
                  height={200}
                  className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                />
              </Link>
              
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Your trusted source for premium subscription accounts at unbeatable prices. 
                Fast delivery, secure payments, and 24/7 support.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href={config.contact.whatsappLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span>+94 74 257 0943</span>
                </a>
                
                <a 
                  href="mailto:support@itechlk.store"
                  className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <Mail className="h-4 w-4 text-primary-600" />
                  </div>
                  <span>support@itechlk.store</span>
                </a>
                
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-neutral-600" />
                  </div>
                  <span>Morawaka, Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-neutral-900 text-sm font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors inline-flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-600" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h4 className="text-neutral-900 text-sm font-bold mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors inline-flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-600" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h4 className="text-neutral-900 text-sm font-bold mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors inline-flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-600" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-sm text-neutral-600">
                © <span suppressHydrationWarning>{currentYear}</span> <span className="text-neutral-900 font-semibold">iTechLK Store</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-neutral-500">Online & Ready to Help</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-9 w-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center hover:border-transparent transition-all duration-300 ${social.color} group`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4 text-neutral-600 group-hover:text-white transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
