'use client'

import { useState } from 'react'

const steps = [
  {
    title: 'Send a message',
    desc: 'Patients receive a branded text or email with a secure payment link. No app downloads, no portal accounts — just a simple tap to get started.',
    link: 'Learn more',
    screen: 'sms',
  },
  {
    title: 'Verify identity',
    desc: 'Date of birth is all it takes. No account creation, no usernames, no passwords. Secure and HIPAA-compliant verification in seconds.',
    link: 'Learn more',
    screen: 'login',
  },
  {
    title: 'View & pay the bill',
    desc: 'A clean, mobile-friendly breakdown of what they owe and why. Patients can pay in full, set up a plan, or use saved methods like HSA and Apple Pay.',
    link: 'Learn more',
    screen: 'balance',
  },
  {
    title: 'Auto-post to your EMR',
    desc: 'Every payment is automatically reconciled in real time. No manual entry, no end-of-day batching, no reconciliation headaches.',
    link: 'Learn more',
    screen: 'posting',
  },
  {
    title: 'Track everything',
    desc: 'See every payment, message, and patient interaction in one dashboard. Real-time analytics, exportable reports, and full audit trails.',
    link: 'Learn more',
    screen: 'dashboard',
  },
]

/* ── Screen Mockups ── */

function SmsScreen() {
  return (
    <div className="w-full h-full bg-[#1a1a2e] rounded-2xl p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">+</div>
        <div>
          <div className="text-white text-sm font-semibold">PayVital</div>
          <div className="text-white/40 text-xs">Automated Message</div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 space-y-3">
        <div className="bg-white/10 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
          <p className="text-white/90 text-xs leading-relaxed">
            Hi Sarah, you have a new bill from <span className="font-semibold text-white">Valley Health</span> for $245.00.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
          <p className="text-white/90 text-xs leading-relaxed">
            Tap to view &amp; pay securely:
          </p>
          <p className="text-primary text-xs mt-1 underline">pay.payvital.com/x7k</p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
        <div>
          <div className="text-primary text-lg font-bold">98%</div>
          <div className="text-white/40 text-[10px]">Open rate</div>
        </div>
        <div>
          <div className="text-primary text-lg font-bold">67%</div>
          <div className="text-white/40 text-[10px]">Click rate</div>
        </div>
        <div>
          <div className="text-primary text-lg font-bold">2m</div>
          <div className="text-white/40 text-[10px]">Avg. response</div>
        </div>
      </div>
    </div>
  )
}

function LoginScreen() {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-6 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
      </div>
      <div className="text-lg font-bold text-brand-dark mb-1">Secure Verification</div>
      <div className="text-sm text-brand-400 mb-6">HIPAA-compliant identity check</div>
      <div className="w-full space-y-3">
        <div className="w-full border border-brand-200 rounded-xl p-3 text-sm text-brand-400">
          Date of Birth
        </div>
        <div className="w-full border-2 border-primary rounded-xl p-3 text-sm text-brand-dark font-semibold bg-primary/5">
          03 / 15 / 1988
        </div>
        <div className="w-full bg-primary text-white text-sm font-semibold text-center py-3 rounded-xl">
          Continue
        </div>
      </div>
    </div>
  )
}

