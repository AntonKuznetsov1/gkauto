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
          primary: '#70BAE6',   // Sky Blue accent
          primaryHover: '#58A6D3',
          dark: '#0F172A',      // Deep Slate text & dark surfaces
          surface: '#F8FAFC',   // Light Surface tint
          border: '#E2E8F0',    // Muted border gray
        },
      },
    },
  },
  plugins: [],
};