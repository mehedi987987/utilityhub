import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signature Maker',
  description: 'Resize and clean up a scanned signature for online applications.',
  alternates: { canonical: '/tools/signature-maker' },
  openGraph: {
    title: 'Signature Maker — Work Gate',
    description: 'Resize and clean up a scanned signature for online applications.',
    url: '/tools/signature-maker',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
