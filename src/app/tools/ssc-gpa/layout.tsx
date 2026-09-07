import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSC GPA Calculator',
  description: 'Calculate your SSC GPA from subject grades under the Bangladesh system.',
  alternates: { canonical: '/tools/ssc-gpa' },
  openGraph: {
    title: 'SSC GPA Calculator — UtilityHub',
    description: 'Calculate your SSC GPA from subject grades under the Bangladesh system.',
    url: '/tools/ssc-gpa',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
