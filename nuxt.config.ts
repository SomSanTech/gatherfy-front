// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: {
    dirs: ['~/components'],
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
    },
  },
});
