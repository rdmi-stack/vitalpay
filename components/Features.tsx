const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    title: 'EHR Integration',
    desc: 'Works with Epic, Cerner, athenahealth, and more — no workflow disruption.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: 'Smart delivery',
    desc: 'Right message, right time. Text, email, or mail — all automated.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Payment automation',
    desc: 'Touchless plans, text-to-pay, and insurance payments. Zero busywork.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 10v4"/><path d="M8 12h8"/></svg>,
    title: 'Digital wallet',
    desc: 'Follows patients across providers. Pay anywhere without re-entering info.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Auto-posting',
    desc: 'Payments reconciled to your EMR in real time. No manual entry.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
    title: 'Live insights',
    desc: 'Track collections, engagement, and performance as it happens.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[600px] mb-14">
          <p className="text-primary font-semibold text-[15px] mb-4">Platform</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-brand-dark leading-tight mb-5">
            Everything you need to collect more
          </h2>
          <p className="text-lg text-brand-500 leading-relaxed">
            From front-desk workflows to back-end automation — built to perform without
            disrupting how you work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-100 rounded-2xl overflow-hidden border border-brand-100">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 hover:bg-brand-100/50 transition-colors duration-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-brand-dark mb-2">{f.title}</h3>
              <p className="text-[15px] text-brand-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
