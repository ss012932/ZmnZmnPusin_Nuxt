import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // 控制 Nuxt DevTools
  devtools: { enabled: true },

  // 控制 Nuxt 模組
  modules: ['@nuxt/image'],

  // 控制本機開發伺服器 HTTPS
  devServer: {
    host: 'localhost',
    port: 3000,

    // 控制 HTTPS 憑證設定
    // Nuxt 4 這裡請放「檔案路徑字串」，不要放 readFileSync 的結果
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
  },

  // 控制 Vue 編譯器設定
  vue: {
    compilerOptions: {
      // 控制 iconify-icon 被 Vue 視為原生 Web Component
      isCustomElement: (tag) => tag === 'iconify-icon',
    },
  },

  // 控制全域 CSS
  // 如果 christy-richtext 已經移除，這段要一起刪掉
  css: [
    path.resolve(
      './node_modules/christy-richtext/dist-lib/christy-richtext.css'
    ),
  ],

  // 控制 HTML head 設定
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