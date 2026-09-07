import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Enhancer',
  description: 'Improve photo quality with manual adjustments or AI upscaling.',
  alternates: { canonical: '/tools/image-enhancer' },
  openGraph: {
    title: 'Image Enhancer — Work Gate',
    description: 'Improve photo quality with manual adjustments or AI upscaling.',
    url: '/tools/image-enhancer',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
