import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nav: '#111827',
        blue: '#4776e6',
        blue2: '#edf3ff',
        ink: '#172033',
        muted: '#6d778a',
        line: '#e5e8ee',
        surface: '#ffffff',
        bg: '#f7f8fb',
        green: '#28a88b',
        warm: '#e5a83b',
      },
    },
  },
  plugins: [],
}
export default config
