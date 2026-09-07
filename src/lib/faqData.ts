export interface FaqItem {
  q: string
  a: string
}

export interface FaqSection {
  id: string
  icon: string
  title: string
  items: FaqItem[]
}

/**
 * Single source of truth for the FAQ.
 * Used by /faq, the home page preview, and the FAQPage JSON-LD.
 * Answers are plain text so they can be embedded in structured data safely.
 */
export const faqSections: FaqSection[] = [
  {
    id: 'general',
    icon: '💡',
    title: 'General',
    items: [
      {
        q: 'Is Work Gate really free?',
        a: 'Yes. Every one of the 27 tools is free to use with no usage limits, no watermarks and no paid tier. There is nothing to unlock.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No. Work Gate has no accounts, no login and no email collection. Open a tool and start using it straight away.',
      },
      {
        q: 'Does it work on a phone?',
        a: 'Yes. Every tool is built mobile-first and works in any modern browser on Android, iPhone, tablet or desktop. There is no app to install.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. Work Gate runs entirely in your browser. There is no software to download, which also means nothing can bundle adware onto your computer.',
      },
      {
        q: 'Is there a limit on how many files I can process?',
        a: 'There is no daily or monthly limit. Because the browser-based tools use your own device, the only real limit is your device memory — very large images may be slow on an older phone.',
      },
    ],
  },
  {
    id: 'tokens',
    icon: '\u{1FA99}',
    title: 'Accounts & Tokens',
    items: [
      {
        q: 'Why do I need an account?',
        a: 'An account lets us keep your token balance and stops a single person from draining the paid AI services. Signing up is free, takes a few seconds and asks only for a name, email and password.',
      },
      {
        q: 'What are tokens?',
        a: 'Tokens are the free credits that let you run a tool. You get 100 when you sign up, each tool run costs 10, and you can always top up by watching a short ad or claiming the daily bonus.',
      },
      {
        q: 'How do I get more tokens?',
        a: 'Watch a rewarded ad for 50 tokens, up to ten times a day, or claim 25 free tokens once every 24 hours from the Earn Tokens page. There is nothing to buy.',
      },
      {
        q: 'Do tokens expire?',
        a: 'No. Your balance stays on your account until you spend it.',
      },
      {
        q: 'Do I have to pay for anything?',
        a: 'No. Work Gate has no paid plan. Ads cover the cost of the AI services so the tools can stay free.',
      },
    ],
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Privacy & Security',
    items: [
      {
        q: 'Are my files uploaded to a server?',
        a: 'For almost every tool, no. Image resizing, compression, passport photos, signatures, JPG to PDF, PDF to JPG and all calculators run entirely inside your browser, so the file never leaves your device.',
      },
      {
        q: 'Which tools do send my image somewhere?',
        a: 'Only two: Remove Background and the AI mode of Image Enhancer. These need an external AI service, so the image is forwarded through our server to that provider just long enough to produce the result. We never store a copy.',
      },
      {
        q: 'Do you track me or use advertising cookies?',
        a: 'No. We do not set advertising or tracking cookies and we do not build a profile about you. Some tools remember your preferences in your browser local storage, which stays on your device and can be cleared any time.',
      },
      {
        q: 'Is it safe to use for official documents?',
        a: 'The browser-based tools are a good fit for sensitive documents because the file is processed locally and never transmitted. For anything highly confidential, avoid the two AI-backed tools since those must contact a third-party service.',
      },
    ],
  },
  {
    id: 'images',
    icon: '🖼️',
    title: 'Image & Photo Tools',
    items: [
      {
        q: 'What size passport photo does the maker produce?',
        a: 'The Passport Photo Maker supports the standard sizes used for Bangladeshi applications, including 300x300 pixel forms and common print sizes, with the correct margins around the face.',
      },
      {
        q: 'How do I get an image under a specific KB limit?',
        a: 'Use the Image Size Maker if the form specifies a maximum file size in KB, or the Image Compressor if you just want the file smaller. Both let you trade quality against size and show the resulting file size live.',
      },
      {
        q: 'Will resizing or compressing ruin the quality?',
        a: 'Compression is lossy, so a very aggressive setting will show artefacts. Start near the default and lower it only until you hit your target size. Resizing down is generally safe; enlarging a small image will always look softer.',
      },
      {
        q: 'What image formats are supported?',
        a: 'JPG, PNG and WebP work everywhere. Remove Background returns a transparent PNG so the cut-out edges stay clean.',
      },
      {
        q: 'Why did Remove Background say it is not configured?',
        a: 'That tool needs an API key from the background-removal provider set on the server. If you are self-hosting, add REMOVE_BG_API_KEYS to your environment. All the other tools keep working without it.',
      },
    ],
  },
  {
    id: 'files',
    icon: '📄',
    title: 'Files & PDF',
    items: [
      {
        q: 'Can I combine several images into one PDF?',
        a: 'Yes. JPG to PDF accepts multiple images at once, keeps them in the order you add them, and produces a single PDF with one image per page.',
      },
      {
        q: 'Does PDF to JPG handle multi-page documents?',
        a: 'Yes. Every page is rendered as a separate JPG and you can download the pages individually.',
      },
      {
        q: 'Is there a maximum file size?',
        a: 'The two AI-backed tools cap uploads at 12 MB. The browser-based tools have no fixed cap, but very large PDFs take longer because your own device does the rendering.',
      },
    ],
  },
  {
    id: 'calculators',
    icon: '🧮',
    title: 'Calculators & Education',
    items: [
      {
        q: 'Which grading system do the GPA calculators use?',
        a: 'The SSC and HSC calculators follow the Bangladesh education board scale, where A+ is 5.00 down to F at 0.00, and handle the optional (fourth) subject rule.',
      },
      {
        q: 'How is the optional subject counted in SSC and HSC GPA?',
        a: 'Only the marks above a C grade in the optional subject are added to the total, matching the official board rule. The calculator applies this for you.',
      },
      {
        q: 'Is the Zakat calculation based on gold or silver nisab?',
        a: 'The calculator works out the threshold from the metal prices you enter and applies the standard 2.5 percent rate to your net zakatable assets. Many scholars recommend the silver nisab because it benefits more recipients.',
      },
      {
        q: 'Are the results reliable enough to act on?',
        a: 'The maths is standard and the results are accurate for the inputs you give. Even so, treat them as a guide — verify a GPA against your official transcript, and consult a scholar for a Zakat ruling on an unusual situation.',
      },
    ],
  },
  {
    id: 'technical',
    icon: '🛠️',
    title: 'Technical',
    items: [
      {
        q: 'A tool is not working. What should I check?',
        a: 'Refresh the page, make sure your browser is up to date, and try a smaller file. If a tool shows a red error message, the text usually explains what went wrong. Reporting it on GitHub with the tool name helps us fix it.',
      },
      {
        q: 'Does anything work offline?',
        a: 'The page itself needs to load once, but after that the browser-based tools do all their work locally. Only Remove Background and AI enhancement require an active connection.',
      },
      {
        q: 'Can I self-host Work Gate?',
        a: 'Yes. It is a standard Next.js app. Clone the repository, run npm install and npm run build, then npm start. The README lists the optional environment variables for the AI-backed tools.',
      },
      {
        q: 'How do I request a new tool?',
        a: 'Open a discussion or an issue on the GitHub repository describing what you need. Tools that solve a common, repetitive task are the most likely to get built.',
      },
    ],
  },
]

export const faqItems: FaqItem[] = faqSections.flatMap((s) => s.items)

/** Handful of high-level questions shown on the home page. */
export const topFaqs: FaqItem[] = [
  faqSections[0].items[0], // free?
  faqSections[0].items[1], // account?
  faqSections[1].items[0], // files uploaded?
  faqSections[0].items[2], // phone?
]
