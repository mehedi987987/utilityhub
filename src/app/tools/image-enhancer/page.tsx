"use client"
import { useState, useRef, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import BeforeAfter from '@/components/BeforeAfter'
import ErrorBanner from '@/components/ErrorBanner'

async function enhanceWithAI(
  imageBlob: Blob,
  type: 'upscale' | 'denoise' | 'sharpen'
): Promise<string> {
  const formData = new FormData()
  formData.append('image', imageBlob, 'image.jpg')
  formData.append('type', type)

  const res = await fetch('/api/enhance', { method: 'POST', body: formData })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Enhancement failed (${res.status}).`)
  }

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export default function ImageEnhancerPage() {
  const [original, setOriginal] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'adjust' | 'ai'>('adjust')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    warmth: 0,
    vignette: 0,
  })


  const applyEffects = useCallback((img: HTMLImageElement, s: typeof settings) => {
    setProcessing(true)

    setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2]

        if (s.brightness !== 0) {
          const f = s.brightness * 2.55
          r = clamp(r + f); g = clamp(g + f); b = clamp(b + f)
        }

        if (s.contrast !== 0) {
          const f = (259 * (s.contrast + 255)) / (255 * (259 - s.contrast))
          r = clamp(f * (r - 128) + 128)
          g = clamp(f * (g - 128) + 128)
          b = clamp(f * (b - 128) + 128)
        }

        if (s.saturation !== 0) {
          const gray = 0.2989 * r + 0.587 * g + 0.114 * b
          const f = 1 + s.saturation / 100
          r = clamp(gray + f * (r - gray))
          g = clamp(gray + f * (g - gray))
          b = clamp(gray + f * (b - gray))
        }

        if (s.warmth !== 0) {
          const f = s.warmth * 0.5
          r = clamp(r + f); b = clamp(b - f)
        }

        data[i] = r; data[i + 1] = g; data[i + 2] = b
      }

      ctx.putImageData(imageData, 0, 0)

      if (s.sharpness > 0) {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')!
        tempCtx.drawImage(canvas, 0, 0)

        ctx.filter = `blur(${3 - s.sharpness * 0.02}px)`
        ctx.drawImage(tempCanvas, 0, 0)
        ctx.filter = 'none'

        const sharpData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const origData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)
        const amount = s.sharpness / 50

        for (let i = 0; i < sharpData.data.length; i += 4) {
          sharpData.data[i] = clamp(origData.data[i] + (origData.data[i] - sharpData.data[i]) * amount)
          sharpData.data[i + 1] = clamp(origData.data[i + 1] + (origData.data[i + 1] - sharpData.data[i + 1]) * amount)
          sharpData.data[i + 2] = clamp(origData.data[i + 2] + (origData.data[i + 2] - sharpData.data[i + 2]) * amount)
        }
        ctx.putImageData(sharpData, 0, 0)
      }

      if (s.vignette > 0) {
        const w = canvas.width, h = canvas.height
        const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7)
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(1, `rgba(0,0,0,${s.vignette / 100})`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      }

      setPreview(canvas.toDataURL('image/jpeg', 0.95))
      setProcessing(false)
    }, 50)
  }, [])

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setOriginal(dataUrl)
      setPreview(null)
      const img = new window.Image()
      img.onload = () => {
        imgRef.current = img
        applyEffects(img, settings)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(f)
  }, [settings, applyEffects])

  const handleAIEnhance = async (type: 'upscale' | 'denoise' | 'sharpen') => {
    if (!original) return

    setError(null)
    setProcessing(true)
    setProgress(`Starting AI ${type}...`)

    try {
      const res = await fetch(original)
      const blob = await res.blob()

      setProgress('Processing with AI... (may take 15-30 seconds)')

      const resultUrl = await enhanceWithAI(blob, type)
      setPreview(resultUrl)
      setProgress('Done!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`${message} Falling back to manual enhancement.`)
      setProgress('')
      
      if (imgRef.current) {
        const autoSettings = { brightness: 10, contrast: 15, saturation: 10, sharpness: 30, warmth: 0, vignette: 0 }
        setSettings(autoSettings)
        applyEffects(imgRef.current, autoSettings)
      }
    }

    setProcessing(false)
  }

  const handleSettingChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (imgRef.current) applyEffects(imgRef.current, newSettings)
  }

  const handlePreset = (preset: 'auto' | 'vivid' | 'warm' | 'cool' | 'bw' | 'reset') => {
    let newSettings: typeof settings
    switch (preset) {
      case 'auto': newSettings = { brightness: 10, contrast: 15, saturation: 10, sharpness: 20, warmth: 0, vignette: 0 }; break
      case 'vivid': newSettings = { brightness: 5, contrast: 20, saturation: 40, sharpness: 15, warmth: 0, vignette: 0 }; break
      case 'warm': newSettings = { brightness: 5, contrast: 10, saturation: 15, sharpness: 10, warmth: 30, vignette: 0 }; break
      case 'cool': newSettings = { brightness: 5, contrast: 10, saturation: 5, sharpness: 10, warmth: -30, vignette: 0 }; break
      case 'bw': newSettings = { brightness: 5, contrast: 20, saturation: -100, sharpness: 15, warmth: 0, vignette: 20 }; break
      case 'reset': default: newSettings = { brightness: 0, contrast: 0, saturation: 0, sharpness: 0, warmth: 0, vignette: 0 }; break
    }
    setSettings(newSettings)
    if (imgRef.current) applyEffects(imgRef.current, newSettings)
  }

  const handleDownload = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = 'workgate-enhanced.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setOriginal(null)
    setPreview(null)
    imgRef.current = null
    setSettings({ brightness: 0, contrast: 0, saturation: 0, sharpness: 0, warmth: 0, vignette: 0 })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Image Enhancer" icon="✨" description="Improve your photos with manual adjustments or AI-powered enhancement.">
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Preview Area */}
        <div>
          <div className="card rounded-2xl p-5 mb-4">
            <div
              className="upload-area min-h-[300px] flex items-center justify-center text-center overflow-hidden relative"
              onClick={() => !original && fileRef.current?.click()}
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
              {!original ? (
                <div className="py-10">
                  <div className="text-5xl mb-4">✨</div>
                  <p className="text-lg font-bold text-white">Drop or select an image</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG or WebP</p>
                  <span className="btn-primary inline-block mt-4">Select Image</span>
                </div>
              ) : (
                <div className="p-4 w-full">
                  {processing && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-xl">
                      <div className="spinner mb-3"></div>
                      <p className="text-sm text-gray-300 font-medium">{progress}</p>
                    </div>
                  )}
                  <BeforeAfter
                    before={original}
                    after={preview}
                    beforeLabel="Original"
                    afterLabel="Enhanced"
                    placeholder="Adjust the settings or run an AI enhancement to see the result"
                  />
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {original && (
            <div className="flex gap-3">
              <button onClick={handleReset} className="btn-secondary flex-1">🔄 Try Another</button>
              <button onClick={handleDownload} disabled={!preview} className="btn-primary flex-1">⬇️ Download</button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div className="card rounded-2xl p-2 flex gap-1">
            <button
              onClick={() => setActiveTab('adjust')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'adjust' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-white/10'}`}
            >
              🎨 Manual
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'ai' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-white/10'}`}
            >
              🤖 AI Enhance
            </button>
          </div>

          {/* Manual Controls */}
          {activeTab === 'adjust' && (
            <>
              <div className="card rounded-2xl p-5">
                <h3 className="font-bold text-sm text-white mb-3">🎨 Quick Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handlePreset('auto')} className="py-2.5 px-3 bg-white/5 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold transition">✨ Auto</button>
                  <button onClick={() => handlePreset('vivid')} className="py-2.5 px-3 bg-white/5 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold transition">🌈 Vivid</button>
                  <button onClick={() => handlePreset('warm')} className="py-2.5 px-3 bg-white/5 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold transition">🌅 Warm</button>
                  <button onClick={() => handlePreset('cool')} className="py-2.5 px-3 bg-white/5 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold transition">❄️ Cool</button>
                  <button onClick={() => handlePreset('bw')} className="py-2.5 px-3 bg-white/5 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold transition">⬛ B&W</button>
                  <button onClick={() => handlePreset('reset')} className="py-2.5 px-3 bg-white/5 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-semibold transition">↺ Reset</button>
                </div>
              </div>

              <div className="card rounded-2xl p-5">
                <h3 className="font-bold text-sm text-white mb-4">🔧 Adjustments</h3>
                <div className="space-y-4">
                  <Slider label="☀️ Brightness" value={settings.brightness} onChange={(v) => handleSettingChange('brightness', v)} />
                  <Slider label="🔲 Contrast" value={settings.contrast} onChange={(v) => handleSettingChange('contrast', v)} />
                  <Slider label="🎨 Saturation" value={settings.saturation} onChange={(v) => handleSettingChange('saturation', v)} />
                  <Slider label="🔪 Sharpness" value={settings.sharpness} onChange={(v) => handleSettingChange('sharpness', v)} min={0} max={100} />
                  <Slider label="🌡️ Warmth" value={settings.warmth} onChange={(v) => handleSettingChange('warmth', v)} />
                  <Slider label="🔲 Vignette" value={settings.vignette} onChange={(v) => handleSettingChange('vignette', v)} min={0} max={100} />
                </div>
              </div>
            </>
          )}

          {/* AI Controls */}
          {activeTab === 'ai' && (
            <div className="card rounded-2xl p-5">
              <h3 className="font-bold text-sm text-white mb-4">🤖 AI Enhancement</h3>
              <p className="text-xs text-gray-400 mb-4">
                Uses multiple AI services for best results. Auto-rotates if one fails.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleAIEnhance('upscale')}
                  disabled={!original || processing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  🔍 AI Upscale (2x)
                </button>
                <button
                  onClick={() => handleAIEnhance('denoise')}
                  disabled={!original || processing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  🧹 AI Denoise
                </button>
                <button
                  onClick={() => handleAIEnhance('sharpen')}
                  disabled={!original || processing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  🔪 AI Sharpen
                </button>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-800">
                  ✅ 4 AI services connected: Clipdrop, DeepAI, Claid, Pixelcut
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}

function Slider({ label, value, onChange, min = -100, max = 100 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-white">{label}</span>
        <span className="text-xs font-mono text-gray-400 bg-white/10 px-2 py-0.5 rounded">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-600" />
    </div>
  )
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}
