'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Payment {
  id: string
  bill_id: string
  patient_id: string
  amount: number
  method: string
  status: string
  created_at: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiAuth<Payment[]>('/api/payments').then(setPayments).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-brand-400">Loading payments...</div>

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-dark mb-6">Payment History</h2>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400 mb-2">No payments yet</p>
          <p className="text-[13px] text-brand-300">Payments will appear here once patients start paying their bills.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 text-brand-dark">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-brand-400 capitalize">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
