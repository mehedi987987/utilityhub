import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Work Gate',
  description: 'How Work Gate handles your files and data. Most tools run entirely in your browser.',
}

const sections = [
  {
    title: 'Files you upload',
    body: 'Most Work Gate tools — image resizing, compression, JPG to PDF, PDF to JPG, passport photos, signatures, and every calculator — run completely inside your browser using JavaScript and the Canvas API. Those files never leave your device and are never sent to our servers.',
  },
  {
    title: 'Tools that use third-party services',
    body: 'Two tools need external AI providers: Remove Background and the AI mode of Image Enhancer. When you use them, your image is forwarded through our server to the provider purely to produce the result. We do not store a copy, and the request is discarded once the response is returned.',
  },
  {
    title: 'Accounts and personal data',
    body: 'Work Gate has no user accounts. We do not ask for your name, email address, or phone number, and we do not build a profile about you.',
  },
  {
    title: 'Cookies and analytics',
    body: 'We do not set advertising or tracking cookies. Some tools save your preferences in your browser\u2019s local storage so the settings persist between visits; that data stays on your device and can be cleared at any time from your browser settings.',
  },
  {
    title: 'Changes to this policy',
    body: 'If this policy changes we will update this page. Continued use of the site after an update means you accept the revised policy.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: September 2025</p>

      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="card p-6">
            <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
