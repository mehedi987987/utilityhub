"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TOKENS } from '@/lib/authConfig'
import TokenBalance from '@/components/TokenBalance'

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

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
        <span className="icon-tile mx-auto mb-4" aria-hidden="true">👤</span>
        <h1 className="text-xl font-bold text-white mb-2">You are not signed in</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to see your account and tokens.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login?next=/account" className="btn-primary text-sm">Sign in</Link>
          <Link href="/signup?next=/account" className="btn-secondary text-sm">Sign up free</Link>
        </div>
      </div>
    )
  }

  const initial = (user.displayName || user.email).charAt(0).toUpperCase()
  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-[720px] mx-auto px-4 py-12">
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-white truncate">{user.displayName}</h1>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Member since {joined}</p>
          </div>
        </div>
      </div>

      <div className="card p-8 mb-4 text-center">
        <TokenBalance size="large" />
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link href="/earn-tokens" className="btn-primary text-sm">🎁 Earn more tokens</Link>
          <Link href="/#tools" className="btn-secondary text-sm">🛠️ Use a tool</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Per tool run', value: `${TOKENS.costPerUse}` },
          { label: 'Per ad watched', value: `+${TOKENS.rewardPerAd}` },
          { label: 'Daily bonus', value: `+${TOKENS.dailyBonus}` },
          { label: 'Ads per day', value: `${TOKENS.dailyAdLimit}` },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-lg font-bold text-white tabular-nums">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-white text-sm mb-1">Sign out</h2>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Your tokens stay on your account and will be here when you sign back in.
        </p>
        <button
          onClick={() => { logout(); router.push('/') }}
          className="btn-secondary text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
