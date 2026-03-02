'use client'

import { LayoutDashboard, ClipboardList } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { label: 'Dashboard', href: '/qc', icon: LayoutDashboard },
  { label: 'Inspections', href: '/qc/inspections', icon: ClipboardList },
]

export default function QCLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar title={user?.name || 'QC Officer'} subtitle="QC Portal" navItems={navItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
