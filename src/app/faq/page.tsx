import type { Metadata } from 'next'
import Link from 'next/link'
import FaqAccordion from '@/components/FaqAccordion'
import { faqSections, faqItems } from '@/lib/faqData'
import { TOOL_COUNT } from '@/lib/toolCatalog'

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Answers to common questions about Work Gate — whether the ${TOOL_COUNT} tools are free, how your files are handled, which tools work offline, and how the GPA and Zakat calculators work.`,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — Work Gate',
    description: 'Common questions about pricing, privacy, file handling and how each Work Gate tool works.',
    url: '/faq',
  },
}

/** Google-readable FAQPage structured data, built from the same source as the page. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="hero-glow dot-grid pt-14 pb-10">
        <div className="max-w-[1100px] mx-auto px-4 text-center">
          <div className="status-pill mb-6">
            <span className="status-dot" />
            {faqItems.length} questions answered
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Frequently asked <span className="headline-gradient">questions</span>
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Everything about pricing, privacy and how the {TOOL_COUNT} tools actually work. Cannot
            find your answer? <Link href="/contact" className="text-violet-300 hover:text-violet-200 font-medium">Get in touch</Link>.
          </p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-10">
          {/* Section nav */}
          <aside className="hidden lg:block">
            <nav aria-label="FAQ sections" className="sticky top-24">
              <p className="px-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Topics
              </p>
              {faqSections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="faq-nav-link">
                  <span aria-hidden="true">{section.icon}</span>
                  {section.title}
                </a>
              ))}

              <div className="divider my-4" />

              <div className="px-3">
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  Still stuck? We answer questions on GitHub.
                </p>
                <Link href="/contact" className="text-xs text-violet-300 hover:text-violet-200 font-semibold">
                  Contact us →
                </Link>
              </div>
            </nav>
          </aside>

          {/* Sections */}
          <div className="space-y-12">
            {faqSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-anchor">
                <div className="flex items-center gap-3 mb-4">
                  <span className="icon-tile" aria-hidden="true">{section.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">{section.title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {section.items.length} question{section.items.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <FaqAccordion items={section.items} />
              </section>
            ))}

            {/* CTA */}
            <section className="feature-card text-center items-center">
              <span className="icon-tile mb-4" aria-hidden="true">💬</span>
              <h2 className="text-xl font-bold text-white mb-2">Still have a question?</h2>
              <p className="text-sm text-gray-400 max-w-md mb-6">
                Ask on GitHub and we will answer — and if it comes up often, it lands on this page.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact" className="btn-primary text-sm">✉️ Contact us</Link>
                <Link href="/#tools" className="btn-secondary text-sm">🛠️ Browse tools</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
