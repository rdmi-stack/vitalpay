'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setError('')
    try {
      await api('/api/auth/reset-password', { method: 'POST', body: { token, new_password: password } })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-brand-dark mb-2">Invalid Link</h1>
        <p className="text-brand-500 text-[14px] mb-4">This reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-primary font-medium">Request a new one</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <h1 className="text-xl font-bold text-brand-dark mb-2">Password Reset!</h1>
        <p className="text-brand-500 text-[14px] mb-6">Your password has been updated. You can now sign in.</p>
        <Link href="/login/provider" className="bg-primary text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-all text-[14px]">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark mb-2">Set New Password</h1>
        <p className="text-[14px] text-brand-500">Enter your new password below.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[14px] font-medium text-brand-dark mb-1.5">New Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-brand-dark mb-1.5">Confirm Password</label>
          <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all text-[15px] disabled:opacity-50">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-brand-100 flex flex-col">
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-dark">
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">+</span>
            PayVital
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <Suspense fallback={<div className="text-center text-brand-400">Loading...</div>}>
              <ResetForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
