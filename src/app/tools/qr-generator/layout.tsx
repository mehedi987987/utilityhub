import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate a custom QR code for links, text, Wi-Fi and more.',
  alternates: { canonical: '/tools/qr-generator' },
  openGraph: {
    title: 'QR Code Generator — Work Gate',
    description: 'Generate a custom QR code for links, text, Wi-Fi and more.',
    url: '/tools/qr-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
