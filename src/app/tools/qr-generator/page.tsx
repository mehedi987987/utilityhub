"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function QRGeneratorPage() {
  const [text, setText] = useState('https://')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(300)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Simple QR code generation using API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fgColor.slice(1)}&bgcolor=${bgColor.slice(1)}`
    
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
    }
    img.src = qrUrl
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'workgate-qr-code.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <ToolLayout title="QR Code Generator" icon="🔲" description="Generate QR codes for URLs, text, WiFi, and more.">
      <TokenGate slug="qr-generator">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <div className="card p-5 mb-4">
            <h3 className="font-bold text-sm text-white mb-3">Content</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
            />
            <button onClick={generateQR} className="btn-primary w-full mt-3">
              Generate QR Code
            </button>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">Preview</h3>
            <div className="bg-white rounded-xl p-4 flex items-center justify-center min-h-[300px]">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
            <button onClick={handleDownload} className="btn-primary w-full mt-3">
              ⬇️ Download PNG
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">🎨 Colors</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Foreground</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer" />
                  <span className="text-xs font-mono text-gray-400">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer" />
                  <span className="text-xs font-mono text-gray-400">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">📐 Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {[200, 300, 500].map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${size === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {s}px
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">💡 Quick Templates</h3>
            <div className="space-y-2">
              <button onClick={() => setText('https://')} className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 text-left transition">
                🔗 URL
              </button>
              <button onClick={() => setText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')} className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 text-left transition">
                📶 WiFi
              </button>
              <button onClick={() => setText('mailto:example@email.com')} className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 text-left transition">
                📧 Email
              </button>
              <button onClick={() => setText('tel:+8801XXXXXXXXX')} className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 text-left transition">
                📱 Phone
              </button>
            </div>
          </div>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
