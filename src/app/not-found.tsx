import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Page not found</h1>
      <p className="text-sm text-gray-400 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">🏠 Go home</Link>
        <Link href="/#tools" className="btn-secondary inline-flex items-center gap-2">🛠️ Browse tools</Link>
      </div>
    </div>
  )
}
