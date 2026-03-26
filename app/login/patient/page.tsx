'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PatientLogin() {
  const [billCode, setBillCode] = useState('')
  const [dob, setDob] = useState('')

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
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-xl">👤</div>
              <h1 className="text-2xl font-extrabold text-brand-dark mb-2">Pay Your Bill</h1>
              <p className="text-[14px] text-brand-500">Enter your bill code and date of birth to access your statement.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="bill-code" className="block text-[14px] font-medium text-brand-dark mb-1.5">Bill Code</label>
                <input id="bill-code" type="text" placeholder="e.g. PV-123456" value={billCode} onChange={(e) => setBillCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                <p className="text-[12px] text-brand-500 mt-1">Find this on your text, email, or printed statement.</p>
              </div>
              <div>
                <label htmlFor="dob" className="block text-[14px] font-medium text-brand-dark mb-1.5">Date of Birth</label>
                <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-300/40 text-[15px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all text-[15px]">
                View My Bill
              </button>
            </form>

            <p className="text-[12px] text-brand-500 text-center mt-6 pt-6 border-t border-brand-100">
              Need help? <a href="tel:+18887309374" className="text-primary font-medium">(888) 730-9374</a> or <a href="mailto:support@payvital.com" className="text-primary font-medium">support@payvital.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
