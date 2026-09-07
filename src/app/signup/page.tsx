import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create a free Work Gate account and get 100 tokens to start using the tools.',
  robots: { index: false, follow: true },
}

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  )
}
