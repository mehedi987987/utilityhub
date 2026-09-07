import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zakat Calculator',
  description: 'Calculate Zakat due on cash, gold, silver and business assets.',
  alternates: { canonical: '/tools/zakat' },
  openGraph: {
    title: 'Zakat Calculator — UtilityHub',
    description: 'Calculate Zakat due on cash, gold, silver and business assets.',
    url: '/tools/zakat',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
