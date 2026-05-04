'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  ShoppingBag, 
  ArrowRight,
  Clock,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { formatNaira, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order } from '@/types'

export default function BuyerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
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

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-kube-primary-pale/50 font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Background blobs for elegance */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-kube-primary-soft/20 to-transparent -z-10"></div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-kube-primary-light/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-40 left-40 w-72 h-72 bg-kube-primary/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-[1400px] mx-auto">
          {/* Welcome Header */}
          <div className="mb-10 p-8 rounded-[2rem] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-kube-primary-soft/20 relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-kube-primary-soft text-kube-primary-mid text-sm font-bold mb-3 tracking-wide">
                Welcome Back 🌟
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Hi, <span className="text-transparent bg-clip-text bg-kube-gradient">{user?.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-gray-500 text-lg">Ready to find some amazing verified goods today?</p>
            </div>
            <div className="hidden md:flex w-32 h-32 bg-kube-primary-soft rounded-full items-center justify-center shadow-inner relative">
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
              </div>
            </div>
            {/* Elegant background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-kube-primary-soft/50 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Quick Stats / Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl cursor-pointer group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[1.2rem] bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200 group-hover:rotate-3">
                <Package size={28} strokeWidth={2} />
              </div>
              <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">My Orders</p>
              <Link href="/account/orders" className="text-xl font-bold text-gray-800">View All</Link>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl cursor-pointer group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[1.2rem] bg-pink-50 flex items-center justify-center text-pink-500 mb-4 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-pink-200 group-hover:-rotate-3">
                <Heart size={28} strokeWidth={2} />
              </div>
              <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Wishlist</p>
              <p className="text-xl font-bold text-gray-800">0 Items</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl cursor-pointer group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[1.2rem] bg-green-50 flex items-center justify-center text-green-500 mb-4 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-green-200 group-hover:rotate-3">
                <MapPin size={28} strokeWidth={2} />
              </div>
              <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Address</p>
              <Link href="/account/address" className="text-xl font-bold text-gray-800">Manage</Link>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl cursor-pointer group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[1.2rem] bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-orange-200 group-hover:-rotate-3">
                <Settings size={28} strokeWidth={2} />
              </div>
              <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Settings</p>
              <Link href="/account/profile" className="text-xl font-bold text-gray-800">Edit Profile</Link>
            </div>
          </div>

          <div className="space-y-10">
            {/* Main Section: Recent Orders */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                  <div className="bg-kube-primary-soft text-kube-primary-mid p-2 rounded-xl">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  Recent Orders
                </h2>
                <Link href="/account/orders" className="text-kube-primary text-sm font-bold flex items-center gap-1 hover:bg-kube-primary/10 px-4 py-2 rounded-xl transition-all">
                  See all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-[1.5rem]"></div>)}
                    </div>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                      <div key={order.id} className="bg-white p-5 rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors">
                            <ShoppingBag size={24} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 text-lg mb-0.5 tracking-tight">{order.order_number}</p>
                            <p className="text-sm font-medium text-gray-400">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-extrabold text-gray-900 text-lg mb-0.5">{formatNaira(order.total_amount)}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Paid</p>
                          </div>
                          <div className="scale-110 origin-right">
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-[2rem] text-center py-16 shadow-sm border border-kube-primary-soft/20 relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-50 rounded-full blur-xl opacity-50"></div>
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-xl opacity-50"></div>
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-orange-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 rotate-3">
                          <ShoppingBag size={36} className="text-orange-500 -rotate-3" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-800 mb-2">No orders yet!</h3>
                        <p className="text-gray-500 mb-8 font-medium">Let's find something reliable for you.</p>
                        <Link href="/products" className="bg-kube-accent-gradient text-white font-bold px-8 py-3.5 rounded-[1.2rem] inline-flex items-center gap-2 hover:shadow-lg hover:shadow-orange-200 transition-all hover:-translate-y-1">
                          <ShoppingBag size={20} />
                          Start Shopping
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar inside Main Area */}
                <div className="space-y-6">
                  {/* Kube Guarantee */}
                  <div className="bg-gradient-to-br from-kube-primary via-kube-primary-mid to-kube-primary-light rounded-[2rem] p-8 text-white overflow-hidden relative shadow-xl shadow-kube-primary/20">
                    <ShieldCheck size={200} className="absolute -bottom-16 -right-10 text-white/10 rotate-12" />
                    <div className="relative z-10">
                      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 tracking-tight">
                        <ShieldCheck size={20} className="text-white" />
                        Our Promise
                      </h2>
                      <p className="text-white/90 text-sm font-medium leading-relaxed mb-6">
                        Lovingly inspected by our quality team. 100% refund, no stress.
                      </p>
                      <ul className="space-y-3 font-bold text-xs">
                        <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-kube-primary-light" />
                          Verified Quality
                        </li>
                        <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-kube-primary-light" />
                          Secure Payments
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 text-center">
                    <div className="w-12 h-12 bg-kube-primary-soft rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                      👋
                    </div>
                    <h3 className="font-extrabold text-gray-900 mb-1 text-base">Need a hand?</h3>
                    <p className="text-xs font-medium text-gray-500 mb-4 leading-relaxed">Friendly support 24/7.</p>
                    <button className="w-full bg-kube-primary-pale hover:bg-kube-primary-soft text-kube-primary font-bold py-3 rounded-xl transition-all border border-kube-primary-soft/30 text-sm">
                      Chat with us
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Recommendations Section to fill space */}
            <div className="space-y-6 pb-20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-500 p-2 rounded-xl">
                    <ShoppingBag size={20} strokeWidth={2.5} />
                  </div>
                  Recommended for You
                </h2>
                <Link href="/products" className="text-gray-500 text-sm font-bold flex items-center gap-1 hover:text-gray-900 transition-all">
                  View marketplace <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-50 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="aspect-square bg-gray-50 rounded-[1.2rem] mb-4 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-kube-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                        <ShoppingBag size={48} strokeWidth={1} />
                      </div>
                    </div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded-full mb-2 animate-pulse group-hover:animate-none group-hover:bg-gray-200 transition-colors"></div>
                    <div className="h-4 w-1/2 bg-gray-50 rounded-full animate-pulse group-hover:animate-none group-hover:bg-gray-100 transition-colors"></div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="h-6 w-20 bg-kube-primary-pale rounded-lg"></div>
                      <div className="w-8 h-8 rounded-full bg-kube-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
