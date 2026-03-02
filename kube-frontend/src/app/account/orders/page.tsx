'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
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
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>You have no orders yet</p>
            <Link href="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-sm">{order.order_number}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</div>
                    <div className="text-sm font-medium mt-1">{formatNaira(order.total_amount + order.delivery_fee)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={order.status} />
                    <Link href={`/account/orders/${order.id}`}
                      className="text-xs text-kube-accent hover:underline flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                {order.status === 'DELIVERED' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <button
                      onClick={async () => {
                        await api.patch(`/orders/${order.id}/confirm-receipt`)
                        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'CONFIRMED' } : o))
                      }}
                      className="btn-primary btn-sm text-xs"
                    >
                      Confirm Receipt
                    </button>
                    <Link href={`/account/returns/new?order_id=${order.id}`} className="btn-secondary btn-sm text-xs">
                      Request Return
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
