// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  build: {
    transpile: ['christy-richtext'],
  },
  app: {
    head: {
      script: [
        {
          src: 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js',
          defer: true,
        },
      ],
    },
  },
})