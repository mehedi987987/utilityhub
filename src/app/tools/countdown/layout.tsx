import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Countdown Timer',
  description: 'Count down to any date and time with a live timer.',
  alternates: { canonical: '/tools/countdown' },
  openGraph: {
    title: 'Countdown Timer — UtilityHub',
    description: 'Count down to any date and time with a live timer.',
    url: '/tools/countdown',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
