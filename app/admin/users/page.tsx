'use client'

import { useState, useEffect } from 'react'
import { apiAuth } from '@/lib/api'

interface User {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  is_active: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'provider', first_name: '', last_name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function loadUsers() {
    apiAuth<User[]>('/api/admin/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await apiAuth('/api/admin/users', { method: 'POST', body: form })
      setShowModal(false)
      setForm({ email: '', password: '', role: 'provider', first_name: '', last_name: '' })
      loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(userId: string, currentlyActive: boolean) {
    try {
      await apiAuth(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        body: { is_active: !currentlyActive },
      })
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-600',
    provider: 'bg-blue-100 text-blue-600',
    patient: 'bg-emerald-100 text-emerald-600',
  }

  if (loading) return <div className="text-brand-400">Loading users...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-dark">User Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + Create User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-100 p-12 text-center">
          <p className="text-brand-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-brand-100 text-left">
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 font-medium text-brand-400 text-[12px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-dark">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3 text-brand-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${u.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-400 text-[12px]">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(u.id, u.is_active)}
                      className={`text-[12px] font-medium hover:underline ${u.is_active ? 'text-red-500' : 'text-emerald-600'}`}>
                      {u.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[450px] mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-brand-dark">Create User</h3>
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
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-brand-dark mb-1">Last Name</label>
                  <input type="text" required value={form.last_name} onChange={(e) => update('last_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Email</label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-brand-dark mb-1">Role</label>
                <select required value={form.role} onChange={(e) => update('role', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-[14px] font-medium text-brand-500 hover:bg-brand-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
