"use client"
import { useCallback, useEffect, useRef, useState } from 'react'

interface BeforeAfterProps {
  before: string
  after: string | null
  /** Shown in the corner labels. */
  beforeLabel?: string
  afterLabel?: string
  /** Message shown in place of the slider while there is no result yet. */
  placeholder?: string
  /** Checkerboard behind the image, for transparent PNGs. */
  transparent?: boolean
  className?: string
}

export default function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  placeholder = 'Adjust the settings to see a preview',
  transparent = false,
  className = '',
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, next)))
  }, [])

  // Track the pointer anywhere on the page while dragging, so the handle
  // keeps following even if the cursor leaves the image.
  useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      e.preventDefault()
      setFromClientX(e.clientX)
    }
    const stop = () => setDragging(false)

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [dragging, setFromClientX])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos((p) => Math.max(0, p - step)) }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPos((p) => Math.min(100, p + step)) }
    if (e.key === 'Home') { e.preventDefault(); setPos(0) }
    if (e.key === 'End') { e.preventDefault(); setPos(100) }
  }

  // Nothing to compare yet — show the original with a hint.
  if (!after) {
    return (
      <div className={`ba-frame ${transparent ? 'ba-checker' : ''} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="ba-img" />
        <div className="ba-placeholder">
          <p>{placeholder}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        ref={frameRef}
        className={`ba-frame ba-interactive ${transparent ? 'ba-checker' : ''} ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={(e) => {
          // Ignore right/middle clicks.
          if (e.button !== 0) return
          setDragging(true)
          setFromClientX(e.clientX)
        }}
      >
        {/* After image sits underneath and is fully visible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt={afterLabel} className="ba-img" draggable={false} />

        {/* Before image is clipped to the left of the handle. */}
        <div className="ba-clip" style={{ width: `${pos}%` }}>
          {/* The inner wrapper keeps the image at full frame width so it
              does not squash as the clip narrows. */}
          <div className="ba-clip-inner" style={{ width: `${(100 / Math.max(pos, 0.001)) * 100}%` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={before} alt={beforeLabel} className="ba-img" draggable={false} />
          </div>
        </div>

        {/* Labels fade out when the handle covers them. */}
        <span className="ba-label ba-label-left" style={{ opacity: pos > 12 ? 1 : 0 }}>
          {beforeLabel}
        </span>
        <span className="ba-label ba-label-right" style={{ opacity: pos < 88 ? 1 : 0 }}>
          {afterLabel}
        </span>

        {/* Divider + handle */}
        <div className="ba-divider" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="ba-handle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
            </svg>
          </span>
        </div>

        {/* Accessible control overlaying the frame. */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          onKeyDown={onKeyDown}
          className="ba-range"
          aria-label={`Reveal ${beforeLabel} or ${afterLabel}. Drag to compare.`}
          aria-valuetext={`${Math.round(pos)}% ${beforeLabel}`}
        />
      </div>

      <div className="flex items-center justify-between mt-2.5 px-0.5">
        <p className="text-[11px] text-gray-500">Drag the handle to compare</p>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setPos(0)} className="ba-quick">{afterLabel}</button>
          <button type="button" onClick={() => setPos(50)} className="ba-quick">Split</button>
          <button type="button" onClick={() => setPos(100)} className="ba-quick">{beforeLabel}</button>
        </div>
      </div>
    </div>
  )
}
