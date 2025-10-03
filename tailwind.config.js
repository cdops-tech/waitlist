/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0b',
          card: '#1a1a1d',
          border: '#2a2a2f',
          text: '#e5e5e7',
          textMuted: '#9ca3af'
        },
        accent: {
          primary: '#3b82f6',
          primaryHover: '#2563eb',
          secondary: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
