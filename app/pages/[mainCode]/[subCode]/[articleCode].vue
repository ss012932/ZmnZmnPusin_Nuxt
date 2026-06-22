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
          <!-- ── 左：文字 ── -->
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

          <!-- ── 右：互動貓咪卡片（桌面） ── -->
          <div class="hero-visual" ref="heroVisual" @click="onCatClick">
            <!-- 底部點陣裝飾 -->
            <div class="card-dots"></div>
            <!-- 類別徽章 -->
            <div class="card-badge" v-if="article.mainCategoryName">
              {{ article.mainCategoryName }}
            </div>
            <!-- 說話泡泡 -->
            <div class="cat-bubble">
              {{ catHappy ? '喵～謝謝你摸我 💕' : (article.subCategoryName || '摸摸我吧！') }}
            </div>
            <!-- 飛心特效 -->
            <div class="hearts-wrap" v-if="catHappy" aria-hidden="true">
              <span v-for="h in 5" :key="h" class="fly-heart" :style="{ '--hi': h }">❤️</span>
            </div>
            <!-- 閃光特效 -->
            <div class="sparkle-wrap" v-if="catHappy" aria-hidden="true">
              <span v-for="s in 4" :key="'s' + s" class="sparkle" :style="{ '--si': s }">✦</span>
            </div>
            <!-- 貓咪 SVG（圓臉奶貓・小獸醫） -->
            <div class="cat-float">
              <svg class="cat-svg" viewBox="0 0 180 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- 尾巴（身體後方，先畫；GSAP 以 143,162 為軸搖擺） -->
                <g ref="catTail">
                  <path d="M 136 170 C 166 158 180 192 158 202 C 146 207 132 200 135 189"
                    stroke="#DEE9F5" stroke-width="17" stroke-linecap="round" />
                </g>

                <!-- 身體 -->
                <ellipse cx="90" cy="172" rx="50" ry="36" fill="#EEF4FA" />
                <!-- 肚肚淺色 -->
                <ellipse cx="90" cy="182" rx="30" ry="22" fill="#F7FBFE" />

                <!-- 前爪 -->
                <ellipse cx="66" cy="200" rx="18" ry="11" fill="#DEE9F5" />
                <ellipse cx="66" cy="199" rx="15.5" ry="9" fill="#F4F9FD" />
                <ellipse cx="114" cy="200" rx="18" ry="11" fill="#DEE9F5" />
                <ellipse cx="114" cy="199" rx="15.5" ry="9" fill="#F4F9FD" />
                <!-- 肉球 -->
                <ellipse cx="66" cy="201" rx="6" ry="3.6" fill="#FFB8C6" opacity="0.55" />
                <ellipse cx="114" cy="201" rx="6" ry="3.6" fill="#FFB8C6" opacity="0.55" />

                <!-- 頭 -->
                <circle cx="90" cy="86" r="46" fill="#EEF4FA" />

                <!-- 左耳 -->
                <path d="M 55 64 L 59 38 L 85 57 Z" fill="#EEF4FA" />
                <path d="M 61 59 L 63 45 L 79 56 Z" fill="#FFB8C6" />
                <!-- 右耳 -->
                <path d="M 125 64 L 121 38 L 95 57 Z" fill="#EEF4FA" />
                <path d="M 119 59 L 117 45 L 101 56 Z" fill="#FFB8C6" />

                <!-- 額頭小撮毛 -->
                <path d="M 83 47 Q 90 39 97 47" fill="none" stroke="#DEE9F5" stroke-width="3" stroke-linecap="round" />

                <!-- 腮紅 -->
                <ellipse cx="60" cy="100" rx="9" ry="5.5" fill="rgba(255,150,170,0.22)" />
                <ellipse cx="120" cy="100" rx="9" ry="5.5" fill="rgba(255,150,170,0.22)" />

                <!-- 眼睛：正常（白點隨滑鼠看人） -->
                <g v-if="!catHappy && !catBlink">
                  <ellipse cx="74" cy="90" rx="9" ry="11.5" fill="#143c64" />
                  <ellipse cx="106" cy="90" rx="9" ry="11.5" fill="#143c64" />
                  <circle :cx="74 + catPupil.x" :cy="86 + catPupil.y" r="3.4" fill="#ffffff" />
                  <circle :cx="106 + catPupil.x" :cy="86 + catPupil.y" r="3.4" fill="#ffffff" />
                  <circle cx="71" cy="95" r="1.7" fill="rgba(255,255,255,0.55)" />
                  <circle cx="103" cy="95" r="1.7" fill="rgba(255,255,255,0.55)" />
                </g>
                <!-- 眼睛：眨眼 -->
                <g v-else-if="catBlink && !catHappy">
                  <path d="M 66 91 Q 74 96 82 91" fill="none" stroke="#143c64" stroke-width="2.6" stroke-linecap="round" />
                  <path d="M 98 91 Q 106 96 114 91" fill="none" stroke="#143c64" stroke-width="2.6" stroke-linecap="round" />
                </g>
                <!-- 眼睛：開心 ^ ^ -->
                <g v-else>
                  <path d="M 65 93 Q 74 82 83 93" fill="none" stroke="#143c64" stroke-width="3.2" stroke-linecap="round" />
                  <path d="M 97 93 Q 106 82 115 93" fill="none" stroke="#143c64" stroke-width="3.2" stroke-linecap="round" />
                </g>

                <!-- 鼻子 -->
                <path d="M 86 104 L 94 104 L 90 109 Z" fill="#FF9DB0" />
                <!-- 嘴巴 ω -->
                <path d="M 90 109 Q 85 115 81 112" fill="none" stroke="rgba(20,60,100,0.45)" stroke-width="1.6" stroke-linecap="round" />
                <path d="M 90 109 Q 95 115 99 112" fill="none" stroke="rgba(20,60,100,0.45)" stroke-width="1.6" stroke-linecap="round" />

                <!-- 鬍鬚左 -->
                <line x1="26" y1="98"  x2="58" y2="102" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
                <line x1="24" y1="106" x2="58" y2="108" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
                <line x1="26" y1="114" x2="58" y2="113" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
                <!-- 鬍鬚右 -->
                <line x1="154" y1="98"  x2="122" y2="102" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
                <line x1="156" y1="106" x2="122" y2="108" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
                <line x1="154" y1="114" x2="122" y2="113" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />

                <!-- 聽診器（衛教主題） -->
                <path d="M 68 126 Q 58 146 64 164 Q 69 178 86 173" stroke="#5aa0c8" stroke-width="4" stroke-linecap="round" />
                <path d="M 112 126 Q 122 146 116 164 Q 111 178 94 173" stroke="#5aa0c8" stroke-width="4" stroke-linecap="round" />
                <circle cx="68" cy="126" r="4.2" fill="#5aa0c8" />
                <circle cx="112" cy="126" r="4.2" fill="#5aa0c8" />
                <circle cx="90" cy="174" r="9" fill="#5aa0c8" />
                <circle cx="90" cy="174" r="5.2" fill="#143c64" />
                <circle cx="90" cy="174" r="2.4" fill="#7cc0e0" />
              </svg>
            </div>
            <!-- 提示文字 -->
            <div class="cat-hint-text">點我互動 🐾</div>
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
      <div class="article-body">

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

        <!-- ── TOC Sidebar ── -->
        <aside
          v-if="visibleSections.length > 1"
          class="toc-sidebar"
          :class="{ 'mobile-open': isMenuOpen }"
          ref="tocSidebar"
        >
          <div class="toc-card">
            <button class="toc-close" @click="isMenuOpen = false">✕</button>
            <div class="toc-heading">
              <span class="toc-heading-bar"></span>目次
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
          <div class="article-document">
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
  border-bottom: 1px solid #dce9f5;
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

