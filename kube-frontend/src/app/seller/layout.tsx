'use client'

import { LayoutDashboard, Package, ShoppingBag, Wallet, Settings } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { label: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { label: 'Products', href: '/seller/products', icon: Package },
  { label: 'Orders', href: '/seller/orders', icon: ShoppingBag },
  { label: 'Payouts', href: '/seller/payouts', icon: Wallet },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title={user?.name || 'Seller'}
        subtitle="Seller Portal"
        navItems={navItems}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
