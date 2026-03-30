'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-6">
      <div className="text-center max-w-[400px]">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Something went wrong</h2>
        <p className="text-brand-500 text-[14px] mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="bg-primary hover:bg-primary-dark text-white font-medium text-[14px] px-6 py-2.5 rounded-lg transition-all">
          Try again
        </button>
      </div>
    </div>
  )
}
