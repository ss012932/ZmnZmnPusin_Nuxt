<!-- ============================================================
  App 根元件
  設定全域 SEO、引入全域樣式，並掛載路由頁面
============================================================ -->
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%; /* / 這是解決左右留白的最終手段 */
  overflow-x: hidden;
}
</style>

<script setup lang="ts">
// 全站預設 SEO 設定（各頁面會覆蓋此設定）
useHead({
  titleTemplate: "%s | 人人動物醫院後台管理系統",
  htmlAttrs: {
    lang: "zh-TW",
  },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#C9956C" },
    { charset: "utf-8" },
  ],
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
});
</script>
