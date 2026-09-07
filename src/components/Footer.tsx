import Link from 'next/link'
import { categories, tools, TOOL_COUNT } from '@/lib/toolCatalog'

export default function Footer() {
  const popular = tools.filter((t) => t.badge).slice(0, 5)

  return (
    <footer className="footer-gradient mt-8 py-12">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="brand-mark" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20V9l8-5 8 5v11" />
                <path d="M10 20v-6h4v6" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-white">Work</span>
              <span className="gradient-text">Gate</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            {TOOL_COUNT} free tools for everyday work. No signup, no upload limits, and your files
            stay on your device.
          </p>
        </div>

        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Popular Tools</h3>
          {popular.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition"
            >
              {t.title}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Categories</h3>
          {categories.map((c) => (
            <Link
              key={c.id}
              href="/#tools"
              className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition"
            >
              {c.title}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="text-sm text-white font-semibold mb-3">Company</h3>
          <Link href="/about" className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition">About</Link>
          <Link href="/faq" className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition">FAQ</Link>
          <Link href="/earn-tokens" className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition">Earn Tokens</Link>
          <Link href="/privacy" className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition">Privacy</Link>
          <Link href="/contact" className="block text-xs py-1.5 text-gray-500 hover:text-violet-300 transition">Contact</Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mt-10 pt-6 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} Work Gate. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
