import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

const posts = [
  {
    title: 'How AI Voice Agents Are Transforming Patient Collections',
    excerpt: 'Healthcare billing teams spend millions of hours on phone calls. AI voice agents can handle 60-85% of routine calls — here\'s how.',
    category: 'AI & Voice',
    date: 'Mar 25, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
  },
  {
    title: 'The Real Cost of Paper Statements in Healthcare',
    excerpt: 'At $0.50 per statement and 3+ mailings per bill, paper billing costs healthcare providers billions annually. There\'s a better way.',
    category: 'Industry',
    date: 'Mar 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
  },
  {
    title: '5 Reasons Patients Ignore Medical Bills (And How to Fix It)',
    excerpt: 'Confusion, friction, and fear are the top barriers. Modern payment platforms solve all three with one simple link.',
    category: 'Patient Experience',
    date: 'Mar 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
  },
  {
    title: 'HIPAA Compliance for Digital Patient Payments: A Complete Guide',
    excerpt: 'Everything you need to know about keeping patient data safe when processing digital healthcare payments.',
    category: 'Compliance',
    date: 'Mar 3, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop',
  },
  {
    title: 'Text-to-Pay: Why SMS Has a 98% Open Rate for Healthcare Billing',
    excerpt: 'Email gets lost. Paper gets ignored. But SMS? 98% of text messages are opened within 3 minutes.',
    category: 'Product',
    date: 'Feb 24, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    title: 'How to Increase Patient Collections by 50% Without Hiring More Staff',
    excerpt: 'Automation, AI, and modern payment UX can dramatically increase collections while reducing administrative burden.',
    category: 'ROI',
    date: 'Feb 17, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
]

const categoryColors: Record<string, string> = {
  'AI & Voice': 'bg-purple-100 text-purple-600',
  'Industry': 'bg-blue-100 text-blue-600',
  'Patient Experience': 'bg-emerald-100 text-emerald-600',
  'Compliance': 'bg-red-100 text-red-600',
  'Product': 'bg-amber-100 text-amber-600',
  'ROI': 'bg-primary/10 text-primary',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-brand-dark">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">Resources</p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-white leading-tight mb-5">
              Insights for modern healthcare billing
            </h1>
            <p className="text-lg text-white/50 max-w-[520px] mx-auto">
              Expert articles on patient payments, AI in healthcare, compliance, and revenue cycle optimization.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.title} className="group cursor-pointer">
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-brand-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                      {post.category}
                    </span>
                    <span className="text-[12px] text-brand-400">{post.date}</span>
                    <span className="text-[12px] text-brand-300">{post.readTime}</span>
                  </div>
                  <h2 className="text-[17px] font-bold text-brand-dark mb-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[14px] text-brand-500 leading-relaxed">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
