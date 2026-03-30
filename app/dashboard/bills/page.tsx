'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Bill {
  id: string
  patient_id: string
  amount: number
  amount_due: number
  service_description: string
  status: string
  due_date: string
  provider_name: string
  payment_link: string | null
  created_at: string
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-600',
  viewed: 'bg-amber-100 text-amber-600',
  paid: 'bg-emerald-100 text-emerald-600',
  overdue: 'bg-red-100 text-red-600',
  plan_active: 'bg-purple-100 text-purple-600',
}

const emptyForm = {
  patient_id: '',
  amount: '',
  service_description: '',
  service_date: '',
  insurance_adjustment: '0',
  due_date: '',
  provider_name: '',
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  function loadBills() {
    apiAuth<Bill[]>('/api/bills').then(setBills).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBills()
    apiAuth<Patient[]>('/api/patients').then(setPatients).catch(console.error)
  }, [])

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await apiAuth('/api/bills', {
        method: 'POST',
        body: {
          ...form,
          amount: parseFloat(form.amount),
          insurance_adjustment: parseFloat(form.insurance_adjustment || '0'),
        },
      })
      setShowModal(false)
      setForm(emptyForm)
      loadBills()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bill')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSendStatement(billId: string) {
    try {
      await apiAuth('/api/statements/send', { method: 'POST', body: { bill_id: billId, channels: ['sms', 'email'] } })
      loadBills()
    } catch (err) {
      console.error(err)
    }
  }

  function copyLink(link: string) {
    navigator.clipboard.writeText(`${window.location.origin}${link}`)
    setCopied(link)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) return <div className="text-brand-400">Loading bills...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-dark">All Bills</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + New Bill
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400 mb-2">No bills yet</p>
          <p className="text-[13px] text-brand-300">Create your first bill to start collecting payments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Due</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-dark">{bill.service_description}</td>
                  <td className="px-4 py-3">
                    <span className="text-brand-dark font-medium">${bill.amount_due.toFixed(2)}</span>
                    {bill.amount_due !== bill.amount && (
                      <span className="text-brand-300 text-[12px] ml-1">/ ${bill.amount.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-400">{bill.due_date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize ${statusColors[bill.status] || 'bg-gray-100 text-gray-600'}`}>
                      {bill.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {bill.payment_link && (
                        <button onClick={() => copyLink(bill.payment_link!)}
                          className="text-primary text-[12px] font-medium hover:underline">
                          {copied === bill.payment_link ? 'Copied!' : 'Copy link'}
                        </button>
                      )}
                      {bill.status === 'pending' && (
                        <button onClick={() => handleSendStatement(bill.id)}
                          className="text-emerald-600 text-[12px] font-medium hover:underline">
                          Send
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-brand-dark">Create New Bill</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-400 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Patient</label>
                <select required value={form.patient_id} onChange={(e) => update('patient_id', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Provider / Practice Name</label>
                <input type="text" required placeholder="e.g. Valley Health" value={form.provider_name} onChange={(e) => update('provider_name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Service Description</label>
                <input type="text" required placeholder="e.g. Office Visit, Lab Work" value={form.service_description} onChange={(e) => update('service_description', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Amount ($)</label>
                  <input type="number" required step="0.01" min="0" placeholder="245.00" value={form.amount} onChange={(e) => update('amount', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Insurance Adj. ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="0" value={form.insurance_adjustment} onChange={(e) => update('insurance_adjustment', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Service Date</label>
                  <input type="date" required value={form.service_date} onChange={(e) => update('service_date', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Due Date</label>
                  <input type="date" required value={form.due_date} onChange={(e) => update('due_date', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-[14px] font-medium text-brand-500 hover:bg-brand-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
