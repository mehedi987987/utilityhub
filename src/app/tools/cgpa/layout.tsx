import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'University CGPA Calculator',
  description: 'Calculate semester and cumulative CGPA from your course grades.',
  alternates: { canonical: '/tools/cgpa' },
  openGraph: {
    title: 'University CGPA Calculator — Work Gate',
    description: 'Calculate semester and cumulative CGPA from your course grades.',
    url: '/tools/cgpa',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
