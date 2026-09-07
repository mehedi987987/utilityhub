"use client"
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { TOKENS } from '@/lib/authConfig'

export default function TokenBalance({ size = 'normal' }: { size?: 'normal' | 'large' }) {
  const { user } = useAuth()
  if (!user) return null

  const runs = Math.floor(user.tokens / TOKENS.costPerUse)
  const low = user.tokens < TOKENS.costPerUse * 2

  if (size === 'large') {
    return (
      <div className="inline-flex flex-col items-center">
        <div className="flex items-baseline gap-2.5">
          <span className="text-5xl" aria-hidden="true">🪙</span>
          <span className="text-5xl font-extrabold text-white tabular-nums">{user.tokens}</span>
          <span className="text-sm text-gray-500 font-medium">tokens</span>
        </div>
        <p className={`text-xs mt-2 ${low ? 'text-amber-300' : 'text-gray-500'}`}>
          {runs > 0 ? `Enough for ${runs} more tool run${runs === 1 ? '' : 's'}` : 'Not enough for a run'}
        </p>
      </div>
    )
  }

  return (
    <Link
      href="/earn-tokens"
      className={`token-chip ${low ? 'is-low' : ''}`}
      title={`${user.tokens} tokens · ${runs} runs left`}
    >
      <span aria-hidden="true">🪙</span>
      <span className="tabular-nums font-bold">{user.tokens}</span>
      <span className="token-chip-plus" aria-hidden="true">+</span>
    </Link>
  )
}
