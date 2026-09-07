"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TOKENS } from '@/lib/authConfig'
import ErrorBanner from '@/components/ErrorBanner'

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup'
  const { login, signup, googleLogin } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (isSignup) await signup(email, password, name)
      else await login(email, password)
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const withGoogle = async () => {
    setError(null)
    setBusy(true)
    try {
      await googleLogin()
      router.push(next)
    } catch {
      setError('Google sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="hero-glow dot-grid min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-gray-400">
            {isSignup
              ? `Get ${TOKENS.signupBonus} free tokens to start using the tools.`
              : 'Sign in to keep using your tokens.'}
          </p>
        </div>

        <div className="card p-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />

          <button
            type="button"
            onClick={withGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-gray-800 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-60"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
              <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.14 6.16-4.14z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-gray-500 font-medium">OR</span>
            <span className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-400 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-16"
                  placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-500 hover:text-gray-300"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full !py-3">
              {busy ? 'Please wait...' : isSignup ? `Create account` : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={isSignup ? '/login' : '/signup'}
              className="text-violet-300 hover:text-violet-200 font-semibold"
            >
              {isSignup ? 'Sign in' : 'Sign up free'}
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-4 leading-relaxed">
          By continuing you agree to our{' '}
          <Link href="/privacy" className="text-gray-500 hover:text-gray-400 underline">privacy policy</Link>.
        </p>

        <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/8 p-3.5">
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong>Demo mode.</strong> Accounts are stored in this browser only — no real server
            yet, so do not use a password you use anywhere else.
          </p>
        </div>
      </div>
    </div>
  )
}
