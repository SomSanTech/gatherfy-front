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
    baseURL: '/us1',
  },
  plugins: ['~/plugins/preline.client.ts'],
});
