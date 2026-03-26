'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Our Solution', href: '#solution' },
  { label: 'Who We Serve', href: '#who-we-serve' },
  { label: 'About', href: '#about' },
  { label: 'Resources', href: '#resources' },
]

const loginOptions = [
  { label: "I'm a Patient & I Have a Bill Code", href: '/login/patient', icon: '👤' },
  { label: 'PayVital Admin Portal', href: '/login/admin', icon: '🏥' },
  { label: 'Provider Dashboard', href: '/login/provider', icon: '📊' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const loginRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) setLoginOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className={`flex items-center gap-2 text-lg font-bold transition-colors ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
          <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">+</span>
          PayVital
        </Link>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={`text-[15px] transition-colors ${scrolled ? 'text-brand-700 hover:text-brand-dark' : 'text-white/90 hover:text-white'}`}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <div ref={loginRef} className="relative">
            <button
              onClick={() => setLoginOpen((o) => !o)}
              className={`text-[15px] transition-colors flex items-center gap-1 ${scrolled ? 'text-brand-700 hover:text-brand-dark' : 'text-white/90 hover:text-white'}`}
            >
              Login
              <svg className={`w-3.5 h-3.5 transition-transform ${loginOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`absolute right-0 top-full mt-3 w-[320px] bg-white rounded-xl shadow-xl border border-brand-100 p-4 transition-all duration-200 ${loginOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500 mb-3 px-1">Access Your Account</p>
              {loginOptions.map((o) => (
                <a key={o.href} href={o.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-100 transition-colors">
                  <span className="text-lg">{o.icon}</span>
                  <span className="text-[14px] font-medium text-brand-dark">{o.label}</span>
                </a>
              ))}
            </div>
          </div>
          <a href="#contact" className="text-[15px] font-medium bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition-all duration-200">
            Contact Us
          </a>
        </div>

        <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden p-2" aria-label="Toggle menu">
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? 'bg-brand-dark' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? 'bg-brand-dark' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? 'bg-brand-dark' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t border-brand-100 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-4 space-y-1">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-[15px] text-brand-700 rounded-lg hover:bg-brand-100">{l.label}</a>
          ))}
          <div className="pt-3 mt-3 border-t border-brand-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500 mb-2 px-3">Login</p>
            {loginOptions.map((o) => (
              <a key={o.href} href={o.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-100">
                <span>{o.icon}</span>
                <span className="text-[14px] font-medium text-brand-dark">{o.label}</span>
              </a>
            ))}
          </div>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-center text-[15px] font-medium bg-primary text-white px-4 py-3 rounded-full mt-3">Contact Us</a>
        </div>
      </div>
    </header>
  )
}
