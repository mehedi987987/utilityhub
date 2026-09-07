import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Work Gate',
  description: 'Work Gate is a free collection of everyday online tools for images, files, grades and calculations.',
}

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">About Work Gate</h1>
      <p className="text-sm text-gray-400 mb-8">
        Simple, free tools that do one job well — no signup, no clutter.
      </p>

      <div className="card p-6 space-y-4 text-sm text-gray-400 leading-relaxed">
        <p>
          Work Gate bundles the small utilities people in Bangladesh actually need day to day:
          preparing passport-size photos for application forms, resizing an image to fit an upload
          limit, converting a PDF to images, calculating an SSC or HSC GPA, and working out Zakat.
        </p>
        <p>
          Almost every tool runs entirely in your browser. Your files are processed on your own
          device and are never uploaded to us. The few tools that need an external AI service
          (background removal and AI image enhancement) send the image to that provider only for as
          long as the request takes.
        </p>
        <p>
          The project is free to use and has no accounts, no subscriptions, and no usage limits.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/#tools" className="btn-primary inline-flex items-center gap-2">🛠️ Browse tools</Link>
        <Link href="/faq" className="btn-secondary inline-flex items-center gap-2">❓ Read the FAQ</Link>
        <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">✉️ Contact us</Link>
      </div>
    </div>
  )
}
