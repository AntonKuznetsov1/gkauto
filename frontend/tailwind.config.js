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
          primary: '#1687B5',   // Ocean blue accent
          primaryHover: '#0F6F98',
          dark: '#0F172A',      // Deep Slate text & dark surfaces
          surface: '#F8FAFC',   // Light Surface tint
          border: '#E2E8F0',    // Muted border gray
        },
      },
    },
  },
  plugins: [],
};