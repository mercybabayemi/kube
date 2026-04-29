'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  ShoppingBag, 
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { formatNaira, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order } from '@/types'

export default function BuyerDashboard() {
  const { user } = useAuthStore()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch recent orders
    api.get('/orders')
      .then(res => {
        setRecentOrders(res.data.slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-gray-500">Track your orders and manage your verified used goods account.</p>
      </div>

      {/* Quick Stats / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="card hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">My Orders</p>
              <Link href="/account/orders" className="text-lg font-bold hover:text-kube-accent">View All</Link>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wishlist</p>
              <p className="text-lg font-bold">0 Items</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address Book</p>
              <Link href="/account/address" className="text-sm font-bold hover:text-kube-accent">Manage</Link>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Settings</p>
              <Link href="/account/profile" className="text-sm font-bold hover:text-kube-accent">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section: Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-kube-accent" />
              Recent Orders
            </h2>
            <Link href="/account/orders" className="text-kube-accent text-sm font-medium flex items-center gap-1 hover:underline">
              See all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order.id} className="card flex items-center justify-between hover:border-kube-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatNaira(order.total_amount)}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Paid via Paystack</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-12 bg-gray-50/50 border-dashed border-2">
                <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping for verified used items!</p>
                <Link href="/products" className="btn-primary">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Kube Guarantee */}
        <div className="space-y-6">
          <div className="bg-kube-primary rounded-2xl p-6 text-white overflow-hidden relative group">
            <ShieldCheck size={120} className="absolute -bottom-6 -right-6 text-white/10 group-hover:rotate-12 transition-transform" />
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={24} />
              Kube Guarantee
            </h2>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Every item on Kube is inspected by our quality control officers. 
              If the item doesn't match the description, we'll give you a 100% refund.
            </p>
            <ul className="space-y-3 text-xs font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-kube-accent" />
                Verified Quality
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-kube-accent" />
                Secure Payments
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-kube-accent" />
                48-Hour Return Policy
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Need help?</h3>
            <p className="text-sm text-gray-500 mb-4">Our support team is available 24/7 to help you with your orders.</p>
            <button className="w-full btn-secondary text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
