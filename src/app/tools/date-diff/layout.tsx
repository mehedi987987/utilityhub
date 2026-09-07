import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Date Difference Calculator',
  description: 'Count the days, weeks and months between two dates.',
  alternates: { canonical: '/tools/date-diff' },
  openGraph: {
    title: 'Date Difference Calculator — UtilityHub',
    description: 'Count the days, weeks and months between two dates.',
    url: '/tools/date-diff',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
