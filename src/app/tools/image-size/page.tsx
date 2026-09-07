"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function ImageSizePage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [w, setW] = useState(800)
  const [h, setH] = useState(800)
  const [bg, setBg] = useState('#ffffff')
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
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    const scale = Math.min(w / img.width, h / img.height)
    const sw = img.width * scale, sh = img.height * scale
    ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
    setPreview(canvas.toDataURL('image/jpeg', 0.92))
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
      a.download = `image-${w}x${h}.jpg`
      a.click()
    }, 'image/jpeg', 0.92)
  }

  const handleReset = () => {
    setPreview(null)
    setReady(false)
    imgRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Image Size Maker" description="Set custom width and height for your image. Fits the image within the canvas with background color.">
      <TokenGate slug="image-size">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <div
            className="border-2 border-dashed rounded-xl min-h-[180px] flex items-center justify-center text-center cursor-pointer border-gray-300 bg-white/5 hover:border-blue-400 transition overflow-hidden"
            onClick={() => !preview && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {!preview ? (
              <div>
                <p className="text-sm font-bold">Select an image</p>
                <span className="inline-block bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold mt-3">Select Image</span>
              </div>
            ) : (
              <img src={preview} alt="Preview" className="max-w-full max-h-[350px] object-contain" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-3">Canvas Size</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Width</label>
              <input type="number" value={w} onChange={(e) => setW(+e.target.value)} min={10} max={10000}
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Height</label>
              <input type="number" value={h} onChange={(e) => setH(+e.target.value)} min={10} max={10000}
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Background</label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg px-1 cursor-pointer" />
            </div>
          </div>
          {imgRef.current && (
            <button onClick={() => renderImage(imgRef.current!)} className="w-full bg-white/10 text-white py-2 rounded-lg text-xs font-bold mt-3 hover:bg-white/20">
              Apply
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
