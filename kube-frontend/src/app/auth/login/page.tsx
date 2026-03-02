'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  phone: z.string().min(10),
  password: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { data: tokens } = await api.post('/auth/login', data)
      setTokens(tokens.access_token, tokens.refresh_token)
      const { data: user } = await api.get('/auth/me')
      setUser(user)

      const roleRoutes: Record<string, string> = {
        SELLER: '/seller',
        QC_OFFICER: '/qc',
        DELIVERY_OFFICER: '/delivery',
        ADMIN: '/admin',
        BUYER: '/account/orders',
      }
      router.push(roleRoutes[user.role] || '/')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card">
          <h1 className="text-xl font-bold mb-6">Welcome back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input {...register('phone')} className="input mt-1" placeholder="08012345678" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input {...register('password')} type="password" className="input mt-1" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-kube-accent font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
