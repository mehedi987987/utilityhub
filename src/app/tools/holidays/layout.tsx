import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bangladesh Public Holidays',
  description: 'Full list of Bangladesh government public holidays.',
  alternates: { canonical: '/tools/holidays' },
  openGraph: {
    title: 'Bangladesh Public Holidays — Work Gate',
    description: 'Full list of Bangladesh government public holidays.',
    url: '/tools/holidays',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
