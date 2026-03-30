'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
  address: string | null
  created_at: string
}

const emptyForm = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  phone: '',
  email: '',
  address: '',
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function loadPatients() {
    apiAuth<Patient[]>('/api/patients').then(setPatients).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { loadPatients() }, [])

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await apiAuth('/api/patients', { method: 'POST', body: form })
      setShowModal(false)
      setForm(emptyForm)
      loadPatients()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-brand-400">Loading patients...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-dark">Patients</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + Add Patient
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400 mb-2">No patients yet</p>
          <p className="text-[13px] text-brand-300">Add your first patient to start sending bills.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">DOB</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Added</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-dark">{p.first_name} {p.last_name}</td>
                  <td className="px-4 py-3 text-brand-400">{p.email}</td>
                  <td className="px-4 py-3 text-brand-400">{p.phone}</td>
                  <td className="px-4 py-3 text-brand-400">{p.date_of_birth}</td>
                  <td className="px-4 py-3 text-brand-400 text-[12px]">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[480px] mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-brand-dark">Add New Patient</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-400 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">First Name</label>
                  <input type="text" required value={form.first_name} onChange={(e) => update('first_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Last Name</label>
                  <input type="text" required value={form.last_name} onChange={(e) => update('last_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Date of Birth</label>
                <input type="date" required value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Email</label>
                <input type="email" required placeholder="patient@email.com" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Phone</label>
                <input type="tel" required placeholder="+1 (555) 123-4567" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Address (optional)</label>
                <input type="text" placeholder="123 Main St, City, State" value={form.address} onChange={(e) => update('address', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-[14px] font-medium text-brand-500 hover:bg-brand-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
