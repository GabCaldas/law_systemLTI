/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {midnightGreen: '#004953', 
      darkWhite: '#f8f8f8', 
    }},
  },
  plugins: [],
}

