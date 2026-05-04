'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, Search, User, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuthStore()
  const totalItems = useCartStore((s) => s.totalItems())
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getDashboardLink = () => {
    if (!user) return null
    const links: Record<string, string> = {
      SELLER: '/seller',
      QC_OFFICER: '/qc',
      DELIVERY_OFFICER: '/delivery',
      ADMIN: '/admin',
    }
    return links[user.role] || '/dashboard'
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-kube-primary flex-shrink-0">
          KUBE
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kube-accent"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto justify-end">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-kube-accent">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-kube-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth section - only render after mount to avoid hydration mismatch */}
          {mounted && (
            isAuthenticated() && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-kube-accent bg-gray-50 px-3 py-2 rounded-full border border-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-kube-accent/10 rounded-full flex items-center justify-center text-kube-accent">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  Hi, {user.name.split(' ')[0]}
                  <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden z-50">
                    {getDashboardLink() && (
                      <Link
                        href={getDashboardLink()!}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-kube-accent transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-kube-accent transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-kube-accent">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary btn-sm text-sm">
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
