/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#122033',
        alfa: '#0E4D8C',
        'alfa-deep': '#0A3260',
        nippon: '#D0121A',
        eco: '#1B7A45',
        mist: '#F3F6F8',
        line: '#E2E8EF',
      },
      fontFamily: {
        sans: ['Outfit', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 32px rgba(18, 32, 51, 0.08)',
      },
    },
  },
  plugins: [],
}
