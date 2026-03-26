export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,91,255,0.2), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,212,170,0.1), transparent)',
          }}
        />

        {/* Centered content */}
        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <p className="text-primary font-semibold text-[15px] mb-6 tracking-wide">
            Healthcare payments infrastructure
          </p>

          <h1 className="text-[clamp(2.8rem,6.5vw,5rem)] font-extrabold leading-[1.05] text-white mb-6 tracking-[-0.03em]">
            Get paid more.
            <br />
            Get paid faster.
          </h1>

          <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-[520px] mx-auto">
            The smarter way to bill and collect — maximizing revenue
            and delivering a better experience for everyone.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-brand-dark font-medium text-[15px] px-7 py-3.5 rounded-full hover:bg-white/90 transition-all duration-200"
            >
              Get started
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white font-medium text-[15px] px-7 py-3.5 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              Contact sales
            </a>
          </div>
        </div>
      </section>

      {/* Logo/trust bar */}
      <div className="bg-white border-b border-brand-100">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-brand-300 text-center mb-6">
            Trusted by leading healthcare organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {['Valley Health', 'Summit Medical', 'Lakeside Clinic', 'Metro Hospital', 'Pacific Care', 'Cascade Health'].map((name) => (
              <span key={name} className="text-[15px] font-semibold text-brand-300 hover:text-brand-500 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