/* 主容器 */
.hero-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 56px;
  display: flex;
  align-items: center;
  gap: 48px;
  position: relative;
  z-index: 1;
}

/* ── 左：文字 ── */
.hero-text { flex: 1; min-width: 0; }

.breadcrumb {
  display: flex; align-items: center;
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

/* 標題（左對齊） */
.hero-title {
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 800;
  color: #143c64;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 0;
  text-align: left;
}

/* 金色底線 */
.title-accent {
  width: 56px; height: 4px;
  background: linear-gradient(90deg, #5aa0c8, #ffd966);
  border-radius: 2px;
  margin: 12px 0 18px;
}

.hero-summary {
  font-size: 15px;
  color: #4a6a82;
  line-height: 1.8;
  margin: 0 0 20px;
  max-width: 540px;
}

/* Meta chips */
.hero-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

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

/* ── 右：互動貓咪卡片（桌面） ── */
.hero-visual {
  width: 360px;
  height: 260px;
  background: linear-gradient(155deg, #0c2543 0%, #143c64 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 56px rgba(20, 60, 100, 0.22),
    0 0 0 1px rgba(90, 160, 200, 0.12);
  flex-shrink: 0;
  position: relative;
  display: none; /* 手機隱藏 */
  cursor: pointer;
  user-select: none;
}

/* 點陣背景 */
.card-dots {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(90, 160, 200, 0.14) 1px, transparent 1px);
  background-size: 18px 18px;
  pointer-events: none;
}

/* 類別徽章 */
.card-badge {
  position: absolute; top: 14px; right: 14px;
  background: rgba(90, 160, 200, 0.22);
  border: 1px solid rgba(90, 160, 200, 0.38);
  color: rgba(255,255,255,0.82);
  font-size: 11px; font-weight: 600;
  padding: 4px 10px; border-radius: 999px;
  letter-spacing: 0.03em;
  pointer-events: none; z-index: 2;
}

/* 說話泡泡 */
.cat-bubble {
  position: absolute; top: 18px; left: 16px;
  background: white; color: #143c64;
  font-size: 12px; font-weight: 600;
  padding: 6px 12px; border-radius: 10px;
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
  transition: opacity 0.3s ease, transform 0.3s ease;
  box-shadow: 0 3px 10px rgba(0,0,0,0.18);
  pointer-events: none; white-space: nowrap; z-index: 3;
}
.cat-bubble::after {
  content: '';
  position: absolute; bottom: -7px; left: 14px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid white;
}
.hero-visual:hover .cat-bubble {
  opacity: 1; transform: translateY(0) scale(1);
}

/* 飛心容器 */
.hearts-wrap {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 4;
}
.fly-heart {
  position: absolute;
  font-size: 17px;
  left: calc(18% + calc(var(--hi) - 1) * 14%);
  bottom: 42%;
  animation: flyHeart 1.4s ease-out forwards;
  animation-delay: calc((var(--hi) - 1) * 0.12s);
}
@keyframes flyHeart {
  0%   { transform: translateY(0) scale(0.5); opacity: 1; }
  100% { transform: translateY(-75px) scale(1.1); opacity: 0; }
}

/* 貓咪浮動容器 */
.cat-float {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding-bottom: 22px;
  animation: catBob 3.2s ease-in-out infinite;
}
@keyframes catBob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

/* 貓咪 SVG */
.cat-svg {
  width: 152px; height: auto;
  filter: drop-shadow(0 8px 22px rgba(0,0,0,0.38));
  transition: transform 0.25s ease;
}
.hero-visual:hover .cat-svg { transform: scale(1.04); }

/* 提示文字 */
.cat-hint-text {
  position: absolute; bottom: 12px; left: 0; right: 0;
  text-align: center; font-size: 11px;
  color: rgba(255,255,255,0.36); letter-spacing: 0.04em;
  transition: color 0.25s; pointer-events: none;
}
.hero-visual:hover .cat-hint-text { color: rgba(255,255,255,0.58); }

/* Hero 底線 */
.hero-rule {
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #5aa0c8 35%, #ffd966 65%, transparent 100%);
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
  box-shadow: 0 4px 20px rgba(20, 60, 100, 0.4);
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
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 24px;
  margin-top: 56px;
  border: 1px solid #dce9f5;
  box-shadow: 0 8px 32px rgba(20, 60, 100, 0.1);
}

.toc-close {
  position: absolute; top: 28px; right: 28px;
  background: #f0f6fc; border: none;
  width: 30px; height: 30px; border-radius: 50%;
  font-size: 15px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #666; transition: all 0.2s;
}
.toc-close:hover { background: #dce9f5; color: #143c64; }

.toc-heading {
  display: flex; align-items: center; gap: 10px;
  font-size: 15px; font-weight: 700; color: #143c64;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8f2f8;
}
.toc-heading-bar {
  width: 4px; height: 16px;
  background: linear-gradient(to bottom, #5aa0c8, #ffd966);
  border-radius: 2px; flex-shrink: 0;
}

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
  background: linear-gradient(90deg, #5aa0c8, #ffd966);
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
  font-size: 15px; line-height: 1.85; margin: 0 0 14px; color: #374151;
}

.rich-content :deep(h2) { font-size: 18px; font-weight: 700; color: #143c64; margin: 22px 0 11px; }
.rich-content :deep(h3) { font-size: 16px; font-weight: 700; color: #1e4d87; margin: 18px 0 9px; }
.rich-content :deep(h4) { font-size: 15px; font-weight: 600; color: #2c5a7a; margin: 14px 0 8px; }
.rich-content :deep(strong) { font-weight: 700; color: #143c64; }
.rich-content :deep(em)     { font-style: italic; color: #5a6c7d; }

.rich-content :deep(ul), .rich-content :deep(ol) {
  padding-left: 22px; margin: 12px 0;
}
.rich-content :deep(li) { font-size: 15px; line-height: 1.8; margin-bottom: 7px; }

.rich-content :deep(img) {
  max-width: 100%; border-radius: 10px;
  margin: 14px 0;
  box-shadow: 0 4px 16px rgba(20, 60, 100, 0.1);
}

.rich-content :deep(table) {
  width: 100%; border-collapse: collapse;
  margin: 18px 0; font-size: 14px;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 2px 8px rgba(20, 60, 100, 0.08);
}
.rich-content :deep(th) {
  background: linear-gradient(135deg, #143c64, #1e5280);
  color: white; font-weight: 600;
  padding: 11px 13px; text-align: left; font-size: 13px;
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
  color: #4a6880; font-style: italic;
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

.rich-content :deep(.notice-box) {
  background: linear-gradient(135deg, #fff9e0, #fffbf0);
  border: 2px solid #ffd966; border-radius: 12px;
  padding: 16px; margin: 18px 0;
  box-shadow: 0 2px 8px rgba(255,217,102,0.12);
}
.rich-content :deep(.notice-title) { color: #e74c3c; font-weight: 700; font-size: 14px; margin-bottom: 9px; }

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

  /* 顯示 Three.js 卡片 */
  .hero-visual { display: block; }

  /* TOC 轉為 sticky */
  .toc-sidebar {
    position: sticky;
    top: 90px;
    left: auto;
    width: 268px;
    height: auto;
    max-height: calc(100vh - 110px);
    transform: none !important;
    overflow-y: auto;
    padding: 0;
    flex-shrink: 0;
  }
  .toc-card   { margin-top: 0; }
  .toc-close  { display: none; }
  .toc-fab    { display: none; }
  .mobile-overlay { display: none; }
}

/* ════════════════════════════════════
   桌面 1024px+
════════════════════════════════════ */
@media (min-width: 1024px) {
  .hero-wrap    { padding: 80px 40px 72px; gap: 56px; }
  .hero-visual  { width: 400px; height: 290px; }
  .cover-section { padding: 0 40px; margin-top: -32px; }
  .article-body  { padding: 60px 40px 100px; gap: 40px; }
  .toc-sidebar   { width: 288px; top: 100px; }
  .article-document { padding: 48px 36px 8px; }
  .doc-body { padding: 4px 0 48px; }
  .rich-content :deep(p), .rich-content :deep(li) { font-size: 16px; }
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
import { publicAPI } from "~/composables/utils/api.js";

export default {
  name: "ArticleDetailPage",

  data() {
    return {
      article: null,
      loading: true,
      isMenuOpen: false,
      activeSection: "",
      readingPercent: 0,
      // 貓咪互動
      catPupil: { x: 0, y: 0 },
      catHappy: false,
      catBlink: false,
    };
  },

  computed: {
    visibleSections() {
      if (!this.article) return [];
      return (this.article.sections || []).filter((s) => !s.isHide);
    },
  },

  async mounted() {
    if (!import.meta.client) return;

    const code = this.$route.params.articleCode;
    await this.loadArticle(code);

    if (this.article) {
      await this.loadScripts();
      await this.$nextTick();
      this.initCatInteraction();
      this.scheduleNextBlink();
      this.initAnimations();
    }

    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("scroll", this.updateProgress);
    this.updateProgress();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("scroll", this.updateProgress);
    if (this._catMouseFn) document.removeEventListener("mousemove", this._catMouseFn);
    if (this._blinkTimer) clearTimeout(this._blinkTimer);
    if (this._catHappyTimer) clearTimeout(this._catHappyTimer);
    if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
  },

  methods: {
    // ── 載入文章 ──
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

    // ── 貓咪互動 ──
    initCatInteraction() {
      if (window.innerWidth < 768) return;
      this._catMouseFn = (e) => {
        const card = this.$refs.heroVisual;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  * 0.52;
        const cy = rect.top  + rect.height * 0.48;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const maxOff = 3.8;
        const factor = Math.min(1, dist / 240);
        this.catPupil = {
          x: Math.cos(angle) * maxOff * factor,
          y: Math.sin(angle) * maxOff * factor,
        };
      };
      document.addEventListener("mousemove", this._catMouseFn);
    },

    onCatClick() {
      if (this.catHappy) return;
      this.catHappy = true;
      if (this._catHappyTimer) clearTimeout(this._catHappyTimer);
      this._catHappyTimer = setTimeout(() => { this.catHappy = false; }, 1600);
    },

    scheduleNextBlink() {
      const delay = 2800 + Math.random() * 3200;
      this._blinkTimer = setTimeout(() => {
        if (this.catHappy) { this.scheduleNextBlink(); return; }
        this.catBlink = true;
        setTimeout(() => {
          this.catBlink = false;
          this.scheduleNextBlink();
        }, 160);
      }, delay);
    },

    // ── GSAP ──
    initAnimations() {
      if (!window.gsap) return;
      const gsap = window.gsap;

      // Hero 進場（由左滑入）
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (this.$refs.breadcrumbEl) {
        tl.fromTo(this.$refs.breadcrumbEl,
          { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
      }
      if (this.$refs.heroTitle) {
        tl.fromTo(this.$refs.heroTitle,
          { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.25");
      }
      if (this.$refs.heroAccent) {
        tl.fromTo(this.$refs.heroAccent,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
      }
      if (this.$refs.heroSummary) {
        tl.fromTo(this.$refs.heroSummary,
          { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.4");
      }
      if (this.$refs.heroMeta) {
        tl.fromTo(this.$refs.heroMeta,
          { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
      }
      if (this.$refs.heroVisual) {
        tl.fromTo(this.$refs.heroVisual,
          { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.6");
      }

      // 貓咪尾巴搖擺
      const tail = this.$refs.catTail;
      if (tail) {
        gsap.fromTo(tail,
          { rotate: -13, svgOrigin: "143 162" },
          { rotate: 16, svgOrigin: "143 162", duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" }
        );
      }

      // 封面圖
      if (this.$refs.coverFrame) {
        gsap.fromTo(this.$refs.coverFrame,
          { y: 24, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power2.out",
            scrollTrigger: { trigger: this.$refs.coverSection, start: "top 90%" } });
      }

      // TOC（桌面）
      if (this.$refs.tocSidebar && window.innerWidth >= 768) {
        gsap.fromTo(this.$refs.tocSidebar,
          { x: -18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.25 });
      }

      // 每個段落（時間軸 + 內容）
      const sections = this.$refs.docSections;
      if (sections) {
        const arr = Array.isArray(sections) ? sections : [sections];
        arr.forEach((el) => {
          gsap.fromTo(el,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%" } });
        });
      }
    },

    // ── 進度條 ──
    updateProgress() {
      const bar = this.$refs.progressBar;
      if (!bar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      const v = Math.min(100, pct);
      bar.style.width = `${v}%`;
      this.readingPercent = Math.round(v);
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

    sectionId(sec) { return `section-${sec.id}`; },

    scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isMenuOpen = false;
      this.activeSection = id;
    },

    formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
    },
  },
};
</script>
