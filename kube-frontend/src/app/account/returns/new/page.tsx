'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'

const RETURN_REASONS = [
  'Item arrived damaged',
  'Item not as described',
  'Wrong item delivered',
  'Item stopped working',
  'Other',
]

const schema = z.object({
  reason: z.string().min(1, 'Please select a reason'),
  description: z.string().min(10, 'Please describe the issue'),
})
type FormData = z.infer<typeof schema>

function ReturnRequestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/returns', {
        order_id: orderId,
        reason: data.reason,
        description: data.description,
      })
      alert('Return request submitted. Our team will be in touch.')
      router.push('/account/orders')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to submit return request')
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">Request a Return</h1>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Reason for return</label>
              <div className="space-y-2">
                {RETURN_REASONS.map(r => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer">
                    <input {...register('reason')} type="radio" value={r} className="text-kube-accent" />
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Describe the issue</label>
              <textarea
                {...register('description')}
                rows={4}
                className="input resize-none"
                placeholder="Please provide as much detail as possible..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              A slight logistics fee may apply for buyer-initiated returns where no product fault is found.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ReturnRequestPage() {
  return (
    <Suspense fallback={<><Navbar /><div className="text-center py-20 text-gray-400">Loading...</div><Footer /></>}>
      <ReturnRequestContent />
    </Suspense>
  )
}
