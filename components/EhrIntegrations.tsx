const emrs = ['Epic', 'Cerner', 'athenahealth', 'eClinicalWorks', 'NextGen', 'Allscripts', 'DrChrono', 'Greenway']

export default function EhrIntegrations() {
  return (
    <section id="who-we-serve" className="py-24 bg-brand-100">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-primary font-semibold text-[15px] mb-4">Integrations</p>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-brand-dark leading-tight mb-5">
          Works with the systems you already use
        </h2>
        <p className="text-lg text-brand-500 max-w-[600px] mx-auto mb-12 leading-relaxed">
          PayVital integrates with leading EMRs for seamless implementation from day one.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {emrs.map((name) => (
            <div key={name} className="bg-white rounded-xl px-6 py-4 text-[14px] font-semibold text-brand-500 hover:text-primary transition-colors">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
