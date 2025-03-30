/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#D71515',
        'burgundy-dark': '#A61010',
        'red-light': '#F25C5C',
        'bright-blue': '#0085DB',
        'green-light': '#16C098',
        'green-dark': '#008767',
        'light-grey': '#F6F6F6',
        'mist-grey': '#EEEEEE',
        grey: '#D0D0D0 ',
        'lavender-gray': '#B5B7C0',
        'cool-gray': '#9197B3',
        'dark-grey': '#3A393D ',
        dark: '#1F1E22',
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { left: '50%' },
          '25%': { left: '49.5%' },
          '50%': { left: '50.5%' },
          '75%': { left: '49.5%' },
        },
      },
    },
  },
  plugins: [require('preline/plugin')],
};
