"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function ImageResizerPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [lock, setLock] = useState(true)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const renderImage = (img: HTMLImageElement, tw: number, th: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = tw
    canvas.height = th
    ctx.drawImage(img, 0, 0, tw, th)
    setPreview(canvas.toDataURL('image/jpeg', 0.9))
    setReady(true)
  }

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        imgRef.current = img
        setW(img.width)
        setH(img.height)
        renderImage(img, img.width, img.height)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(f)
  }

  const handleWChange = (val: number) => {
    setW(val)
    if (lock && imgRef.current && val > 0) {
      const ratio = imgRef.current.height / imgRef.current.width
      const newH = Math.round(val * ratio)
      setH(newH)
      renderImage(imgRef.current, val, newH)
    } else if (imgRef.current && val > 0 && h > 0) {
      renderImage(imgRef.current, val, h)
    }
  }

  const handleHChange = (val: number) => {
    setH(val)
    if (lock && imgRef.current && val > 0) {
      const ratio = imgRef.current.width / imgRef.current.height
      const newW = Math.round(val * ratio)
      setW(newW)
      renderImage(imgRef.current, newW, val)
    } else if (imgRef.current && w > 0 && val > 0) {
      renderImage(imgRef.current, w, val)
    }
  }

  const handleDownload = () => {
    if (!ready) return
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `resized-${w}x${h}.jpg`
      a.click()
    }, 'image/jpeg', 0.92)
  }

  const handleReset = () => {
    setPreview(null)
    setReady(false)
    setW(0)
    setH(0)
    imgRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Image Resizer" description="Resize any image to your desired dimensions. Lock aspect ratio to maintain proportions.">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div>
          <div className="card p-5 mb-4">
            <h2 className="text-sm font-bold mb-3">Upload Image</h2>
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
                  <p className="text-sm font-bold">Drop or select an image</p>
                  <span className="inline-block bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold mt-3">Select Image</span>
                </div>
              ) : (
                <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {preview && (
            <div className="card p-5 mb-4">
              <h2 className="text-sm font-bold mb-3">Resize Dimensions</h2>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Width (px)</label>
                  <input type="number" value={w} onChange={(e) => handleWChange(+e.target.value)} min={1} max={10000}
                    className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                </div>
                <div className="flex items-center justify-center pb-2">
                  <button onClick={() => setLock(!lock)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg transition ${lock ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                    {lock ? '🔗' : '🔓'}
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Height (px)</label>
                  <input type="number" value={h} onChange={(e) => handleHChange(+e.target.value)} min={1} max={10000}
                    className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                </div>
              </div>
              {imgRef.current && (
                <p className="text-xs text-gray-400 mt-2">Original: {imgRef.current.width} × {imgRef.current.height} px</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleReset} className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
            <button onClick={handleDownload} disabled={!ready}
              className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Download</button>
          </div>
        </div>

        <aside className="card p-5">
          <h3 className="text-sm font-bold mb-2">How to resize</h3>
          <ul className="text-xs text-gray-300 space-y-2">
            <li>1️⃣ Upload your image above</li>
            <li>2️⃣ Enter new width or height</li>
            <li>3️⃣ 🔗 keeps proportions (recommended)</li>
            <li>4️⃣ Click Download to save</li>
          </ul>
        </aside>
      </div>
    </ToolLayout>
  )
}
