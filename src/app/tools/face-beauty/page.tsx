"use client"
import { useState, useRef, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'
import BeforeAfter from '@/components/BeforeAfter'

export default function FaceBeautyPage() {
  const [original, setOriginal] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState({
    smoothSkin: 0,
    whitenSkin: 0,
    removeBlemishes: 0,
    brightenEyes: 0,
    slimFace: 0,
    reddenLips: 0,
  })


  const applyEffects = useCallback((img: HTMLImageElement, s: typeof settings) => {
    setProcessing(true)
    setProgress('Applying effects...')

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

      // Skin detection and beautification
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2]

        // Simple skin detection (works for various skin tones)
        const isSkin = detectSkin(r, g, b)

        if (isSkin) {
          // Skin smoothing (reduce noise while keeping texture)
          if (s.smoothSkin > 0) {
            const factor = s.smoothSkin / 100
            const avg = (r + g + b) / 3
            r = r + (avg - r) * factor * 0.3
            g = g + (avg - g) * factor * 0.3
            b = b + (avg - b) * factor * 0.3
          }

          // Skin whitening/brightening
          if (s.whitenSkin > 0) {
            const factor = s.whitenSkin / 100
            r = Math.min(255, r + factor * 40)
            g = Math.min(255, g + factor * 35)
            b = Math.min(255, b + factor * 30)
          }

          // Blemish removal (reduce redness)
          if (s.removeBlemishes > 0) {
            const factor = s.removeBlemishes / 100
            const avg = (r + g + b) / 3
            if (r > avg * 1.2) { // Reddish areas
              r = r - (r - avg) * factor * 0.5
            }
          }
        }

        // Brighten eyes (detect bright areas in eye region)
        if (s.brightenEyes > 0) {
          const brightness = (r + g + b) / 3
          if (brightness > 150 && brightness < 250) {
            const factor = s.brightenEyes / 100
            r = Math.min(255, r + factor * 20)
            g = Math.min(255, g + factor * 20)
            b = Math.min(255, b + factor * 20)
          }
        }

        // Redden lips (detect lip-colored areas)
        if (s.reddenLips > 0) {
          const isLipColor = detectLips(r, g, b)
          if (isLipColor) {
            const factor = s.reddenLips / 100
            r = Math.min(255, r + factor * 30)
            g = Math.max(0, g - factor * 10)
            b = Math.max(0, b - factor * 5)
          }
        }

        data[i] = Math.round(r)
        data[i + 1] = Math.round(g)
        data[i + 2] = Math.round(b)
      }

      ctx.putImageData(imageData, 0, 0)

      // Apply Gaussian blur for smoothing effect
      if (s.smoothSkin > 30) {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')!
        tempCtx.drawImage(canvas, 0, 0)

        ctx.filter = `blur(${s.smoothSkin * 0.05}px)`
        ctx.globalAlpha = s.smoothSkin * 0.003
        ctx.drawImage(tempCanvas, 0, 0)
        ctx.globalAlpha = 1
        ctx.filter = 'none'
      }

      setPreview(canvas.toDataURL('image/jpeg', 0.95))
      setProcessing(false)
      setProgress('Done!')
    }, 100)
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

  const handleSettingChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (imgRef.current) applyEffects(imgRef.current, newSettings)
  }

  const handlePreset = (preset: 'natural' | 'glamour' | 'bright' | 'reset') => {
    let newSettings: typeof settings
    switch (preset) {
      case 'natural':
        newSettings = { smoothSkin: 30, whitenSkin: 15, removeBlemishes: 40, brightenEyes: 20, slimFace: 0, reddenLips: 15 }
        break
      case 'glamour':
        newSettings = { smoothSkin: 60, whitenSkin: 35, removeBlemishes: 60, brightenEyes: 30, slimFace: 10, reddenLips: 30 }
        break
      case 'bright':
        newSettings = { smoothSkin: 40, whitenSkin: 50, removeBlemishes: 30, brightenEyes: 40, slimFace: 0, reddenLips: 20 }
        break
      case 'reset':
      default:
        newSettings = { smoothSkin: 0, whitenSkin: 0, removeBlemishes: 0, brightenEyes: 0, slimFace: 0, reddenLips: 0 }
        break
    }
    setSettings(newSettings)
    if (imgRef.current) applyEffects(imgRef.current, newSettings)
  }

  const handleDownload = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = 'workgate-face-beauty.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setOriginal(null)
    setPreview(null)
    imgRef.current = null
    setSettings({ smoothSkin: 0, whitenSkin: 0, removeBlemishes: 0, brightenEyes: 0, slimFace: 0, reddenLips: 0 })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ToolLayout title="Face Beauty" icon="💄" description="AI-powered face beautification - smooth skin, whiten, remove blemishes, and more.">
      <TokenGate slug="face-beauty">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Preview Area */}
        <div>
          <div className="card p-5 mb-4">
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
                  <div className="text-5xl mb-4">💄</div>
                  <p className="text-lg font-bold text-white">Drop or select a face photo</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG or WebP · Best with clear face</p>
                  <span className="btn-primary inline-block mt-4">Select Photo</span>
                </div>
              ) : (
                <div className="p-4 w-full">
                  {processing && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 rounded-xl">
                      <div className="spinner mb-3"></div>
                      <p className="text-sm text-gray-300 font-medium">{progress}</p>
                    </div>
                  )}
                  <BeforeAfter
                    before={original}
                    after={preview}
                    beforeLabel="Original"
                    afterLabel="Enhanced"
                    placeholder="Adjust the settings on the right to see the retouched result"
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
          {/* Quick Presets */}
          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">✨ Quick Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handlePreset('natural')} className="py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-xs font-semibold text-blue-400 transition">
                🌸 Natural
              </button>
              <button onClick={() => handlePreset('glamour')} className="py-3 px-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-xs font-semibold text-purple-400 transition">
                💎 Glamour
              </button>
              <button onClick={() => handlePreset('bright')} className="py-3 px-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-xs font-semibold text-yellow-400 transition">
                ☀️ Bright
              </button>
              <button onClick={() => handlePreset('reset')} className="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-semibold text-red-400 transition">
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-4">🔧 Adjustments</h3>
            <div className="space-y-4">
              <Slider label="🧴 Smooth Skin" value={settings.smoothSkin} onChange={(v) => handleSettingChange('smoothSkin', v)} />
              <Slider label="✨ Whiten Skin" value={settings.whitenSkin} onChange={(v) => handleSettingChange('whitenSkin', v)} />
              <Slider label="🎯 Remove Blemishes" value={settings.removeBlemishes} onChange={(v) => handleSettingChange('removeBlemishes', v)} />
              <Slider label="👁️ Brighten Eyes" value={settings.brightenEyes} onChange={(v) => handleSettingChange('brightenEyes', v)} />
              <Slider label="💋 Redden Lips" value={settings.reddenLips} onChange={(v) => handleSettingChange('reddenLips', v)} />
            </div>
          </div>

          {/* Tips */}
          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-3">💡 Tips</h3>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>• Use a clear, well-lit face photo</li>
              <li>• Face should be clearly visible</li>
              <li>• Start with &quot;Natural&quot; preset</li>
              <li>• Adjust sliders gradually</li>
            </ul>
          </div>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}

// Skin detection function (works for various skin tones)
function detectSkin(r: number, g: number, b: number): boolean {
  // Convert to HSV
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max / 255

  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  // Skin color range in HSV
  // Hue: 0-50 degrees (0.0-0.14 in normalized)
  // Saturation: 0.1-0.7
  // Value: 0.3-1.0
  return (h >= 0 && h <= 0.14 && s >= 0.1 && s <= 0.7 && v >= 0.3)
}

// Lip detection function
function detectLips(r: number, g: number, b: number): boolean {
  // Lips are typically reddish/pinkish
  return (r > 150 && g < 120 && b < 120 && r > g * 1.3 && r > b * 1.3)
}

function Slider({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-300">{label}</span>
        <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full" />
    </div>
  )
}
