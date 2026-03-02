'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Circle, Clock, HelpCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatNaira, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils'
import api from '@/lib/api'
import type { Order } from '@/types'

const STEPS = [
  { key: 'PAID', label: 'Payment Received' },
  { key: 'SELLER_NOTIFIED', label: 'Seller Preparing' },
  { key: 'SHIPPED_TO_QC', label: 'Shipped to Kube QC' },
  { key: 'QC_IN_PROGRESS', label: 'QC Testing' },
  { key: 'DISPATCHED', label: 'Dispatched' },
  { key: 'DELIVERED', label: 'Delivered' },
]

const STEP_ORDER = STEPS.map(s => s.key)

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => {})
  }, [id])

  if (!order) {
    return <><Navbar /><div className="text-center py-20 text-gray-400">Loading...</div><Footer /></>
  }

  const currentIdx = STEP_ORDER.indexOf(order.status)

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <h1 className="text-xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-gray-500">
            Placed {formatDate(order.created_at)} · {formatNaira(order.total_amount)} · {order.items.length} item(s)
          </p>
        </div>

        {/* Status timeline */}
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Order Status</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const done = i <= currentIdx
              const active = i === currentIdx
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {done ? (
                      <CheckCircle className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-kube-green'}`} />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</div>
                    {active && <div className="text-xs text-blue-500 mt-0.5">In progress</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Items */}
        <div className="card mb-4">
          <h2 className="font-semibold mb-3">Items in this order</h2>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b last:border-0">
              <span className="text-gray-600">Product ID: {item.product_id.slice(0, 8)}...</span>
              <span>{formatNaira(item.unit_price)} × {item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="card text-sm text-gray-600">
          <div className="font-semibold mb-1">Delivery Address</div>
          {order.delivery_address}
        </div>

        <div className="mt-4 flex justify-end">
          <Link href="mailto:support@kube.ng" className="btn-secondary btn-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Need Help?
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
