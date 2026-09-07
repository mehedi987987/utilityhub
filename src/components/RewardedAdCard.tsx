"use client"
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TOKENS } from '@/lib/authConfig'

type Phase = 'idle' | 'loading' | 'playing' | 'done'

/** How long the simulated ad runs, in seconds. */
const AD_SECONDS = 15

/**
 * DESIGN-STAGE PLACEHOLDER.
 *
 * This simulates a rewarded ad so the flow can be reviewed. When wiring up a
 * real network (Adsterra, AdMob, etc.):
 *
 *   1. Replace startAd() with the network's SDK call.
 *   2. Grant the reward from the network's SERVER-TO-SERVER postback, not from
 *      this component. A reward granted in the browser can be triggered by
 *      anyone with DevTools, and ad networks will suspend an account for the
 *      inflated impressions that follow.
 *   3. Keep the daily cap enforced on the server as well.
 */
export default function RewardedAdCard() {
  const { user, registerAdWatched, adsRemainingToday } = useAuth()
  const [phase, setPhase] = useState<Phase>('idle')
  const [left, setLeft] = useState(AD_SECONDS)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const startAd = () => {
    if (adsRemainingToday <= 0) return
    setPhase('loading')

    // Simulated network latency before the ad shows.
    setTimeout(() => {
      setPhase('playing')
      setLeft(AD_SECONDS)
      timer.current = setInterval(() => {
        setLeft((prev) => {
          if (prev <= 1) {
            if (timer.current) clearInterval(timer.current)
            registerAdWatched()
            setPhase('done')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 900)
  }

  const progress = ((AD_SECONDS - left) / AD_SECONDS) * 100
  const exhausted = adsRemainingToday <= 0

  return (
    <div className="card p-6">
      <div className="flex items-start gap-4 mb-5">
        <span className="icon-tile" aria-hidden="true">🎬</span>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white">Watch an ad</h2>
          <p className="text-xs text-gray-500 mt-1">
            About {AD_SECONDS} seconds · earn {TOKENS.rewardPerAd} tokens
          </p>
        </div>
        <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex-shrink-0">
          +{TOKENS.rewardPerAd}
        </span>
      </div>

      {/* Ad surface */}
      <div className="ad-surface mb-4">
        {phase === 'idle' && (
          <div className="text-center">
            <p className="text-sm text-gray-400">Your ad will appear here</p>
            <p className="text-[11px] text-gray-600 mt-1">Ad slot · 336 × 280</p>
          </div>
        )}

        {phase === 'loading' && (
          <div className="text-center">
            <div className="spinner mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading ad...</p>
          </div>
        )}

        {phase === 'playing' && (
          <div className="text-center w-full px-6">
            <p className="text-4xl font-extrabold text-white tabular-nums mb-1">{left}</p>
            <p className="text-xs text-gray-400 mb-4">Keep this tab open</p>
            <div className="ad-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-sm font-semibold text-emerald-300">
              +{TOKENS.rewardPerAd} tokens added
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Balance: {user?.tokens ?? 0} tokens
            </p>
          </div>
        )}
      </div>

      {phase === 'done' ? (
        <button
          onClick={() => { setPhase('idle'); setLeft(AD_SECONDS) }}
          disabled={exhausted}
          className="btn-secondary w-full text-sm disabled:opacity-50"
        >
          {exhausted ? 'Daily limit reached' : 'Watch another'}
        </button>
      ) : (
        <button
          onClick={startAd}
          disabled={phase !== 'idle' || exhausted}
          className="btn-primary w-full text-sm disabled:opacity-50"
        >
          {exhausted
            ? 'Daily limit reached'
            : phase === 'idle'
              ? `▶ Watch ad for ${TOKENS.rewardPerAd} tokens`
              : 'Ad in progress...'}
        </button>
      )}

      <p className="text-[11px] text-gray-600 text-center mt-3">
        {adsRemainingToday} of {TOKENS.dailyAdLimit} ads left today
      </p>
    </div>
  )
}
