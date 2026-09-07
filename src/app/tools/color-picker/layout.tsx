import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Picker',
  description: 'Pick colours and convert between HEX, RGB and HSL.',
  alternates: { canonical: '/tools/color-picker' },
  openGraph: {
    title: 'Color Picker — UtilityHub',
    description: 'Pick colours and convert between HEX, RGB and HSL.',
    url: '/tools/color-picker',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
