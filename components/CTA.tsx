export default function CTA() {
  return (
    <section id="contact" className="py-28 lg:py-36 bg-white">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=700&fit=crop&crop=center"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-brand-dark/60" />

          {/* Content */}
          <div className="relative z-10 px-8 py-20 sm:px-16 sm:py-24 text-center">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white leading-tight mb-5">
              Make your next move
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-[480px] mx-auto">
              Simplify payments, reduce costs, and give your patients the experience they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-white/90 transition-all"
              >
                Get started
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] px-8 py-3.5 rounded-full transition-all"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
