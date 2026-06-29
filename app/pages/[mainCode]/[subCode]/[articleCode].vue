<template>
  <div class="article-page">
    <!-- ── 閱讀進度條 ── -->
    <div class="reading-progress" ref="progressBar"></div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="loading-screen">
      <div class="loading-dots"><span></span><span></span><span></span></div>
      <p>載入中…</p>
    </div>

    <!-- ── 404 ── -->
    <div v-else-if="!article" class="not-found">
      <div class="not-found-inner">
        <div class="not-found-icon">🐾</div>
        <h1>找不到此文章</h1>
        <p>此文章不存在或尚未發布。</p>
        <NuxtLink to="/" class="back-btn">← 返回首頁</NuxtLink>
      </div>
    </div>

    <template v-else>

      <!-- ══════════════════════════════
           Hero：輕色系，符合網站風格
           左：標題文字　右：Three.js 卡片
      ══════════════════════════════ -->
      <section class="article-hero">
        <!-- 裝飾圓 -->
        <div class="hero-blob hero-blob-a"></div>
        <div class="hero-blob hero-blob-b"></div>

        <div class="hero-wrap">
          <!-- ── 置中文字 ── -->
          <div class="hero-text">
            <nav class="breadcrumb" ref="breadcrumbEl">
              <NuxtLink to="/" class="bc-link">首頁</NuxtLink>
              <span class="bc-sep">›</span>
              <span v-if="article.mainCategoryName" class="bc-link">{{ article.mainCategoryName }}</span>
              <span v-if="article.subCategoryName" class="bc-sep">›</span>
              <span v-if="article.subCategoryName" class="bc-current">{{ article.subCategoryName }}</span>
            </nav>

            <h1 class="hero-title" ref="heroTitle">{{ article.title }}</h1>
            <div class="title-accent" ref="heroAccent"></div>

            <p v-if="article.summary" class="hero-summary" ref="heroSummary">
              {{ article.summary }}
            </p>

            <div class="hero-meta" ref="heroMeta">
              <span v-if="article.publishedAt" class="meta-chip">
                <svg class="chip-icon" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.4"/>
                  <path d="M1 7h14M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
                {{ formatDate(article.publishedAt) }}
              </span>
              <span v-if="article.subCategoryName" class="meta-tag">
                {{ article.subCategoryName }}
              </span>
            </div>
          </div>
        </div>

        <!-- 底部漸層線 -->
        <div class="hero-rule"></div>
      </section>

      <!-- ══ 封面圖 ══ -->
      <div v-if="article.coverImageUrl" class="cover-section" ref="coverSection">
        <div class="cover-frame" ref="coverFrame">
          <img :src="article.coverImageUrl" :alt="article.title" class="cover-img" />
        </div>
      </div>

      <!-- ══════════════════════════════
           主體：目錄 + 連貫文件
      ══════════════════════════════ -->
      <div class="article-body" ref="articleBody">

        <!-- 手機版 FAB -->
        <button
          v-if="visibleSections.length > 1"
          class="toc-fab"
          :class="{ active: isMenuOpen }"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="目錄"
        >
          <span class="fab-icon">
            <span></span><span></span><span></span>
          </span>
          目錄
        </button>

        <!-- 遮罩 -->
        <transition name="fade">
          <div v-if="isMenuOpen" class="mobile-overlay" @click="isMenuOpen = false"></div>
        </transition>

        <!-- ── TOC 佔位 div（fixed 時維持 flex 排版寬度） ── -->
        <div
          v-if="visibleSections.length > 1 && tocIsFixed"
          class="toc-sidebar-placeholder"
        ></div>

        <!-- ── TOC Sidebar ── -->
        <aside
          v-if="visibleSections.length > 1"
          class="toc-sidebar"
          :class="{ 'mobile-open': isMenuOpen }"
          :style="tocSidebarStyle"
          ref="tocSidebar"
        >
          <div class="toc-card">
            <div class="toc-heading">
              <span class="toc-heading-bar"></span>目錄
              <button class="toc-close" @click="isMenuOpen = false">✕</button>
            </div>
            <nav class="toc-nav">
              <button
                v-for="(sec, i) in visibleSections"
                :key="sec.id"
                class="toc-item"
                :class="{ active: activeSection === sectionId(sec) }"
                @click="scrollToSection(sectionId(sec))"
              >
                <span class="toc-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="toc-text">{{ sec.sectionTitle }}</span>
                <span class="toc-arrow">›</span>
              </button>
            </nav>
            <div class="toc-track">
              <div class="toc-fill" :style="{ width: readingPercent + '%' }"></div>
            </div>
          </div>
        </aside>

        <!-- ── 連貫文件 ── -->
        <main class="document-wrap" ref="documentWrap">
          <div class="article-document" ref="articleDocument">
            <div
              v-for="(sec, i) in visibleSections"
              :key="sec.id"
              :id="sectionId(sec)"
              class="doc-section"
              ref="docSections"
            >
              <!-- 時間軸標記 -->
              <div class="timeline">
                <div class="tl-badge">{{ String(i + 1).padStart(2, '0') }}</div>
                <div
                  v-if="i < visibleSections.length - 1"
                  class="tl-line"
                ></div>
              </div>

              <!-- 段落內容 -->
              <div class="doc-body">
                <h2 class="doc-title">{{ sec.sectionTitle }}</h2>
                <article class="rich-content" v-html="sec.content || ''"></article>
              </div>
            </div>
          </div>

          <!-- 文章結尾 -->
          <div class="doc-footer">
            <div class="doc-footer-ornament">
              <span></span><span class="ornament-dot"></span><span></span>
            </div>
            <p class="footer-msg">感謝您閱讀此篇衛教文章</p>
            <NuxtLink to="/" class="footer-back">← 返回首頁</NuxtLink>
          </div>
        </main>

      </div>
    </template>
  </div>
