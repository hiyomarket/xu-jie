/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9e7',
          100: '#fbf0c5',
          200: '#f8e18a',
          300: '#f5d14d',
          400: '#f2c424',
          500: '#eebb00', // 主金色
          600: '#c49b00',
          700: '#9a7b00',
          800: '#705c00',
          900: '#473e00',
        },
        element: {
          fire: '#ff6b6b',
          water: '#4dabf7',
          earth: '#69db7c',
          wind: '#ffd43b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
