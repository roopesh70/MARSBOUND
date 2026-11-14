/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          dark: '#0c0706',
          rust: '#a84323',
          red: '#c85a32',
          orange: '#d97746',
          sand: '#e09867',
          dust: '#f3c299',
          surface: '#181210',
          panel: '#1f1613',
          border: '#3d251c',
          accent: '#e65c00',
          glow: '#ff7733',
          cyan: '#38bdf8',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Consolas', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif']
      }
    },
  },
  plugins: [],
}
