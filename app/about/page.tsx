import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const values = [
  { title: 'Patients First', desc: 'Every feature starts with the question: does this make it easier for the patient to understand and pay their bill?' },
  { title: 'Revenue, Not Revenue Cycle', desc: 'We focus on outcomes — dollars collected, days reduced — not dashboards and reports.' },
  { title: 'Radical Simplicity', desc: 'If it takes more than 2 minutes, we failed. Every flow is designed for speed and clarity.' },
  { title: 'Healthcare-Native', desc: 'Built by people who understand HIPAA, EHRs, denial codes, and the billing workflow inside out.' },
]

const stats = [
  { value: '85%', label: 'Average collection rate' },
  { value: '<2 min', label: 'Patient time to pay' },
  { value: '50%', label: 'Revenue increase' },
  { value: '56 hrs', label: 'Staff hours saved/month' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-brand-dark">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">About PayVital</p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-white leading-tight mb-5">
              We&apos;re fixing healthcare payments
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-[560px] mx-auto">
              Healthcare billing is broken. Patients are confused, staff are overwhelmed, and providers lose billions in uncollected revenue. We built PayVital to change that.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Our Mission</h2>
                <p className="text-brand-500 leading-relaxed mb-4">
                  Every healthcare provider deserves to get paid for the care they deliver. Every patient deserves a billing experience that&apos;s clear, simple, and respectful.
                </p>
                <p className="text-brand-500 leading-relaxed">
                  PayVital is the bridge — an AI-powered platform that gets providers paid faster while giving patients a modern, frictionless payment experience. No more paper statements. No more confusing portals. No more 45-day collection cycles.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-brand-50 rounded-xl p-5 text-center">
                    <p className="text-2xl font-extrabold text-primary mb-1">{s.value}</p>
                    <p className="text-[12px] text-brand-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-brand-50">
          <div className="max-w-[900px] mx-auto px-6">
            <h2 className="text-2xl font-bold text-brand-dark text-center mb-12">What We Believe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-xl p-6 border border-brand-100">
                  <h3 className="font-bold text-brand-dark mb-2">{v.title}</h3>
                  <p className="text-[14px] text-brand-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-[600px] mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Ready to modernize your billing?</h2>
            <p className="text-brand-500 mb-8">Join hundreds of healthcare organizations collecting more, faster, with less effort.</p>
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