</template>

<style scoped>
/* ════════════════════════════════════
   全域 / 進度條
════════════════════════════════════ */
.article-page {
  background: #f0f6fc;
  min-height: 100vh;
}

.reading-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #5aa0c8 0%, #ffd966 100%);
  z-index: 9999;
  border-radius: 0 2px 2px 0;
  transition: width 0.1s linear;
}

/* ════════════════════════════════════
   Loading
════════════════════════════════════ */
.loading-screen {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 20px;
  background: #f0f6fc;
}

.loading-screen p { color: #5a8ab8; font-size: 15px; }

.loading-dots { display: flex; gap: 10px; }
.loading-dots span {
  width: 12px; height: 12px;
  border-radius: 50%; background: #5aa0c8;
  animation: ldBounce 1.2s infinite ease-in-out both;
}
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes ldBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1.0); opacity: 1; }
}

/* ════════════════════════════════════
   404
════════════════════════════════════ */
.not-found {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: #f0f6fc;
}
.not-found-inner { text-align: center; padding: 40px 20px; }
.not-found-icon { font-size: 56px; margin-bottom: 16px; }
.not-found h1 { font-size: 26px; color: #143c64; margin-bottom: 8px; }
.not-found p  { color: #888; margin-bottom: 24px; }
.back-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #143c64; color: white;
  border-radius: 999px; text-decoration: none;
  font-size: 14px; font-weight: 600;
  transition: background 0.2s;
}
.back-btn:hover { background: #1e5280; }

/* ════════════════════════════════════
   Hero
════════════════════════════════════ */
.article-hero {
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

/* 裝飾圓光暈 */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero-blob-a {
  width: 560px; height: 560px;
  top: -280px; right: -120px;
  background: radial-gradient(circle, rgba(90, 160, 200, 0.08) 0%, transparent 70%);
}
.hero-blob-b {
  width: 360px; height: 360px;
  bottom: -180px; left: -80px;
  background: radial-gradient(circle, rgba(255, 217, 102, 0.07) 0%, transparent 70%);
}

/* 主容器（置中單欄） */
.hero-wrap {
  max-width: 820px;
  margin: 0 auto;
  padding: 56px 20px 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* ── 文字 ── */
.hero-text { width: 100%; min-width: 0; }

.breadcrumb {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; flex-wrap: wrap;
  margin-bottom: 18px;
}
.bc-link {
  font-size: 13px; color: #8bafc8;
  text-decoration: none;
  transition: color 0.2s;
}
.bc-link:hover { color: #143c64; }
.bc-sep   { font-size: 13px; color: #c4d8e8; }
.bc-current { font-size: 13px; color: #143c64; font-weight: 500; }

/* 標題（置中） */
.hero-title {
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 800;
  color: #143c64;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 0;
  text-align: center;
}

/* 金色底線 */
.title-accent {
  width: 56px; height: 4px;
  background: #5aa0c8;
  border-radius: 2px;
  margin: 14px auto 18px;
}

.hero-summary {
  font-size: 15px;
  color: #4a6a82;
  line-height: 1.8;
  margin: 0 auto 20px;
  max-width: 620px;
}

/* Meta chips */
.hero-meta { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }

.meta-chip {
  display: flex; align-items: center; gap: 6px;
  background: #eef6fb;
  border: 1px solid #c8e0ef;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 13px;
  color: #2c5a7a;
}
.chip-icon { width: 13px; height: 13px; opacity: 0.7; }

.meta-tag {
  background: linear-gradient(135deg, #143c64, #1e5280);
  color: white;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 500;
}

/* Hero 底線 */
.hero-rule {
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #8ecae6 20%,
    #5aa0c8 50%,
    #8ecae6 80%,
    transparent 100%
  );
}

/* ════════════════════════════════════
   封面圖
════════════════════════════════════ */
.cover-section {
  max-width: 1200px;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}
.cover-frame {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(20, 60, 100, 0.18);
  position: relative;
}
.cover-img {
  width: 100%; max-height: 460px;
  object-fit: cover; display: block;
}

/* ════════════════════════════════════
   主體容器
════════════════════════════════════ */
.article-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: flex;
  align-items: flex-start;
  gap: 32px;
  position: relative;
}

/* ════════════════════════════════════
   手機 FAB
════════════════════════════════════ */
.toc-fab {
  position: fixed;
  bottom: 28px; right: 20px;
  z-index: 600;
  display: flex; align-items: center; gap: 8px;
  background: #143c64; color: white;
  border: none; border-radius: 999px;
  padding: 12px 20px;
  font-size: 14px; font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}
.toc-fab:hover  { background: #1e5280; transform: translateY(-2px); }
.toc-fab.active { background: #5aa0c8; }

.fab-icon {
  display: flex; flex-direction: column;
  gap: 3px; width: 16px;
}
.fab-icon span {
  height: 2px; background: white;
  border-radius: 1px; transition: all 0.2s;
}
.toc-fab.active .fab-icon span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.toc-fab.active .fab-icon span:nth-child(2) { opacity: 0; }
.toc-fab.active .fab-icon span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

/* ════════════════════════════════════
   遮罩
════════════════════════════════════ */
.mobile-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 550;
  backdrop-filter: blur(2px);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* ════════════════════════════════════
   TOC Sidebar
════════════════════════════════════ */
.toc-sidebar {
  position: fixed;
  top: 0; left: 0;
  width: 300px; height: 100dvh;
  z-index: 600;
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
.toc-sidebar.mobile-open { transform: translateX(0); }

.toc-card {
  position: relative;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 24px;
  margin-top: 56px;
  border: 1px solid #dce9f5;
}

.toc-heading {
  display: flex; align-items: center; gap: 10px;
  font-size: 15px; font-weight: 700; color: #143c64;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8f2f8;
}
.toc-heading-bar {
  width: 4px; height: 16px;
  background: #5aa0c8;
  border-radius: 2px; flex-shrink: 0;
}

.toc-close {
  margin-left: auto;
  background: #f0f6fc; border: none;
  width: 44px; height: 44px; border-radius: 50%;
  font-size: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #666; transition: all 0.2s;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.toc-close:hover  { background: #dce9f5; color: #143c64; }
.toc-close:active { background: #c8dff0; color: #143c64; }

.toc-nav { display: flex; flex-direction: column; gap: 2px; }

.toc-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  background: none; border: none;
  text-align: left; cursor: pointer;
  border-radius: 10px; width: 100%;
  transition: all 0.2s;
}
.toc-item:hover { background: #f0f6fc; }
.toc-item.active {
  background: linear-gradient(135deg, #e8f4fc, #f0f8ff);
  box-shadow: inset 3px 0 0 #5aa0c8;
}

.toc-num {
  font-size: 11px; font-weight: 700;
  color: #5aa0c8; min-width: 22px;
  font-variant-numeric: tabular-nums;
}
.toc-item.active .toc-num { color: #143c64; }

.toc-text {
  flex: 1; font-size: 13px; line-height: 1.5;
  color: #4a6880; text-align: left;
}
.toc-item.active .toc-text { color: #143c64; font-weight: 600; }

.toc-arrow { font-size: 14px; color: transparent; transition: color 0.2s; }
.toc-item:hover .toc-arrow,
.toc-item.active .toc-arrow { color: #5aa0c8; }

.toc-track {
  margin-top: 18px; height: 3px;
  background: #e8f2f8; border-radius: 999px; overflow: hidden;
}
.toc-fill {
  height: 100%;
  background: #5aa0c8;
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* ════════════════════════════════════
   文件容器
════════════════════════════════════ */
.document-wrap { flex: 1; min-width: 0; }

/* ── 單一白卡，連貫段落 ── */
.article-document {
  background: white;
  border-radius: 20px;
  padding: 40px 28px 8px;
  box-shadow:
    0 2px 10px rgba(20, 60, 100, 0.06),
    0 0 0 1px rgba(20, 60, 100, 0.05);
}

/* ── 每一段：時間軸 + 內容 ── */
.doc-section {
  display: flex;
  gap: 20px;
  scroll-margin-top: 80px;
}

/* ── 時間軸 ── */
.timeline {
  display: flex; flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
}

.tl-badge {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #143c64 0%, #1e5280 100%);
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 14px rgba(20, 60, 100, 0.28);
  flex-shrink: 0;
  z-index: 1;
}

.tl-line {
  flex: 1;
  width: 2px;
  min-height: 40px;
  background: linear-gradient(to bottom, #c0d8ec 0%, #e8f2f8 100%);
  border-radius: 1px;
  margin-top: 10px;
  margin-bottom: -8px;
}

/* ── 段落內容 ── */
.doc-body {
  flex: 1; min-width: 0;
  padding: 4px 0 40px;
}

.doc-title {
  font-size: clamp(17px, 2.5vw, 21px);
  font-weight: 700; color: #143c64;
  margin: 0 0 6px;
  line-height: 1.35;
}

/* 標題底線 */
.doc-title::after {
  content: '';
  display: block;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, #dce9f5 0%, transparent 70%);
  border-radius: 1px;
  margin-top: 12px;
}

/* ════════════════════════════════════
   富文本
════════════════════════════════════ */
.rich-content { color: #374151; line-height: 1.85; }

.rich-content :deep(p) {
  font-size: 15px; line-height: 1.85;
  /* 上下都給 margin，與編輯器行為一致（瀏覽器預設 margin: 1em 0） */
  margin: 0.9em 0;
  color: #374151;
}
/* 確保空白行高度不被壓縮 */
.rich-content :deep(p:empty),
.rich-content :deep(p:has(> br:only-child)) {
  min-height: 1.0em;
}

.rich-content :deep(h2) { font-size: 18px; font-weight: 700; color: #143c64; margin: 22px 0 11px; }
.rich-content :deep(h3) { font-size: 16px; font-weight: 700; color: #1e4d87; margin: 18px 0 9px; }
.rich-content :deep(h4) { font-size: 15px; font-weight: 600; color: #2c5a7a; margin: 14px 0 8px; }
.rich-content :deep(strong) { font-weight: 700; }
.rich-content :deep(em)     { font-style: italic; }

.rich-content :deep(ul), .rich-content :deep(ol) {
  padding-left: 22px; margin: 12px 0;
}
.rich-content :deep(li) { font-size: 15px; line-height: 1.8; margin-bottom: 7px; }

.rich-content :deep(img) {
  max-width: 100%; border-radius: 10px;
  margin: 14px 0;
  box-shadow: 0 4px 16px rgba(20, 60, 100, 0.1);
}

.rich-content :deep(.table-scroll-wrap) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 18px 0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(20, 60, 100, 0.08);
}
.rich-content :deep(table) {
  width: 100%; border-collapse: collapse;
  margin: 0; font-size: 14px;
  min-width: 360px;
}
.rich-content :deep(th) {
  background-color: #143c64;
  color: white; font-weight: 600;
  padding: 11px 13px; font-size: 13px;
  /* text-align 不設定，保留瀏覽器預設 center，讓編輯器 inline style 可覆蓋 */
}
.rich-content :deep(td) {
  padding: 11px 13px; border-bottom: 1px solid #eef4f8; color: #374151;
}
.rich-content :deep(tbody tr:nth-child(even) td) { background: #f8fbff; }
.rich-content :deep(tbody tr:hover td) { background: #eef6fb; }

.rich-content :deep(blockquote) {
  border-left: 4px solid #5aa0c8;
  background: #f0f8ff;
  padding: 12px 16px; margin: 16px 0;
  border-radius: 0 10px 10px 0;
  color: #4a6880;
}

.rich-content :deep(a)       { color: #5aa0c8; text-decoration: underline; text-underline-offset: 2px; }
.rich-content :deep(a:hover) { color: #143c64; }

/* disease.vue 繼承的自訂 class */
.rich-content :deep(.highlight-red)   { color: #e74c3c; }
.rich-content :deep(.content-list)    { list-style: none; padding: 0; margin: 14px 0; }
.rich-content :deep(.content-list li) { padding-left: 8px; margin-bottom: 9px; font-size: 15px; line-height: 1.8; }

.rich-content :deep(.subsection-block) { margin-bottom: 20px; }
.rich-content :deep(.subsection-title) {
  font-size: 15px; font-weight: 700; color: #1e4d87; margin: 0 0 9px; padding-left: 8px;
}

.rich-content :deep(.treatment-box) {
  background: #f0f8ff; border-left: 4px solid #5aa0c8;
  border-radius: 0 10px 10px 0; padding: 13px 15px; margin-bottom: 12px;
}
.rich-content :deep(.treatment-subtitle) { font-size: 14px; font-weight: 700; color: #143c64; margin: 0 0 9px; }

.rich-content :deep(.type-box) {
  background: #f0f8ff; border-left: 4px solid #5aa0c8;
  border-radius: 0 10px 10px 0; padding: 11px 13px; margin-bottom: 9px;
}
.rich-content :deep(.type-box.danger) { background: #fff5f5; border-left-color: #e74c3c; }
.rich-content :deep(.type-title) { font-size: 14px; font-weight: 700; color: #143c64; margin: 0 0 7px; }

.rich-content :deep(.symptom-box) {
  background: #fff8f0; border-left: 4px solid #ffb347;
  border-radius: 0 10px 10px 0; padding: 10px 12px; margin-bottom: 7px;
}

.rich-content :deep(.prevention-item) {
  padding: 12px 13px; background: #f0f8ff;
  border-radius: 10px; border-left: 3px solid #5aa0c8; margin-bottom: 12px;
}
.rich-content :deep(.prevention-title) { font-size: 14px; font-weight: 700; color: #143c64; margin: 0 0 7px; }

/* notice-box：disease.vue hardcode 用 */
.rich-content :deep(.notice-box) {
  background: linear-gradient(135deg, #fff9e0, #fffbf0);
  border: 2px solid #ffd966; border-radius: 12px;
  padding: 16px; margin: 18px 0;
  box-shadow: 0 2px 8px rgba(255,217,102,0.12);
}
.rich-content :deep(.notice-title) { color: #e74c3c; font-weight: 700; font-size: 14px; margin-bottom: 9px; }

/* crt-callout：christy-richtext 編輯器實際輸出的重點框 class */
.rich-content :deep(.crt-callout) {
  border: 1.5px solid #fde68a;
  background: #fefce8;
  border-radius: 12px;
  padding: 18px 22px;
  margin: 0.9em 0;
}
.rich-content :deep(.crt-callout > :first-child) { margin-top: 0; }
.rich-content :deep(.crt-callout > :last-child)  { margin-bottom: 0; }
.rich-content :deep(.crt-callout ul) {
  list-style: none;
  padding-left: 0.25em;
  margin: 0.4em 0;
}
.rich-content :deep(.crt-callout ul li) {
  position: relative;
  padding-left: 1.9em;
  margin: 0.35em 0;
}
.rich-content :deep(.crt-callout ul li::before) {
  content: "✅";
  position: absolute;
  left: 0;
  top: 0.05em;
  font-size: 0.95em;
}

.rich-content :deep(.vaccine-table) {
  margin: 14px 0; border-radius: 12px; overflow: hidden;
  border: 2px solid #ffd966; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.rich-content :deep(.vaccine-table table) { width: 100%; border-collapse: collapse; text-align: center; }
.rich-content :deep(.vaccine-table th) {
  background: #ffd966; color: #143c64; font-weight: 700;
  padding: 10px 8px; border: 1px solid #ffe599; font-size: 13px;
}
.rich-content :deep(.vaccine-table td) {
  padding: 10px 8px; border: 1px solid #ffe599;
  color: #333; font-size: 13px; line-height: 1.6;
}
.rich-content :deep(.vaccine-table tbody tr:nth-child(even)) { background: #fffbf0; }

/* ════════════════════════════════════
   文章結尾
════════════════════════════════════ */
.doc-footer {
  text-align: center;
  padding: 48px 20px 40px;
}

.doc-footer-ornament {
  display: flex; align-items: center;
  justify-content: center; gap: 10px;
  margin-bottom: 20px;
}
.doc-footer-ornament span {
  flex: 1; max-width: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, #c0d8ec);
}
.doc-footer-ornament span:last-child {
  background: linear-gradient(90deg, #c0d8ec, transparent);
}
.ornament-dot {
  width: 8px !important; height: 8px !important;
  background: #5aa0c8 !important;
  border-radius: 50%;
  max-width: 8px !important;
}

.footer-msg { font-size: 14px; color: #9ab0c0; margin-bottom: 20px; }

.footer-back {
  display: inline-block;
  padding: 10px 28px;
  border: 2px solid #143c64; color: #143c64;
  border-radius: 999px; font-size: 14px; font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.footer-back:hover { background: #143c64; color: white; }

/* ════════════════════════════════════
   Transitions
════════════════════════════════════ */
.slide-toc-enter-active, .slide-toc-leave-active { transition: opacity 0.3s; }
.slide-toc-enter-from, .slide-toc-leave-to       { opacity: 0; }

/* ════════════════════════════════════
   平板 768px+
════════════════════════════════════ */
@media (min-width: 768px) {
  .hero-wrap     { padding: 64px 32px 64px; }
  .cover-section { padding: 0 32px; }
  .article-body  { padding: 48px 32px 80px; gap: 32px; }
}

/* ════════════════════════════════════
   桌面 1024px+：TOC 轉為 sticky 常駐
════════════════════════════════════ */
@media (min-width: 1024px) {
  .hero-wrap    { padding: 80px 40px 72px; }
  .cover-section { padding: 0 40px; margin-top: -32px; }
  .article-body  { padding: 60px 40px 100px; gap: 40px; }

  /* TOC 常駐 sticky：固定在畫面上方指定位置，內容過長時由目錄自己捲動 */
  .toc-sidebar {
    position: sticky;
    top: 80px;
    left: auto;
    width: 288px;
    height: auto;
    max-height: calc(100dvh - 80px);
    transform: none !important;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    flex-shrink: 0;
    align-self: flex-start;
    scrollbar-gutter: stable;
    overscroll-behavior: contain;
  }
  .toc-card {
    margin-top: 0;
    min-height: 100%;
    box-sizing: border-box;
  }
  .toc-close  { display: none; }
  .toc-fab    { display: none; }
  .mobile-overlay { display: none; }
  /* fixed 模式佔位，維持 flex 排版不跑版 */
  .toc-sidebar-placeholder {
    width: 288px;
    flex-shrink: 0;
  }

  .article-document { padding: 48px 36px 8px; }
  .doc-body { padding: 4px 0 48px; }
  .rich-content :deep(p), .rich-content :deep(li) { font-size: 16px; }
}

/* ════════════════════════════════════
   1280px+：Footer 有負 margin-top（波浪設計）
   加 padding-bottom 讓 sticky TOC 剛好停在 Footer 上方
   padding = abs(footer.marginTop) + 安全間距
════════════════════════════════════ */
@media (min-width: 1280px) {
  .article-page {
    padding-bottom: calc(clamp(90px, 8vw, 130px) + 24px);
  }
}

/* ════════════════════════════════════
   手機 480px 以下（精簡時間軸）
════════════════════════════════════ */
@media (max-width: 480px) {
  .article-document { padding: 28px 16px 8px; }
  .doc-section { gap: 14px; }
  .timeline    { width: 32px; }
  .tl-badge    { width: 32px; height: 32px; font-size: 11px; }
  .doc-body    { padding: 2px 0 32px; }
}
</style>

<script>
import _ from "lodash";
import { computed } from "vue";
import { publicAPI } from "~/composables/utils/api.js";

const SITE_NAME = "人人動物醫院埔心分院";

// ════════════════════════════════════════════════════════
//  defineNuxtComponent：讓 composable 在 setup() 中正確運作
//  setup() 保持同步 → useAsyncData / useSeoMeta / useHead
//  全部在同一個 synchronous context 內呼叫，不跨越 await 邊界
// ════════════════════════════════════════════════════════
export default defineNuxtComponent({
  name: "ArticleDetailPage",

  setup() {
    const route = useRoute();
    const articleCode = String(route.params.articleCode);

    // ── 1. SSR 資料抓取（不 await，取得 reactive ref） ──
    //    Nuxt 會在 render 前等 useAsyncData 完成，server HTML 就有資料
    const { data: articleSSR } = useAsyncData(
      `article-${articleCode}`,
      () => publicAPI.getArticleByCode(articleCode)
    );

    // ── 2. SEO Meta（用 getter function，data 解析後自動更新） ──
    useSeoMeta({
      title:              () => articleSSR.value?.title ? `${articleSSR.value.title} | ${SITE_NAME}` : SITE_NAME,
      ogTitle:            () => articleSSR.value?.title || SITE_NAME,
      description:        () => articleSSR.value?.summary || "",
      ogDescription:      () => articleSSR.value?.summary || "",
      ogImage:            () => articleSSR.value?.coverImageUrl || "",
      ogType:             "article",
      twitterCard:        "summary_large_image",
      twitterTitle:       () => articleSSR.value?.title || SITE_NAME,
      twitterDescription: () => articleSSR.value?.summary || "",
    });

    // ── 3. JSON-LD 結構化資料（computed，data 存在才注入） ──
    useHead({
      script: computed(() => {
        if (!articleSSR.value) return [];
        return [
          {
            key: "article-jsonld",
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline:      articleSSR.value.title,
              description:   articleSSR.value.summary || "",
              image:         articleSSR.value.coverImageUrl || "",
              datePublished: articleSSR.value.publishedAt || "",
              dateModified:  articleSSR.value.publishedAt || "",
              author:    { "@type": "Organization", name: SITE_NAME },
              publisher: { "@type": "Organization", name: SITE_NAME },
            }),
          },
        ];
      }),
    });

    return { articleSSR };
  },

  // ══════════════════════════════════════════════════════
  //  Options API
  // ══════════════════════════════════════════════════════
  data() {
    // Vue 自動 unwrap setup() 回傳的 Ref，this.articleSSR 直接是資料物件
    return {
      article:        this.articleSSR || null,
      loading:        !this.articleSSR,
      isMenuOpen:     false,
      activeSection:  "",
      readingPercent: 0,
      tocDynamicMaxHeight: '',
      tocIsFixed:     false,
      tocFixedLeft:   0,
    };
  },

  watch: {
    // Client-side 路由導航時，useAsyncData 非同步更新後同步到 article
    articleSSR(val) {
      if (val) {
        this.article = val;
        this.loading = false;
      }
    },
  },

  computed: {
    tocSidebarStyle() {
      if (this.tocIsFixed) {
        return {
          position: 'fixed',
          top: '100px',
          left: this.tocFixedLeft + 'px',
          width: '288px',
          zIndex: 100,
        }
      }
      return {}
    },

    visibleSections() {
      if (!this.article) return [];
      return (this.article.sections || []).filter((s) => !s.isHide);
    },
  },

  async mounted() {
    if (!import.meta.client) return;

    if (this.article) {
      // SSR 已有資料，直接做動畫
      await this.loadScripts();
      await this.$nextTick();
      this.wrapTables();
      this.initAnimations();
    } else {
      // Fallback：SSR 失敗時才 client-side fetch
      const code = String(this.$route.params.articleCode);
      await this.loadArticle(code);
      if (this.article) {
        await this.loadScripts();
        await this.$nextTick();
        this.wrapTables();
        this.initAnimations();
      }
    }

    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("scroll", this.updateProgress);
    window.addEventListener("scroll", this.updateTocMaxHeight);
    window.addEventListener("resize", this.updateTocMaxHeight);
    this.updateProgress();
    this.updateTocMaxHeight();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("scroll", this.updateProgress);
    window.removeEventListener("scroll", this.updateTocMaxHeight);
    window.removeEventListener("resize", this.updateTocMaxHeight);
    if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
  },

  methods: {
    // ── 載入文章（僅 SSR 失敗時的 client fallback） ──
    async loadArticle(code) {
      this.loading = true;
      try {
        this.article = await publicAPI.getArticleByCode(code);
      } catch {
        this.article = null;
      } finally {
        this.loading = false;
      }
    },

    // ── CDN 載入 ──
    loadScript(src) {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement("script");
        s.src = src; s.onload = resolve; s.onerror = resolve;
        document.head.appendChild(s);
      });
    },

    async loadScripts() {
      await this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
      await this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }
    },

    // ── GSAP ──
    initAnimations() {
      if (!window.gsap) return;
      const gsap = window.gsap;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (this.$refs.breadcrumbEl)
        tl.fromTo(this.$refs.breadcrumbEl, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
      if (this.$refs.heroTitle)
        tl.fromTo(this.$refs.heroTitle, { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.25");
      if (this.$refs.heroAccent)
        tl.fromTo(this.$refs.heroAccent, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
      if (this.$refs.heroSummary)
        tl.fromTo(this.$refs.heroSummary, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.4");
      if (this.$refs.heroMeta)
        tl.fromTo(this.$refs.heroMeta, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
      if (this.$refs.coverFrame)
        gsap.fromTo(this.$refs.coverFrame,
          { y: 24, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power2.out",
            scrollTrigger: { trigger: this.$refs.coverSection, start: "top 90%" } });
      if (this.$refs.tocSidebar && window.innerWidth >= 768)
        gsap.fromTo(this.$refs.tocSidebar, { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.25 });
      const sections = this.$refs.docSections;
      if (sections) {
        const arr = Array.isArray(sections) ? sections : [sections];
        arr.forEach((el) => {
          gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" } });
        });
      }
    },

    // ── 進度條 ──
    updateProgress() {
      const bar = this.$refs.progressBar;
      if (!bar) return;

      // 頁面頂部進度條：整頁捲動比例
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${Math.min(100, pct)}%`;

      // TOC 進度條：以 article-document 為基準
      // article-document 底部進入視窗時 = 100%
      const articleDoc = this.$refs.articleDocument;
      if (articleDoc) {
        const docBottom = articleDoc.getBoundingClientRect().bottom;
        if (docBottom <= window.innerHeight) {
          this.readingPercent = 100;
        } else {
          const docTop    = articleDoc.getBoundingClientRect().top;
          const docHeight = articleDoc.offsetHeight;
          // 已捲過的比例 = 進入視窗的部分 / 總高
          const scrolled  = Math.max(0, -docTop);
          const readable  = Math.max(1, docHeight - window.innerHeight);
          this.readingPercent = Math.min(100, Math.round((scrolled / readable) * 100));
        }
      } else {
        this.readingPercent = Math.min(100, Math.round(pct));
      }
    },

    // ── Scroll spy ──
    handleScroll: _.throttle(function () {
      if (!this.visibleSections.length) return;
      const threshold = window.scrollY + window.innerHeight / 3;
      let found = "";
      for (let i = this.visibleSections.length - 1; i >= 0; i--) {
        const id = this.sectionId(this.visibleSections[i]);
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) { found = id; break; }
      }
      if (found !== this.activeSection) this.activeSection = found;
    }, 150),

    // ── 將 rich-content 內所有表格包一層 scroll wrapper ──
    wrapTables() {
      const richContents = this.$el?.querySelectorAll('.rich-content');
      richContents?.forEach(rc => {
        rc.querySelectorAll('table').forEach(table => {
          if (table.parentElement?.classList.contains('table-scroll-wrap')) return;
          const wrap = document.createElement('div');
          wrap.className = 'table-scroll-wrap';
          table.parentNode.insertBefore(wrap, table);
          wrap.appendChild(table);
        });
      });
    },

    // ── 產生 section id ──
    sectionId(sec) {
      return `sec-${sec.id}`;
    },

    // ── 捲動到指定段落 ──
    scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      this.isMenuOpen = false;
    },

    // ── 格式化日期 ──
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    },

    // ── TOC 最大高度（手機版不作用） ──
    updateTocMaxHeight() {
      if (window.innerWidth < 1024) return;
      const sidebar = this.$refs.tocSidebar;
      if (!sidebar) return;
      sidebar.style.maxHeight = (window.innerHeight - 80) + 'px';
    },
  },
});
</script>
