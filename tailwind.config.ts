import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#635bff',
          dark: '#4b45c6',
          light: '#f6f5ff',
        },
        accent: {
          DEFAULT: '#00d4aa',
          dark: '#00b894',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          dark: '#ee5a5a',
          light: '#fff5f5',
        },
        brand: {
          dark: '#0a2540',
          900: '#0d3356',
          700: '#425466',
          500: '#6b7c93',
          300: '#a3acb9',
          100: '#f6f9fc',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        barGrow: {
          from: { width: '0%' },
          to: { width: '85%' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'bar-grow': 'barGrow 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
