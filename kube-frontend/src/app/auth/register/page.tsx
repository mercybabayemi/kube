'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await api.post('/auth/register', data)
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setServerError(detail.map((d: any) => d.msg).join(', '))
      } else if (typeof detail === 'string') {
        setServerError(detail)
      } else if (err.request && !err.response) {
        setServerError('Cannot connect to the server. Please check if the backend is running.')
      } else {
        setServerError('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-3xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card shadow-xl border-t-4 border-t-kube-accent">
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Join the marketplace for verified used goods.</p>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{serverError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input 
                {...register('name')} 
                autoComplete="name"
                className={`input mt-1 ${errors.name ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="John Doe" 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input 
                {...register('phone')} 
                autoComplete="tel"
                className={`input mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="08012345678" 
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`input mt-1 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
              <p className="text-gray-400 text-[10px] mt-1 italic uppercase tracking-wider">Verification code will be sent here</p>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                className={`input mt-1 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2 relative overflow-hidden group">
              <span className={isSubmitting ? 'opacity-0' : 'opacity-100 transition-opacity'}>Create Account</span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-kube-accent-dark">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Please wait...</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-kube-accent font-bold hover:underline">Login</Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              Are you a seller?{' '}
              <Link href="/auth/seller-apply" className="text-kube-accent font-bold hover:underline">Apply to Sell</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
