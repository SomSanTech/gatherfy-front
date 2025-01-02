// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-rating'],
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
    dirs: ['~/components', '~/components/backoffice'],
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    },
  },
  app: {
    baseURL: '',
  },
  plugins: ['~/plugins/preline.client.ts'],
});
