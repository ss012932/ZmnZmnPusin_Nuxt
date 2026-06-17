import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'iconify-icon',
    },
  },
  // 同 ZmnZmnPusin_BackEnd 做法：用絕對路徑完全繞過 christy-richtext exports map 限制
  css: [path.resolve(__dirname, 'node_modules/christy-richtext/dist-lib/christy-richtext.css')],
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
