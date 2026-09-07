import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate strong, random passwords with the options you need.',
  alternates: { canonical: '/tools/password-generator' },
  openGraph: {
    title: 'Password Generator — UtilityHub',
    description: 'Generate strong, random passwords with the options you need.',
    url: '/tools/password-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
