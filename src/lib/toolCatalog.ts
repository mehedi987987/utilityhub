export type CategoryId =
  | 'images'
  | 'files'
  | 'education'
  | 'calculators'
  | 'islamic'
  | 'utilities'

export interface Tool {
  slug: string
  icon: string
  title: string
  desc: string
  cat: CategoryId
  badge?: 'Most Popular' | 'Popular' | 'New'
  featured?: boolean
}

export interface Category {
  id: CategoryId
  icon: string
  title: string
  desc: string
}

export const categories: Category[] = [
  { id: 'images', icon: '🖼️', title: 'Image Tools', desc: 'Resize, compress & retouch' },
  { id: 'files', icon: '📄', title: 'Files & PDF', desc: 'Convert between formats' },
  { id: 'education', icon: '🎓', title: 'Education', desc: 'SSC, HSC & University' },
  { id: 'calculators', icon: '🧮', title: 'Calculators', desc: 'Everyday calculations' },
  { id: 'islamic', icon: '🕌', title: 'Islamic', desc: 'Hijri date & Zakat' },
  { id: 'utilities', icon: '🧰', title: 'Utilities', desc: 'QR, passwords & text' },
]

export const tools: Tool[] = [
  // Images
  {
    slug: 'passport-photo',
    icon: '📷',
    title: 'Passport Photo Maker',
    desc: 'Turn any portrait into a print-ready passport or stamp size photo with correct margins.',
    cat: 'images',
    badge: 'Most Popular',
    featured: true,
  },
  {
    slug: 'remove-bg',
    icon: '✂️',
    title: 'Remove Background',
    desc: 'Cut out the background and drop in a solid colour, gradient or your own image.',
    cat: 'images',
    badge: 'Popular',
    featured: true,
  },
  {
    slug: 'image-enhancer',
    icon: '✨',
    title: 'Image Enhancer',
    desc: 'Sharpen, denoise and upscale photos with manual controls or AI.',
    cat: 'images',
    badge: 'New',
    featured: true,
  },
  { slug: 'face-beauty', icon: '💄', title: 'Face Beauty', desc: 'Smooth skin and balance tones on portraits.', cat: 'images', badge: 'New' },
  { slug: 'image-resizer', icon: '📐', title: 'Image Resizer', desc: 'Resize to exact pixel dimensions.', cat: 'images' },
  { slug: 'image-compressor', icon: '📦', title: 'Image Compressor', desc: 'Shrink file size, keep it sharp.', cat: 'images' },
  { slug: 'image-size', icon: '🎯', title: 'Image Size Maker', desc: 'Hit a target KB limit for form uploads.', cat: 'images' },
  { slug: 'signature-maker', icon: '✍️', title: 'Signature Maker', desc: 'Clean up a scanned signature.', cat: 'images' },

  // Files
  { slug: 'jpg-to-pdf', icon: '📄', title: 'JPG to PDF', desc: 'Merge images into one PDF document.', cat: 'files', badge: 'Popular' },
  { slug: 'pdf-to-jpg', icon: '🖼️', title: 'PDF to JPG', desc: 'Export every PDF page as an image.', cat: 'files' },

  // Education
  { slug: 'ssc-grammar', icon: '📖', title: 'SSC Grammar Solution', desc: 'Interactive grammar book with solved exercises.', cat: 'education', badge: 'New' },
  { slug: 'ssc-gpa', icon: '🎓', title: 'SSC GPA Calculator', desc: 'GPA from subject grades.', cat: 'education' },
  { slug: 'hsc-gpa', icon: '📚', title: 'HSC GPA Calculator', desc: 'GPA with optional subject rules.', cat: 'education' },
  { slug: 'cgpa', icon: '🏛️', title: 'University CGPA', desc: 'Semester and cumulative CGPA.', cat: 'education' },

  // Calculators
  { slug: 'bmi-calculator', icon: '⚖️', title: 'BMI Calculator', desc: 'Body Mass Index and healthy range.', cat: 'calculators' },
  { slug: 'loan-calculator', icon: '💰', title: 'Loan EMI Calculator', desc: 'Monthly EMI, interest and totals.', cat: 'calculators' },
  { slug: 'percentage', icon: '🔢', title: 'Percentage Calculator', desc: 'Increase, decrease and of-value.', cat: 'calculators' },
  { slug: 'age', icon: '🎂', title: 'Age Calculator', desc: 'Exact age in years, months, days.', cat: 'calculators' },
  { slug: 'date-diff', icon: '📅', title: 'Date Difference', desc: 'Days between any two dates.', cat: 'calculators' },

  // Islamic
  { slug: 'islamic-date', icon: '🌙', title: 'Islamic Date Converter', desc: 'Gregorian to Hijri and back.', cat: 'islamic' },
  { slug: 'zakat', icon: '🕌', title: 'Zakat Calculator', desc: 'Zakat on cash, gold and assets.', cat: 'islamic' },

  // Utilities
  { slug: 'qr-generator', icon: '🔲', title: 'QR Code Generator', desc: 'Custom QR codes for links and text.', cat: 'utilities', badge: 'Popular' },
  { slug: 'password-generator', icon: '🔐', title: 'Password Generator', desc: 'Strong random passwords.', cat: 'utilities' },
  { slug: 'word-counter', icon: '📝', title: 'Word Counter', desc: 'Words, characters and reading time.', cat: 'utilities' },
  { slug: 'color-picker', icon: '🎨', title: 'Color Picker', desc: 'Convert HEX, RGB and HSL.', cat: 'utilities' },
  { slug: 'countdown', icon: '⏱️', title: 'Countdown Timer', desc: 'Live countdown to any moment.', cat: 'utilities' },
  { slug: 'holidays', icon: '🇧🇩', title: 'Bangladesh Holidays', desc: 'Official public holiday list.', cat: 'utilities' },
]

export const TOOL_COUNT = tools.length
