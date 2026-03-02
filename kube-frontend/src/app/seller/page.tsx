'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatNaira, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { Order } from '@/types'

export default function SellerDashboard() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, pendingPayout: 0 })

  useEffect(() => {
    api.get('/seller/orders').then(r => {
      const allOrders: Order[] = r.data
      setOrders(allOrders.slice(0, 5))
      setStats(s => ({
        ...s,
        pendingOrders: allOrders.filter(o => o.status === 'SELLER_NOTIFIED').length,
      }))
    }).catch(() => {})

    api.get('/seller/products').then(r => {
      setStats(s => ({ ...s, products: r.data.length }))
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening with your store</p>
        </div>
        <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Products Listed', value: stats.products },
          { label: 'Pending Orders', value: stats.pendingOrders },
          { label: 'Pending Payout', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <div className="text-3xl font-bold text-kube-primary">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/seller/orders" className="text-sm text-kube-accent hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>}
          {orders.map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="text-sm font-medium">{order.order_number}</div>
                <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{formatNaira(order.total_amount)}</span>
                <StatusBadge status={order.status} />
                {order.status === 'SELLER_NOTIFIED' && (
                  <button
                    onClick={async () => {
                      await api.patch(`/seller/orders/${order.id}/ship-to-qc`)
                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'SHIPPED_TO_QC' } : o))
                    }}
                    className="btn-primary btn-sm text-xs"
                  >
                    Mark Shipped
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
