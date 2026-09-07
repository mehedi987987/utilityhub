"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function ImageCompressorPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(70)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const compress = (img: HTMLImageElement, q: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        setCompressedSize(blob.size)
        setPreview(canvas.toDataURL('image/jpeg', q / 100))
        setReady(true)
      }
    }, 'image/jpeg', q / 100)
  }

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setOriginalSize(f.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        imgRef.current = img
        compress(img, quality)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(f)
  }

  const handleQualityChange = (q: number) => {
    setQuality(q)
    if (imgRef.current) compress(imgRef.current, q)
  }

  const handleDownload = () => {
    if (!ready) return
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `compressed-${quality}percent.jpg`
      a.click()
    }, 'image/jpeg', quality / 100)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const savings = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0

  return (
    <ToolLayout title="Image Compressor" description="Reduce image file size while maintaining quality. Perfect for web uploads and email.">
      <TokenGate slug="image-compressor">
      <div className="max-w-2xl mx-auto">
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
                <p className="text-sm font-bold">Drop or select an image</p>
                <span className="inline-block bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold mt-3">Select Image</span>
              </div>
            ) : (
              <img src={preview} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {preview && (
          <>
            <div className="card p-5 mb-4">
              <h2 className="text-sm font-bold mb-3">Quality: {quality}%</h2>
              <input type="range" min={10} max={100} value={quality}
                onChange={(e) => handleQualityChange(+e.target.value)}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>📦 Smaller file</span><span>✨ Better quality</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="card p-4 text-center">
                <p className="text-xs text-gray-400">Original</p>
                <p className="text-lg font-bold">{formatSize(originalSize)}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xs text-gray-400">Compressed</p>
                <p className="text-lg font-bold text-green-600">{formatSize(compressedSize)}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xs text-gray-400">Saved</p>
                <p className="text-lg font-bold text-blue-600">{savings}%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPreview(null); setReady(false); setOriginalSize(0); setCompressedSize(0); imgRef.current = null; if (fileRef.current) fileRef.current.value = '' }}
                className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
              <button onClick={handleDownload} disabled={!ready}
                className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Download</button>
            </div>
          </>
        )}
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
