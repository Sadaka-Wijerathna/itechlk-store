"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  Store,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">iT</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2">Menu</div>
        {adminNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors", 
                isActive ? "text-primary-600" : "text-neutral-400 group-hover:text-neutral-600"
              )} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-neutral-200 flex flex-col gap-2">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200 group"
        >
          <Store className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600" />
          Back to Store
        </Link>
        <Link 
          href="/api/auth/signout" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600" />
          Logout
        </Link>
      </div>
    </aside>
  )
}
