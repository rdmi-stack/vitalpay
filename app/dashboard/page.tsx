'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Stats {
  total_bills: number
  bills_this_month: number
  total_collected: number
  collected_this_month: number
  total_outstanding: number
  collection_rate: number
  total_patients: number
  active_payment_plans: number
  bill_status_counts: Record<string, number>
}

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    apiAuth<Stats>('/api/dashboard/stats').then(setStats).catch(console.error)
  }, [])

  if (!stats) {
    return <div className="text-brand-400">Loading stats...</div>
  }

  const cards = [
    { label: 'Total Collected', value: fmt(stats.total_collected), sub: `${fmt(stats.collected_this_month)} this month`, color: 'text-emerald-600' },
    { label: 'Outstanding', value: fmt(stats.total_outstanding), sub: `${stats.total_bills} total bills`, color: 'text-amber-600' },
    { label: 'Collection Rate', value: `${stats.collection_rate}%`, sub: `${stats.total_patients} patients`, color: 'text-primary' },
    { label: 'Payment Plans', value: String(stats.active_payment_plans), sub: `${stats.bills_this_month} bills this month`, color: 'text-blue-600' },
  ]

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-brand-100 p-5">
            <p className="text-[13px] text-brand-400 mb-1">{c.label}</p>
            <p className={`text-2xl font-extrabold ${c.color}`}>{c.value}</p>
            <p className="text-[12px] text-brand-300 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Bill status breakdown */}
      <div className="bg-white rounded-xl border border-brand-100 p-6">
        <h2 className="text-[15px] font-bold text-brand-dark mb-4">Bills by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats.bill_status_counts).map(([status, count]) => (
            <div key={status} className="text-center p-3 bg-brand-50 rounded-lg">
              <p className="text-xl font-bold text-brand-dark">{count}</p>
              <p className="text-[12px] text-brand-400 capitalize">{status.replace('_', ' ')}</p>
            </div>
          ))}
          {Object.keys(stats.bill_status_counts).length === 0 && (
            <p className="text-sm text-brand-400 col-span-full">No bills yet. Create your first bill to get started.</p>
          )}
        </div>
      </div>
    </div>
  )
}
