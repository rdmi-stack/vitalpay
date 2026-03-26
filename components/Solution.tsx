const stats = [
  { stat: '85%', label: 'Collection rate' },
  { stat: '<2 min', label: 'Time to first payment' },
  { stat: '50%', label: 'Revenue increase' },
  { stat: '56 hrs', label: 'Staff hours saved/mo' },
]

export default function Solution() {
  return (
    <section id="solution" className="py-24 bg-brand-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[600px] mb-16">
          <p className="text-primary font-semibold text-[15px] mb-4">Why PayVital</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-brand-dark leading-tight mb-5">
            This is what healthcare payments should look like
          </h2>
          <p className="text-lg text-brand-500 leading-relaxed">
            Digital-first. Patient-centered. Built to perform. PayVital replaces friction
            with flow—helping you collect faster and give patients an experience they want to use.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ stat, label }) => (
            <div key={label} className="bg-white rounded-xl p-6">
              <div className="text-3xl font-extrabold text-brand-dark mb-1">{stat}</div>
              <div className="text-[14px] text-brand-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
