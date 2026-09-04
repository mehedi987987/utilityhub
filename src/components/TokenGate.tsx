"use client"
import { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function TokenGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-3">🔐</p>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-gray-500 mb-4">
            Please login to use this tool. New users get 100 free tokens!
          </p>
          <Link href="/login" className="inline-block bg-blue text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
            Login / Sign Up
          </Link>
        </div>
      </div>
    )
  }

  if (user.tokens < 10) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-3">🪙</p>
          <h2 className="text-xl font-bold mb-2">Not Enough Tokens</h2>
          <p className="text-sm text-gray-500 mb-2">
            You need at least 10 tokens to use a tool. Your balance: <strong>{user.tokens}</strong> tokens.
          </p>
          <p className="text-xs text-gray-400 mb-4">Watch ads to earn more tokens. Each ad gives 50 tokens.</p>
          <Link href="/earn-tokens" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition">
            Earn Tokens
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
