"use client"
import AdBanner from './AdBanner'
import { BANNERS } from '@/lib/adsConfig'

/**
 * Full-width horizontal ad placement.
 *
 * Shows the 728x90 leaderboard on desktop and the 320x50 unit on mobile.
 * Both are rendered but only one is visible per breakpoint, because Adsterra
 * keys are size-specific and a 728px unit simply will not fit a phone.
 */
export default function AdRail({ className = '' }: { className?: string }) {
  const hasAny = BANNERS.leaderboard.key || BANNERS.mobile.key
  if (!hasAny) return null

  return (
    <div className={`ad-rail ${className}`}>
      <div className="ad-rail-inner">
        <div className="hidden md:block">
          <AdBanner format={BANNERS.leaderboard} />
        </div>
        <div className="md:hidden">
          <AdBanner format={BANNERS.mobile} />
        </div>
      </div>
    </div>
  )
}
