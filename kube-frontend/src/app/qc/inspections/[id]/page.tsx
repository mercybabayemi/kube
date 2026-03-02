'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Wrench } from 'lucide-react'
import api from '@/lib/api'
import type { QCInspection } from '@/types'

const CHECKLIST = [
  'Screen condition',
  'Battery health',
  'All buttons functional',
  'Speakers / microphone',
  'Cameras (front + back)',
  'Charging port',
  'Back / casing',
]

export default function InspectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [inspection, setInspection] = useState<QCInspection | null>(null)
  const [checks, setChecks] = useState<Record<string, boolean | null>>({})
  const [notes, setNotes] = useState('')
  const [repairDetails, setRepairDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/qc/pending`).then(r => {
      const found = r.data.find((i: QCInspection) => i.id === id)
      if (found) setInspection(found)
    }).catch(() => {})
    // Init checks
    const initial: Record<string, boolean | null> = {}
    CHECKLIST.forEach(c => { initial[c] = null })
    setChecks(initial)
  }, [id])

  const startInspection = async () => {
    await api.patch(`/qc/${id}/assign`)
    await api.patch(`/qc/${id}/start`)
  }

  const handlePass = async () => {
    setSubmitting(true)
    try {
      await api.patch(`/qc/${id}/pass`, { notes })
      router.push('/qc')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFail = async () => {
    if (!notes) { alert('Please add inspection notes'); return }
    setSubmitting(true)
    try {
      await api.patch(`/qc/${id}/fail`, { notes, repair_details: repairDetails })
      router.push('/qc')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRepair = async () => {
    if (!repairDetails) { alert('Please enter repair details'); return }
    setSubmitting(true)
    try {
      await api.patch(`/qc/${id}/repair`, { repair_details: repairDetails })
      router.push('/qc')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Inspection Detail</h1>
      <p className="text-gray-500 text-sm mb-6">INS-{id?.slice(0, 8).toUpperCase()}</p>

      <div className="card max-w-2xl">
        <h2 className="font-semibold mb-4">Inspection Checklist</h2>
        <div className="space-y-3 mb-6">
          {CHECKLIST.map(item => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setChecks(c => ({ ...c, [item]: true }))}
                  className={`text-sm font-medium px-3 py-1 rounded-full ${checks[item] === true ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600'}`}
                >
                  Pass
                </button>
                <button
                  onClick={() => setChecks(c => ({ ...c, [item]: false }))}
                  className={`text-sm font-medium px-3 py-1 rounded-full ${checks[item] === false ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:text-red-600'}`}
                >
                  Fail
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Inspection Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              className="input mt-1 resize-none" placeholder="Add notes about the item condition..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Repair Details (if needed)</label>
            <textarea rows={2} value={repairDetails} onChange={e => setRepairDetails(e.target.value)}
              className="input mt-1 resize-none" placeholder="Describe what needs to be repaired..." />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleFail} disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-3 font-semibold text-sm">
            <XCircle className="w-4 h-4" /> Fail Item
          </button>
          <button onClick={handleRepair} disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl py-3 font-semibold text-sm">
            <Wrench className="w-4 h-4" /> Log Repair
          </button>
          <button onClick={handlePass} disabled={submitting}
            className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Pass Item
          </button>
        </div>
      </div>
    </div>
  )
}
