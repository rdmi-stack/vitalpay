export default function AboutMission() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual — iPhone mockup */}
        <div aria-hidden="true" className="relative flex justify-center">
          <div className="relative">
            {/* Gradient background blob */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-[40px] blur-2xl" />

            {/* iPhone frame */}
            <div className="relative bg-[#e8e8ed] rounded-[44px] p-[10px] shadow-2xl ring-1 ring-black/10 w-[280px]">
              {/* Dynamic Island */}
              <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-10" />

              {/* Screen */}
              <div className="bg-white rounded-[34px] overflow-hidden">
                {/* Status bar */}
                <div className="px-7 pt-4 pb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-brand-dark">9:41</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-brand-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" /></svg>
                    <svg className="w-4 h-3 text-brand-dark" viewBox="0 0 25 12" fill="currentColor"><rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" /><rect x="1.5" y="2.5" width="16" height="7" rx="1" /><rect x="22" y="4" width="2" height="4" rx="0.5" /></svg>
                  </div>
                </div>

                {/* URL bar */}
                <div className="mx-5 mb-3 bg-gray-100 rounded-full px-3 py-1.5 flex items-center justify-center gap-1">
                  <svg className="w-2.5 h-2.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  <span className="text-[9px] text-brand-400">pay.payvital.com</span>
                </div>

                {/* App header */}
                <div className="px-5 pb-3 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center text-[9px] font-bold">+</span>
                    <span className="text-[13px] font-bold text-brand-dark">PayVital</span>
                  </div>
                  <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </div>

                {/* Content */}
                <div className="px-5 py-5">
                  <p className="text-[16px] font-bold text-brand-dark text-center mb-1">Hi Sarah,</p>
                  <p className="text-[10px] text-brand-500 text-center leading-relaxed mb-4">
                    You have 1 medical bill from Valley Health. If you need assistance, we&apos;re here to help.
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full">1 bill</span>
                    <span className="text-primary text-[9px] font-semibold">View details</span>
                  </div>

                  {/* Bill card */}
                  <div className="bg-brand-50 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] text-brand-400">Total due</span>
                      <span className="text-[22px] font-extrabold text-brand-dark">$245.00</span>
                    </div>
                    <div className="w-full bg-primary text-white text-[12px] font-semibold py-2.5 rounded-xl text-center">
                      Pay total: $245.00
                    </div>
                    <p className="text-[9px] text-brand-400 text-center mt-2 flex items-center justify-center gap-0.5">
                      More payment options
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </p>
                  </div>

                  <p className="text-[12px] font-bold text-brand-dark mb-2">Your medical bills</p>
                  <div className="bg-brand-50 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-brand-dark">Office Visit</p>
                      <p className="text-[9px] text-brand-400">Valley Health &middot; Feb 12</p>
                    </div>
                    <p className="text-[12px] font-bold text-brand-dark">$245.00</p>
                  </div>

                  <p className="text-primary text-[9px] font-medium flex items-center gap-1 mt-3">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Statement history
                  </p>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-[80px] h-[4px] bg-brand-dark/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Floating stat badges */}
            <div className="absolute -left-12 top-1/4 bg-white rounded-xl shadow-lg px-4 py-3 ring-1 ring-black/5">
              <div className="text-[20px] font-extrabold text-brand-dark">2 min</div>
              <div className="text-[10px] text-brand-400">Avg pay time</div>
            </div>
            <div className="absolute -right-10 top-2/3 bg-white rounded-xl shadow-lg px-4 py-3 ring-1 ring-black/5">
              <div className="text-[20px] font-extrabold text-accent">98%</div>
              <div className="text-[10px] text-brand-400">Satisfaction</div>
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
