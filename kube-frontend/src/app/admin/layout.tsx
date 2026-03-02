'use client'

import { LayoutDashboard, Users, Package, ShoppingBag, MessageSquare, BarChart2 } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Sellers', href: '/admin/sellers', icon: Users },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Disputes', href: '/admin/disputes', icon: MessageSquare },
  { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar title="Kube Admin" subtitle="Admin Panel" navItems={navItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
