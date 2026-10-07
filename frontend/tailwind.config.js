/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Option 3: Warm Home Theme
        primary: {
          DEFAULT: '#E07A5F', // Terracotta Orange
          hover: '#D0674D',
        },
        secondary: {
          DEFAULT: '#81B29A', // Sage Green
          hover: '#6E9C85',
        },
        background: '#FDFBF7', // Crisp, slightly warm white (not hospital white)
        surface: '#FFFFFF',    // Pure white for cards/modals
        text: {
          main: '#3D405B',     // Deep navy/gray (softer on the eyes than pure black)
          muted: '#8A8D9F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}