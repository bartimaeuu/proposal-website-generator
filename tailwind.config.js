/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'rainbow': 'rainbow 4s linear infinite',
      },
      keyframes: {
        'rainbow': {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' }
        }
      }
    },
  },
  plugins: [],
};
