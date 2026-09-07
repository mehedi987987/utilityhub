/**
 * ---------------------------------------------------------------------------
 * Adsterra configuration
 * ---------------------------------------------------------------------------
 *
 * Fill these in from your Adsterra dashboard (Websites -> your site -> Get code).
 * They are public values that ship to the browser, which is normal for ad keys —
 * they are not secrets. Leaving a key empty simply hides that slot, so the site
 * works fine before the account is approved.
 *
 * Set them in .env.local:
 *   NEXT_PUBLIC_ADSTERRA_BANNER_KEY=xxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_ADSTERRA_NATIVE_ID=xxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_ADSTERRA_SOCIAL_KEY=xxxxxxxxxxxxxxxx
 */

export interface BannerFormat {
  key: string
  width: number
  height: number
}

/** Banner ("iframe") units. Each size needs its own key in Adsterra. */
export const BANNERS = {
  /** 728x90 — desktop leaderboard, shown above the footer on wide screens. */
  leaderboard: {
    key: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY || '',
    width: 728,
    height: 90,
  },
  /** 320x50 — mobile banner, used where the leaderboard will not fit. */
  mobile: {
    key: process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_KEY || '',
    width: 320,
    height: 50,
  },
  /** 300x250 — rectangle, used in the tool sidebar and on Earn Tokens. */
  rectangle: {
    key: process.env.NEXT_PUBLIC_ADSTERRA_RECTANGLE_KEY || '',
    width: 300,
    height: 250,
  },
} satisfies Record<string, BannerFormat>

/** Native Banner unit id (the "container-xxxx" script). */
export const NATIVE_ID = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID || ''

/**
 * Social Bar / Popunder key.
 *
 * NOTE ON POPUNDERS: they pay more but they open windows the visitor did not
 * ask for. On a utility site that is the fastest way to lose repeat visitors,
 * and Google Search treats intrusive interstitials as a ranking negative.
 * Social Bar (a docked strip) is the safer of the two — it is what this key
 * drives. Popunder is intentionally not wired up anywhere.
 */
export const SOCIAL_BAR_KEY = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_KEY || ''

/** Master switch — set NEXT_PUBLIC_ADS_ENABLED=false to turn every slot off. */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED !== 'false'

/**
 * Routes that must never show ads.
 * Ad networks suspend accounts for ads on pages with no real content, and
 * showing ads on the checkout-like auth screens hurts conversion.
 */
const AD_FREE_PREFIXES = ['/login', '/signup', '/account']

export function adsAllowedOn(pathname: string): boolean {
  if (!ADS_ENABLED) return false
  return !AD_FREE_PREFIXES.some((p) => pathname.startsWith(p))
}
