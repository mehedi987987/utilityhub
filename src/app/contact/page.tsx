import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — Work Gate',
  description: 'Get in touch with the Work Gate team about bugs, tool requests, or feedback.',
}

export default function ContactPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">Contact</h1>
      <p className="text-sm text-gray-400 mb-8">
        Found a bug, or want a tool that is not here yet? We would like to hear about it.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl mb-3">🐛</div>
          <h2 className="font-semibold text-white text-sm mb-1">Report a bug</h2>
          <p className="text-xs text-gray-500 mb-3">
            Open an issue on GitHub with the tool name and what went wrong.
          </p>
          <a
            href="https://github.com/mehedi987987/utilityhub/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            GitHub Issues →
          </a>
        </div>

        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl mb-3">💡</div>
          <h2 className="font-semibold text-white text-sm mb-1">Suggest a tool</h2>
          <p className="text-xs text-gray-500 mb-3">
            Tell us what you keep doing by hand and we will look at building it.
          </p>
          <a
            href="https://github.com/mehedi987987/utilityhub/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Start a discussion →
          </a>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/#tools" className="btn-secondary inline-flex items-center gap-2">← Back to tools</Link>
      </div>
    </div>
  )
}
