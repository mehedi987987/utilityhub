"use client"
import { useState, useRef, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

const presets = [
  { name: 'Passport / Visa', tag: 'STANDARD', desc: '35 × 45 mm · portrait', w: 413, h: 531 },
  { name: 'Square Passport', tag: 'SQUARE', desc: '35 × 35 mm · square', w: 413, h: 413 },
  { name: 'Government Job', tag: 'JOB', desc: '300 × 300 px · square', w: 300, h: 300 },
  { name: 'Education / Admission', tag: 'EDUCATION', desc: '300 × 400 px · portrait', w: 300, h: 400 },
]

export default function PassportPhotoPage() {
  const [selected, setSelected] = useState(0)
  const [custom, setCustom] = useState(false)
  const [cw, setCw] = useState(300)
  const [ch, setCh] = useState(300)
  const [preview, setPreview] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const W = custom ? cw : presets[selected].w
  const H = custom ? ch : presets[selected].h

  const renderImage = useCallback((img: HTMLImageElement, w: number, h: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = w
    canvas.height = h
    const scale = Math.max(w / img.width, h / img.height)
    const sw = w / scale
    const sh = h / scale
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, w, h)
    setPreview(canvas.toDataURL('image/jpeg', 0.9))
    setReady(true)
  }, [])

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        imgRef.current = img
        renderImage(img, W, H)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(f)
  }, [W, H, renderImage])

  const handlePreset = (i: number) => {
    setSelected(i)
    setCustom(false)
    if (imgRef.current) renderImage(imgRef.current, presets[i].w, presets[i].h)
  }

  const handleCustom = () => {
    setCustom(true)
    if (imgRef.current) renderImage(imgRef.current, cw, ch)
  }

  const handleDownload = () => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `workgate-photo-${W}x${H}.jpg`
      a.click()
    }, 'image/jpeg', 0.92)
  }

  const handleReset = () => {
    setPreview(null)
    setReady(false)
    setSelected(0)
    setCustom(false)
    imgRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout
      title="Passport & Application Photo Maker"
      description="Choose the type of photo you need, upload your image, and download the resized result."
    >
      <TokenGate slug="passport-photo">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div>
          <div className="card p-5 mb-4">
            <h2 className="text-sm font-bold mb-3">1. Select photo type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePreset(i)}
                  className={`border rounded-lg p-3 text-left transition ${
                    !custom && selected === i
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-white/10 hover:border-blue-300'
                  }`}
                >
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{p.tag}</span>
                  <b className="text-xs block mt-1">{p.name}</b>
                  <span className="text-[10px] text-gray-400">{p.desc}</span>
                </button>
              ))}
              <button
                onClick={handleCustom}
                className={`border rounded-lg p-3 text-left transition ${
                  custom ? 'border-blue-500 bg-blue-50' : 'border-white/10 hover:border-blue-300'
                }`}
              >
                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">CUSTOM</span>
                <b className="text-xs block mt-1">Custom Size</b>
                <span className="text-[10px] text-gray-400">Enter exact dimensions</span>
              </button>
            </div>

            {custom && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Width (px)</label>
                  <input type="number" value={cw} onChange={(e) => { setCw(+e.target.value); if (imgRef.current) renderImage(imgRef.current, +e.target.value, ch) }} min={20} max={5000}
                    className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Height (px)</label>
                  <input type="number" value={ch} onChange={(e) => { setCh(+e.target.value); if (imgRef.current) renderImage(imgRef.current, cw, +e.target.value) }} min={20} max={5000}
                    className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-3">
              Selected: <strong>{custom ? `Custom — ${cw} × ${ch} px` : `${presets[selected].name} — ${presets[selected].w} × ${presets[selected].h} px`}</strong>
            </p>
          </div>

          <div className="card p-5 mb-4">
            <h2 className="text-sm font-bold mb-3">2. Upload your photo</h2>
            <div
              className={`border-2 border-dashed rounded-xl min-h-[220px] flex items-center justify-center text-center cursor-pointer transition overflow-hidden ${
                preview ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white/5 hover:border-blue-400'
              }`}
              onClick={() => !preview && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50') }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50') }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              {!preview ? (
                <div>
                  <p className="text-sm font-bold">Choose an image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP · Drag & drop or click</p>
                  <span className="inline-block bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold mt-3">
                    Select Photo
                  </span>
                </div>
              ) : (
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
              )}
            </div>
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset} className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold hover:bg-white/5">
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={!ready}
              className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Download JPG
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-2">Which one should I choose?</h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li><strong>Passport / Visa:</strong> 35 × 45 mm portrait format</li>
              <li><strong>Government Job:</strong> 300 × 300 px square format</li>
              <li><strong>Education:</strong> 300 × 400 px portrait format</li>
              <li><strong>Custom:</strong> Enter exact dimensions from application</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-yellow-800">
              ⚠️ Always check official application instructions before submitting your photo.
            </p>
          </div>
        </aside>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
