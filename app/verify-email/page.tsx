'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    api('/api/auth/verify-email', { method: 'POST', body: { token } })
      .then(() => {
        setStatus('success')
        setMessage('Your email has been verified!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Verification failed.')
      })
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <p className="text-brand-400">Verifying your email...</p>
      )}
      {status === 'success' && (
        <>
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Email Verified!</h1>
          <p className="text-brand-500 text-[14px] mb-6">{message}</p>
          <Link href="/login/provider" className="bg-primary text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-all text-[14px]">
            Sign In
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Verification Failed</h1>
          <p className="text-brand-500 text-[14px] mb-6">{message}</p>
          <Link href="/" className="text-primary font-medium text-[14px] hover:underline">Go home</Link>
        </>
      )}
    </div>
  )
}

export default function VerifyEmail() {
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
              <VerifyContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
