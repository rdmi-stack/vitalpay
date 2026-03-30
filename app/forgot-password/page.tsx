'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

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
            {sent ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h1 className="text-xl font-bold text-brand-dark mb-2">Check your email</h1>
                <p className="text-[14px] text-brand-500 mb-6">If an account exists for {email}, we&apos;ve sent a password reset link.</p>
                <Link href="/login/provider" className="text-primary font-medium text-[14px] hover:underline">Back to login</Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-extrabold text-brand-dark mb-2">Forgot Password</h1>
                  <p className="text-[14px] text-brand-500">Enter your email and we&apos;ll send you a reset link.</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[14px] font-medium text-brand-dark mb-1.5">Email</label>
                    <input id="email" type="email" required placeholder="you@yourpractice.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all text-[15px] disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <p className="text-[13px] text-brand-500 text-center mt-6">
                  Remember your password? <Link href="/login/provider" className="text-primary font-medium">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
