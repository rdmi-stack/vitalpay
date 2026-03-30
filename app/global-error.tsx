'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ margin: 0, fontFamily: '-apple-system, sans-serif', background: '#f7f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0a2540', marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ color: '#6b7c93', marginBottom: '24px' }}>{error.message || 'An unexpected error occurred.'}</p>
            <button onClick={reset} style={{ background: '#635bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
