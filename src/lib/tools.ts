export const TOOL_SLUGS = [
  'passport-photo',
  'remove-bg',
  'face-beauty',
  'image-enhancer',
  'ssc-grammar',
  'qr-generator',
  'password-generator',
  'word-counter',
  'color-picker',
  'bmi-calculator',
  'loan-calculator',
  'image-resizer',
  'image-compressor',
  'image-size',
  'signature-maker',
  'jpg-to-pdf',
  'pdf-to-jpg',
  'ssc-gpa',
  'hsc-gpa',
  'cgpa',
  'islamic-date',
  'zakat',
  'percentage',
  'age',
  'date-diff',
  'countdown',
  'holidays',
] as const

export const STATIC_PATHS = ['/', '/about', '/privacy', '/contact'] as const

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}
