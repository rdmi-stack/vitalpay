'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api, saveTokens } from '@/lib/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api<{ access_token: string; refresh_token: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      saveTokens(res.access_token, res.refresh_token)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
          <Link href="/" className="text-[14px] text-brand-500 hover:text-brand-dark transition-colors">&larr; Back to Home</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-xl">🏥</div>
              <h1 className="text-2xl font-extrabold text-brand-dark mb-2">Admin Portal</h1>
              <p className="text-[14px] text-brand-500">Sign in to manage your PayVital account.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[14px] font-medium text-brand-dark mb-1.5">Email</label>
                <input id="email" type="email" required placeholder="you@yourpractice.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="text-[14px] font-medium text-brand-dark">Password</label>
                  <Link href="/forgot-password" className="text-[12px] text-primary font-medium">Forgot password?</Link>
                </div>
                <input id="password" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all text-[15px] disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-brand-100 space-y-2">
              <p className="text-[12px] text-brand-500 text-center">
                Don&apos;t have an account? <a href="/#contact" className="text-primary font-medium">Request a demo</a>
              </p>
              <div className="flex justify-center gap-4 text-[12px]">
                <Link href="/login/provider" className="text-primary font-medium hover:underline">Provider Login</Link>
                <span className="text-brand-200">|</span>
                <Link href="/login/patient" className="text-primary font-medium hover:underline">Patient Login</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
