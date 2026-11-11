/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        samrat: {
          dark: '#0F172A',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: '#E2E8F0',
          primary: '#1E40AF', // Corporate Royal Blue
          primaryHover: '#1D4ED8',
          accent: '#0284C7', // Sky Blue Accent
          purple: '#7C3AED',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          textMuted: '#64748B',
          textBright: '#0F172A'
        },
        corporate: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          subtext: '#64748B',
          blue: '#1E40AF',
          sky: '#0284C7'
        }
      }
    },
  },
  plugins: [],
}
