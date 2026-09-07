import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to JPG',
  description: 'Convert every page of a PDF into downloadable JPG images.',
  alternates: { canonical: '/tools/pdf-to-jpg' },
  openGraph: {
    title: 'PDF to JPG — UtilityHub',
    description: 'Convert every page of a PDF into downloadable JPG images.',
    url: '/tools/pdf-to-jpg',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
