'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import api from '@/lib/api'
import type { Return } from '@/types'

export default function AdminDisputesPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [selected, setSelected] = useState<Return | null>(null)
  const [resolution, setResolution] = useState('REPAIR')
  const [deduction, setDeduction] = useState('0')
  const [adminNotes, setAdminNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/admin/returns').then(r => setReturns(r.data)).catch(() => {})
  }, [])

  const resolve = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await api.patch(`/admin/returns/${selected.id}/resolve`, {
        resolution_type: resolution,
        logistics_deduction: Number(deduction),
        admin_notes: adminNotes,
      })
      setReturns(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'RESOLVED' } : r))
      setSelected(null)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dispute Resolution</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {returns.length === 0 && <p className="text-gray-400 text-center py-8">No disputes</p>}
          {returns.map(ret => (
            <button key={ret.id} onClick={() => setSelected(ret)} className={`card w-full text-left hover:shadow-md transition-shadow ${selected?.id === ret.id ? 'ring-2 ring-kube-accent' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-medium">RET-{ret.id.slice(0, 8).toUpperCase()}</div>
                <StatusBadge status={ret.status} />
              </div>
              <div className="text-xs text-gray-500">{ret.reason}</div>
              <div className="text-xs text-gray-400 mt-1">{formatDate(ret.created_at)}</div>
            </button>
          ))}
        </div>

        {/* Resolution panel */}
        {selected && (
          <div className="card">
            <h2 className="font-semibold mb-4">Resolve — RET-{selected.id.slice(0, 8).toUpperCase()}</h2>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <div className="font-medium text-gray-700">Issue:</div>
              <div className="text-gray-600 mt-1">{selected.reason}</div>
              {selected.description && <div className="text-gray-500 text-xs mt-1">{selected.description}</div>}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Resolution</label>
                {['REPAIR', 'REPLACEMENT', 'REFUND'].map(r => (
                  <label key={r} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="radio" value={r} checked={resolution === r} onChange={() => setResolution(r)} />
                    <span className="text-sm">{r.charAt(0) + r.slice(1).toLowerCase()}</span>
                  </label>
                ))}
              </div>

              {resolution === 'REFUND' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Logistics Deduction (₦)</label>
                  <input type="number" value={deduction} onChange={e => setDeduction(e.target.value)}
                    className="input mt-1" placeholder="0" />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Admin Notes</label>
                <textarea rows={3} value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                  className="input mt-1 resize-none" placeholder="Add internal notes..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={resolve} disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Submitting...' : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
