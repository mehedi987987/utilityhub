import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to PDF',
  description: 'Combine JPG and PNG images into a single PDF document.',
  alternates: { canonical: '/tools/jpg-to-pdf' },
  openGraph: {
    title: 'JPG to PDF — UtilityHub',
    description: 'Combine JPG and PNG images into a single PDF document.',
    url: '/tools/jpg-to-pdf',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
