import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor',
  description: 'Reduce image file size while keeping it looking sharp.',
  alternates: { canonical: '/tools/image-compressor' },
  openGraph: {
    title: 'Image Compressor — Work Gate',
    description: 'Reduce image file size while keeping it looking sharp.',
    url: '/tools/image-compressor',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
