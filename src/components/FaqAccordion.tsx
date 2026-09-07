"use client"
import { useId, useState } from 'react'
import type { FaqItem } from '@/lib/faqData'

interface FaqAccordionProps {
  items: FaqItem[]
  /** Open the first question by default. */
  defaultOpen?: number | null
}

export default function FaqAccordion({ items, defaultOpen = null }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-panel-${i}`
        const buttonId = `${baseId}-button-${i}`

        return (
          <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="faq-question"
              >
                <span className="flex-1">{item.q}</span>
                <span className="faq-chevron" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="faq-answer"
            >
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
