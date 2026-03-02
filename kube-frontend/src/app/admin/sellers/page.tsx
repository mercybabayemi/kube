'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([])
  const [tab, setTab] = useState('PENDING')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/sellers/pending').then(r => setSellers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const approve = async (userId: string) => {
    await api.patch(`/admin/sellers/${userId}/approve`)
    setSellers(prev => prev.filter(s => s.user_id !== userId))
  }

  const reject = async (userId: string) => {
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    await api.patch(`/admin/sellers/${userId}/reject`, { rejection_reason: reason })
    setSellers(prev => prev.filter(s => s.user_id !== userId))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seller Applications</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${tab === t ? 'bg-kube-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : sellers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No pending applications</div>
      ) : (
        <div className="space-y-4">
          {sellers.map(seller => (
            <div key={seller.user_id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg">{seller.business_name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Bank: {seller.bank_name || 'N/A'} · {seller.bank_account_number || 'N/A'}
                  </div>
                  {seller.cac_number && (
                    <div className="text-xs text-gray-400 mt-0.5">CAC No: {seller.cac_number}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => reject(seller.user_id)}
                    className="flex items-center gap-1 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => approve(seller.user_id)}
                    className="flex items-center gap-1 bg-kube-green text-white hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
