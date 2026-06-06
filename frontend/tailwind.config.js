/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ev: {
          blue: '#0ea5e9',
          'blue-dark': '#0284c7',
          'blue-deeper': '#0369a1',
          dark: '#0f172a',
          'dark-card': '#1e293b',
          'dark-border': '#334155',
          gray: '#64748b',
          green: '#22c55e',
          red: '#ef4444',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
