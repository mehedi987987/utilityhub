"use client"
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { adsAllowedOn, type BannerFormat } from '@/lib/adsConfig'

interface AdBannerProps {
  format: BannerFormat
  /** Small caption above the unit. Ad networks require ads to be labelled. */
  label?: boolean
  className?: string
}

/**
 * Renders an Adsterra banner inside a sandboxed iframe.
 *
 * Why an iframe: Adsterra's snippet calls document.write() and defines a global
 * `atOptions` object. Injected directly into a React tree it either wipes the
 * document or collides with a second unit on the same page. Isolating each unit
 * in its own iframe fixes both, keeps a slow ad from blocking our own JS, and
 * stops the ad from reading the page around it.
 */
export default function AdBanner({ format, label = true, className = '' }: AdBannerProps) {
  const pathname = usePathname()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [filled, setFilled] = useState(false)

  const { key, width, height } = format
  const allowed = adsAllowedOn(pathname) && Boolean(key)

  useEffect(() => {
    if (!allowed) return
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    doc.open()
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent}
  body{display:flex;align-items:center;justify-content:center}
</style></head><body>
<script type="text/javascript">
  atOptions = {
    'key': ${JSON.stringify(key)},
    'format': 'iframe',
    'height': ${height},
    'width': ${width},
    'params': {}
  };
<\/script>
<script type="text/javascript" src="//www.highperformanceformat.com/${key}/invoke.js"><\/script>
</body></html>`)
    doc.close()

    // If the network never fills the slot, collapse it rather than leaving a
    // labelled empty box on the page.
    const timeout = setTimeout(() => {
      try {
        const body = iframe.contentDocument?.body
        setFilled(Boolean(body && body.scrollHeight > 10))
      } catch {
        // Cross-origin once the ad loads — that means it filled.
        setFilled(true)
      }
    }, 2500)

    return () => clearTimeout(timeout)
  }, [allowed, key, width, height])

  if (!allowed) return null

  return (
    <div
      className={`ad-slot ${filled ? 'is-filled' : ''} ${className}`}
      style={{ maxWidth: width }}
    >
      {label && <span className="ad-slot-label">Advertisement</span>}
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={width}
        height={height}
        scrolling="no"
        frameBorder={0}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        style={{ width, height, border: 0, display: 'block' }}
      />
    </div>
  )
}
