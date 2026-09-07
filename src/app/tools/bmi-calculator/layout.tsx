import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BMI Calculator',
  description: 'Calculate your Body Mass Index and see the healthy range.',
  alternates: { canonical: '/tools/bmi-calculator' },
  openGraph: {
    title: 'BMI Calculator — UtilityHub',
    description: 'Calculate your Body Mass Index and see the healthy range.',
    url: '/tools/bmi-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
