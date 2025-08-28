/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Emotion-based colors for accessibility
        emotion: {
          happy: '#34d399',
          sad: '#60a5fa',
          anxious: '#fbbf24',
          angry: '#f87171',
          neutral: '#9ca3af',
          excited: '#f472b6',
          scared: '#a78bfa',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}