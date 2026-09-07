"use client"
import Link from 'next/link'
import { useMemo, useState } from 'react'

const categories = [
  { id: 'education', icon: '🎓', title: 'Education', desc: 'SSC, HSC & University', color: 'from-blue-600 to-blue-700' },
  { id: 'islamic', icon: '🕌', title: 'Islamic', desc: 'Date & Zakat tools', color: 'from-emerald-600 to-emerald-700' },
  { id: 'calculators', icon: '🧮', title: 'Calculators', desc: 'Everyday calculations', color: 'from-orange-600 to-orange-700' },
  { id: 'images', icon: '🖼️', title: 'Images & Files', desc: 'Photo & PDF tools', color: 'from-purple-600 to-purple-700' },
  { id: 'utilities', icon: '🧰', title: 'Utilities', desc: 'QR, passwords & text', color: 'from-rose-600 to-rose-700' },
]

const tools = [
  { slug: 'passport-photo', cat: 'images', icon: '📷', title: 'Passport Photo Maker', desc: 'Create passport size photos', badge: 'Popular', badgeColor: 'bg-blue-500/20 text-blue-400' },
  { slug: 'remove-bg', cat: 'images', icon: '✂️', title: 'Remove Background', desc: 'AI-powered background removal', badge: 'New', badgeColor: 'bg-green-500/20 text-green-400' },
  { slug: 'face-beauty', cat: 'images', icon: '💄', title: 'Face Beauty', desc: 'AI face beautification', badge: 'New', badgeColor: 'bg-pink-500/20 text-pink-400' },
  { slug: 'image-enhancer', cat: 'images', icon: '✨', title: 'Image Enhancer', desc: 'Improve photo quality', badge: 'New', badgeColor: 'bg-purple-500/20 text-purple-400' },
  { slug: 'ssc-grammar', cat: 'education', icon: '📖', title: 'SSC Grammar Solution', desc: 'Interactive grammar book', badge: 'New', badgeColor: 'bg-amber-500/20 text-amber-400' },
  { slug: 'qr-generator', cat: 'utilities', icon: '🔲', title: 'QR Code Generator', desc: 'Generate QR codes', badge: 'Popular', badgeColor: 'bg-blue-500/20 text-blue-400' },
  { slug: 'password-generator', cat: 'utilities', icon: '🔐', title: 'Password Generator', desc: 'Generate secure passwords', badge: '', badgeColor: '' },
  { slug: 'word-counter', cat: 'utilities', icon: '📝', title: 'Word Counter', desc: 'Count words & characters', badge: '', badgeColor: '' },
  { slug: 'color-picker', cat: 'utilities', icon: '🎨', title: 'Color Picker', desc: 'Pick & convert colors', badge: '', badgeColor: '' },
  { slug: 'bmi-calculator', cat: 'calculators', icon: '⚖️', title: 'BMI Calculator', desc: 'Calculate Body Mass Index', badge: '', badgeColor: '' },
  { slug: 'loan-calculator', cat: 'calculators', icon: '💰', title: 'Loan EMI Calculator', desc: 'Calculate monthly EMI', badge: '', badgeColor: '' },
  { slug: 'image-resizer', cat: 'images', icon: '📐', title: 'Image Resizer', desc: 'Resize any image', badge: '', badgeColor: '' },
  { slug: 'image-compressor', cat: 'images', icon: '📦', title: 'Image Compressor', desc: 'Reduce file size', badge: '', badgeColor: '' },
  { slug: 'image-size', cat: 'images', icon: '🖼️', title: 'Image Size Maker', desc: 'Set custom dimensions', badge: '', badgeColor: '' },
  { slug: 'signature-maker', cat: 'images', icon: '✍️', title: 'Signature Maker', desc: 'Resize signatures', badge: '', badgeColor: '' },
  { slug: 'jpg-to-pdf', cat: 'images', icon: '📄', title: 'JPG to PDF', desc: 'Convert images to PDF', badge: '', badgeColor: '' },
  { slug: 'pdf-to-jpg', cat: 'images', icon: '🖼️', title: 'PDF to JPG', desc: 'Convert PDF to images', badge: '', badgeColor: '' },
  { slug: 'ssc-gpa', cat: 'education', icon: '🎓', title: 'SSC GPA Calculator', desc: 'Calculate SSC GPA', badge: '', badgeColor: '' },
  { slug: 'hsc-gpa', cat: 'education', icon: '📚', title: 'HSC GPA Calculator', desc: 'Calculate HSC GPA', badge: '', badgeColor: '' },
  { slug: 'cgpa', cat: 'education', icon: '🏛️', title: 'University CGPA', desc: 'Calculate CGPA', badge: '', badgeColor: '' },
  { slug: 'islamic-date', cat: 'islamic', icon: '🌙', title: 'Islamic Date Converter', desc: 'Gregorian to Hijri', badge: '', badgeColor: '' },
  { slug: 'zakat', cat: 'islamic', icon: '💰', title: 'Zakat Calculator', desc: 'Calculate Zakat', badge: '', badgeColor: '' },
  { slug: 'percentage', cat: 'calculators', icon: '🔢', title: 'Percentage Calculator', desc: 'Quick calculations', badge: '', badgeColor: '' },
  { slug: 'age', cat: 'calculators', icon: '🎂', title: 'Age Calculator', desc: 'Find exact age', badge: '', badgeColor: '' },
  { slug: 'date-diff', cat: 'calculators', icon: '📅', title: 'Date Difference', desc: 'Days between dates', badge: '', badgeColor: '' },
  { slug: 'countdown', cat: 'utilities', icon: '⏱️', title: 'Countdown Timer', desc: 'Countdown to any date', badge: '', badgeColor: '' },
  { slug: 'holidays', cat: 'utilities', icon: '🇧🇩', title: 'Bangladesh Holidays', desc: 'Public holidays 2025', badge: '', badgeColor: '' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const visibleTools = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      const matchesCat = !activeCat || t.cat === activeCat
      const matchesQuery =
        !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, activeCat])

  const activeCatTitle = categories.find((c) => c.id === activeCat)?.title

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-blue-400">20+ free tools available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Useful tools.<br />
              <span className="gradient-text">Nothing complicated.</span>
            </h1>
            <p className="text-base text-gray-400 leading-relaxed max-w-lg mb-8">
              Resize photos, remove backgrounds, calculate grades, convert files — all free, no registration required.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/#tools" className="btn-primary inline-flex items-center gap-2">
                🛠️ Explore Tools
              </Link>
              <Link href="/tools/remove-bg" className="btn-secondary inline-flex items-center gap-2">
                ✂️ Try Remove BG
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4">
        {/* Categories */}
        <section className="py-12" id="categories">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Browse by category</h2>
            <p className="text-sm text-gray-500 mt-1">Find the right tool for your task</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={cat.id}
                type="button"
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                aria-pressed={activeCat === cat.id}
                className={`category-card group text-left ${activeCat === cat.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-white">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* All Tools */}
        <section className="py-6" id="tools">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeCatTitle ? `${activeCatTitle} tools` : 'All tools'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {visibleTools.length} of {tools.length} tools
                {activeCat && (
                  <button
                    onClick={() => setActiveCat(null)}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    clear filter
                  </button>
                )}
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">🔍</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                aria-label="Search tools"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleTools.map((tool, i) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="tool-card group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
                      {tool.badge && (
                        <span className={`badge ${tool.badgeColor}`}>{tool.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                  </div>
                  <span className="text-gray-600 text-xl group-hover:text-blue-400 group-hover:translate-x-1 transition flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>

          {visibleTools.length === 0 && (
            <div className="card p-10 text-center">
              <p className="text-3xl mb-3">🤷</p>
              <h3 className="font-semibold text-white text-sm mb-1">No tools match your search</h3>
              <p className="text-xs text-gray-500 mb-4">Try a different keyword or clear the filters.</p>
              <button
                onClick={() => { setQuery(''); setActiveCat(null) }}
                className="btn-secondary text-sm"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl mx-auto mb-3">🆓</div>
              <h3 className="font-semibold text-white text-sm">100% Free</h3>
              <p className="text-xs text-gray-500 mt-1">No hidden charges</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mx-auto mb-3">⚡</div>
              <h3 className="font-semibold text-white text-sm">Lightning Fast</h3>
              <p className="text-xs text-gray-500 mt-1">Results in seconds</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mx-auto mb-3">📱</div>
              <h3 className="font-semibold text-white text-sm">Mobile Friendly</h3>
              <p className="text-xs text-gray-500 mt-1">Works on any device</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl mx-auto mb-3">🔒</div>
              <h3 className="font-semibold text-white text-sm">Privacy First</h3>
              <p className="text-xs text-gray-500 mt-1">Your data stays safe</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
