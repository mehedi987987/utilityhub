import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Islamic Date Converter',
  description: 'Convert between Gregorian and Hijri calendar dates.',
  alternates: { canonical: '/tools/islamic-date' },
  openGraph: {
    title: 'Islamic Date Converter — Work Gate',
    description: 'Convert between Gregorian and Hijri calendar dates.',
    url: '/tools/islamic-date',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
