"use client"
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SOCIAL_BAR_KEY, adsAllowedOn } from '@/lib/adsConfig'

/**
 * Adsterra Social Bar — a docked strip the network positions itself.
 *
 * Loaded once for the whole app, after the page is interactive, so it never
 * competes with our own JavaScript for bandwidth on first paint.
 */
export default function SocialBar() {
  const pathname = usePathname()
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    if (!adsAllowedOn(pathname) || !SOCIAL_BAR_KEY) return

    loaded.current = true

    const inject = () => {
      const script = document.createElement('script')
      script.async = true
      script.dataset.cfasync = 'false'
      script.src = `//pl${SOCIAL_BAR_KEY}.profitablecpmrate.com/${SOCIAL_BAR_KEY}/invoke.js`
      document.body.appendChild(script)
    }

    // Wait for idle so the ad script cannot delay our Largest Contentful Paint.
    if ('requestIdleCallback' in window) {
      const id = (window as Window & typeof globalThis).requestIdleCallback(inject, { timeout: 4000 })
      return () => (window as Window & typeof globalThis).cancelIdleCallback?.(id)
    }
    const t = setTimeout(inject, 2500)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}
