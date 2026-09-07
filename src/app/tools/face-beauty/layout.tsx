import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Face Beauty',
  description: 'Retouch portraits with smoothing, brightening and tone presets.',
  alternates: { canonical: '/tools/face-beauty' },
  openGraph: {
    title: 'Face Beauty — UtilityHub',
    description: 'Retouch portraits with smoothing, brightening and tone presets.',
    url: '/tools/face-beauty',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
