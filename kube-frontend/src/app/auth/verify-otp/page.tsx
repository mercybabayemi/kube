'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import api from '@/lib/api'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(45)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

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

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) return
    setLoading(true)
    try {
      await api.post('/auth/otp/verify', { phone, otp: code })
      router.push('/auth/login')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await api.post('/auth/otp/resend', { phone })
      setResendTimer(45)
      setOtp(['', '', '', '', '', ''])
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold text-kube-primary mb-8">KUBE</Link>

        <div className="card text-center">
          <h1 className="text-xl font-bold mb-2">Verify your phone number</h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to <strong>{phone}</strong>
          </p>

          <div className="flex justify-center gap-3 mb-6">
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
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-kube-accent"
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading || otp.join('').length < 6}
            className="btn-primary w-full mb-4">
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button onClick={handleResend} disabled={resendTimer > 0}
            className="text-sm text-gray-500 disabled:cursor-not-allowed">
            {resendTimer > 0
              ? `Didn't receive it? Resend (0:${String(resendTimer).padStart(2, '0')})`
              : <span className="text-kube-accent font-medium">Resend Code</span>
            }
          </button>
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
