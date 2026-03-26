export default function AboutMission() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual */}
        <div aria-hidden="true" className="relative rounded-2xl overflow-hidden bg-brand-dark aspect-[4/3]">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(99,91,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,212,170,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10 p-10 flex flex-col items-center justify-center h-full">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-[200px]">
              <div className="text-center">
                <div className="text-[13px] font-semibold text-brand-dark mb-1">Your Balance</div>
                <div className="text-2xl font-bold text-brand-dark">$245.00</div>
                <div className="text-[11px] text-brand-500 mt-1 mb-4">Valley Health — Office Visit</div>
                <div className="bg-primary text-white text-[13px] font-medium py-2 rounded-lg">Pay Now</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-center">
                <div className="text-lg font-bold text-white">2 min</div>
                <div className="text-[10px] text-white/50">Avg pay time</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-center">
                <div className="text-lg font-bold text-accent">98%</div>
                <div className="text-[10px] text-white/50">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-primary font-semibold text-[15px] mb-4">About PayVital</p>
          <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-brand-dark leading-tight mb-6">
            Our name says it all
          </h2>
          <p className="text-lg font-medium text-brand-dark mb-4 leading-relaxed">
            We don&apos;t try to do everything — just the things that get you paid faster,
            with less effort.
          </p>
          <p className="text-[16px] text-brand-500 leading-relaxed mb-8">
            At PayVital, we&apos;ve built a platform patients actually want to use — and
            healthcare organizations can count on. Our mission is simple: drive more revenue,
            in less time, with less work.
          </p>
          <div className="space-y-3">
            {[
              'Purpose-built for healthcare payments',
              'Live in minutes, not months',
              'HIPAA compliant and PCI DSS certified',
              'Proven 50% increase in collections',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                <span className="text-[15px] text-brand-700">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
