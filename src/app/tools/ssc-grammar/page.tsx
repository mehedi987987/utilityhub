"use client"
import { useState, useRef, useEffect } from 'react'
import { bookPages } from '@/lib/bookData'
import TokenGate from '@/components/TokenGate'

export default function SSCGrammarPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showTOC, setShowTOC] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const totalPages = bookPages.length
  const page = bookPages[currentPage]

  // Page flip sound using Web Audio API
  const playFlipSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current

      // Layer 1: Whoosh sound
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(600, ctx.currentTime)
      osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12)
      gain1.gain.setValueAtTime(0.08, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc1.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + 0.15)

      // Layer 2: Paper rustle
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'sawtooth'
      osc2.frequency.setValueAtTime(2500, ctx.currentTime)
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08)
      gain2.gain.setValueAtTime(0.025, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc2.start(ctx.currentTime + 0.01)
      osc2.stop(ctx.currentTime + 0.11)
    } catch (e) { /* audio not supported */ }
  }

  const goNext = () => {
    if (isFlipping || currentPage >= totalPages - 1) return
    setIsFlipping(true)
    playFlipSound()
    setTimeout(() => {
      setCurrentPage(p => p + 1)
      setIsFlipping(false)
    }, 600)
  }

  const goPrev = () => {
    if (isFlipping || currentPage <= 0) return
    setIsFlipping(true)
    playFlipSound()
    setTimeout(() => {
      setCurrentPage(p => p - 1)
      setIsFlipping(false)
    }, 600)
  }

  const goToPage = (idx: number) => {
    setCurrentPage(idx)
    setShowTOC(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  // Render content with basic formatting
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) return <br key={i} />
      if (trimmed.startsWith('⭐') || trimmed.startsWith('📌') || trimmed.startsWith('🔥') || trimmed.startsWith('🧠'))
        return <p key={i} className="font-bold text-amber-800 mt-3 mb-1">{trimmed}</p>
      if (trimmed.startsWith('✅') || trimmed.startsWith('☑️'))
        return <p key={i} className="font-bold text-green-700 mt-2">{trimmed}</p>
      if (trimmed.startsWith('⚠️'))
        return <p key={i} className="font-bold text-red-600 mt-2">{trimmed}</p>
      if (trimmed.startsWith('Q') && /^\d/.test(trimmed.substring(1)))
        return <p key={i} className="font-bold text-blue-800 mt-3">{trimmed}</p>
      if (trimmed.match(/^\d+\./))
        return <p key={i} className="ml-2 font-medium">{trimmed}</p>
      if (trimmed.startsWith('•') || trimmed.startsWith('-'))
        return <p key={i} className="ml-4">{trimmed}</p>
      if (trimmed.startsWith('STOP'))
        return <p key={i} className="text-center font-bold text-red-500 my-3 py-2 border-y border-red-200">{trimmed}</p>
      return <p key={i} className="mb-0.5">{trimmed}</p>
    })
  }

  return (
    <TokenGate slug="ssc-grammar">
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950">
      {/* Header */}
      <div className="bg-amber-950/90 backdrop-blur-sm border-b border-amber-800/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={() => setShowTOC(true)} className="text-amber-300 hover:text-amber-200 text-xs font-medium flex items-center gap-1.5">
            📚 Contents
          </button>
          <h1 className="text-amber-200 font-bold text-sm hidden sm:block">English Perfect Solution SSC 27</h1>
          <span className="text-amber-400 text-xs">{currentPage + 1} / {totalPages}</span>
        </div>
      </div>

      {/* Book */}
      <div className="flex items-center justify-center min-h-[calc(100vh-96px)] p-3 md:p-6">
        <div className="w-full max-w-2xl">
          {/* Page */}
          <div className="relative">
            <div
              className={`bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-lg shadow-2xl shadow-black/40 min-h-[500px] md:min-h-[600px] overflow-hidden transition-all duration-500 ${
                isFlipping ? 'opacity-0 scale-95 rotate-y-12' : 'opacity-100 scale-100'
              }`}
              style={{ perspective: '1000px' }}
            >
              {/* Page fold effect */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-200/50 to-transparent pointer-events-none" />

              <div className="p-5 md:p-8">
                {/* Page header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-amber-300/50 mb-4">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                    {page.chapter || 'SSC Grammar Solution'}
                  </span>
                  <span className="text-[10px] text-amber-600">{currentPage + 1}</span>
                </div>

                {/* Cover page */}
                {page.type === 'cover' && (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-6">📘</div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 mb-2">
                      SSC 2027 · English 2nd Paper
                    </h1>
                    <h2 className="text-xl font-bold text-amber-800 mb-4">Grammar Master Book</h2>
                    <div className="w-20 h-0.5 bg-amber-400 mx-auto mb-4" />
                    <p className="text-sm text-amber-700">Zero থেকে Board-Ready</p>
                    <div className="flex justify-center gap-6 mt-6 text-xs text-amber-600">
                      <span>📖 9 Chapters</span>
                      <span>📝 10 Model Tests</span>
                      <span>🎯 60 Marks</span>
                    </div>
                  </div>
                )}

                {/* TOC */}
                {page.type === 'toc' && (
                  <div>
                    <h2 className="text-xl font-bold text-amber-900 text-center mb-6">📑 Table of Contents</h2>
                    {page.content.split('\n').map((line, i) => {
                      const trimmed = line.trim()
                      if (!trimmed) return null
                      const isChapter = trimmed.startsWith('CH')
                      const isPart = trimmed.startsWith('PART')
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            const target = bookPages.findIndex(p =>
                              p.chapter?.includes(trimmed.split(':')[0].replace('CH ', 'Chapter ').replace('PART ', 'PART '))
                            )
                            if (target >= 0) goToPage(target)
                          }}
                          className={`block w-full text-left py-2 px-3 rounded-lg mb-1 transition hover:bg-amber-200/50 ${
                            isChapter ? 'ml-4 text-sm text-amber-800' : isPart ? 'font-bold text-amber-900' : 'text-sm text-amber-700'
                          }`}
                        >
                          {trimmed}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Chapter intro */}
                {page.type === 'chapter-intro' && (
                  <div>
                    <div className="text-center mb-6">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{page.chapter}</span>
                      <h2 className="text-xl md:text-2xl font-extrabold text-amber-900 mt-2">{page.title}</h2>
                      <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3" />
                    </div>
                    <div className="text-sm text-amber-800 leading-relaxed">
                      {renderContent(page.content)}
                    </div>
                  </div>
                )}

                {/* Content/Practice/Answer pages */}
                {(page.type === 'content' || page.type === 'practice' || page.type === 'answer') && (
                  <div>
                    {page.title && (
                      <h2 className="text-lg font-bold text-amber-900 mb-4">{page.title}</h2>
                    )}
                    <div className={`text-[13px] leading-relaxed ${
                      page.type === 'answer' ? 'text-green-800' : 'text-amber-800'
                    }`}>
                      {renderContent(page.content)}
                    </div>
                  </div>
                )}
              </div>

              {/* Page footer */}
              <div className="absolute bottom-0 left-0 right-0 px-8 py-3 border-t border-amber-200/50">
                <p className="text-[9px] text-amber-500 text-center italic">English Perfect Solution SSC 27</p>
              </div>
            </div>

            {/* Page shadow */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/20 rounded-2xl blur-xl -z-10" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-5 py-3 bg-amber-800 text-amber-200 rounded-xl font-semibold text-sm hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-lg"
            >
              <span className="text-xl">‹</span> Previous
            </button>

            <div className="flex-1 max-w-[200px]">
              <div className="h-1.5 bg-amber-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-amber-400 mt-2">
                {currentPage + 1} of {totalPages}
              </p>
            </div>

            <button
              onClick={goNext}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-2 px-5 py-3 bg-amber-800 text-amber-200 rounded-xl font-semibold text-sm hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-lg"
            >
              Next <span className="text-xl">›</span>
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-amber-600/50 mt-3">
            Use ← → arrow keys or click buttons to flip pages
          </p>
        </div>
      </div>

      {/* TOC Modal */}
      {showTOC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowTOC(false)}>
          <div className="bg-amber-950 border border-amber-700 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-amber-800">
              <h3 className="text-amber-200 font-bold">📚 Table of Contents</h3>
              <button onClick={() => setShowTOC(false)} className="text-amber-400 hover:text-amber-200 text-lg">✕</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-1">
              {bookPages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    currentPage === i
                      ? 'bg-amber-700/50 text-amber-200 font-semibold'
                      : 'text-amber-400 hover:bg-amber-800/50'
                  }`}
                >
                  <span className="text-amber-600 text-xs mr-2">{i + 1}.</span>
                  {p.title || p.chapter || 'Page'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </TokenGate>
  )
}
