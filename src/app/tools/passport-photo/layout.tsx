import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passport Photo Maker',
  description: 'Create passport size photos in standard sizes, right in your browser.',
  alternates: { canonical: '/tools/passport-photo' },
  openGraph: {
    title: 'Passport Photo Maker — Work Gate',
    description: 'Create passport size photos in standard sizes, right in your browser.',
    url: '/tools/passport-photo',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
