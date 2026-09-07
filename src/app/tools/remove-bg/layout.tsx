import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Background',
  description: 'Remove an image background and replace it with a colour or your own photo.',
  alternates: { canonical: '/tools/remove-bg' },
  openGraph: {
    title: 'Remove Background — UtilityHub',
    description: 'Remove an image background and replace it with a colour or your own photo.',
    url: '/tools/remove-bg',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
