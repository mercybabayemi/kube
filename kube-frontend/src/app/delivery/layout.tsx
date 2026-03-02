'use client'

import { Truck, RotateCcw } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { label: 'Assignments', href: '/delivery', icon: Truck },
  { label: 'Returns', href: '/delivery/returns', icon: RotateCcw },
]

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar title={user?.name || 'Delivery'} subtitle="Delivery Portal" navItems={navItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
