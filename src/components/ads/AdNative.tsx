"use client"
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { NATIVE_ID, adsAllowedOn } from '@/lib/adsConfig'

/**
 * Adsterra "Native Banner" — a responsive block that mimics a content grid.
 * Unlike the iframe banners this one is designed to be injected into the page,
 * so it can adapt to the container width.
 */
export default function AdNative({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const mounted = useRef(false)
  const allowed = adsAllowedOn(pathname) && Boolean(NATIVE_ID)

  useEffect(() => {
    if (!allowed || mounted.current) return
    mounted.current = true

    const script = document.createElement('script')
    script.async = true
    script.dataset.cfasync = 'false'
    script.src = `//pl${NATIVE_ID}.profitablecpmrate.com/${NATIVE_ID}/invoke.js`
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [allowed])

  if (!allowed) return null

  return (
    <div className={`ad-slot ${className}`}>
      <span className="ad-slot-label">Advertisement</span>
      <div id={`container-${NATIVE_ID}`} />
    </div>
  )
}
