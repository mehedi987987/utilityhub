import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word Counter',
  description: 'Count words, characters, sentences and reading time instantly.',
  alternates: { canonical: '/tools/word-counter' },
  openGraph: {
    title: 'Word Counter — Work Gate',
    description: 'Count words, characters, sentences and reading time instantly.',
    url: '/tools/word-counter',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
