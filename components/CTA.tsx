'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

const ehrOptions = ['Epic', 'Cerner', 'athenahealth', 'eClinicalWorks', 'NextGen', 'Allscripts', 'DrChrono', 'Other']

export default function CTA() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', organization: '', ehr_system: '', provider_count: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api('/api/contact/demo', { method: 'POST', body: form })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-brand-dark">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">Get Started</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white leading-[1.1] mb-5">
              See what PayVital can do for your practice
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Book a personalized demo and discover how much more revenue you could be collecting.
            </p>

            <div className="space-y-4">
              {[
                { icon: '⚡', text: 'Live demo with your own data' },
                { icon: '📊', text: 'Custom ROI projection for your practice' },
                { icon: '🚀', text: 'Go live in under 2 weeks' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-white/70 text-[15px]">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/30 text-[13px] mb-2">Or call us directly</p>
              <a href="tel:+18887309374" className="text-white font-semibold text-lg hover:text-primary transition-colors">(888) 730-9374</a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">Thank you!</h3>
                <p className="text-brand-500 text-[15px]">Our team will reach out within 24 hours to schedule your demo.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-brand-dark mb-1">Book a Demo</h3>
                <p className="text-[14px] text-brand-400 mb-6">Fill out the form and we&apos;ll be in touch shortly.</p>

                {error && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="First name" value={form.first_name} onChange={(e) => update('first_name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="text" required placeholder="Last name" value={form.last_name} onChange={(e) => update('last_name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <input type="email" required placeholder="Work email" value={form.email} onChange={(e) => update('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <input type="text" required placeholder="Organization name" value={form.organization} onChange={(e) => update('organization', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={form.ehr_system} onChange={(e) => update('ehr_system', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="">EHR System</option>
                      {ehrOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={form.provider_count} onChange={(e) => update('provider_count', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value=""># of Providers</option>
                      <option value="1-5">1-5</option>
                      <option value="6-20">6-20</option>
                      <option value="21-50">21-50</option>
                      <option value="51-100">51-100</option>
                      <option value="100+">100+</option>
                    </select>
                  </div>
                  <textarea placeholder="Anything else we should know? (optional)" value={form.message} onChange={(e) => update('message', e.target.value)} rows={3}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-200 text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                  <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all text-[15px] disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Request a Demo'}
                  </button>
                  <p className="text-[11px] text-brand-300 text-center">
                    By submitting, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
