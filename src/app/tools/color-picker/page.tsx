"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function ColorPickerPage() {
  const [color, setColor] = useState('#3b82f6')
  const [copied, setCopied] = useState('')

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const hexToHsl = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)
    const r1 = r / 255, g1 = g / 255, b1 = b / 255
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break
        case g1: h = ((b1 - r1) / d + 2) / 6; break
        case b1: h = ((r1 - g1) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const rgb = hexToRgb(color)
  const hsl = hexToHsl(color)

  const copyValue = (val: string, type: string) => {
    navigator.clipboard.writeText(val)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const colorFormats = [
    { label: 'HEX', value: color },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ]

  const popularColors = [
    '#FF0000', '#FF5733', '#FFC300', '#28A745', '#17A2B8',
    '#007BFF', '#6F42C1', '#E83E8C', '#FFFFFF', '#000000',
  ]

  return (
    <ToolLayout title="Color Picker" icon="🎨" description="Pick colors and get HEX, RGB, HSL values instantly.">
      <TokenGate slug="color-picker">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 mb-4">
          {/* Color Preview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-xl border-2 border-white/10 shadow-lg" style={{ backgroundColor: color }} />
            <div>
              <p className="text-2xl font-bold text-white">{color.toUpperCase()}</p>
              <p className="text-sm text-gray-400">RGB({rgb.r}, {rgb.g}, {rgb.b})</p>
            </div>
          </div>

          {/* Color Input */}
          <div className="flex items-center gap-3 mb-6">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16 rounded-xl cursor-pointer" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
              className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white font-mono" />
          </div>

          {/* Color Formats */}
          <div className="space-y-2">
            {colorFormats.map((fmt) => (
              <div key={fmt.label} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-xs text-gray-400">{fmt.label}</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white font-mono">{fmt.value}</code>
                  <button onClick={() => copyValue(fmt.value, fmt.label)}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {copied === fmt.label ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Colors */}
        <div className="card p-5">
          <h3 className="font-bold text-sm text-white mb-3">🎨 Popular Colors</h3>
          <div className="grid grid-cols-10 gap-2">
            {popularColors.map((c) => (
              <button key={c} onClick={() => setColor(c)}
                className={`aspect-square rounded-lg border-2 transition ${color === c ? 'border-blue-500 scale-110' : 'border-white/10 hover:border-white/30'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
