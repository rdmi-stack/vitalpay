import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const verticals = [
  {
    name: 'Health Systems',
    desc: 'Enterprise-grade patient payments for multi-facility health systems. Centralized billing, unified reporting, and consistent patient experience across all locations.',
    stats: [['$2.4M', 'Avg monthly collections'], ['89%', 'Collection rate'], ['12 days', 'Avg time to pay']],
    features: ['Multi-facility consolidation', 'Centralized reporting dashboard', 'EMR integration (Epic, Cerner)', 'Custom branding per facility'],
  },
  {
    name: 'Medical Groups',
    desc: 'Streamlined billing for multi-provider practices. One platform for all providers, unified patient experience, and group-level analytics.',
    stats: [['50%', 'Revenue increase'], ['3x', 'Faster collections'], ['56 hrs', 'Staff time saved/month']],
    features: ['Provider-level reporting', 'Shared patient records', 'Automated statement delivery', 'Payment plan management'],
  },
  {
    name: 'Specialty Practices',
    desc: 'Purpose-built for high-balance specialties — orthopedics, cardiology, oncology, dermatology. Handle complex billing with simple patient payments.',
    stats: [['$850', 'Avg bill handled'], ['92%', 'Patient satisfaction'], ['40%', 'Fewer phone calls']],
    features: ['High-balance payment plans', 'Insurance adjustment handling', 'Specialty-specific workflows', 'Pre-visit cost estimates'],
  },
  {
    name: 'Urgent Care',
    desc: 'Fast payments for fast care. Point-of-service collection, text-to-pay follow-up, and automated reminders for walk-in patients.',
    stats: [['<2 min', 'Time to pay'], ['78%', 'Self-service rate'], ['$195', 'Avg collection']],
    features: ['Point-of-service payments', 'Walk-in patient capture', 'Same-day text-to-pay', 'No patient portal needed'],
  },
  {
    name: 'Dental Practices',
    desc: 'Modern billing for dental offices. Handle insurance estimates, patient portions, and flexible payment plans for cosmetic and restorative procedures.',
    stats: [['85%', 'Collection rate'], ['$320', 'Avg plan amount'], ['2x', 'Plan enrollment']],
    features: ['Treatment plan financing', 'Insurance estimate integration', 'Family account linking', 'Automated recall reminders'],
  },
  {
    name: 'Behavioral Health',
    desc: 'Sensitive, patient-centered billing for mental health and substance abuse treatment. Discreet statements, flexible plans, and compassionate collections.',
    stats: [['70%', 'Reduction in no-shows'], ['3x', 'Plan adoption'], ['95%', 'Patient retention']],
    features: ['Discreet billing statements', 'Sliding-scale support', 'Recurring session billing', 'Financial assistance screening'],
  },
]

export default function WhoWeServePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-brand-dark">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">Who We Serve</p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-white leading-tight mb-5">
              Built for every type of healthcare organization
            </h1>
            <p className="text-lg text-white/50 max-w-[560px] mx-auto">
              From single practices to health systems — PayVital adapts to your size, specialty, and workflow.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 space-y-20">
            {verticals.map((v, i) => (
              <div key={v.name} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">{v.name}</h2>
                  <p className="text-brand-500 leading-relaxed mb-6">{v.desc}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {v.stats.map(([value, label]) => (
                      <div key={label}>
                        <p className="text-xl font-extrabold text-primary">{value}</p>
                        <p className="text-[11px] text-brand-400">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {v.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        <span className="text-[14px] text-brand-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`bg-brand-50 rounded-2xl p-8 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-xs font-bold">+</span>
                      <span className="font-bold text-brand-dark text-sm">{v.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {v.stats.map(([value, label]) => (
                        <div key={label} className="bg-brand-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-primary">{value}</p>
                          <p className="text-[10px] text-brand-400">{label}</p>
                        </div>
                      ))}
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="text-lg font-bold text-emerald-600">Active</p>
                        <p className="text-[10px] text-brand-400">Platform status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-brand-50">
          <div className="max-w-[600px] mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Don&apos;t see your specialty?</h2>
            <p className="text-brand-500 mb-8">PayVital works for any healthcare organization that sends patient bills. Let&apos;s talk about your specific needs.</p>
            <a href="/#contact" className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all">
              Book a Demo
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
