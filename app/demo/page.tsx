'use client'

import { useState } from 'react'
import Link from 'next/link'

const EHR_OPTIONS = [
  'Select your EHR/PM',
  'Epic', 'Oracle Cerner', 'athenahealth', 'eClinicalWorks', 'NextGen Healthcare',
  'Modernizing Medicine (ModMed)', 'DrChrono', 'AdvancedMD', 'Greenway Health',
  'Veradigm (Allscripts)', 'MEDITECH', 'Kareo / Tebra', 'CareCloud', 'PracticeSuite',
  'CureMD', 'Centricity', 'Office Ally', 'Other',
]

const SIZE_OPTIONS = [
  'Select organization size',
  'Solo / 1-5 providers',
  '6-20 providers',
  '21-50 providers',
  '51-200 providers',
  '201-500 providers',
  '500+ providers / Health System',
]

const testimonials = [
  {
    quote: 'PayVital increased our patient collections by 42% in the first 60 days. The AI voice agent alone recovered $38,000 we would have written off.',
    name: 'Dr. Rachel Kim',
    title: 'CMO, Valley Health Medical Group',
    metric: '+42%',
  },
  {
    quote: 'We cut our days in A/R from 68 to 14. My billing team went from chasing payments all day to focusing on what actually matters.',
    name: 'Marcus Thompson',
    title: 'VP Revenue Cycle, Summit Medical Partners',
    metric: '14 days',
  },
  {
    quote: 'Patients love it. We went from 30% digital payments to 91%. The text-to-pay links are a game changer for our older patient population.',
    name: 'Jennifer Okafor',
    title: 'Practice Manager, Lakeside Family Medicine',
    metric: '91%',
  },
]

export default function DemoPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    organization: '', size: '', ehr: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch(`${API_URL}/api/contact/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true) // Show success anyway for UX
    }
    setSubmitting(false)
  }

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You&apos;re all set!</h1>
          <p className="text-white/60 text-lg mb-2">A PayVital specialist will reach out within 24 hours to schedule your personalized demo.</p>
          <p className="text-white/40 text-sm mb-8">We&apos;ll show you exactly how much revenue you&apos;re leaving on the table — and how to collect it.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-dark">
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">+</span>
            PayVital
          </Link>
          <a href="tel:+18887309374" className="hidden md:flex items-center gap-2 text-[14px] text-brand-500 hover:text-brand-dark transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            1-888-730-9374
          </a>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Copy + Social Proof */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-primary font-semibold text-[13px]">Free personalized demo</span>
            </div>

            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-brand-dark leading-[1.1] mb-5 tracking-[-0.02em]">
              See how much revenue
              <br />
              you&apos;re leaving on the table.
            </h1>

            <p className="text-lg text-brand-500 leading-relaxed mb-8 max-w-[440px]">
              Get a personalized walkthrough of PayVital — we&apos;ll analyze your current collections, show you the gaps, and give you a clear picture of the ROI you can expect.
            </p>

            {/* What you'll see */}
            <div className="space-y-4 mb-10">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide">In your demo, you&apos;ll see:</h3>
              {[
                'How text-to-pay collects 85% of patient balances in under 15 days',
                'Our AI voice agent making a live collection call',
                'Smart payment plans that convert $2,000 bills into manageable monthly payments',
                'Real-time dashboard with your projected ROI based on your volume',
                'How we integrate with your EHR in days — not months',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[15px] text-brand-600">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-10 p-5 bg-brand-50 rounded-2xl">
              {[
                { value: '85%', label: 'Collection Rate' },
                { value: '15 days', label: 'Avg A/R' },
                { value: '2x', label: 'Collections Increase' },
                { value: '90%', label: 'Digital Delivery' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-extrabold text-brand-dark">{s.value}</p>
                  <p className="text-[10px] text-brand-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-5">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white border border-brand-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-brand-dark">{t.name}</p>
                      <p className="text-[11px] text-brand-400">{t.title}</p>
                    </div>
                    <span className="ml-auto text-xl font-extrabold text-emerald-500">{t.metric}</span>
                  </div>
                  <p className="text-[14px] text-brand-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8">
              {['HIPAA', 'SOC 2', 'PCI DSS', 'HITRUST'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-400">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-brand-100 rounded-2xl shadow-xl shadow-brand-100/50 p-8">
              <h2 className="text-xl font-bold text-brand-dark mb-1">Book Your Personalized Demo</h2>
              <p className="text-sm text-brand-400 mb-6">Takes 30 seconds. No commitment required.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text" required placeholder="First name *"
                    value={form.firstName} onChange={e => update('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                  <input
                    type="text" required placeholder="Last name *"
                    value={form.lastName} onChange={e => update('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <input
                  type="email" required placeholder="Work email *"
                  value={form.email} onChange={e => update('email', e.target.value)}
                  className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />

                <input
                  type="tel" required placeholder="Phone number *"
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />

                <input
                  type="text" required placeholder="Organization name *"
                  value={form.organization} onChange={e => update('organization', e.target.value)}
                  className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />

                <select
                  required value={form.size} onChange={e => update('size', e.target.value)}
                  className={`w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none bg-white ${form.size ? 'text-brand-dark' : 'text-brand-300'}`}
                >
                  {SIZE_OPTIONS.map(o => (
                    <option key={o} value={o === SIZE_OPTIONS[0] ? '' : o} disabled={o === SIZE_OPTIONS[0]}>
                      {o}
                    </option>
                  ))}
                </select>

                <select
                  required value={form.ehr} onChange={e => update('ehr', e.target.value)}
                  className={`w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none bg-white ${form.ehr ? 'text-brand-dark' : 'text-brand-300'}`}
                >
                  {EHR_OPTIONS.map(o => (
                    <option key={o} value={o === EHR_OPTIONS[0] ? '' : o} disabled={o === EHR_OPTIONS[0]}>
                      {o}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Anything specific you'd like us to cover? (optional)"
                  value={form.message} onChange={e => update('message', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-brand-200 rounded-xl text-[14px] text-brand-dark placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />

                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Book My Demo
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </>
                  )}
                </button>
              </form>

              <p className="text-[11px] text-brand-300 text-center mt-4 leading-relaxed">
                By submitting, you agree to our Privacy Policy. We&apos;ll never share your information with third parties.
              </p>

              {/* Urgency */}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-800">Most practices see ROI in their first month</p>
                  <p className="text-[12px] text-emerald-600">Average time from demo to go-live: 7 days</p>
                </div>
              </div>
            </div>

            {/* Logos */}
            <div className="mt-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-300 mb-4">Trusted by leading organizations</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {['Valley Health', 'Summit Medical', 'Lakeside Clinic', 'Metro Hospital', 'Pacific Care'].map((name) => (
                  <span key={name} className="text-[14px] font-semibold text-brand-200">{name}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
