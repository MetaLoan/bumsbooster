/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#f9f91f",
        "primary-dim": "#baba17",
        "background-light": "#f0f2f5",
        "background-dark": "#050A14",
        "surface-dark": "#0F1623", 
        "surface-border": "#1E293B",
        "accent-blue": "#0ea5e9"
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.375rem", 
        "lg": "0.5rem", 
        "xl": "0.75rem", 
        "2xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        'neon': '0 0 10px rgba(249, 249, 31, 0.3)',
        'neon-strong': '0 0 20px rgba(249, 249, 31, 0.5)',
      }
    },
  },
  plugins: [],
}
