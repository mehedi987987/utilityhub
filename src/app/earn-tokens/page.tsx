"use client"
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import RewardedAdCard from '@/components/RewardedAdCard'
import TokenBalance from '@/components/TokenBalance'
import { TOKENS } from '@/lib/authConfig'

export default function EarnTokensPage() {
  const { user, loading, claimDailyBonus, canClaimDailyBonus } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-[460px] mx-auto px-4 py-20 text-center">
        <span className="icon-tile mx-auto mb-4" aria-hidden="true">🔐</span>
        <h1 className="text-xl font-bold text-white mb-2">Sign in to earn tokens</h1>
        <p className="text-sm text-gray-400 mb-6">
          Create a free account and get {TOKENS.signupBonus} tokens to start.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/signup?next=/earn-tokens" className="btn-primary text-sm">Sign up free</Link>
          <Link href="/login?next=/earn-tokens" className="btn-secondary text-sm">Sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="hero-glow dot-grid pt-12 pb-8">
        <div className="max-w-[900px] mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            Earn <span className="headline-gradient">free tokens</span>
          </h1>
          <p className="text-sm text-gray-400 mb-7 max-w-lg mx-auto leading-relaxed">
            Tokens keep the AI tools running. Watch an ad or claim your daily bonus — no payment
            needed, ever.
          </p>
          <TokenBalance size="large" />
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <RewardedAdCard />

          {/* Daily bonus */}
          <div className="card p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-5">
              <span className="icon-tile" aria-hidden="true">🎁</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-white">Daily bonus</h2>
                <p className="text-xs text-gray-500 mt-1">Once every 24 hours</p>
              </div>
              <span className="badge bg-violet-500/15 text-violet-300 border border-violet-500/25 flex-shrink-0">
                +{TOKENS.dailyBonus}
              </span>
            </div>

            <div className="ad-surface mb-4 !min-h-[150px]">
              <div className="text-center">
                <p className="text-4xl mb-2">{canClaimDailyBonus ? '🎁' : '✅'}</p>
                <p className="text-sm text-gray-400">
                  {canClaimDailyBonus ? 'Your bonus is ready' : 'Claimed for today'}
                </p>
                {!canClaimDailyBonus && (
                  <p className="text-[11px] text-gray-600 mt-1">Come back tomorrow</p>
                )}
              </div>
            </div>

            <button
              onClick={claimDailyBonus}
              disabled={!canClaimDailyBonus}
              className="btn-primary w-full text-sm mt-auto disabled:opacity-50"
            >
              {canClaimDailyBonus ? `Claim ${TOKENS.dailyBonus} tokens` : 'Already claimed'}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="card p-6">
          <h2 className="font-bold text-white text-sm mb-4">How tokens work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { n: '1', t: 'Get tokens', d: `${TOKENS.signupBonus} free when you sign up, ${TOKENS.rewardPerAd} per ad, ${TOKENS.dailyBonus} daily.` },
              { n: '2', t: 'Use a tool', d: `Each run costs ${TOKENS.costPerUse} tokens.` },
              { n: '3', t: 'Top up anytime', d: `Up to ${TOKENS.dailyAdLimit} ads a day, so ${TOKENS.dailyAdLimit * TOKENS.rewardPerAd} tokens is always within reach.` },
            ].map((s) => (
              <div key={s.n} className="flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{s.t}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/#tools" className="btn-secondary text-sm">🛠️ Back to tools</Link>
        </div>
      </div>
    </>
  )
}
