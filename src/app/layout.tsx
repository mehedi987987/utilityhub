import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteUrl } from '@/lib/tools'

const title = 'UtilityHub — Free Online Tools'
const description =
  '27 free tools for everyday work. Resize photos, remove backgrounds, prepare passport images, calculate GPA and Zakat, and convert files — no signup required.'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: '%s — UtilityHub',
  },
  description,
  applicationName: 'UtilityHub',
  keywords: [
    'free online tools',
    'passport photo maker',
    'remove background',
    'image resizer',
    'SSC GPA calculator',
    'HSC GPA calculator',
    'zakat calculator',
    'JPG to PDF',
  ],
  openGraph: {
    type: 'website',
    siteName: 'UtilityHub',
    title,
    description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
