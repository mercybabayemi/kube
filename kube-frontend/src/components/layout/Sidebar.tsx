'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Package, 
  MapPin, 
  Settings, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', href: '/account/orders', icon: Package },
    { label: 'Address Book', href: '/account/address', icon: MapPin },
    { label: 'Settings', href: '/account/profile', icon: Settings },
  ]

  const confirmLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <div 
        className={cn(
          "bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)] flex flex-col h-full z-20 transition-all duration-300 border-r border-gray-100 relative",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm hover:text-kube-primary transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo/Top Section */}
        <div className={cn("py-8 flex items-center justify-center", !isCollapsed && "justify-start px-6 gap-3")}>
          <div className="w-10 h-10 bg-kube-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-kube-primary/20 flex-shrink-0">
            <span className="font-black text-xl italic">K</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="font-bold text-gray-900 truncate">Kube Verified</h2>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {!isCollapsed && <div className="px-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dashboard</div>}
          
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "group relative flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300",
                    !isCollapsed && "flex-row items-center justify-start px-4 gap-3",
                    isActive 
                      ? "bg-kube-primary/5 text-kube-primary" 
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isActive ? "bg-kube-primary text-white" : "group-hover:bg-gray-100"
                  )}>
                    <Icon size={isCollapsed ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-tighter text-center px-1 leading-tight",
                    !isCollapsed && "text-sm normal-case tracking-normal font-semibold text-left p-0",
                    isActive ? "text-kube-primary" : "text-gray-400"
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Profile/Bottom Section */}
        <div className={cn("mt-auto p-4 border-t border-gray-50 flex flex-col items-center gap-4", !isCollapsed && "p-6 items-stretch")}>
          <div className={cn("flex items-center gap-3 w-full", isCollapsed && "justify-center")}>
            <div className={cn(
              "w-10 h-10 rounded-full bg-kube-primary-soft border-2 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0",
              !isCollapsed && "w-12 h-12"
            )}>
              <span className="text-kube-primary font-bold text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
              </span>
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                <p className="text-[10px] font-medium text-gray-400 truncate">{user?.role?.toLowerCase() || 'buyer'}</p>
              </div>
            )}

            {!isCollapsed && (
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Log out"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </>
  )
}
