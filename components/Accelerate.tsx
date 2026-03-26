export default function Accelerate() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,91,255,0.15), transparent)' }}
      />
      <div className="relative z-10 max-w-[640px] mx-auto px-6 text-center">
        <p className="text-primary font-semibold text-[15px] mb-4">New</p>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-white leading-tight mb-5">
          Say hello to Accelerate™
        </h2>
        <p className="text-lg text-white/50 leading-relaxed mb-8">
          Move patient payments from insurance portals into your bank account — automatically.
          No manual reconciliation. No delays.
        </p>
        <a href="#contact" className="inline-flex items-center gap-2 bg-white text-brand-dark font-medium text-[15px] px-6 py-3 rounded-full hover:bg-white/90 transition-all">
          Learn more <span className="text-brand-500">→</span>
        </a>
      </div>
    </section>
  )
}
