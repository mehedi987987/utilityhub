"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'
import ErrorBanner from '@/components/ErrorBanner'

export default function JpgToPdfPage() {
  const [images, setImages] = useState<{ src: string; name: string }[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((f) => {
      if (f.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImages(prev => [...prev, { src: e.target?.result as string, name: f.name }])
        }
        reader.readAsDataURL(f)
      }
    })
  }

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const moveImage = (from: number, to: number) => {
    const copy = [...images]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    setImages(copy)
  }

  const handleConvert = async () => {
    if (images.length === 0) return
    setError(null)
    setProcessing(true)

    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF()

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage()

        const img = await loadImage(images[i].src)
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        const x = (pageWidth - w) / 2
        const y = (pageHeight - h) / 2

        pdf.addImage(images[i].src, 'JPEG', x, y, w, h)
      }

      pdf.save('workgate-images.pdf')
    } catch (err) {
      setError(
        err instanceof Error
          ? `PDF generation failed: ${err.message}`
          : 'PDF generation failed. Please try with smaller images.'
      )
    }

    setProcessing(false)
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  return (
    <ToolLayout title="JPG to PDF" icon="📄" description="Convert images to PDF.">
      <TokenGate slug="jpg-to-pdf">
      <div className="max-w-3xl mx-auto">
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
        <div className="card p-5 mb-4">
          <div
            className="upload-area min-h-[150px] flex items-center justify-center text-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }}
          >
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            <div className="py-6">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-bold text-white">Drop or select images</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
              <span className="btn-primary inline-block mt-3 text-sm">Select Images</span>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={() => setImages([])} className="btn-secondary flex-1">🗑️ Clear</button>
              <button onClick={handleConvert} disabled={processing} className="btn-primary flex-1">
                {processing ? 'Converting...' : `📄 Convert (${images.length})`}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="card p-3 relative group">
                  <img src={img.src} alt={img.name} className="w-full h-28 object-cover rounded-lg mb-2" />
                  <p className="text-xs text-gray-400 truncate">{img.name}</p>
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{i + 1}</span>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    {i > 0 && <button onClick={() => moveImage(i, i - 1)} className="w-6 h-6 bg-black/60 text-white rounded text-xs">←</button>}
                    {i < images.length - 1 && <button onClick={() => moveImage(i, i + 1)} className="w-6 h-6 bg-black/60 text-white rounded text-xs">→</button>}
                    <button onClick={() => removeImage(i)} className="w-6 h-6 bg-red-500/80 text-white rounded text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
