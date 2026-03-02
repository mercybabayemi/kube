'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Truck, Package } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import type { Shipment } from '@/types'

export default function DeliveryAssignmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [otp, setOtp] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/delivery/assignments'),
      api.get('/delivery/pending'),
    ]).then(([myRes, pendingRes]) => {
      const map = new Map<string, Shipment>([...pendingRes.data, ...myRes.data].map((s: Shipment) => [s.id, s]))
      const all = Array.from(map.values())
      setShipments(all)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const pickup = async (id: string) => {
    try {
      await api.patch(`/delivery/${id}/assign`)
      await api.patch(`/delivery/${id}/pickup`)
      setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'PICKED_UP' } : s))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    }
  }

  const deliver = async (id: string) => {
    const code = otp[id]
    if (!code || code.length < 6) { alert('Enter the 6-digit OTP from buyer'); return }
    try {
      await api.patch(`/delivery/${id}/delivered`, { otp: code })
      setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'DELIVERED' } : s))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Invalid OTP')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Deliveries</h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No active delivery assignments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map(shipment => (
            <div key={shipment.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{shipment.tracking_number}</div>
                  <div className="text-xs text-gray-500">Created: {formatDate(shipment.created_at)}</div>
                </div>
                <StatusBadge status={shipment.status} />
              </div>

              {shipment.status === 'PENDING' && (
                <button onClick={() => pickup(shipment.id)} className="btn-primary btn-sm text-xs flex items-center gap-2">
                  <Package className="w-3 h-3" /> Confirm Pickup
                </button>
              )}

              {shipment.status === 'PICKED_UP' && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP from buyer"
                    maxLength={6}
                    value={otp[shipment.id] || ''}
                    onChange={e => setOtp(prev => ({ ...prev, [shipment.id]: e.target.value }))}
                    className="input text-sm flex-1"
                  />
                  <button onClick={() => deliver(shipment.id)} className="btn-primary btn-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Mark Delivered
                  </button>
                </div>
              )}

              {shipment.status === 'DELIVERED' && (
                <div className="text-xs text-kube-green font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Delivered on {shipment.delivered_at ? formatDate(shipment.delivered_at) : 'N/A'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
