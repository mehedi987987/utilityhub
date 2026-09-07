"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { TOKENS } from '@/lib/authConfig'

/**
 * ============================================================================
 * DESIGN-STAGE MOCK ONLY — NOT SECURE
 * ============================================================================
 * Everything here lives in localStorage so the UI can be built and reviewed
 * without a backend. A user can open DevTools and give themselves unlimited
 * tokens, and passwords are stored in plain text.
 *
 * Before launch this must be replaced with a real backend (Supabase, Firebase
 * or NextAuth + a database) where:
 *   - the token balance is authoritative on the SERVER, never the client
 *   - tokens are deducted inside the API route that does the paid work
 *     (src/app/api/remove-bg, src/app/api/enhance), not in the browser
 *   - ad completion is verified with the ad network's server-side callback,
 *     otherwise users will fake "I watched an ad" requests
 * The component API below is intentionally shaped so that swapping the
 * implementation will not require changing any screen that consumes it.
 * ============================================================================
 */

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  tokens: number
  createdAt: string
  /** ISO date (yyyy-mm-dd) the daily bonus was last claimed. */
  lastDailyBonus?: string
  /** Ads watched today, reset each day. */
  adsToday?: number
  adsDate?: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => void
  /** Returns false when the balance is too low. */
  spendTokens: (amount?: number) => boolean
  addTokens: (amount: number) => void
  claimDailyBonus: () => boolean
  canClaimDailyBonus: boolean
  adsRemainingToday: number
  registerAdWatched: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_KEY = 'workgate_user'
const USERS_KEY = 'workgate_users'

const today = () => new Date().toISOString().slice(0, 10)

function readUsers(): Array<User & { password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {
      localStorage.removeItem(USER_KEY)
    }
    setLoading(false)
  }, [])

  const persist = useCallback((u: User | null) => {
    setUser(u)
    if (!u) {
      localStorage.removeItem(USER_KEY)
      return
    }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    // Keep the balance in sync with the "accounts table" too.
    const users = readUsers()
    const i = users.findIndex((x) => x.uid === u.uid)
    if (i !== -1) {
      users[i] = { ...users[i], ...u }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const found = readUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Wrong email or password.')
    const { password: _pw, ...safe } = found
    persist(safe)
  }, [persist])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new Error('Enter a valid email address.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters.')
    if (!name.trim()) throw new Error('Please enter your name.')

    const users = readUsers()
    if (users.some((u) => u.email.toLowerCase() === clean)) {
      throw new Error('That email is already registered.')
    }

    const created: User & { password: string } = {
      uid: `u_${Date.now()}`,
      email: clean,
      displayName: name.trim(),
      photoURL: '',
      tokens: TOKENS.signupBonus,
      createdAt: new Date().toISOString(),
      password,
    }
    users.push(created)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const { password: _pw, ...safe } = created
    persist(safe)
  }, [persist])

  const googleLogin = useCallback(async () => {
    // Placeholder for the real OAuth flow.
    const users = readUsers()
    const existing = users.find((u) => u.uid.startsWith('g_'))
    if (existing) {
      const { password: _pw, ...safe } = existing
      persist(safe)
      return
    }
    const created: User & { password: string } = {
      uid: `g_${Date.now()}`,
      email: 'demo.user@gmail.com',
      displayName: 'Demo User',
      photoURL: '',
      tokens: TOKENS.signupBonus,
      createdAt: new Date().toISOString(),
      password: '',
    }
    users.push(created)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const { password: _pw, ...safe } = created
    persist(safe)
  }, [persist])

  const logout = useCallback(() => persist(null), [persist])

  const addTokens = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, tokens: prev.tokens + amount }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const spendTokens = useCallback((amount: number = TOKENS.costPerUse) => {
    if (!user || user.tokens < amount) return false
    persist({ ...user, tokens: user.tokens - amount })
    return true
  }, [user, persist])

  const canClaimDailyBonus = Boolean(user && user.lastDailyBonus !== today())

  const claimDailyBonus = useCallback(() => {
    if (!user || user.lastDailyBonus === today()) return false
    persist({
      ...user,
      tokens: user.tokens + TOKENS.dailyBonus,
      lastDailyBonus: today(),
    })
    return true
  }, [user, persist])

  const adsRemainingToday = useMemo(() => {
    if (!user) return 0
    const count = user.adsDate === today() ? user.adsToday ?? 0 : 0
    return Math.max(0, TOKENS.dailyAdLimit - count)
  }, [user])

  const registerAdWatched = useCallback(() => {
    if (!user) return
    const sameDay = user.adsDate === today()
    persist({
      ...user,
      tokens: user.tokens + TOKENS.rewardPerAd,
      adsToday: (sameDay ? user.adsToday ?? 0 : 0) + 1,
      adsDate: today(),
    })
  }, [user, persist])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    spendTokens,
    addTokens,
    claimDailyBonus,
    canClaimDailyBonus,
    adsRemainingToday,
    registerAdWatched,
  }), [
    user, loading, login, signup, googleLogin, logout, spendTokens,
    addTokens, claimDailyBonus, canClaimDailyBonus, adsRemainingToday, registerAdWatched,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
