'use client'

import { useEffect, useState } from 'react'
import { formatNaira, formatDate } from '@/lib/utils'
import api from '@/lib/api'

export default function SellerPayoutsPage() {
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    // Fetch orders and derive payout info
    api.get('/seller/orders').then(r => setPayments(r.data)).catch(() => {})
  }, [])

  const pending = payments.filter(o => ['QC_PASSED', 'DISPATCHED', 'DELIVERED', 'CONFIRMED'].includes(o.status))
  const paid = payments.filter(o => o.status === 'CONFIRMED')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payout Status</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-500">
            {formatNaira(pending.reduce((s, o) => s + o.total_amount, 0))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Pending Release</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-kube-green">
            {formatNaira(paid.reduce((s, o) => s + o.total_amount * 0.9, 0))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Paid Out</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Payout History</h2>
        <div className="space-y-3">
          {payments.map(order => {
            const gross = order.total_amount
            const commission = gross * 0.10
            const net = gross - commission
            const isPaid = order.status === 'CONFIRMED'
            return (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="text-sm font-medium">{order.order_number}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                  <div className="text-xs text-gray-400">
                    Gross: {formatNaira(gross)} · Commission: {formatNaira(commission)} · Net: {formatNaira(net)}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {isPaid ? 'Paid' : 'Awaiting'}
                </span>
              </div>
            )
          })}
          {payments.length === 0 && <p className="text-center text-gray-400 py-4">No payouts yet</p>}
        </div>
      </div>
    </div>
  )
}
