"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function PdfToJpgPage() {
  const [fileName, setFileName] = useState('')
  const [pages, setPages] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (f: File) => {
    if (!f.type.includes('pdf')) return
    setFileName(f.name)
    setPages([])
    setProcessing(true)
    setProgress('Loading PDF library...')

    try {
      // Dynamic import
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker
      const pdfjsVersion = pdfjsLib.version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`

      setProgress('Reading PDF...')
      const arrayBuffer = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdf.numPages
      const renderedPages: string[] = []

      for (let i = 1; i <= totalPages; i++) {
        setProgress(`Rendering page ${i} of ${totalPages}...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await (page.render as any)({
          canvasContext: context,
          viewport: viewport,
        }).promise

        renderedPages.push(canvas.toDataURL('image/jpeg', 0.85))
      }

      setPages(renderedPages)
      setProgress(`Done! ${totalPages} pages extracted.`)
    } catch (err: any) {
      console.error('PDF error:', err)
      setProgress('Error: Could not read PDF. Try a different file.')
    }

    setProcessing(false)
  }

  const downloadPage = (idx: number) => {
    const a = document.createElement('a')
    a.href = pages[idx]
    a.download = `page-${idx + 1}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadAll = () => {
    pages.forEach((_, idx) => setTimeout(() => downloadPage(idx), idx * 300))
  }

  return (
    <ToolLayout title="PDF to JPG" icon="🖼️" description="Convert PDF pages to JPG images.">
      <TokenGate slug="pdf-to-jpg">
      <div className="max-w-3xl mx-auto">
        <div className="card p-5 mb-4">
          <div
            className="upload-area min-h-[180px] flex items-center justify-center text-center cursor-pointer"
            onClick={() => !fileName && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {!fileName ? (
              <div className="py-8">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-sm font-bold text-white">Drop or select a PDF</p>
                <span className="btn-primary inline-block mt-3 text-sm">Select PDF</span>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-sm font-bold text-white">📄 {fileName}</p>
                <p className="text-xs text-gray-400 mt-1">{pages.length} pages</p>
              </div>
            )}
          </div>
        </div>

        {processing && (
          <div className="card p-6 text-center mb-4">
            <div className="spinner mx-auto mb-3"></div>
            <p className="text-sm text-gray-300">{progress}</p>
          </div>
        )}

        {pages.length > 0 && (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={() => { setFileName(''); setPages([]) }} className="btn-secondary flex-1">🔄 New PDF</button>
              <button onClick={downloadAll} className="btn-primary flex-1">⬇️ Download All ({pages.length})</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((src, i) => (
                <div key={i} className="card p-3 group cursor-pointer" onClick={() => downloadPage(i)}>
                  <img src={src} alt={`Page ${i + 1}`} className="w-full h-40 object-contain rounded-lg bg-white mb-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Page {i + 1}</span>
                    <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition">⬇️</span>
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
