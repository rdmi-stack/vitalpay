export default function Manifesto() {
  const stats = [
    { value: '72%', label: 'of patients prefer digital payment options' },
    { value: '3x', label: 'faster collections vs. traditional billing' },
    { value: '40%', label: 'reduction in administrative overhead' },
  ]

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[3px] bg-primary rounded-full" />
          <span className="text-primary font-semibold text-sm tracking-wide uppercase">The problem</span>
        </div>

        <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold text-brand-dark leading-[1.15] mb-8 max-w-[720px]">
          Healthcare deserves better than paper and portals
        </h2>

        <p className="text-lg text-brand-500 leading-relaxed mb-6 max-w-[680px]">
          Too many healthcare organizations are stuck with systems built for a different
          era — manual statements, outdated portals, and workflows that create more friction
          than progress. Patients are confused. Staff are overwhelmed. Revenue is delayed.
        </p>

        <p className="text-xl font-semibold text-brand-dark leading-relaxed mb-16 max-w-[680px]">
          PayVital was built to fix this. We make payments faster, simpler, and better
          for everyone involved.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-brand-100">
          {stats.map((s) => (
            <div key={s.value}>
              <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold text-primary leading-none mb-2">
                {s.value}
              </p>
              <p className="text-[15px] text-brand-500 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
