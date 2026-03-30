'use client'

import { useState } from 'react'

const steps = [
  {
    title: 'Send a message',
    desc: 'Patients receive a branded text or email with a secure payment link. No app downloads, no portal accounts.',
    link: 'Learn more',
  },
  {
    title: 'Verify identity',
    desc: 'Date of birth is all it takes. No account creation, no usernames, no passwords. HIPAA-compliant.',
    link: 'Learn more',
  },
  {
    title: 'View & pay the bill',
    desc: 'A clean, mobile-friendly breakdown of what they owe and why. Pay in full, set up a plan, or use Apple Pay.',
    link: 'Learn more',
  },
  {
    title: 'Auto-post to your EMR',
    desc: 'Every payment is automatically reconciled in real time. No manual entry, no end-of-day batching.',
    link: 'Learn more',
  },
  {
    title: 'Track everything',
    desc: 'See every payment, message, and patient interaction in one dashboard. Real-time analytics and full audit trails.',
    link: 'Learn more',
  },
]

const screens = [
  // SMS
  { bg: '#1a1a2e', content: [
    { type: 'header', text: 'PayVital', sub: 'Automated Message' },
    { type: 'stat', items: [['98%', 'Open rate'], ['67%', 'Click rate'], ['2m', 'Avg response']] },
  ]},
  // Login
  { bg: '#ffffff', content: [
    { type: 'header', text: 'Secure Verification', sub: 'HIPAA-compliant identity check' },
    { type: 'stat', items: [['DOB', 'Verify'], ['1-tap', 'Access'], ['0', 'Passwords']] },
  ]},
  // Balance
  { bg: '#ffffff', content: [
    { type: 'header', text: '$245.00', sub: 'Valley Health — Office Visit' },
    { type: 'stat', items: [['Full', '$245'], ['3×', '$81.67'], ['6×', '$40.83']] },
  ]},
  // Posting
  { bg: '#1a1a2e', content: [
    { type: 'header', text: 'Auto-Posting', sub: 'Real-time EMR reconciliation' },
    { type: 'stat', items: [['100%', 'Auto-posted'], ['0', 'Manual entries'], ['<1s', 'Sync time']] },
  ]},
  // Dashboard
  { bg: '#1a1a2e', content: [
    { type: 'header', text: 'Collections', sub: 'March 2026' },
    { type: 'stat', items: [['$128K', 'Collected'], ['89%', 'Rate'], ['342', 'Bills']] },
  ]},
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const screen = screens[active]
  const isDark = screen.bg === '#1a1a2e'

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[500px] mb-14">
          <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">Patient Journey</p>
          <h2 id="how-it-works-heading" className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-brand-dark leading-[1.1]">
            See the whole payment flow click into place
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Accordion */}
          <div>
            {steps.map((step, i) => (
              <div key={step.title} className="border-b border-brand-100 last:border-b-0">
                <button
                  onClick={() => setActive(i)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4"
                >
                  <h3 className={`text-[1.1rem] font-bold transition-colors duration-200 ${active === i ? 'text-brand-dark' : 'text-brand-400'}`}>
                    {step.title}
                  </h3>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center">
                    {active === i ? (
                      <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
                    )}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${active === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                  <p className="text-[15px] text-brand-500 leading-relaxed mb-3 pr-8">{step.desc}</p>
                  <a href="#features" className="text-[14px] font-semibold text-brand-dark underline underline-offset-4 decoration-1 hover:text-primary transition-colors">
                    {step.link}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mockup card */}
          <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div
              className="w-full max-w-[440px] rounded-3xl p-8 transition-colors duration-300"
              style={{ backgroundColor: screen.bg }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <span className="text-primary font-bold text-lg">+</span>
                </div>
                <h4 className={`text-2xl font-extrabold mb-1 ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                  {screen.content[0].text}
                </h4>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-brand-400'}`}>
                  {screen.content[0].sub}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {screen.content[1].items?.map(([value, label]) => (
                  <div
                    key={label}
                    className={`rounded-2xl p-4 text-center ${isDark ? 'bg-white/[0.06]' : 'bg-brand-50'}`}
                  >
                    <p className={`text-xl font-extrabold mb-0.5 ${isDark ? 'text-primary' : 'text-primary'}`}>
                      {value}
                    </p>
                    <p className={`text-[11px] ${isDark ? 'text-white/40' : 'text-brand-400'}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visual bars */}
              <div className="flex items-end gap-1 mt-6 h-[60px]">
                {[30, 40, 35, 50, 45, 60, 55, 70, 65, 75, 70, 80, 78, 85, 82 + active * 2].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${isDark ? 'bg-primary/50' : 'bg-primary/30'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
