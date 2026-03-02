'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(8),
  business_name: z.string().min(2),
  bank_account_number: z.string().optional(),
  bank_name: z.string().optional(),
  cac_number: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const BANKS = ['GTBank','Access Bank','Zenith Bank','First Bank','UBA','FCMB','Stanbic IBTC','Sterling Bank','Wema Bank','Polaris Bank']

export default function SellerApplyPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/seller/apply', data)
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}`)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Application failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="block text-center text-2xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card">
          <h1 className="text-xl font-bold mb-2">Apply to Sell on Kube</h1>
          <p className="text-sm text-gray-500 mb-6">Your application will be reviewed by the Kube team.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="border-b pb-4 mb-2">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Personal Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Full Name</label>
                  <input {...register('name')} className="input mt-1" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Phone</label>
                  <input {...register('phone')} className="input mt-1" placeholder="08012345678" />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600">Email (optional)</label>
                <input {...register('email')} type="email" className="input mt-1" placeholder="you@email.com" />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <input {...register('password')} type="password" className="input mt-1" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Business Details</h2>
              <div>
                <label className="text-xs font-medium text-gray-600">Business Name</label>
                <input {...register('business_name')} className="input mt-1" placeholder="Imported Gadgets NG" />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600">CAC Number (optional)</label>
                <input {...register('cac_number')} className="input mt-1" placeholder="RC1084723" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Bank</label>
                  <select {...register('bank_name')} className="input mt-1 text-sm">
                    <option value="">Select bank</option>
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Account Number</label>
                  <input {...register('bank_account_number')} className="input mt-1" placeholder="0123456789" maxLength={10} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-kube-accent hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
