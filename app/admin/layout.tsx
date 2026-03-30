'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { apiAuth, clearTokens } from '@/lib/api'

const navItems = [
  { label: 'Overview', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Users', href: '/admin/users', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
]

interface User { first_name: string; last_name: string; email: string; role: string }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    apiAuth<User>('/api/auth/me').then((u) => {
      if (u.role !== 'admin') { router.push('/'); return }
      setUser(u)
    }).catch(() => router.push('/login/admin'))
  }, [router])

  if (!user) return <div className="min-h-screen bg-brand-50 flex items-center justify-center"><p className="text-brand-400">Loading...</p></div>

  return (
    <div className="min-h-screen bg-brand-50 flex">
      <aside className="hidden lg:block w-64 bg-brand-dark">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">A</span>
            Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${pathname === item.href ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-white/10">
          <button onClick={() => { clearTokens(); router.push('/') }} className="text-[13px] text-white/40 hover:text-white transition-colors">Sign out</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-brand-100 h-14 flex items-center px-6">
          <h1 className="text-[15px] font-semibold text-brand-dark">{navItems.find((i) => i.href === pathname)?.label || 'Admin'}</h1>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
