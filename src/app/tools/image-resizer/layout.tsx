import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer',
  description: 'Resize any image to exact pixel dimensions without losing quality.',
  alternates: { canonical: '/tools/image-resizer' },
  openGraph: {
    title: 'Image Resizer — UtilityHub',
    description: 'Resize any image to exact pixel dimensions without losing quality.',
    url: '/tools/image-resizer',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
