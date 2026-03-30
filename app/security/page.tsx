import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const badges = [
  { name: 'HIPAA', desc: 'Full HIPAA compliance with BAA agreements for all PHI handling and storage.' },
  { name: 'SOC 2 Type II', desc: 'Independent audit of security, availability, and confidentiality controls.' },
  { name: 'PCI DSS Level 1', desc: 'Highest level of payment card security. We never store card numbers.' },
  { name: 'HITRUST CSF', desc: 'Healthcare-specific security framework certification for risk management.' },
]

const practices = [
  { title: 'End-to-End Encryption', desc: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256). No exceptions.' },
  { title: 'Zero-Knowledge Payments', desc: 'Card data goes directly to Stripe. PayVital never sees, stores, or processes card numbers.' },
  { title: 'Access Controls', desc: 'Role-based access, multi-factor authentication, and principle of least privilege across all systems.' },
  { title: 'Audit Logging', desc: 'Every action logged with timestamps, user IDs, and IP addresses. Full audit trail for compliance.' },
  { title: 'Data Residency', desc: 'All patient data stored in SOC 2 certified US data centers with geographic redundancy.' },
  { title: 'Incident Response', desc: '24/7 security monitoring with documented incident response procedures and breach notification.' },
  { title: 'Vendor Security', desc: 'All third-party vendors (Twilio, Mailgun, Stripe) maintain independent HIPAA and SOC 2 certifications.' },
  { title: 'Penetration Testing', desc: 'Regular third-party penetration testing and vulnerability scanning of all infrastructure.' },
]

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-20 bg-brand-dark">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">Security & Compliance</p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-white leading-tight mb-5">
              Built for healthcare. Secured like a bank.
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-[560px] mx-auto">
              PayVital meets the highest standards of security, privacy, and compliance required by healthcare organizations.
            </p>
          </div>
        </section>

        {/* Compliance badges */}
        <section className="py-20 bg-white">
          <div className="max-w-[1000px] mx-auto px-6">
            <h2 className="text-2xl font-bold text-brand-dark text-center mb-12">Compliance Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((b) => (
                <div key={b.name} className="text-center p-6 border border-brand-100 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <h3 className="font-bold text-brand-dark mb-2">{b.name}</h3>
                  <p className="text-[13px] text-brand-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security practices */}
        <section className="py-20 bg-brand-50">
          <div className="max-w-[1000px] mx-auto px-6">
            <h2 className="text-2xl font-bold text-brand-dark text-center mb-4">Security Practices</h2>
            <p className="text-brand-500 text-center mb-12 max-w-[500px] mx-auto">How we protect your data and your patients&apos; information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {practices.map((p) => (
                <div key={p.title} className="bg-white rounded-xl p-6 border border-brand-100">
                  <h3 className="font-bold text-brand-dark mb-2">{p.title}</h3>
                  <p className="text-[14px] text-brand-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
