'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { QCInspection } from '@/types'

export default function QCDashboard() {
  const { user } = useAuthStore()
  const [inspections, setInspections] = useState<QCInspection[]>([])
  const [pending, setPending] = useState<QCInspection[]>([])

  useEffect(() => {
    api.get('/qc/assignments').then(r => setInspections(r.data)).catch(() => {})
    api.get('/qc/pending').then(r => setPending(r.data)).catch(() => {})
  }, [])

  const pending_count = [...inspections, ...pending].filter(i => i.status === 'PENDING').length
  const inprogress_count = [...inspections, ...pending].filter(i => i.status === 'IN_PROGRESS').length
  const ready_count = [...inspections, ...pending].filter(i => i.status === 'READY_TO_SHIP').length

  const allItems = Array.from(new Map<string, QCInspection>([...pending, ...inspections].map(i => [i.id, i])).values())

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">QC Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome back, {user?.name}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Items', value: pending_count, color: 'text-orange-500' },
          { label: 'In Progress', value: inprogress_count, color: 'text-blue-500' },
          { label: 'Awaiting Reship', value: ready_count, color: 'text-kube-green' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Items to Inspect</h2>
        <div className="space-y-3">
          {allItems.slice(0, 10).map(inspection => (
            <div key={inspection.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="text-sm font-medium">INS-{inspection.id.slice(0, 8).toUpperCase()}</div>
                <div className="text-xs text-gray-500">Received: {formatDate(inspection.received_at)}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={inspection.status} />
                <Link href={`/qc/inspections/${inspection.id}`}
                  className="btn-primary btn-sm text-xs flex items-center gap-1">
                  {inspection.status === 'PENDING' ? 'Inspect' : 'Continue'} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
          {allItems.length === 0 && <p className="text-center text-gray-400 py-4">No items to inspect</p>}
        </div>
      </div>
    </div>
  )
}
