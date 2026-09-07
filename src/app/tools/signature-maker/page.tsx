"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function SignatureMakerPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [w, setW] = useState(300)
  const [h, setH] = useState(100)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const renderImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = w
    canvas.height = h
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
    const scale = Math.max(w / img.width, h / img.height)
    const sw = w / scale, sh = h / scale
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, w, h)
    setPreview(canvas.toDataURL('image/jpeg', 0.95))
    setReady(true)
  }

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => { imgRef.current = img; renderImage(img) }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(f)
  }

  const handleDownload = () => {
    if (!ready) return
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `signature-${w}x${h}.jpg`
      a.click()
    }, 'image/jpeg', 0.95)
  }

  const handleReset = () => {
    setPreview(null)
    setReady(false)
    imgRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Signature Size Maker" description="Upload your signature image and resize it to application-ready dimensions.">
      <TokenGate slug="signature-maker">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-3">Upload Signature</h2>
          <div
            className="border-2 border-dashed rounded-xl min-h-[150px] flex items-center justify-center text-center cursor-pointer border-gray-300 bg-white/5 hover:border-blue-400 transition overflow-hidden"
            onClick={() => !preview && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {!preview ? (
              <div>
                <p className="text-sm font-bold">Select signature image</p>
                <span className="inline-block bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold mt-3">Select Image</span>
              </div>
            ) : (
              <img src={preview} alt="Signature" className="max-w-full object-contain p-2" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-3">Output Size</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Width (px)</label>
              <input type="number" value={w} onChange={(e) => setW(+e.target.value)} min={50} max={2000}
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Height (px)</label>
              <input type="number" value={h} onChange={(e) => setH(+e.target.value)} min={20} max={1000}
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
          </div>
          {imgRef.current && (
            <button onClick={() => renderImage(imgRef.current!)} className="w-full bg-white/10 text-white py-2 rounded-lg text-xs font-bold mt-3 hover:bg-white/20">
              Apply Size
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
          <button onClick={handleDownload} disabled={!ready}
            className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Download</button>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
