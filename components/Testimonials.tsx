const testimonials = [
  {
    quote: 'PayVital transformed our collections. We saw a 40% increase in patient payments within the first month.',
    name: 'Dr. Sarah Chen',
    role: 'Medical Director, Valley Health Partners',
  },
  {
    quote: "Our staff used to spend hours on billing follow-ups. Now it's automated and patients pay faster than ever.",
    name: 'Michael Torres',
    role: 'CFO, Summit Medical Group',
  },
  {
    quote: "The two-minute rule is real. We had payments coming in before the onboarding call was even over.",
    name: 'Jennifer Walsh',
    role: 'Practice Manager, Lakeside Clinic',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[600px] mb-14">
          <p className="text-primary font-semibold text-[15px] mb-4">Testimonials</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-brand-dark leading-tight">
            Trusted by healthcare leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="bg-white rounded-2xl p-8 flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-[15px] text-brand-700 leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-5 border-t border-brand-100">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[13px] font-bold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-brand-dark">{t.name}</div>
                  <div className="text-[12px] text-brand-500">{t.role}</div>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
