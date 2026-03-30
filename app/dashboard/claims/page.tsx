'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Claim {
  id: string
  patient_name: string
  payer: string
  amount: number
  denial_reason: string
  status: string
  recovered_amount: number
  created_at: string
}

interface Analytics {
  total_claims: number
  denied: number
  appealed: number
  recovered: number
  recovery_rate: number
  total_recovered_amount: number
  total_denied_amount: number
}

const emptyForm = {
  patient_name: '',
  payer: '',
  claim_number: '',
  amount: '',
  service_description: '',
  service_date: '',
  denial_reason: '',
  status: 'denied',
}

const statusColors: Record<string, string> = {
  filed: 'bg-gray-100 text-gray-600',
  denied: 'bg-red-100 text-red-600',
  appealed: 'bg-amber-100 text-amber-600',
  recovered: 'bg-emerald-100 text-emerald-600',
  written_off: 'bg-gray-100 text-gray-400',
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState('')
  const [appealModal, setAppealModal] = useState<{ id: string; letter: string } | null>(null)

  function loadData() {
    apiAuth<Claim[]>('/api/claims').then(setClaims).catch(console.error).finally(() => setLoading(false))
    apiAuth<Analytics>('/api/claims/analytics').then(setAnalytics).catch(console.error)
  }

  useEffect(() => { loadData() }, [])

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await apiAuth('/api/claims', {
        method: 'POST',
        body: { ...form, amount: parseFloat(form.amount) },
      })
      setShowModal(false)
      setForm(emptyForm)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create claim')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAnalyze(claimId: string) {
    setAnalyzing(claimId)
    try {
      await apiAuth('/api/claims/analyze', { method: 'POST', body: { claim_id: claimId } })
      loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing('')
    }
  }

  async function handleGenerateAppeal(claimId: string) {
    setAnalyzing(claimId)
    try {
      const res = await apiAuth<{ appeal_letter: string }>('/api/claims/generate-appeal', { method: 'POST', body: { claim_id: claimId } })
      setAppealModal({ id: claimId, letter: res.appeal_letter })
      loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing('')
    }
  }

  if (loading) return <div className="text-brand-400">Loading claims...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-brand-dark">ClaimPilot</h2>
          <p className="text-sm text-brand-400">AI-powered denial recovery</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + Add Claim
        </button>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <p className="text-[12px] text-brand-400 mb-1">Total Denied</p>
            <p className="text-xl font-bold text-red-600">${Math.round(analytics.total_denied_amount).toLocaleString()}</p>
            <p className="text-[11px] text-brand-300">{analytics.denied} claims</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <p className="text-[12px] text-brand-400 mb-1">Recovered</p>
            <p className="text-xl font-bold text-emerald-600">${Math.round(analytics.total_recovered_amount).toLocaleString()}</p>
            <p className="text-[11px] text-brand-300">{analytics.recovered} claims</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <p className="text-[12px] text-brand-400 mb-1">Recovery Rate</p>
            <p className="text-xl font-bold text-primary">{analytics.recovery_rate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <p className="text-[12px] text-brand-400 mb-1">Appealed</p>
            <p className="text-xl font-bold text-amber-600">{analytics.appealed}</p>
            <p className="text-[11px] text-brand-300">in progress</p>
          </div>
        </div>
      )}

      {/* Claims table */}
      {claims.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400 mb-2">No claims yet</p>
          <p className="text-[13px] text-brand-300">Add denied claims to start AI-powered recovery.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Payer</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-dark">{c.patient_name}</td>
                  <td className="px-4 py-3 text-brand-400">{c.payer}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">${c.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-brand-400 text-[13px] max-w-[200px] truncate">{c.denial_reason || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.status === 'denied' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAnalyze(c.id)} disabled={analyzing === c.id}
                          className="text-primary text-[12px] font-medium hover:underline disabled:opacity-50">
                          {analyzing === c.id ? 'Analyzing...' : 'AI Analyze'}
                        </button>
                        <button onClick={() => handleGenerateAppeal(c.id)} disabled={analyzing === c.id}
                          className="text-emerald-600 text-[12px] font-medium hover:underline disabled:opacity-50">
                          Generate Appeal
                        </button>
                      </div>
                    )}
                    {c.status === 'appealed' && (
                      <span className="text-amber-600 text-[12px]">Appeal sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Claim Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-brand-dark">Add Denied Claim</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-400 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Patient Name</label>
                  <input type="text" required value={form.patient_name} onChange={(e) => update('patient_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Payer / Insurance</label>
                  <input type="text" required value={form.payer} onChange={(e) => update('payer', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Claim Amount ($)</label>
                  <input type="number" required step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Service Date</label>
                  <input type="date" required value={form.service_date} onChange={(e) => update('service_date', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Service Description</label>
                <input type="text" required value={form.service_description} onChange={(e) => update('service_description', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Denial Reason</label>
                <textarea required rows={2} value={form.denial_reason} onChange={(e) => update('denial_reason', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-[14px] font-medium text-brand-500 hover:bg-brand-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appeal Letter Modal */}
      {appealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAppealModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[600px] mx-4 p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-dark">Generated Appeal Letter</h3>
              <button onClick={() => setAppealModal(null)} className="text-brand-400 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="bg-brand-50 rounded-xl p-5 text-[14px] text-brand-dark leading-relaxed whitespace-pre-wrap">
              {appealModal.letter}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigator.clipboard.writeText(appealModal.letter)} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors">
                Copy to Clipboard
              </button>
              <button onClick={() => setAppealModal(null)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-[14px] font-medium text-brand-500 hover:bg-brand-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
