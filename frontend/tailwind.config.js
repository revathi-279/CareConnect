/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2F6F4E',
          greenHover: '#25593e',
          cream: '#FAF6ED',
          gold: '#D4A857',
          blue: '#7DB8DA',
          dark: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}