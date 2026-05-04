'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatNaira, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import type { Order } from '@/types'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-kube-primary-pale/50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-[1.5rem] animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] text-center py-20 shadow-sm border border-kube-primary-soft/20 relative overflow-hidden">
              <Package className="w-16 h-16 mx-auto mb-6 text-gray-300 opacity-50" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
              <Link href="/products" className="bg-kube-accent-gradient text-white font-bold px-8 py-3.5 rounded-[1.2rem] inline-block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-kube-primary-soft/30 rounded-[1.2rem] flex items-center justify-center text-kube-primary-mid">
                        <Package size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-900 text-lg tracking-tight">{order.order_number}</div>
                        <div className="text-sm font-medium text-gray-400">{formatDate(order.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="font-extrabold text-gray-900 text-lg">{formatNaira(order.total_amount + order.delivery_fee)}</div>
                        <StatusBadge status={order.status} />
                      </div>
                      <Link href={`/account/orders/${order.id}`}
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-kube-primary/10 hover:text-kube-primary transition-all">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                  
                  {order.status === 'DELIVERED' && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-50">
                      <button
                        onClick={async () => {
                          await api.patch(`/orders/${order.id}/confirm-receipt`)
                          setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'CONFIRMED' } : o))
                        }}
                        className="bg-kube-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02]"
                      >
                        Confirm Receipt
                      </button>
                      <Link href={`/account/returns/new?order_id=${order.id}`} 
                        className="bg-gray-50 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-gray-100">
                        Request Return
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
