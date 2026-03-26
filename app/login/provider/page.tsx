'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProviderLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-brand-100 flex flex-col">
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-dark">
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">+</span>
            PayVital
          </Link>
          <Link href="/" className="text-[14px] text-brand-500 hover:text-brand-dark transition-colors">← Back to Home</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-xl">📊</div>
              <h1 className="text-2xl font-extrabold text-brand-dark mb-2">Provider Dashboard</h1>
              <p className="text-[14px] text-brand-500">Access your analytics and collection performance.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[14px] font-medium text-brand-dark mb-1.5">Email</label>
                <input id="email" type="email" placeholder="you@yourpractice.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="text-[14px] font-medium text-brand-dark">Password</label>
                  <a href="#" className="text-[12px] text-primary font-medium">Forgot password?</a>
                </div>
                <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
              <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3 rounded-lg transition-all text-[15px]">
                Sign In to Dashboard
              </button>
            </form>

            <p className="text-[12px] text-brand-500 text-center mt-6 pt-6 border-t border-brand-100">
              Need access? <a href="mailto:sales@payvital.com" className="text-primary font-medium">Contact your account manager</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
