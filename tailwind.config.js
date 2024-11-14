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
        'light-grey': '#F6F6F6',
        grey: '#D0D0D0 ',
        'dark-grey': '#3A393D ',
        'black-1': '#1F1E22',
        'ghost-white': '#fafbff',
        'cool-gray': '#9197B3',
        'lavender-gray': '#B5B7C0',
      },
    },
  },
  plugins: [require('preline/plugin')],
};
