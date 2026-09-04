"use client"
import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    let chars = ''
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (numbers) chars += '0123456789'
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
    setCopied(false)
  }, [length, uppercase, lowercase, numbers, symbols])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrength = () => {
    if (length < 8) return { label: 'Weak', color: 'text-red-400', bg: 'bg-red-500' }
    if (length < 12) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500' }
    if (length < 16) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500' }
    return { label: 'Strong', color: 'text-green-400', bg: 'bg-green-500' }
  }

  const strength = getStrength()

  return (
    <ToolLayout title="Password Generator" icon="🔐" description="Generate secure, random passwords with customizable options.">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 mb-4">
          {/* Generated Password */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Generated Password</span>
              <span className={`text-xs font-bold ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-lg font-mono text-white break-all">{password || 'Click Generate'}</code>
              <button onClick={copyToClipboard} disabled={!password}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition disabled:opacity-50">
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* Length Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Length</span>
              <span className="text-sm font-mono text-blue-400">{length}</span>
            </div>
            <input type="range" min={4} max={64} value={length}
              onChange={(e) => setLength(+e.target.value)}
              className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>4</span><span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="flex items-center gap-3 bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition">
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500" />
              <span className="text-sm text-gray-300">ABC Uppercase</span>
            </label>
            <label className="flex items-center gap-3 bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500" />
              <span className="text-sm text-gray-300">abc Lowercase</span>
            </label>
            <label className="flex items-center gap-3 bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition">
              <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500" />
              <span className="text-sm text-gray-300">123 Numbers</span>
            </label>
            <label className="flex items-center gap-3 bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition">
              <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500" />
              <span className="text-sm text-gray-300">!@# Symbols</span>
            </label>
          </div>

          <button onClick={generate} className="btn-primary w-full text-lg py-3">
            🔐 Generate Password
          </button>
        </div>

        {/* Quick Presets */}
        <div className="card p-5">
          <h3 className="font-bold text-sm text-white mb-3">⚡ Quick Presets</h3>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => { setLength(8); setUppercase(true); setLowercase(true); setNumbers(true); setSymbols(false); }}
              className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 transition">
              Simple (8)
            </button>
            <button onClick={() => { setLength(16); setUppercase(true); setLowercase(true); setNumbers(true); setSymbols(true); }}
              className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 transition">
              Standard (16)
            </button>
            <button onClick={() => { setLength(32); setUppercase(true); setLowercase(true); setNumbers(true); setSymbols(true); }}
              className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 transition">
              Strong (32)
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
