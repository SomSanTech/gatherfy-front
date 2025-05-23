// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['nuxt-rating', 'nuxt-vue3-google-signin'],

  googleSignIn: {
    clientId:
      '208535017949-i5clt2a567g51nhu9lj58ctdqo8vkp2i.apps.googleusercontent.com',
  },

  // compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: ['~/assets/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false, extensions: ['vue'] },
      { path: '~/components', pathPrefix: false },
      {
        path: '~/components/backoffice',
        pathPrefix: false,
        extensions: ['vue'],
      },
      { path: '~/components/icons', pathPrefix: false },
    ],
  },

  typescript: {
    strict: false,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      minioUrl: process.env.MINIO_URL,
    },
  },

  app: {
    baseURL: process.env.NUXT_BASE_URL,
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  plugins: [
    '~/plugins/preline.client.ts',
    '~/plugins/error-handler.ts',
    '~/plugins/google-signin.ts',
  ],
  compatibilityDate: '2025-03-29',
});
