"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="h-16 glass sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight whitespace-nowrap">
            <span className="gradient-text">Utility</span><span className="text-white">Hub</span>
          </Link>
          <nav className="hidden md:flex gap-1 flex-1">
            <Link href="/" className="text-sm text-gray-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 font-medium transition">Home</Link>
            <Link href="/#tools" className="text-sm text-gray-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 font-medium transition">All Tools</Link>
            <Link href="/#categories" className="text-sm text-gray-400 px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 font-medium transition">Categories</Link>
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-[280px] h-full bg-[#0f0f1a] border-l border-white/10 shadow-2xl animate-slide-up overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <b className="text-lg">
                <span className="gradient-text">Utility</span><span className="text-white">Hub</span>
              </b>
              <button 
                onClick={() => setMenuOpen(false)} 
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
            
            <nav className="p-4">
              <Link href="/" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">🏠</span> Home
              </Link>
              <Link href="/#tools" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">🛠️</span> All Tools
              </Link>
              <Link href="/#categories" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">📂</span> Categories
              </Link>

              <div className="divider my-3"></div>
              <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Popular Tools</p>

              <Link href="/tools/passport-photo" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">📷</span> Photo Maker
              </Link>
              <Link href="/tools/remove-bg" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">✂️</span> Remove Background
              </Link>
              <Link href="/tools/image-enhancer" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">✨</span> Image Enhancer
              </Link>
              <Link href="/tools/image-resizer" className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
                <span className="text-lg">📐</span> Image Resizer
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
