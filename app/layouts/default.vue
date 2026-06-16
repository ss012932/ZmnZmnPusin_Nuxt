<!-- ============================================================
  默認 Layout（Default Layout）
  包含全站共用的 Navbar、主要內容插槽與 Footer
  所有頁面皆套用此 layout
============================================================ -->
<template>
  <div class="app-wrapper">
    <!-- 全站導航列 -->
    <AppHeader />

    <!-- 主要內容區 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 全站頁腳 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 使用自動引入，Header 與 Footer 由 Nuxt 自動解析
</script>

<style scoped>
/* App Wrapper：避免 Header 遮蓋內容所做的基礎佈局 */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主要內容區：自動撐滿剩餘空間 */
.main-content {
  flex: 1;
}
</style>
