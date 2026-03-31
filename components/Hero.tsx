import VoiceAgentWrapper from './VoiceAgentWrapper'

export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop&crop=center"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,91,255,0.25), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,212,170,0.15), transparent)',
          }}
        />

        <div className="relative z-10 max-w-[1300px] mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-primary font-semibold text-[15px] mb-5 tracking-wide uppercase">
                The AI Patient Payment Platform
              </p>
              <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[1.05] text-white mb-6 tracking-[-0.03em]">
                Collect more.
                <br />
                Collect faster.
                <br />
                <span className="text-primary">Automatically.</span>
              </h1>
              <p className="text-lg text-white/50 leading-relaxed mb-5 max-w-[480px]">
                PayVital combines text-to-pay, AI voice agents, and smart payment plans into one platform — accelerating cash flow, reducing cost to collect, and delivering a billing experience patients actually like.
              </p>
              <p className="text-[15px] text-white/70 font-medium mb-8 max-w-[480px]">
                Works seamlessly with any EHR. HIPAA compliant. Live in days.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="/demo"
                  className="inline-flex items-center gap-2 bg-white text-brand-dark font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-white/90 transition-all duration-200"
                >
                  Book a Demo
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white font-medium text-[15px] px-7 py-3.5 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-200"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-emerald-400">85%</span>
                  <span className="text-[11px] text-white/40">collection rate</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-primary">15 days</span>
                  <span className="text-[11px] text-white/40">avg A/R</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-white">2x</span>
                  <span className="text-[11px] text-white/40">patient collections</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-white/90">90%</span>
                  <span className="text-[11px] text-white/40">digital delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Product Mockup + Voice Widget */}
            <div className="relative flex justify-center lg:block">
              {/* iPad Device Frame — hidden on mobile */}
              <div className="hidden lg:block bg-[#e8e8ed] rounded-[20px] p-[10px] shadow-2xl w-full max-w-[520px] ring-1 ring-black/10">
                {/* iPad bezel top — camera */}
                <div className="flex justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#d1d1d6] ring-1 ring-[#c0c0c5]" />
                </div>
                {/* iPad screen */}
                <div className="bg-white rounded-[10px] overflow-hidden">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">+</span>
                      <span className="text-[13px] font-bold text-brand-dark">PayVital</span>
                    </div>
                    <span className="text-[11px] text-brand-400">Reporting</span>
                  </div>

                  <div className="p-5">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[
                        { value: '$2.4M', label: 'Billed', color: 'text-brand-dark' },
                        { value: '$1.9M', label: 'Collected', color: 'text-brand-dark' },
                        { value: '85.2%', label: 'Collection Rate', color: 'text-emerald-600' },
                        { value: '91.4%', label: 'Resolution Rate', color: 'text-primary' },
                      ].map((s) => (
                        <div key={s.label}>
                          <p className={`text-[18px] font-extrabold ${s.color}`}>{s.value}</p>
                          <p className="text-[9px] text-brand-400">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-brand-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-brand-dark">Collection Rate</span>
                          <span className="text-[10px] font-bold text-emerald-600">85.2%</span>
                        </div>
                        <div className="h-[60px] flex items-end gap-[3px]">
                          {[35, 42, 38, 50, 55, 48, 62, 58, 65, 70, 72, 78, 75, 82, 85].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-sm bg-primary/40" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[8px] text-brand-300">Jan</span>
                          <span className="text-[8px] text-brand-300">Today</span>
                        </div>
                      </div>

                      <div className="bg-brand-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-brand-dark">Resolution Rate</span>
                          <span className="text-[10px] font-bold text-primary">91.4%</span>
                        </div>
                        <div className="h-[60px] flex items-end gap-[3px]">
                          {[50, 55, 60, 58, 65, 70, 68, 75, 78, 80, 82, 85, 88, 90, 91].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-sm bg-emerald-400/40" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[8px] text-brand-300">Jan</span>
                          <span className="text-[8px] text-brand-300">Today</span>
                        </div>
                      </div>
                    </div>

                    {/* Revenue chart */}
                    <div className="bg-brand-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-brand-dark">Revenue Collected</span>
                        <span className="text-[10px] font-bold text-brand-dark">$2.4M</span>
                      </div>
                      <div className="h-[50px] flex items-end gap-[2px]">
                        {[20, 25, 28, 32, 30, 38, 35, 42, 45, 40, 48, 52, 55, 50, 58, 62, 60, 65, 68, 72, 70, 75, 78, 80].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-primary/30" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] text-brand-300">Jan 2026</span>
                        <span className="text-[8px] text-brand-300">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* iPhone Device Frame — centered on mobile, overlapping on desktop */}
              <div className="relative lg:absolute lg:-bottom-10 lg:-right-6 w-[220px] lg:w-[195px] mx-auto lg:mx-0">
                <div className="bg-[#e8e8ed] rounded-[32px] p-[8px] shadow-2xl ring-1 ring-black/10">
                  {/* iPhone Dynamic Island */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[70px] h-[18px] bg-black rounded-full z-10" />
                  {/* iPhone screen */}
                  <div className="bg-white rounded-[24px] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="px-5 pt-3 pb-1 flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-brand-dark">9:41</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-brand-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" /></svg>
                        <svg className="w-3 h-3 text-brand-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z" /></svg>
                      </div>
                    </div>
                    {/* URL bar */}
                    <div className="mx-3 mb-2 bg-gray-100 rounded-lg px-2 py-1 flex items-center justify-center">
                      <span className="text-[7px] text-brand-400">pay.payvital.com</span>
                    </div>
                    {/* App header */}
                    <div className="px-4 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-primary text-white rounded-md flex items-center justify-center text-[7px] font-bold">+</span>
                        <span className="text-[10px] font-bold text-brand-dark">PayVital</span>
                      </div>
                      <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </div>
                    {/* Content */}
                    <div className="px-4 py-3">
                      <p className="text-[13px] font-bold text-brand-dark text-center mb-1">Hi Sarah,</p>
                      <p className="text-[7.5px] text-brand-500 text-center leading-relaxed mb-3">
                        You have 1 medical bill from Valley Health. If you need assistance, we&apos;re here to help.
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="bg-primary text-white text-[7px] font-bold px-2 py-0.5 rounded-full">1 bill</span>
                        <span className="text-primary text-[7px] font-medium">View details</span>
                      </div>
                      {/* Bill card */}
                      <div className="bg-brand-50 rounded-xl p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] text-brand-400">Total due</span>
                          <span className="text-[16px] font-extrabold text-brand-dark">$245.00</span>
                        </div>
                        <div className="w-full bg-primary text-white text-[9px] font-semibold py-2 rounded-lg text-center">
                          Pay total: $245.00
                        </div>
                        <p className="text-[7px] text-brand-400 text-center mt-1.5 flex items-center justify-center gap-0.5">
                          More payment options
                          <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </p>
                      </div>
                      <p className="text-[10px] font-bold text-brand-dark mb-1">Your medical bills</p>
                      <p className="text-primary text-[7px] font-medium flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        Statement history
                      </p>
                    </div>
                    {/* iPhone home indicator */}
                    <div className="flex justify-center pb-2 pt-1">
                      <div className="w-[60px] h-[4px] bg-brand-dark/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Agent Widget — bottom center under mockups */}
              <div className="mt-6 lg:mt-0 lg:absolute lg:-bottom-24 lg:left-1/2 lg:-translate-x-1/2 z-20 flex justify-center">
                <VoiceAgentWrapper />
              </div>

              {/* Glow behind mockups */}
              <div className="absolute -inset-12 bg-primary/8 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Logo/trust bar */}
      <div className="bg-white border-b border-brand-100">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-brand-300 text-center mb-6">
            Trusted by leading healthcare organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 mb-6">
            {['Valley Health', 'Summit Medical', 'Lakeside Clinic', 'Metro Hospital', 'Pacific Care', 'Cascade Health'].map((name) => (
              <span key={name} className="text-[15px] font-semibold text-brand-300 hover:text-brand-500 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-brand-100">
            {['HIPAA', 'SOC 2', 'PCI DSS', 'HITRUST'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
