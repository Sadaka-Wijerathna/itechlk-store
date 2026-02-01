'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { config } from '@/lib/config'

interface FloatingWhatsAppProps {
  phoneNumber?: string
  message?: string
  hideOnPages?: string[]
}

export default function FloatingWhatsApp({ 
  phoneNumber,
  message = 'Hi! I need help with iTechLK Store',
  hideOnPages = []
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShow, setShouldShow] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Use config value if phoneNumber is not provided
  const actualPhoneNumber = phoneNumber || config.contact.whatsapp.replace(/[^0-9]/g, '')

  useEffect(() => {
    setMounted(true)
    
    // Check if current page is in hideOnPages list
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const shouldHide = hideOnPages.some(page => currentPath.includes(page))
      setShouldShow(!shouldHide)
    }

    // Show after 2 seconds for better UX
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [hideOnPages])

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${actualPhoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  // Don't render on server to prevent hydration mismatch
  if (!mounted || !shouldShow) return null

  return (
    <>
      {/* Floating Button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}
      >
        {/* Expanded Info Card */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 mb-2 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-success-200 p-4 w-64 relative">
              {/* Close button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900">Need Help?</h4>
                    <span className="flex items-center gap-1 text-xs text-success-600">
                      <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Chat with us on WhatsApp for instant support!
                  </p>
                  <button
                    onClick={handleClick}
                    className="w-full bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-success-600 hover:to-success-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Start Chat
                  </button>
                </div>
              </div>

              {/* Triangle pointer */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-success-200 transform rotate-45" />
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="group relative h-16 w-16 rounded-full bg-gradient-to-br from-success-500 to-success-600 text-white shadow-2xl hover:shadow-success-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce-subtle"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse rings */}
          <span className="absolute inset-0 rounded-full bg-success-500 animate-ping opacity-20" />
          <span className="absolute inset-0 rounded-full bg-success-500 animate-pulse opacity-30" />
          
          {/* Icon */}
          <MessageCircle className="h-8 w-8 relative z-10 group-hover:scale-110 transition-transform" />
          
          {/* Online badge */}
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white border-2 border-success-500 flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-success-500 animate-pulse" />
          </span>

          {/* Notification badge (optional - can be controlled via props) */}
          <span className="absolute -top-1 -left-1 h-6 w-6 rounded-full bg-error-500 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-scale-in border-2 border-white">
            1
          </span>
        </button>

        {/* Tooltip for mobile */}
        <div className="md:hidden absolute -top-12 right-0 bg-neutral-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-neutral-900 transform rotate-45" />
        </div>
      </div>
    </>
  )
}
