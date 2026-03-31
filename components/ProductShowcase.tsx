import Image from 'next/image'

const products = [
  {
    title: 'Text-to-Pay',
    desc: 'Patients pay from a simple text message. No app download, no portal login — just tap and pay.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    iconBg: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'Digital Wallet',
    desc: 'Saved payment methods follow patients across every provider in your network. One card, everywhere.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Payment Plans',
    desc: 'Flexible installments patients can set up themselves — no staff intervention, no awkward conversations.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Auto-Posting',
    desc: 'Every payment is reconciled to your EMR in real time. No manual entry, no end-of-day batching.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Smart Statements',
    desc: 'Branded bills delivered by text, email, and mail — every touchpoint tracked in one dashboard.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    iconBg: 'bg-rose-100 text-rose-600',
  },
]

export default function ProductShowcase() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">Products</span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-brand-dark leading-tight mb-4">
            Smooth payments, every time
          </h2>
          <p className="text-[16px] text-brand-500 leading-relaxed">
            A modern toolkit for however you run your practice. Each product works on its own — and even better together.
          </p>
        </div>

        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {products.slice(0, 3).map((p) => (
            <div
              key={p.title}
              className="group bg-white rounded-2xl border border-brand-100 overflow-hidden hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={`absolute top-3 left-3 w-9 h-9 rounded-lg ${p.iconBg} flex items-center justify-center backdrop-blur-sm shadow-sm`}>
                  {p.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-dark mb-2">{p.title}</h3>
                <p className="text-[15px] text-brand-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.slice(3).map((p) => (
            <div
              key={p.title}
              className="group bg-white rounded-2xl border border-brand-100 overflow-hidden hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="relative h-48 md:h-auto md:w-2/5 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute top-3 left-3 w-9 h-9 rounded-lg ${p.iconBg} flex items-center justify-center backdrop-blur-sm shadow-sm`}>
                  {p.icon}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-brand-dark mb-2">{p.title}</h3>
                <p className="text-[15px] text-brand-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Explore all features
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
