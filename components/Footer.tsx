const links = {
  Products: [
    { label: 'Text-to-Pay', href: '#features' },
    { label: 'Digital Wallet', href: '#features' },
    { label: 'Payment Plans', href: '#features' },
    { label: 'Auto-Posting', href: '#features' },
    { label: 'Smart Statements', href: '#features' },
    { label: 'Accelerate™', href: '#features' },
  ],
  'Who We Serve': [
    { label: 'Health Systems', href: '#who-we-serve' },
    { label: 'Medical Groups', href: '#who-we-serve' },
    { label: 'Specialty Practices', href: '#who-we-serve' },
    { label: 'Urgent Care', href: '#who-we-serve' },
    { label: 'Dental Practices', href: '#who-we-serve' },
    { label: 'Behavioral Health', href: '#who-we-serve' },
  ],
  Resources: [
    { label: 'ROI Calculator', href: '#calculator' },
    { label: 'Case Studies', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Webinars', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Careers', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Press & Media', href: '#' },
    { label: 'Contact', href: '#contact' },
  ],
}

export default function Footer() {
  return (
    <footer id="about" className="bg-black text-white/60">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 md:pr-8">
            <div className="flex items-center gap-2 text-lg font-bold text-white mb-4">
              <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">+</span>
              PayVital
            </div>
            <p className="text-[14px] leading-relaxed max-w-[300px] mb-8">
              The modern patient payment platform for healthcare providers. Get paid more, get paid faster.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <p className="text-[12px] font-semibold text-white/30 uppercase tracking-wider">Contact</p>
              <div className="text-[14px]">
                <p>Customer support: <a href="tel:+18887309374" className="text-white hover:text-primary transition-colors">(888) 730-9374</a></p>
              </div>
              <div className="text-[14px]">
                <p>Sales: <a href="tel:+18005551234" className="text-white hover:text-primary transition-colors">(800) 555-1234</a></p>
              </div>
              <div className="text-[14px]">
                <a href="mailto:support@payvital.com" className="hover:text-white transition-colors">support@payvital.com</a>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="md:col-span-2">
              <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[14px] hover:text-white transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-white/30">&copy; {new Date().getFullYear()} PayVital, LLC. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-[13px] text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookie Preferences</a>
            <a href="#" className="hover:text-white/60 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
