"use client"
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TOKENS, isToolGated } from '@/lib/authConfig'

interface TokenGateProps {
  /** Tool slug, used to decide whether this tool is gated at all. */
  slug: string
  children: ReactNode
}

export default function TokenGate({ slug, children }: TokenGateProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Not gated by config — render normally.
  if (!isToolGated(slug)) return <>{children}</>

  if (loading) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-[460px] mx-auto py-10">
        <div className="card p-8 text-center">
          <span className="icon-tile mx-auto mb-4" aria-hidden="true">🔐</span>
          <h2 className="text-lg font-bold text-white mb-2">Sign in to use this tool</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Creating an account is free and takes a few seconds. You get{' '}
            <strong className="text-violet-300">{TOKENS.signupBonus} tokens</strong> straight away —
            enough for {Math.floor(TOKENS.signupBonus / TOKENS.costPerUse)} runs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/signup?next=${encodeURIComponent(pathname)}`}
              className="btn-primary text-sm"
            >
              Sign up free
            </Link>
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="btn-secondary text-sm"
            >
              I have an account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (user.tokens < TOKENS.costPerUse) {
    return (
      <div className="max-w-[460px] mx-auto py-10">
        <div className="card p-8 text-center">
          <span className="icon-tile mx-auto mb-4" aria-hidden="true">🪙</span>
          <h2 className="text-lg font-bold text-white mb-2">You are out of tokens</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-1">
            This tool costs <strong className="text-white">{TOKENS.costPerUse} tokens</strong> per
            run. Your balance is <strong className="text-white">{user.tokens}</strong>.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Watch a short ad to get {TOKENS.rewardPerAd} tokens, or claim your daily bonus.
          </p>
          <Link href="/earn-tokens" className="btn-primary text-sm">
            🎁 Earn free tokens
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
