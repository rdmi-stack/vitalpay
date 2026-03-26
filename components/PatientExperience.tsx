const benefits = [
  { icon: '📱', title: 'Clear statements', desc: 'Mobile-friendly bills that make sense. No PDFs.' },
  { icon: '💳', title: 'Flexible payments', desc: 'Pay in full, enroll in a plan, or use saved methods.' },
  { icon: '🌐', title: 'Pay anywhere', desc: 'Credit card, HSA, Apple Pay — no login required.' },
  { icon: '⚡', title: 'Zero friction', desc: 'Click, view, pay. Faster than any portal.' },
]

export default function PatientExperience() {
  return (
    <section id="patient-experience" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[600px] mb-14">
          <p className="text-primary font-semibold text-[15px] mb-4">Patient experience</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-brand-dark leading-tight mb-5">
            Easy for patients means better for everyone
          </h2>
          <p className="text-lg text-brand-500 leading-relaxed">
            When patients understand what they owe and pay in seconds, collections improve
            and satisfaction rises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((b) => (
            <div key={b.title} className="group">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="text-[16px] font-semibold text-brand-dark mb-2">{b.title}</h3>
              <p className="text-[15px] text-brand-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Two-Minute Rule — split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-brand-100 rounded-2xl overflow-hidden">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-brand-dark leading-tight mb-4">
              The &ldquo;Two-Minute Rule&rdquo;
            </h3>
            <p className="text-lg font-medium text-brand-dark mb-4">
              Faster payments aren&apos;t a goal. They&apos;re our standard.
            </p>
            <p className="text-[15px] text-brand-500 leading-relaxed mb-8">
              57 seconds. 104 seconds. 2 minutes or less. Every new PayVital customer
              sees their first payment within two minutes of going live.
            </p>
            <div className="flex gap-8">
              {[
                { v: '57s', l: 'Fastest' },
                { v: '2 min', l: 'Average' },
                { v: '85%', l: 'Collection rate' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-primary">{s.v}</div>
                  <div className="text-[13px] text-brand-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[300px] lg:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&crop=center"
              alt="Healthcare professional using PayVital"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
