"use client"
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, tools, TOOL_COUNT, type CategoryId } from '@/lib/toolCatalog'

const badgeStyles: Record<string, string> = {
  'Most Popular': 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  Popular: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  New: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<CategoryId | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Cmd/Ctrl+K focuses the search box, like the reference UI.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') searchRef.current?.blur()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visibleTools = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      const matchesCat = !activeCat || t.cat === activeCat
      const matchesQuery =
        !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, activeCat])

  const isFiltering = Boolean(query.trim() || activeCat)
  const featured = visibleTools.filter((t) => t.featured)
  const rest = isFiltering ? visibleTools : visibleTools.filter((t) => !t.featured)
  const activeCatTitle = categories.find((c) => c.id === activeCat)?.title

  const resetFilters = () => {
    setQuery('')
    setActiveCat(null)
  }

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero-glow dot-grid pt-16 pb-10">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <div className="status-pill mb-8">
            <span className="status-dot" />
            All {TOOL_COUNT} tools operational
          </div>

          <h1 className="text-4xl md:text-[64px] md:leading-[1.05] font-extrabold tracking-tight text-white mb-6">
            Every tool you need.
            <br />
            <span className="headline-gradient">One gate to work.</span>
          </h1>

          <p className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Stop hunting for sketchy download sites. Resize photos, remove backgrounds, convert
            PDFs and run the calculators you actually use — free, private, and right in your
            browser.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <label className="command-bar">
              <span className="text-gray-500 text-sm" aria-hidden="true">🔍</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${TOOL_COUNT} tools, converters, calculators...`}
                aria-label="Search tools"
              />
              <kbd className="kbd hidden sm:inline-block">⌘K</kbd>
            </label>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              className="filter-pill"
              aria-pressed={activeCat === null}
              onClick={() => setActiveCat(null)}
            >
              All Tools
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="filter-pill"
                aria-pressed={activeCat === cat.id}
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4">
        {/* ---------------- Featured ---------------- */}
        {!isFiltering && featured.length > 0 && (
          <section className="pt-6 pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4">
              {featured.map((tool, i) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="feature-card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="icon-tile" aria-hidden="true">{tool.icon}</div>
                    {tool.badge && (
                      <span className={`badge ${badgeStyles[tool.badge]}`}>{tool.badge}</span>
                    )}
                  </div>
                  <h2 className={`font-bold text-white mb-2 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                    {tool.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{tool.desc}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-violet-300 inline-flex items-center gap-1.5">
                    Open tool
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- Tool grid ---------------- */}
        <section className="py-10" id="tools">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeCatTitle ?? (isFiltering ? 'Search results' : 'All tools')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {visibleTools.length} of {TOOL_COUNT} tools
              </p>
            </div>
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="text-sm text-violet-300 hover:text-violet-200 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          {rest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card group">
                  <div className="flex items-start gap-3.5">
                    <div className="icon-tile flex-shrink-0" aria-hidden="true">{tool.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
                        {tool.badge && (
                          <span className={`badge ${badgeStyles[tool.badge]}`}>{tool.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>
                    </div>
                    <span className="text-gray-600 group-hover:text-violet-300 group-hover:translate-x-1 transition-all flex-shrink-0">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="font-semibold text-white text-sm mb-1">No tools match your search</h3>
              <p className="text-xs text-gray-500 mb-5">
                Try a different keyword, or browse every tool.
              </p>
              <button onClick={resetFilters} className="btn-secondary text-sm">
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* ---------------- Why Work Gate ---------------- */}
        <section className="pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🔒', title: 'Private by default', desc: 'Files are processed in your browser' },
              { icon: '🆓', title: 'No signup, no limits', desc: 'Every tool is free to use' },
              { icon: '⚡', title: 'Instant results', desc: 'No queues, no waiting rooms' },
              { icon: '📱', title: 'Works anywhere', desc: 'Phone, tablet or desktop' },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="icon-tile mb-3" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
