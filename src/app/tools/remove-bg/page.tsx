"use client"
import { useState, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'
import ErrorBanner from '@/components/ErrorBanner'
import BeforeAfter from '@/components/BeforeAfter'

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF5733', '#33FF57',
  '#3357FF', '#F0F0F0', '#333333', '#8B4513', '#FFD700',
]

export default function RemoveBgPage() {
  const [original, setOriginal] = useState<string | null>(null)
  const [noBg, setNoBg] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [step, setStep] = useState<'upload' | 'removed' | 'bgAdded'>('upload')
  const [error, setError] = useState<string | null>(null)
  
  // Background options
  const [bgType, setBgType] = useState<'transparent' | 'color' | 'image'>('transparent')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [blurBg, setBlurBg] = useState(0)
  
  const fileRef = useRef<HTMLInputElement>(null)
  const bgFileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = async (f: File) => {
    if (!f.type.startsWith('image/')) return
    if (f.size > 12 * 1024 * 1024) {
      setError('Image is larger than 12 MB. Please pick a smaller file.')
      return
    }

    setError(null)
    setProcessing(true)
    setProgress('Removing background...')

    const reader = new FileReader()
    reader.onload = (e) => setOriginal(e.target?.result as string)
    reader.readAsDataURL(f)

    try {
      const formData = new FormData()
      formData.append('image_file', f)

      const response = await fetch('/api/remove-bg', { method: 'POST', body: formData })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (response.status === 429) {
          throw new Error(
            data.error ||
              'You have used all your free runs for now. Please try again later.'
          )
        }
        throw new Error(data.error || `Request failed (${response.status}).`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setNoBg(url)
      setPreview(url)
      setStep('removed')
      setProgress('Done!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed. Please try again later.')
    } finally {
      setProcessing(false)
    }
  }

  const applyBackground = async () => {
    if (!noBg) return

    setProcessing(true)
    setProgress('Applying background...')

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load the no-bg image
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Draw background
      if (bgType === 'color') {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (bgType === 'image' && bgImage) {
        const bgImg = new window.Image()
        bgImg.onload = () => {
          // Apply blur if needed
          if (blurBg > 0) {
            ctx.filter = `blur(${blurBg}px)`
          }
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
          ctx.filter = 'none'
          
          // Draw foreground
          ctx.drawImage(img, 0, 0)
          
          setPreview(canvas.toDataURL('image/png'))
          setStep('bgAdded')
          setProcessing(false)
        }
        bgImg.src = bgImage
        return
      }

      // Draw foreground (no-bg image)
      ctx.drawImage(img, 0, 0)

      setPreview(canvas.toDataURL('image/png'))
      setStep('bgAdded')
      setProcessing(false)
    }
    img.src = noBg
  }

  const handleBgImageUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setBgImage(e.target?.result as string)
      setBgType('image')
    }
    reader.readAsDataURL(f)
  }

  const handleDownload = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = 'workgate-photo.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setOriginal(null)
    setNoBg(null)
    setPreview(null)
    setStep('upload')
    setBgType('transparent')
    setBgColor('#FFFFFF')
    setBgImage(null)
    setBlurBg(0)
    setProcessing(false)
    setProgress('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Remove & Change Background" icon="✂️" description="Remove background and add new one - solid color, gradient, or custom image.">
      <TokenGate slug="remove-bg">
      <div className="max-w-4xl mx-auto">
        {/* Upload Area */}
        {step === 'upload' && (
          <div className="card rounded-2xl p-5 mb-4">
            <div
              className="upload-area min-h-[250px] flex items-center justify-center text-center overflow-hidden"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging') }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('dragging')
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <div className="py-10">
                <div className="text-5xl mb-4">✂️</div>
                <p className="text-lg font-bold text-white">Drop or select an image</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG or WebP · Max 12MB</p>
                <span className="btn-primary inline-block mt-4">Select Image</span>
              </div>
            </div>
          </div>
        )}

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {/* Processing */}
        {processing && (
          <div className="card border border-white/10 rounded-2xl p-8 mb-4 text-center">
            <div className="spinner mx-auto mb-3"></div>
            <p className="text-sm text-gray-300 font-medium">{progress}</p>
          </div>
        )}

        {/* Result Area */}
        {step !== 'upload' && !processing && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Preview */}
            <div>
              <div className="card rounded-2xl p-5 mb-4">
                <BeforeAfter
                  before={original!}
                  after={preview}
                  beforeLabel="Original"
                  afterLabel="Result"
                  transparent
                />

                {/* Cut-out reference thumbnail */}
                {noBg && noBg !== preview && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <div className="ba-checker rounded-lg w-16 h-16 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={noBg} alt="Cut-out with transparent background" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-300">Transparent cut-out</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        The background you pick is composited onto this.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="btn-secondary flex-1">🔄 New Image</button>
                <button onClick={handleDownload} className="btn-primary flex-1">⬇️ Download PNG</button>
              </div>
            </div>

            {/* Background Options */}
            <div className="space-y-4">
              {/* BG Type Selector */}
              <div className="card rounded-2xl p-5">
                <h3 className="font-bold text-sm text-white mb-3">🎨 Background Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setBgType('transparent'); setPreview(noBg) }}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition ${bgType === 'transparent' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                  >
                    🚫 None
                  </button>
                  <button
                    onClick={() => { setBgType('color'); applyBackground() }}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition ${bgType === 'color' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                  >
                    🎨 Color
                  </button>
                  <button
                    onClick={() => { setBgType('image'); if (bgImage) applyBackground() }}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition ${bgType === 'image' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                  >
                    🖼️ Image
                  </button>
                </div>
              </div>

              {/* Color Options */}
              {bgType === 'color' && (
                <div className="card rounded-2xl p-5">
                  <h3 className="font-bold text-sm text-white mb-3">🎨 Choose Color</h3>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => { setBgColor(color); applyBackground() }}
                        className={`w-full aspect-square rounded-xl border-2 transition ${bgColor === color ? 'border-purple-500 scale-110' : 'border-white/10 hover:border-gray-400'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-300">Custom:</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => { setBgColor(e.target.value); applyBackground() }}
                      className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-gray-400">{bgColor}</span>
                  </div>
                </div>
              )}

              {/* Image Options */}
              {bgType === 'image' && (
                <div className="card rounded-2xl p-5">
                  <h3 className="font-bold text-sm text-white mb-3">🖼️ Background Image</h3>
                  <div
                    className="upload-area p-4 text-center cursor-pointer mb-3"
                    onClick={() => bgFileRef.current?.click()}
                  >
                    <input ref={bgFileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleBgImageUpload(e.target.files[0])} />
                    {bgImage ? (
                      <img src={bgImage} alt="BG" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-300">Select background image</p>
                        <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Blur slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">🌫️ Background Blur</span>
                      <span className="text-xs font-mono text-gray-400">{blurBg}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={blurBg}
                      onChange={(e) => { setBlurBg(+e.target.value); applyBackground() }}
                      className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="card rounded-2xl p-5">
                <h3 className="font-bold text-sm text-white mb-3">⚡ Quick Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#FFFFFF'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    ⬜ White BG
                  </button>
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#000000'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    ⬛ Black BG
                  </button>
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#4A90D9'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    🔵 Blue BG
                  </button>
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#FF5733'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    🟠 Orange BG
                  </button>
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#28A745'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    🟢 Green BG
                  </button>
                  <button
                    onClick={() => { setBgType('color'); setBgColor('#6C757D'); applyBackground() }}
                    className="py-2 px-3 bg-white/5 hover:bg-blue-50 rounded-xl text-xs font-semibold transition"
                  >
                    ⚪ Gray BG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Features */}
        {step === 'upload' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">✂️</div>
              <h3 className="font-bold text-sm text-white">Remove BG</h3>
              <p className="text-xs text-gray-400 mt-1">AI-powered removal</p>
            </div>
            <div className="card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-bold text-sm text-white">Solid Color</h3>
              <p className="text-xs text-gray-400 mt-1">Any color you want</p>
            </div>
            <div className="card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🖼️</div>
              <h3 className="font-bold text-sm text-white">Custom Image</h3>
              <p className="text-xs text-gray-400 mt-1">Use your own BG</p>
            </div>
            <div className="card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🌫️</div>
              <h3 className="font-bold text-sm text-white">Blur Effect</h3>
              <p className="text-xs text-gray-400 mt-1">Blur background</p>
            </div>
          </div>
        )}
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
