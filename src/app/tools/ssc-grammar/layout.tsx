import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSC Grammar Solution',
  description: 'Interactive SSC English grammar book with solved exercises.',
  alternates: { canonical: '/tools/ssc-grammar' },
  openGraph: {
    title: 'SSC Grammar Solution — UtilityHub',
    description: 'Interactive SSC English grammar book with solved exercises.',
    url: '/tools/ssc-grammar',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
