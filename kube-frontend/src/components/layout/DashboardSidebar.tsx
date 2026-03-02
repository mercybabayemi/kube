'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

interface DashboardSidebarProps {
  title: string
  subtitle: string
  navItems: NavItem[]
}

export default function DashboardSidebar({ title, subtitle, navItems }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-white min-h-screen pt-6">
      <div className="px-4 mb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{subtitle}</div>
        <div className="font-bold text-gray-900 truncate">{title}</div>
      </div>
      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-link', active && 'sidebar-link-active')}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="ml-auto bg-kube-accent text-white text-xs px-1.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
