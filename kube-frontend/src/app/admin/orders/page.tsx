'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatNaira, formatDate } from '@/lib/utils'
import api from '@/lib/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/admin/orders?page=${page}&page_size=20`).then(r => {
      setOrders(r.data.items || [])
      setTotal(r.data.total || 0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [page])

  const releaseEscrow = async (paymentId: string, orderId: string) => {
    if (!confirm('Release escrow payment to seller?')) return
    try {
      await api.patch(`/admin/payments/${paymentId}/release`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CONFIRMED' } : o))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    }
  }

  const filtered = search
    ? orders.filter(o => o.order_number.toLowerCase().includes(search.toLowerCase()))
    : orders

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-3">Order</th>
              <th className="text-left pb-3">Date</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.map((order: any) => (
              <tr key={order.id}>
                <td className="py-2.5 font-medium">{order.order_number}</td>
                <td className="py-2.5 text-gray-500">{formatDate(order.created_at)}</td>
                <td className="py-2.5 font-medium">{formatNaira(order.total_amount)}</td>
                <td className="py-2.5"><StatusBadge status={order.status} /></td>
                <td className="py-2.5">
                  {order.status === 'CONFIRMED' && order.payment?.status === 'AWAITING_RELEASE' && (
                    <button
                      onClick={() => releaseEscrow(order.payment.id, order.id)}
                      className="btn-primary btn-sm text-xs"
                    >
                      Release Escrow
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-500 self-center">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