function BalanceScreen() {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-6 flex flex-col">
      <div className="text-center mb-5">
        <div className="text-xs text-brand-400 uppercase tracking-wider mb-1">Amount Due</div>
        <div className="text-4xl font-extrabold text-brand-dark">$245<span className="text-xl">.00</span></div>
      </div>
      <div className="space-y-3 mb-5">
        {[
          ['Provider', 'Valley Health'],
          ['Service', 'Office Visit'],
          ['Date', 'Feb 12, 2026'],
          ['Insurance', 'Applied — $55 adj.'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-brand-400">{k}</span>
            <span className="text-brand-dark font-medium">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-2">
        <div className="w-full border-2 border-primary bg-primary/5 text-primary font-semibold text-sm text-center py-2.5 rounded-xl">
          Pay in Full — $245.00
        </div>
        <div className="w-full border border-brand-200 text-brand-600 text-sm text-center py-2.5 rounded-xl">
          Payment Plan — 3× $81.67
        </div>
        <div className="flex gap-2">
          <span className="flex-1 bg-brand-50 text-brand-500 text-xs px-2 py-2 rounded-lg text-center font-medium">Visa ••4242</span>
          <span className="flex-1 bg-brand-50 text-brand-500 text-xs px-2 py-2 rounded-lg text-center font-medium">Apple Pay</span>
          <span className="flex-1 bg-brand-50 text-brand-500 text-xs px-2 py-2 rounded-lg text-center font-medium">HSA</span>
        </div>
      </div>
    </div>
  )
}

function PostingScreen() {
  return (
    <div className="w-full h-full bg-[#1a1a2e] rounded-2xl p-6 flex flex-col">
      <div className="text-white text-sm font-semibold mb-1">Auto-Posting</div>
      <div className="text-white/40 text-xs mb-5">Real-time EMR reconciliation</div>
      {/* Flow diagram */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {[
          { label: 'Payment Received', status: 'done', time: '2:14 PM' },
          { label: 'Verified & Matched', status: 'done', time: '2:14 PM' },
          { label: 'Posted to EMR', status: 'done', time: '2:14 PM' },
          { label: 'Patient Notified', status: 'done', time: '2:15 PM' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <div className="flex-1">
              <div className="text-white/90 text-xs font-medium">{item.label}</div>
            </div>
            <div className="text-white/30 text-[10px]">{item.time}</div>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
        <div>
          <div className="text-emerald-400 text-lg font-bold">100%</div>
          <div className="text-white/40 text-[10px]">Auto-posted</div>
        </div>
        <div>
          <div className="text-emerald-400 text-lg font-bold">0</div>
          <div className="text-white/40 text-[10px]">Manual entries</div>
        </div>
      </div>
    </div>
  )
}

function DashboardScreen() {
  return (
    <div className="w-full h-full bg-[#1a1a2e] rounded-2xl p-6 flex flex-col">
      <div className="text-white text-sm font-semibold mb-1">Collections Dashboard</div>
      <div className="text-white/40 text-xs mb-5">March 2026</div>
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/[0.06] rounded-xl p-3">
          <div className="text-primary text-xl font-bold">$128K</div>
          <div className="text-white/40 text-[10px]">Collected</div>
        </div>
        <div className="bg-white/[0.06] rounded-xl p-3">
          <div className="text-emerald-400 text-xl font-bold">89%</div>
          <div className="text-white/40 text-[10px]">Collection rate</div>
        </div>
      </div>
      {/* Mini chart bars */}
      <div className="flex-1 flex items-end gap-1.5 mb-4">
        {[40, 55, 45, 65, 50, 70, 60, 80, 75, 85, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-primary/60" style={{ height: `${h}%` }} />
        ))}
      </div>
      {/* Recent */}
      <div className="space-y-2 pt-3 border-t border-white/10">
        {[
          ['Sarah M.', '$245.00', 'Paid'],
          ['James K.', '$180.00', 'Paid'],
          ['Lisa R.', '$320.00', 'Plan'],
        ].map(([name, amt, status]) => (
          <div key={name} className="flex items-center justify-between text-xs">
            <span className="text-white/70">{name}</span>
            <span className="text-white/90 font-medium">{amt}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const screenComponents: Record<string, React.ReactNode> = {
  sms: <SmsScreen />,
  login: <LoginScreen />,
  balance: <BalanceScreen />,
  posting: <PostingScreen />,
  dashboard: <DashboardScreen />,
}

export default function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-[500px] mb-14">
          <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">Patient Journey</p>
          <h2 id="how-it-works-heading" className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-brand-dark leading-[1.1]">
            See the whole payment flow click into place
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
          {/* Left: Accordion */}
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
                  <p className="text-[15px] text-brand-500 leading-relaxed mb-3 pr-8">
                    {step.desc}
                  </p>
                  <a href="#features" className="text-[14px] font-semibold text-brand-dark underline underline-offset-4 decoration-1 hover:text-primary transition-colors">
                    {step.link}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right: App mockup */}
          <div className="flex justify-center lg:justify-end lg:pl-8 mt-8 lg:mt-0">
            <div className="relative w-full max-w-[480px]">
              {/* Background shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl" />
              {/* Mockup card */}
              <div className="relative p-6">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  {screenComponents[steps[active].screen]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
