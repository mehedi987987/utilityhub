import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percentage Calculator',
  description: 'Quick percentage increase, decrease and of-value calculations.',
  alternates: { canonical: '/tools/percentage' },
  openGraph: {
    title: 'Percentage Calculator — UtilityHub',
    description: 'Quick percentage increase, decrease and of-value calculations.',
    url: '/tools/percentage',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
