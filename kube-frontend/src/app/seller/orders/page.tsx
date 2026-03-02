'use client'

import { useEffect, useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatNaira, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import type { Order } from '@/types'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const shipToQC = async (orderId: string) => {
    try {
      await api.patch(`/seller/orders/${orderId}/ship-to-qc`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'SHIPPED_TO_QC' } : o))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    }
  }

  const FILTERS = ['ALL', 'SELLER_NOTIFIED', 'SHIPPED_TO_QC', 'DELIVERED', 'CONFIRMED']
  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === f ? 'bg-kube-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'ALL' ? 'All' : f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{order.order_number}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.created_at)} · {formatNaira(order.total_amount)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  {order.status === 'SELLER_NOTIFIED' && (
                    <button onClick={() => shipToQC(order.id)} className="btn-primary btn-sm text-xs">
                      Mark Shipped to QC
                    </button>
                  )}
                </div>
              </div>
              {order.status === 'SELLER_NOTIFIED' && (
                <div className="mt-2 text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2">
                  Ship to: Kube QC Warehouse — contact admin for warehouse address
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No orders</p>}
        </div>
      )}
    </div>
  )
}
