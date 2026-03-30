'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Analytics {
  total_calls: number
  inbound: number
  outbound: number
  paid_via_call: number
  escalated: number
  conversion_rate: number
  active_campaigns: number
}

interface Call {
  id: string
  patient_phone: string
  direction: string
  duration: number
  outcome: string
  created_at: string
}

interface Campaign {
  id: string
  name: string
  type: string
  status: string
  stats: { total: number; completed: number; paid: number }
  created_at: string
}

export default function VoiceDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [calls, setCalls] = useState<Call[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    apiAuth<Analytics>('/api/voice/analytics').then(setAnalytics).catch(console.error)
    apiAuth<Call[]>('/api/voice/calls?limit=10').then(setCalls).catch(console.error)
    apiAuth<Campaign[]>('/api/voice/campaigns').then(setCampaigns).catch(console.error)
  }, [])

  const statCards = analytics ? [
    { label: 'Total Calls', value: analytics.total_calls, color: 'text-brand-dark' },
    { label: 'Inbound', value: analytics.inbound, color: 'text-blue-600' },
    { label: 'Outbound', value: analytics.outbound, color: 'text-purple-600' },
    { label: 'Paid via Call', value: analytics.paid_via_call, color: 'text-emerald-600' },
    { label: 'Conversion', value: `${analytics.conversion_rate}%`, color: 'text-primary' },
    { label: 'Active Campaigns', value: analytics.active_campaigns, color: 'text-amber-600' },
  ] : []

  const outcomeColors: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-600',
    plan_setup: 'bg-blue-100 text-blue-600',
    escalated: 'bg-red-100 text-red-600',
    completed: 'bg-gray-100 text-gray-600',
    sms_sent: 'bg-purple-100 text-purple-600',
    no_answer: 'bg-amber-100 text-amber-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-brand-dark">AI Voice Agent</h2>
          <p className="text-sm text-brand-400">Inbound & outbound call management</p>
        </div>
        <button className="bg-primary text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + New Campaign
        </button>
      </div>

      {/* Stats */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-brand-100 p-4">
              <p className="text-[12px] text-brand-400 mb-1">{c.label}</p>
              <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent calls */}
        <div className="bg-white rounded-xl border border-brand-100 p-5">
          <h3 className="font-semibold text-brand-dark mb-4">Recent Calls</h3>
          {calls.length === 0 ? (
            <p className="text-sm text-brand-400">No calls yet.</p>
          ) : (
            <div className="space-y-3">
              {calls.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-brand-50 last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-brand-dark">{c.patient_phone}</p>
                    <p className="text-[11px] text-brand-400">{c.direction} &middot; {c.duration}s</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${outcomeColors[c.outcome] || 'bg-gray-100 text-gray-600'}`}>
                    {c.outcome.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaigns */}
        <div className="bg-white rounded-xl border border-brand-100 p-5">
          <h3 className="font-semibold text-brand-dark mb-4">Campaigns</h3>
          {campaigns.length === 0 ? (
            <p className="text-sm text-brand-400">No campaigns yet.</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-brand-50 last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-brand-dark">{c.name}</p>
                    <p className="text-[11px] text-brand-400">{c.type} &middot; {c.stats.completed}/{c.stats.total} completed</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${c.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
