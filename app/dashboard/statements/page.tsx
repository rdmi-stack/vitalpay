'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Statement {
  id: string
  bill_id: string
  patient_id: string
  channels: string[]
  type: string
  sent_at: string
  opened: boolean
  clicked: boolean
  paid: boolean
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiAuth<Statement[]>('/api/statements').then(setStatements).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-brand-400">Loading statements...</div>

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-dark mb-6">Sent Statements</h2>

      {statements.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400 mb-2">No statements sent yet</p>
          <p className="text-[13px] text-brand-300">Go to Bills and click &quot;Send&quot; to notify a patient about their bill.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Channels</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Sent</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Opened</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Clicked</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Paid</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((s) => (
                <tr key={s.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 capitalize font-medium text-brand-dark">{s.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {s.channels.map((ch) => (
                        <span key={ch} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ch === 'sms' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {ch.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-400 text-[13px]">{new Date(s.sent_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {s.opened ? <span className="text-emerald-500">Yes</span> : <span className="text-brand-300">No</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.clicked ? <span className="text-emerald-500">Yes</span> : <span className="text-brand-300">No</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.paid
                      ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Paid</span>
                      : <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Unpaid</span>}
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
