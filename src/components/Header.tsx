"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { tools, TOOL_COUNT } from '@/lib/toolCatalog'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const boxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close the drawer / results when navigating.
  useEffect(() => {
    setMenuOpen(false)
    setOpen(false)
    setQuery('')
  }, [pathname])

  // Cmd/Ctrl+K focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside closes the dropdown.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return tools
      .filter((t) => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query])

  const go = (slug: string) => {
    setOpen(false)
    setQuery('')
    router.push(`/tools/${slug}`)
  }

  const popular = tools.filter((t) => t.featured).slice(0, 4)

  return (
    <>
      <header className="h-16 glass sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap">
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
          </Link>

          {/* Search */}
          <div ref={boxRef} className="relative flex-1 max-w-md mx-auto hidden md:block">
            <label className="command-bar">
              <span className="text-gray-500 text-sm" aria-hidden="true">🔍</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0].slug) }}
                placeholder={`Search ${TOOL_COUNT} tools...`}
                aria-label="Search tools"
              />
              <kbd className="kbd">⌘K</kbd>
            </label>

            {open && query.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 card p-2 max-h-[340px] overflow-y-auto z-40">
                {results.length > 0 ? (
                  results.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => go(t.slug)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-white/5 transition"
                    >
                      <span className="text-lg" aria-hidden="true">{t.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-white font-medium">{t.title}</span>
                        <span className="block text-xs text-gray-500 truncate">{t.desc}</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6">
                    No tools match &quot;{query}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/#tools"
              className="hidden md:inline-flex text-sm text-gray-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 font-medium transition"
            >
              All Tools
            </Link>
            <Link
              href="/about"
              className="hidden md:inline-flex text-sm text-gray-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 font-medium transition"
            >
              About
            </Link>
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded-full" />
              <span className="block w-5 h-0.5 bg-white rounded-full" />
              <span className="block w-5 h-0.5 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-[290px] h-full bg-[#0b0b13] border-l border-white/10 shadow-2xl animate-slide-up overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <span className="flex items-center gap-2.5">
                <span className="brand-mark" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20V9l8-5 8 5v11" />
                    <path d="M10 20v-6h4v6" />
                  </svg>
                </span>
                <b className="text-base">
                  <span className="text-white">Work</span>
                  <span className="gradient-text">Gate</span>
                </b>
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="p-4">
              {[
                { href: '/', icon: '🏠', label: 'Home' },
                { href: '/#tools', icon: '🛠️', label: 'All Tools' },
                { href: '/about', icon: 'ℹ️', label: 'About' },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  <span className="text-lg" aria-hidden="true">{l.icon}</span> {l.label}
                </Link>
              ))}

              <div className="divider my-3" />
              <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Popular Tools
              </p>

              {popular.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  <span className="text-lg" aria-hidden="true">{t.icon}</span> {t.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
