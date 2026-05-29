/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#e06a8f",
          primary: "#e06a8f",
          secondary: "#ea8ea9",
          dark: "#b54667",
          light: "#fbeef1",
        },
        neutral: {
          50: '#1f1a1c',
          100: '#1f1a1c',
          200: '#31272a',
          300: '#4d4245',
          400: '#6e6266',
          500: '#9c8f93',
          600: '#b4a7aa',
          700: '#cbbec2',
          800: '#eedbe0', // border-color
          850: '#f8edf0', // lighter border/bg
          900: '#fdf9fa', // card background
          950: '#ffffff', // page background
        }
      },
    },
  },
  plugins: [],
};
