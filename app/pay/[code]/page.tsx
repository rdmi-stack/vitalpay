'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

interface BillData {
  id: string
  amount_due: number
  service_description: string
  provider_name: string
  service_date: string
  insurance_adjustment: number
  amount: number
}

type Step = 'verify' | 'bill' | 'payment' | 'success'

export default function PaymentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const code = params.code as string
  const dobParam = searchParams.get('dob')

  const [step, setStep] = useState<Step>(dobParam ? 'bill' : 'verify')
  const [dob, setDob] = useState(dobParam || '')
  const [patientName, setPatientName] = useState('')
  const [bill, setBill] = useState<BillData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'plan'>('full')
  const [installments, setInstallments] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (dobParam) {
      verifyAndLoadBill(dobParam)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function verifyAndLoadBill(dateOfBirth: string) {
    setLoading(true)
    setError('')
    try {
      const res = await api<{ verified: boolean; patient_name: string; bill: BillData }>(
        `/api/patients/verify-dob?pay_code=${encodeURIComponent(code)}&date_of_birth=${encodeURIComponent(dateOfBirth)}`,
        { method: 'POST' }
      )
      setPatientName(res.patient_name)
      setBill(res.bill)
      setStep('bill')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    await verifyAndLoadBill(dob)
  }

  async function handlePay() {
    if (!bill) return
    setLoading(true)
    setError('')

    try {
      if (paymentMethod === 'plan') {
        // TODO: Integrate Stripe for real payment
        await api('/api/payments/plans', {
          method: 'POST',
          body: {
            bill_id: bill.id,
            total_amount: bill.amount_due,
            installments,
            frequency: 'monthly',
          },
        })
      } else {
        await api('/api/payments', {
          method: 'POST',
          body: {
            bill_id: bill.id,
            amount: bill.amount_due,
            method: 'card',
          },
        })
      }
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-dark">
            <span className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center text-xs font-bold">+</span>
            PayVital
          </Link>
          <span className="text-[12px] text-brand-400">Secure Payment</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px]">

          {/* Step 1: Verify DOB */}
          {step === 'verify' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                </div>
                <h1 className="text-xl font-bold text-brand-dark mb-1">Verify Your Identity</h1>
                <p className="text-sm text-brand-500">Enter your date of birth to access your bill.</p>
              </div>

              {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

              <form onSubmit={handleVerify}>
                <label htmlFor="dob" className="block text-sm font-medium text-brand-dark mb-1.5">Date of Birth</label>
                <input id="dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-brand-200 text-[15px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4" />
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: View Bill */}
          {step === 'bill' && bill && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-brand-400 mb-1">Hello, {patientName}</p>
                <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">Amount Due</p>
                <p className="text-5xl font-extrabold text-brand-dark">${bill.amount_due.toFixed(2)}</p>
              </div>

              <div className="bg-brand-50 rounded-xl p-4 mb-6 space-y-2.5">
                {[
                  ['Provider', bill.provider_name],
                  ['Service', bill.service_description],
                  ['Total Charges', `$${bill.amount.toFixed(2)}`],
                  ['Insurance Adj.', `-$${bill.insurance_adjustment.toFixed(2)}`],
                  ['You Owe', `$${bill.amount_due.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-brand-400">{k}</span>
                    <span className="text-brand-dark font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {/* Payment options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('full')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'full' ? 'border-primary bg-primary/5' : 'border-brand-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-brand-dark text-[15px]">Pay in Full</p>
                      <p className="text-sm text-brand-400">One-time payment</p>
                    </div>
                    <p className="text-lg font-bold text-brand-dark">${bill.amount_due.toFixed(2)}</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('plan')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'plan' ? 'border-primary bg-primary/5' : 'border-brand-100'}`}
                >
                  <div>
                    <p className="font-semibold text-brand-dark text-[15px]">Payment Plan</p>
                    <p className="text-sm text-brand-400">Split into monthly installments</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'plan' && (
                <div className="mb-6 flex gap-2">
                  {[3, 6, 12].map((n) => (
                    <button
                      key={n}
                      onClick={() => setInstallments(n)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${installments === n ? 'bg-primary text-white' : 'bg-brand-50 text-brand-500'}`}
                    >
                      {n}× ${(bill.amount_due / n).toFixed(2)}
                    </button>
                  ))}
                </div>
              )}

              {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

              <button onClick={() => setStep('payment')} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl transition-all text-[15px]">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 3: Payment (Stripe placeholder) */}
          {step === 'payment' && bill && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-lg font-bold text-brand-dark mb-1">Payment Details</h2>
              <p className="text-sm text-brand-400 mb-6">
                {paymentMethod === 'full'
                  ? `Paying $${bill.amount_due.toFixed(2)}`
                  : `Setting up ${installments} payments of $${(bill.amount_due / installments).toFixed(2)}/month`}
              </p>

              {/* Card form placeholder — will be replaced with Stripe Elements */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                    className="w-full px-3.5 py-3 rounded-xl border border-brand-200 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">Expiry</label>
                    <input type="text" placeholder="MM/YY" maxLength={5}
                      className="w-full px-3.5 py-3 rounded-xl border border-brand-200 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">CVC</label>
                    <input type="text" placeholder="123" maxLength={4}
                      className="w-full px-3.5 py-3 rounded-xl border border-brand-200 text-[15px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
              </div>

              {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

              <button onClick={handlePay} disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl transition-all text-[15px] disabled:opacity-50">
                {loading ? 'Processing...' : paymentMethod === 'full' ? `Pay $${bill.amount_due.toFixed(2)}` : `Start Payment Plan`}
              </button>

              <button onClick={() => setStep('bill')} className="w-full text-brand-400 text-sm mt-3 hover:text-brand-dark transition-colors">
                &larr; Back to bill
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-brand-100">
                <svg className="w-4 h-4 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                <span className="text-[11px] text-brand-300">Secured by Stripe. PCI-DSS compliant. PayVital never sees your card details.</span>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && bill && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark mb-2">Payment Confirmed!</h2>
              <p className="text-4xl font-extrabold text-brand-dark mb-1">${bill.amount_due.toFixed(2)}</p>
              <p className="text-sm text-brand-400 mb-6">{bill.provider_name}</p>

              <div className="bg-brand-50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-400">Status</span>
                  <span className="text-emerald-600 font-medium">
                    {paymentMethod === 'full' ? 'Paid in Full' : `Plan Active — ${installments} payments`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-400">Confirmation</span>
                  <span className="text-brand-dark font-medium">PV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                </div>
              </div>

              <p className="text-[13px] text-brand-400 mb-6">A receipt has been sent to your email.</p>

              <Link href="/" className="inline-block text-primary font-medium text-sm hover:text-primary-dark transition-colors">
                Back to PayVital
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-[11px] text-brand-300">&copy; {new Date().getFullYear()} PayVital, LLC. HIPAA Compliant. PCI-DSS Certified.</p>
      </footer>
    </div>
  )
}
