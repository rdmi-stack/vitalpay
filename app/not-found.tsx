import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-primary font-bold text-[120px] leading-none mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-white/50 mb-8 max-w-[400px] mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white font-medium text-[15px] px-6 py-3 rounded-full transition-all">
            Go Home
          </Link>
          <Link href="/#contact" className="border border-white/20 text-white font-medium text-[15px] px-6 py-3 rounded-full hover:bg-white/10 transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
