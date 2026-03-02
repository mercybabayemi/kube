'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/register', data)
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}`)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card">
          <h1 className="text-xl font-bold mb-6">Create your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input {...register('name')} className="input mt-1" placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input {...register('phone')} className="input mt-1" placeholder="08012345678" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email Address (optional)</label>
              <input {...register('email')} type="email" className="input mt-1" placeholder="you@email.com" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" className="input mt-1" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-kube-accent font-medium hover:underline">Login</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Are you a seller?{' '}
            <Link href="/auth/seller-apply" className="text-kube-accent font-medium hover:underline">Apply to Sell</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
