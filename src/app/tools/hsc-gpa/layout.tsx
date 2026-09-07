import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HSC GPA Calculator',
  description: 'Calculate your HSC GPA from subject grades under the Bangladesh system.',
  alternates: { canonical: '/tools/hsc-gpa' },
  openGraph: {
    title: 'HSC GPA Calculator — Work Gate',
    description: 'Calculate your HSC GPA from subject grades under the Bangladesh system.',
    url: '/tools/hsc-gpa',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
