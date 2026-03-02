'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Clock, MessageSquare, ArrowRight } from 'lucide-react'
import { formatNaira, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import api from '@/lib/api'

interface Stats {
  total_revenue_month: number
  active_orders: number
  pending_payouts: number
  open_disputes: number
  pending_seller_applications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {})
    api.get('/admin/orders?page=1&page_size=5').then(r => setRecentOrders(r.data.items || [])).catch(() => {})
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Revenue (Month)', value: stats ? formatNaira(stats.total_revenue_month) : '—' },
          { label: 'Active Orders', value: stats?.active_orders ?? '—' },
          { label: 'Pending Payouts', value: stats?.pending_payouts ?? '—' },
          { label: 'Open Disputes', value: stats?.open_disputes ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <div className="text-2xl font-bold text-kube-primary">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions Required */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Actions Required</h2>
        <div className="space-y-3">
          {stats && stats.pending_seller_applications > 0 && (
            <div className="flex items-center justify-between bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span><strong>{stats.pending_seller_applications}</strong> new seller application(s) awaiting approval</span>
              </div>
              <Link href="/admin/sellers" className="text-xs text-kube-accent font-medium hover:underline flex items-center gap-1">
                Review <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          {stats && stats.pending_payouts > 0 && (
            <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span><strong>{stats.pending_payouts}</strong> payment(s) awaiting escrow release</span>
              </div>
              <Link href="/admin/orders" className="text-xs text-kube-accent font-medium hover:underline flex items-center gap-1">
                Review <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          {stats && stats.open_disputes > 0 && (
            <div className="flex items-center justify-between bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span><strong>{stats.open_disputes}</strong> open dispute(s) to resolve</span>
              </div>
              <Link href="/admin/disputes" className="text-xs text-kube-accent font-medium hover:underline flex items-center gap-1">
                Review <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-kube-accent hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-2">Order</th>
              <th className="text-left pb-2">Date</th>
              <th className="text-left pb-2">Amount</th>
              <th className="text-left pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order: any) => (
              <tr key={order.id}>
                <td className="py-2">{order.order_number}</td>
                <td className="py-2 text-gray-500">{formatDate(order.created_at)}</td>
                <td className="py-2 font-medium">{formatNaira(order.total_amount)}</td>
                <td className="py-2"><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
