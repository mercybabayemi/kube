'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const { setTokens, setUser } = useAuthStore()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  // Countdown for resend button
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) return
    setLoading(true)
    try {
      // Call email OTP verify — returns JWT tokens on success
      const { data: tokens } = await api.post('/auth/otp/email/verify', {
        email,
        otp: code,
      })

      // Store tokens in auth store
      setTokens(tokens.access_token, tokens.refresh_token)

      // Fetch user profile
      const { data: user } = await api.get('/auth/me')
      setUser(user)

      // Redirect to the appropriate dashboard based on role
      const roleRoutes: Record<string, string> = {
        SELLER: '/seller',
        QC_OFFICER: '/qc',
        DELIVERY_OFFICER: '/delivery',
        ADMIN: '/admin',
        BUYER: '/dashboard',
      }
      router.push(roleRoutes[user.role] || '/')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return
    setResendLoading(true)
    setResendMsg('')
    try {
      await api.post('/auth/otp/email/resend', { email })
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      setResendMsg('A new code has been sent to your email.')
      inputs.current[0]?.focus()
    } catch (err: any) {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_: string, a: string, b: string, c: string) =>
        a + '*'.repeat(Math.max(1, b.length)) + c
      )
    : ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-kube-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-kube-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold mb-2">Check your email</h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit verification code to{' '}
            <strong className="text-gray-800">{maskedEmail}</strong>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg
                  focus:outline-none transition-colors
                  ${digit ? 'border-kube-accent bg-kube-accent/5' : 'border-gray-300'}
                  focus:border-kube-accent`}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length < 6}
            className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          {resendMsg && (
            <p className="text-green-600 text-sm mb-3">{resendMsg}</p>
          )}

          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || resendLoading}
            className="text-sm text-gray-500 disabled:cursor-not-allowed"
          >
            {resendTimer > 0
              ? `Didn't receive it? Resend in 0:${String(resendTimer).padStart(2, '0')}`
              : resendLoading
                ? 'Sending...'
                : <span className="text-kube-accent font-medium">Resend Code</span>
            }
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Wrong email?{' '}
            <Link href="/auth/register" className="text-kube-accent hover:underline">Go back</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
