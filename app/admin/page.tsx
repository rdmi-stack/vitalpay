'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Stats {
  total_bills: number
  total_collected: number
  total_outstanding: number
  collection_rate: number
  total_patients: number
  active_payment_plans: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    apiAuth<Stats>('/api/dashboard/stats').then(setStats).catch(console.error)
  }, [])

  if (!stats) return <div className="text-brand-400">Loading...</div>

  const cards = [
    { label: 'Total Collected', value: `$${Math.round(stats.total_collected).toLocaleString()}`, color: 'text-emerald-600' },
    { label: 'Outstanding', value: `$${Math.round(stats.total_outstanding).toLocaleString()}`, color: 'text-amber-600' },
    { label: 'Collection Rate', value: `${stats.collection_rate}%`, color: 'text-primary' },
    { label: 'Total Bills', value: String(stats.total_bills), color: 'text-brand-dark' },
    { label: 'Total Patients', value: String(stats.total_patients), color: 'text-brand-dark' },
    { label: 'Active Plans', value: String(stats.active_payment_plans), color: 'text-blue-600' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-dark mb-6">System Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-brand-100 p-5">
            <p className="text-[13px] text-brand-400 mb-1">{c.label}</p>
            <p className={`text-2xl font-extrabold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
