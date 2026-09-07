import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Size Maker',
  description: 'Set custom image dimensions and target file size for form uploads.',
  alternates: { canonical: '/tools/image-size' },
  openGraph: {
    title: 'Image Size Maker — Work Gate',
    description: 'Set custom image dimensions and target file size for form uploads.',
    url: '/tools/image-size',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
