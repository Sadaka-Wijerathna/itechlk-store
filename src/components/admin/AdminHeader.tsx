"use client"

import { usePathname } from 'next/navigation'
import { Menu, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminHeader() {
  const pathname = usePathname()

  // Generate a simple title based on pathname
  const getTitle = () => {
    if (pathname === '/admin') return 'Dashboard'
    const parts = pathname.split('/').filter(Boolean)
    const view = parts[1] || '' // orders, products, etc.
    return view.charAt(0).toUpperCase() + view.slice(1)
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger - hidden on desktop */}
        <Button variant="ghost" size="sm" className="lg:hidden -ml-2 text-neutral-600">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-neutral-900 hidden sm:block">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 w-64 rounded-md border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        
        <Button variant="ghost" size="sm" className="relative text-neutral-600 rounded-full w-9 h-9 p-0">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-medium text-sm ml-2">
          AD
        </div>
      </div>
    </header>
  )
}
