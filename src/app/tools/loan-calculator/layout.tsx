import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loan EMI Calculator',
  description: 'Work out monthly EMI, total interest and repayment for any loan.',
  alternates: { canonical: '/tools/loan-calculator' },
  openGraph: {
    title: 'Loan EMI Calculator — UtilityHub',
    description: 'Work out monthly EMI, total interest and repayment for any loan.',
    url: '/tools/loan-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
