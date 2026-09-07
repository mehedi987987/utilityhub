import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Age Calculator',
  description: 'Find your exact age in years, months, weeks and days.',
  alternates: { canonical: '/tools/age' },
  openGraph: {
    title: 'Age Calculator — Work Gate',
    description: 'Find your exact age in years, months, weeks and days.',
    url: '/tools/age',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
