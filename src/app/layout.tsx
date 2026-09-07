import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteUrl } from '@/lib/tools'
import { AuthProvider } from '@/contexts/AuthContext'
import SocialBar from '@/components/ads/SocialBar'

const title = 'Work Gate — Every tool you need, one gate to work'
const description =
  '27 free online tools for everyday work. Resize photos, remove backgrounds, make passport images, convert PDFs, and calculate GPA, EMI and Zakat — no signup, files stay in your browser.'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: '%s — Work Gate',
  },
  description,
  applicationName: 'Work Gate',
  authors: [{ name: 'Work Gate' }],
  creator: 'Work Gate',
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
    siteName: 'Work Gate',
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
  colorScheme: 'dark',
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
        <AuthProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SocialBar />
        </AuthProvider>
      </body>
    </html>
  )
}
