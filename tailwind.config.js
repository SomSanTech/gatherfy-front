/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#D71515',
        'light-grey': '#F6F6F6',
        'black-1': '#1F1E22',
      },
    },
  },
  plugins: [],
};
