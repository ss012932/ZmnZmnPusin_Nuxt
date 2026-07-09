<template>
  <div class="protection-page">
    <div class="unified-container">
      <!-- 頁首 -->
      <div class="page-header">
        <img
          src="@/assets/image/Vector (10).webp"
          alt="衛教專區圖標"
          class="header-icon"
        />
        <h1 class="page-title">
          <span class="title-main">衛教專區</span>
          <span class="title-sub">疾病分享</span>
        </h1>

        <!-- 手機版浮動目錄按鈕 -->
        <button class="menu-toggle-btn" @click="isMenuOpen = !isMenuOpen">
          <span class="menu-icon">☰</span>
          <span class="menu-text">目錄</span>
        </button>
      </div>

      <div class="content-wrapper">
        <!-- 手機版背景遮罩 -->
        <div
          class="overlay"
          v-if="isMenuOpen"
          @click="isMenuOpen = false"
        ></div>

        <!-- 左側導覽 -->
        <div
          class="sidebar"
          :class="{ 'sidebar-mobile': true, open: isMenuOpen }"
        >
          <div class="menu-container">
            <button class="menu-close-btn" @click="isMenuOpen = false">
              <span class="close-icon">✕</span>
            </button>
            <h2 class="menu-title">目次</h2>

            <div
              class="menu-item"
              v-for="category in menuData"
              :key="category.key"
            >
              <button
                class="menu-button"
                :class="{ active: activeMenu === category.key }"
                @click="toggleMenu(category.key)"
              >
                <span class="menu-arrow">▶</span>
                {{ category.label }}
              </button>
              <div class="submenu" v-show="activeMenu === category.key">
                <button
                  class="submenu-item"
                  v-for="sub in category.subItems"
                  :key="sub.id"
                  :class="{ active: isSectionActive(sub.id) }"
                  @click="scrollToSection(sub.id)"
                >
                  {{ sub.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側主要內容 -->
        <div class="main-content">
          <section
            class="content-section"
            v-for="section in contentData"
            :key="section.key"
          >
            <div class="content-header">
              <h2 class="content-title">{{ section.title }}</h2>
            </div>

            <div
              v-for="block in section.blocks"
              :key="block.id"
              :id="block.id"
              class="section-content"
            >
              <h3 class="section-title">{{ block.title }}</h3>
              <article
                class="rich-text-content"
                v-html="getArticleHtml(block)"
              ></article>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==================== Mobile First 設計 ==================== */

.protection-page {
  padding: 16px;
  background-color: #fffaf0;
  min-height: 100vh;
}

.unified-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ==================== 頁首區域 ==================== */

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  position: relative;
}

.header-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  color: #143c64;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  flex: 1;
}

.title-main {
  font-size: 22px;
  font-weight: bold;
}

.title-sub {
  font-size: 16px;
  font-weight: bold;
  color: #5a8ab8;
}

/* ==================== 手機版浮動目錄按鈕 ==================== */

.menu-toggle-btn {
  position: fixed;
  top: 90px;
  right: 16px;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #143c64;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle-btn:active {
  transform: scale(0.95);
}

.menu-icon {
  font-size: 18px;
  line-height: 1;
}

.menu-text {
  font-size: 14px;
}

/* ==================== 內容包裹層 ==================== */

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ==================== 手機版背景遮罩 ==================== */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 400;
  transition: opacity 0.3s ease;
}

/* ==================== 側邊欄 (手機版) ==================== */

.sidebar-mobile {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
  z-index: 500;
  overflow-y: auto;
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-mobile.open {
  transform: translateX(0);
  opacity: 1;
}

.menu-container {
  padding: 20px;
  margin-top: 40%;
  position: relative;
}

.menu-close-btn {
  position: absolute;
  margin-top: -2rem;
  right: 16px;
  background: #e74c3c;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  transition: all 0.2s ease;
  z-index: 10;
}

.close-icon {
  font-size: 20px;
  line-height: 1;
  font-weight: bold;
}

.menu-title {
  font-size: 20px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 20px 0;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #5aa0c8;
}

.menu-item {
  margin-bottom: 8px;
}

.menu-button {
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: #143c64;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.menu-button:hover {
  background-color: #f0f7ff;
}

.menu-button.active {
  background-color: #e3f2fd;
  font-weight: bold;
  color: #1e4d87;
}

.menu-arrow {
  font-size: 12px;
  transition: transform 0.2s ease;
  color: #5aa0c8;
}

.menu-button.active .menu-arrow {
  transform: rotate(90deg);
}

.submenu {
  margin-left: 28px;
  margin-top: 8px;
  padding-left: 12px;
  border-left: 2px solid #e3f2fd;
}

.submenu-item {
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #143c64;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: #f5f5f5;
  color: #1e4d87;
}

.submenu-item.active,
button.submenu-item.active {
  background-color: #e8f4fd !important;
  color: #1e4d87 !important;
  font-weight: 600 !important;
  border-left: 3px solid #5aa0c8 !important;
  padding-left: 9px !important;
}

/* ==================== 主要內容區域 ==================== */

.main-content {
  background: white;
  padding: 0;
}

.content-section {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.content-section:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid #5aa0c8;
}

.content-title {
  font-size: 20px;
  font-weight: bold;
  color: #143c64;
  margin: 0;
}

.section-content {
  margin-bottom: 32px;
  scroll-margin-top: 100px;
}

.section-content:target {
  padding: 20px;
  margin: -4px;
  border-left: 4px solid #5aa0c8;
  background: linear-gradient(90deg, #f8f9ff 0%, transparent 100%);
  border-radius: 0 8px 8px 0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 16px 0;
  padding-left: 12px;
  border-left: 4px solid #ffd966;
}

.rich-text-content {
  color: #333;
}

.rich-text-content :deep(p) {
  font-size: 15px;
  line-height: 1.8;
  margin: 0 0 12px;
}

.rich-text-content :deep(strong) {
  font-weight: 700;
}

.rich-text-content :deep(.highlight-red) {
  color: #e74c3c;
}

.rich-text-content :deep(.content-list) {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.rich-text-content :deep(.content-list li) {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 10px;
  padding-left: 8px;
}

.rich-text-content :deep(.subsection-block) {
  margin-bottom: 24px;
}

.rich-text-content :deep(.subsection-title) {
  font-size: 16px;
  font-weight: bold;
  color: #1e4d87;
  margin: 0 0 12px 0;
  padding-left: 8px;
}

.rich-text-content :deep(.treatment-box) {
  background: #f8f9ff;
  border-left: 4px solid #5aa0c8;
  border-radius: 0 8px 8px 0;
  padding: 16px;
  margin-bottom: 16px;
}

.rich-text-content :deep(.treatment-subtitle) {
  font-size: 16px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 12px 0;
}

.rich-text-content :deep(.type-box) {
  background: #f8f9ff;
  border-left: 4px solid #5aa0c8;
  border-radius: 0 8px 8px 0;
  padding: 14px;
  margin-bottom: 12px;
}

.rich-text-content :deep(.type-box.danger) {
  background: #fff8f0;
  border-left-color: #e74c3c;
}

.rich-text-content :deep(.type-title) {
  font-size: 15px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 8px 0;
}

.rich-text-content :deep(.symptom-box) {
  background: #fff8f0;
  border-left: 4px solid #ffb347;
  border-radius: 0 8px 8px 0;
  padding: 12px;
  margin-bottom: 10px;
}

.rich-text-content :deep(.symptom-item) {
  margin: 0;
}

.rich-text-content :deep(.prevention-item) {
  margin-bottom: 20px;
  padding: 14px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 3px solid #5aa0c8;
}

.rich-text-content :deep(.prevention-title) {
  font-size: 15px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 10px 0;
}

.rich-text-content :deep(.notice-box) {
  background: linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%);
  border: 2px solid #ffd966;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  box-shadow: 0 2px 8px rgba(255, 217, 102, 0.2);
}

.rich-text-content :deep(.notice-title) {
  color: #e74c3c;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
}

.rich-text-content :deep(.vaccine-table) {
  margin: 20px 0;
  border: 2px solid #ffd966;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rich-text-content :deep(.vaccine-table table) {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.rich-text-content :deep(.vaccine-table th) {
  background: #ffd966;
  color: #143c64;
  font-weight: bold;
  padding: 12px 8px;
  border: 1px solid #ffd966;
  font-size: 14px;
}

.rich-text-content :deep(.vaccine-table td) {
  padding: 12px 8px;
  border: 1px solid #ffe599;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.rich-text-content :deep(.vaccine-table tbody tr:nth-child(even)) {
  background-color: #fffbf0;
}

.content-text {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 12px;
}

.content-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.content-list li {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 10px;
  padding-left: 8px;
}

/* ==================== 子章節區塊 ==================== */

.subsection-block {
  margin-bottom: 24px;
}

.subsection-title {
  font-size: 16px;
  font-weight: bold;
  color: #1e4d87;
  margin: 0 0 12px 0;
  padding-left: 8px;
}

/* ==================== 治療方式區塊 ==================== */

.treatment-box {
  background: #f8f9ff;
  border-left: 4px solid #5aa0c8;
  border-radius: 0 8px 8px 0;
  padding: 16px;
  margin-bottom: 16px;
}

.treatment-subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 12px 0;
}

/* ==================== 類型區塊 ==================== */

.type-box {
  background: #f8f9ff;
  border-left: 4px solid #5aa0c8;
  border-radius: 0 8px 8px 0;
  padding: 14px;
  margin-bottom: 12px;
}

.type-box.danger {
  background: #fff8f0;
  border-left: 4px solid #e74c3c;
}

.type-title {
  font-size: 15px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 8px 0;
}

/* ==================== 症狀區塊 ==================== */

.symptom-box {
  background: #fff8f0;
  border-left: 4px solid #ffb347;
  border-radius: 0 8px 8px 0;
  padding: 12px;
  margin-bottom: 10px;
}

.symptom-item {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin: 0;
}

/* ==================== 預防項目 ==================== */

.prevention-item {
  margin-bottom: 20px;
  padding: 14px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 3px solid #5aa0c8;
}

.prevention-title {
  font-size: 15px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 10px 0;
}

/* ==================== 提示框 ==================== */

.notice-box {
  background: linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%);
  border: 2px solid #ffd966;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  box-shadow: 0 2px 8px rgba(255, 217, 102, 0.2);
}

.notice-title {
  color: #e74c3c;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
}

/* ==================== 表格樣式 ==================== */

.vaccine-table {
  margin: 20px 0;
  border: 2px solid #ffd966;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.vaccine-table table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.vaccine-table th {
  background: #ffd966;
  color: #143c64;
  font-weight: bold;
  padding: 12px 8px;
  border: 1px solid #ffd966;
  font-size: 14px;
}

.vaccine-table td {
  padding: 12px 8px;
  border: 1px solid #ffe599;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.vaccine-table tbody tr:nth-child(even) {
  background-color: #fffbf0;
}

/* ==================== 平板版 (768px 以上) ==================== */

@media (min-width: 768px) {
  .protection-page {
    padding: 32px 24px;
  }

  .unified-container {
    padding: 32px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .title-main {
    font-size: 26px;
  }

  .title-sub {
    font-size: 18px;
  }

  .content-wrapper {
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
  }

  .menu-toggle-btn {
    display: none;
  }

  .sidebar-mobile {
    position: sticky;
    top: 120px;
    display: block;
    transform: none !important;
    opacity: 1 !important;
    box-shadow: none;
    width: auto;
    height: auto;
    flex: 0 0 280px;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .menu-container {
    border: 3px solid #5aa0c8;
    border-radius: 16px;
    padding: 24px;
    margin-top: 0;
  }

  .main-content {
    flex: 1;
    min-width: 0;
  }

  .content-title {
    font-size: 22px;
  }

  .section-title {
    font-size: 19px;
  }

  .content-text,
  .content-list li {
    font-size: 16px;
  }

  .rich-text-content :deep(p),
  .rich-text-content :deep(.content-list li) {
    font-size: 16px;
  }

  .subsection-title {
    font-size: 17px;
  }

  .rich-text-content :deep(.subsection-title),
  .rich-text-content :deep(.treatment-subtitle) {
    font-size: 17px;
  }

  .treatment-subtitle {
    font-size: 17px;
  }

  .vaccine-table th,
  .vaccine-table td {
    padding: 14px 12px;
    font-size: 15px;
  }

  .rich-text-content :deep(.vaccine-table th),
  .rich-text-content :deep(.vaccine-table td) {
    padding: 14px 12px;
    font-size: 15px;
  }

  .menu-close-btn {
    display: none;
  }
}

/* ==================== 桌面版 (1024px 以上) ==================== */

@media (min-width: 1024px) {
  .unified-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px;
    margin-bottom: -2rem;
  }

  .sidebar-mobile {
    flex: 0 0 320px;
    top: 100px;
    margin-bottom: 60px;
  }

  .menu-container {
    padding: 28px;
  }

  .content-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }
}
</style>

<script>
import _ from "lodash";

export default {
  name: "DiseasePage",

  setup() {
    useSeoMeta({
      title:            '衛教專區・疾病分享｜人人動物醫院埔心分院',
      description:      '人人動物醫院埔心分院衛教專區，提供骨骼關節、泌尿系統、生殖系統、消化系統、皮膚過敏、心肺呼吸等犬貓常見疾病的專業衛教文章。',
      ogTitle:          '衛教專區・疾病分享｜人人動物醫院埔心分院',
      ogDescription:    '提供犬貓骨骼關節、泌尿、生殖、消化、皮膚、心肺等常見疾病衛教文章，由專業獸醫師撰寫。',
      ogType:           'website',
      ogUrl:            'https://www.zmnzmnpusin.com.tw/disease',
      ogImage:          'https://www.zmnzmnpusin.com.tw/og-image.webp',
      twitterCard:      'summary_large_image',
      twitterTitle:     '衛教專區・疾病分享｜人人動物醫院埔心分院',
      twitterDescription: '犬貓常見疾病衛教文章，由人人動物醫院埔心分院專業獸醫師撰寫。',
    })
    useHead({
      link: [{ rel: 'canonical', href: 'https://www.zmnzmnpusin.com.tw/disease' }],
    })
  },

  data() {
    return {
      activeMenu: "joint",
      isMenuOpen: false,
      navbarHeight: 120,
      activeSection: "",

      menuData: [
        {
          key: "joint",
          label: "關節活動照護",
          subItems: [
            { id: "joint-causes", label: "關節退化的原因" },
            { id: "joint-treatment", label: "保養與治療方式" },
            { id: "joint-hospital", label: "本院提供的治療" },
          ],
        },
        {
          key: "uterus",
          label: "子宮蓄膿介紹",
          subItems: [
            { id: "uterus-intro", label: "認識子宮蓄膿" },
            { id: "uterus-prevention", label: "常見症狀與預防" },
          ],
        },
        {
          key: "urinary",
          label: "貓咪下泌尿道疾病",
          subItems: [
            { id: "urinary-causes-symptoms", label: "常見原因及症狀" },
            { id: "urinary-prevention-notes", label: "預防與注意事項" },
          ],
        },
        {
          key: "ivdd",
          label: "椎間盤疾病 (IVDD 相關資訊)",
          subItems: [
            { id: "ivdd-what", label: "什麼是椎間盤疾病（IVDD）" },
            { id: "ivdd-symptoms-grades", label: "症狀及嚴重分級" },
            { id: "ivdd-treatment-prevention", label: "治療與預防" },
          ],
        },
      ],

      contentData: [
        {
          key: "joint",
          title: "關節活動照護",
          blocks: [
            {
              id: "joint-causes",
              title: "關節退化的原因",
              content: [
                {
                  type: "subsection",
                  title: "常見原因",
                  items: [
                    "年齡增長導致關節磨損、軟骨退化。",
                    "關節長期受壓或過度使用。",
                  ],
                },
                {
                  type: "subsection",
                  title: "高風險族群",
                  items: [
                    "🐾 <strong>肥胖:</strong> 體重過重增加關節負擔。",
                    "🐾 <strong>外傷:</strong> 曾有關節脫臼或韌帶損傷。",
                    "🐾 <strong>劇烈運動:</strong> 愛跑愛跳、活動力旺盛的犬貓。",
                  ],
                },
                {
                  type: "subsection",
                  title: "典型症狀",
                  items: [
                    "步態改變、行走不穩。",
                    "上下樓梯、跳高或起身困難。",
                    "跛行、肌肉量減少。",
                  ],
                },
              ],
            },
            {
              id: "joint-treatment",
              title: "保養與治療方式",
              content: [
                {
                  type: "subsection",
                  title: "治療目標",
                  text: "改善生活品質、減緩疼痛、維持關節活動能力。",
                },
                {
                  type: "subsection",
                  title: "延緩退化方法",
                  items: [
                    "🐾 <strong>控制體重:</strong> 避免關節負擔過重。",
                    "🐾 <strong>環境改善:</strong> 使用止滑墊或階梯，減少跳上跳下。",
                    "🐾 <strong>適度運動:</strong> 每日10分鐘散步或游泳，維持肌力。",
                    "🐾 <strong>補充保健品:</strong> 促進軟骨修復與抗發炎。",
                  ],
                },
              ],
            },
            {
              id: "joint-hospital",
              title: "本院提供的治療",
              content: [
                {
                  type: "treatment-box",
                  title: "減重門診",
                  text: "體態評估、飲食管理、營養諮詢。",
                },
                {
                  type: "treatment-box",
                  title: "關節保健產品",
                  items: [
                    "🐾 歐斯沛口服玻尿酸",
                    "🐾 骨力勁玻尿酸加強錠",
                    "🐾 骨捷特綠唇貽貝膠囊",
                  ],
                },
                {
                  type: "treatment-box",
                  title: "MLS四級雷射治療",
                  text: "抗發炎、消水腫、減緩疼痛、促進傷口癒合。",
                },
                {
                  type: "treatment-box",
                  title: "力洛犬/力洛貓注射",
                  text: "無止痛藥副作用，每月一次，長效止痛。",
                },
                {
                  type: "treatment-box",
                  title: "再生療法(寵物幹細胞治療)",
                  text: "幹細胞釋放生長因子，促進軟骨細胞再生，<br/>修補受損組織，持續維持關節功能並減痛。",
                },
              ],
            },
          ],
        },
        {
          key: "uterus",
          title: "子宮蓄膿介紹",
          blocks: [
            {
              id: "uterus-intro",
              title: "認識子宮蓄膿",
              content: [
                {
                  type: "subsection",
                  title: "子宮蓄膿是什麼?",
                  items: [
                    "是未絕育的母犬或母貓常見的生殖系統疾病。",
                    "發情期間子宮內環境容易被細菌感染。",
                    "當細菌進入子宮後，會在子宮內大量繁殖形成膿液。",
                  ],
                },
                {
                  type: "type-box",
                  title: "1. 開放型",
                  text: "可見外陰部有膿性分泌物流出。",
                  danger: false,
                },
                {
                  type: "type-box",
                  title: "2. 閉鎖型(更危險)",
                  items: [
                    "無法見到分泌物排出。",
                    "<strong class='highlight-red'>膿液可能導致子宮或輸卵管破裂，</strong><br/>→ 外滲至腹腔，引發敗血症或腹膜炎。",
                  ],
                  danger: true,
                },
              ],
            },
            {
              id: "uterus-prevention",
              title: "常見症狀與預防",
              content: [
                {
                  type: "subsection",
                  title: "可能症狀",
                  items: [
                    "🐾 食慾不振、嘔吐、嗜睡。",
                    "🐾 腹部脹大或疼痛。",
                    "🐾 頻繁舔陰部、陰部分泌物增多。",
                    "🐾 發燒或體溫過低。",
                  ],
                },
                {
                  type: "notice-box",
                  title: "預防方式",
                  items: [
                    "✅ 子宮蓄膿是常見但可預防的疾病。",
                    "<strong class='highlight-red'>✅ 最有效的方式就是絕育手術。</strong>",
                    "✅ 可避免感染與高額的緊急手術費用。",
                    "✅ 減少毛孩經歷長時間恢復與嚴重併發症風險。",
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "urinary",
          title: "貓咪下泌尿道疾病",
          blocks: [
            {
              id: "urinary-causes-symptoms",
              title: "一、常見原因及症狀",
              content: [
                {
                  type: "subsection",
                  title: "發生原因",
                  items: [
                    "🐾 主要與<strong>壓力、環境改變、飲水量不足</strong>有關。",
                    "🐾 飲食中礦物質比例異常或pH值不平衡也會增加風險。",
                    "🐾 <strong class='highlight-red'>自發性膀胱炎(FIC)</strong>是下泌尿道疾病中最常見的類型，其中情緒壓力是主要誘發因素。",
                  ],
                },
                {
                  type: "subsection",
                  title: "徵兆症狀",
                },
                {
                  type: "symptom-box",
                  value: "<strong>排尿姿勢改變:</strong> 低頭、背拱起、後腳偏站、延長蹲尿時間。",
                },
                {
                  type: "symptom-box",
                  value: "<strong>排尿疼痛或無法排尿:</strong> 背部拱起，可能同時發出哀鳴。",
                },
                {
                  type: "symptom-box",
                  value: "<strong>尿液異常:</strong> 尿色變深、出現血尿。",
                },
                {
                  type: "symptom-box",
                  value: "<strong>排尿地點改變:</strong> 不在貓砂盆內排尿。",
                },
                {
                  type: "symptom-box",
                  value: "<strong>頻尿或尿量減少:</strong> 尿塊大小變異(如從拳頭大小變成豆子大小)。",
                },
                {
                  type: "symptom-box",
                  value: "<strong>舔拭泌尿處:</strong> 頻繁舔陰部表示不適。",
                },
              ],
            },
            {
              id: "urinary-prevention-notes",
              title: "預防與注意事項",
              content: [
                {
                  type: "prevention-item",
                  title: "1. 充足飲水",
                  items: [
                    "提供煮沸過濾水，避免自來水或生水。",
                    "使用不同水碗或噴泉式飲水器，提升飲水量。",
                  ],
                },
                {
                  type: "prevention-item",
                  title: "2. 環境豐富化",
                  text: "增加互動與活動量，提供跳台、藏身空間。",
                },
                {
                  type: "prevention-item",
                  title: "3. 控制體重",
                  text: "避免肥胖以減少泌尿疾病風險。",
                },
                {
                  type: "prevention-item",
                  title: "4. 適當環境與貓砂盆",
                  items: [
                    "保持乾淨、安靜、安全的如廁環境。",
                    "<strong>貓砂盆數量應為「貓數＋1」。</strong>",
                  ],
                },
                {
                  type: "prevention-item",
                  title: "5. 定期健康檢查",
                  text: "早期發現潛在問題並及時治療。",
                },
                {
                  type: "notice-box",
                  title: "注意事項",
                  items: [
                    "🐾 多貓家庭若有衝突，建議分開飼養。",
                    "🐾 有新成員或環境改變時，觀察貓咪壓力反應。",
                    "🐾 適當使用費洛蒙等安撫用品，幫助放鬆心情。",
                    "🐾 <strong class='highlight-red'>若出現異常排尿、血尿或疼痛，應立即就醫，避免惡化或造成尿道阻塞。</strong>",
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "ivdd",
          title: "椎間盤疾病 (IVDD 相關資訊)",
          blocks: [
            {
              id: "ivdd-what",
              title: "什麼是椎間盤疾病(IVDD)",
              content: [
                {
                  type: "list",
                  items: [
                    "🐾 椎間盤位於脊椎骨之間，具有吸收震動與支撐脊椎的作用。",
                    "🐾 當椎間盤退化、突出或破裂時，會壓迫脊髓神經，造成疼痛或行動障礙。",
                    "🐾 此疾病常見於<strong>臘腸犬、柯基、貴賓犬等長背短腿品種。</strong>",
                  ],
                },
              ],
            },
            {
              id: "ivdd-symptoms-grades",
              title: "二、症狀及嚴重分級",
              content: [
                {
                  type: "subsection",
                  title: "常見症狀",
                  items: [
                    "🐾 活動力下降、跛腳。",
                    "🐾 拱背、背部僵硬。",
                    "🐾 身體疼痛時會哀鳴，不願低頭進食。",
                    "🐾 單側或四肢輕癱。",
                    "🐾 排尿困難或尿失禁。",
                  ],
                },
                {
                  type: "subsection",
                  title: "嚴重分級",
                },
                {
                  type: "vaccine-table",
                  headers: ["分級", "狀況說明"],
                  rows: [
                    ["第一級", "僅有背部疼痛，步態正常。"],
                    ["第二級", "步態不協調。"],
                    ["第三級", "無法行走。"],
                    ["第四級", "無法行走且排尿困難。"],
                    ["第五級", "無法行走、排尿困難，且喪失深層痛覺。"],
                  ],
                },
              ],
            },
            {
              id: "ivdd-treatment-prevention",
              title: "治療與預防",
              content: [
                {
                  type: "subsection",
                  title: "治療方式",
                },
                {
                  type: "treatment-box",
                  title: "1. 第一、二級：內科療法",
                  items: ["使用止痛、消炎、肌肉鬆弛藥，並限制活動。"],
                },
                {
                  type: "treatment-box",
                  title: "2. 第三級：內科或外科減壓手術",
                },
                {
                  type: "treatment-box",
                  title: "3. 第四、五級：建議外科手術治療",
                  text: "即使手術後完全康復的機率也低於輕症病例。",
                },
                {
                  type: "treatment-box",
                  title: "4. 手術後輔助治療",
                  text: "可搭配<strong>四級雷射治療</strong>，透過不同波長雷射光減緩發炎、水腫與疼痛，促進癒合。",
                },
                {
                  type: "treatment-box",
                  title: "5. 幹細胞治療",
                  text: "將幹細胞注射至脊椎旁肌肉或靜脈，有助恢復神經功能、減少疼痛並加速康復。",
                },
                {
                  type: "notice-box",
                  title: "預防措施",
                  items: [
                    "🐾 <strong>體重控制，</strong>避免脊椎負擔過大。",
                    "🐾 <strong>增設止滑墊，</strong>防止滑倒。",
                    "🐾 <strong>避免垂直抱起或讓狗雙腳站立。</strong>",
                    "🐾 <strong>減少劇烈運動與上下樓梯。</strong>",
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
    this.handleHashNavigation();
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    getArticleHtml(block) {
      // 後台富文本接上後，可直接讓 API 回傳 block.html。
      return block.html || this.renderRichTextContent(block.content);
    },

    renderRichTextContent(content = []) {
      return content.map((item) => this.renderRichTextItem(item)).join("");
    },

    renderRichTextItem(item) {
      switch (item.type) {
        case "list":
          return this.renderContentList(item.items);

        case "text":
          return this.renderParagraph(item.value);

        case "subsection":
          return `
            <div class="subsection-block">
              <h4 class="subsection-title">${item.title}</h4>
              ${this.renderContentList(item.items)}
              ${this.renderParagraph(item.text)}
            </div>
          `;

        case "treatment-box":
          return `
            <div class="treatment-box">
              <h4 class="treatment-subtitle">${item.title}</h4>
              ${this.renderParagraph(item.text)}
              ${this.renderContentList(item.items)}
            </div>
          `;

        case "type-box":
          return `
            <div class="type-box${item.danger ? " danger" : ""}">
              <h5 class="type-title">${item.title}</h5>
              ${this.renderParagraph(item.text)}
              ${this.renderContentList(item.items)}
            </div>
          `;

        case "symptom-box":
          return `
            <div class="symptom-box">
              <p class="symptom-item">${item.value}</p>
            </div>
          `;

        case "prevention-item":
          return `
            <div class="prevention-item">
              <h5 class="prevention-title">${item.title}</h5>
              ${this.renderContentList(item.items)}
              ${this.renderParagraph(item.text)}
            </div>
          `;

        case "notice-box":
          return `
            <div class="notice-box">
              <p class="notice-title">${item.title}</p>
              ${this.renderContentList(item.items)}
            </div>
          `;

        case "vaccine-table":
          return this.renderContentTable(item);

        default:
          return "";
      }
    },

    renderContentList(items) {
      if (!items?.length) return "";
      const listItems = items.map((li) => `<li>${li}</li>`).join("");
      return `<ul class="content-list">${listItems}</ul>`;
    },

    renderParagraph(text) {
      return text ? `<p class="content-text">${text}</p>` : "";
    },

    renderContentTable(tableData) {
      const headers = tableData.headers
        .map((header) => `<th>${header}</th>`)
        .join("");
      const rows = tableData.rows
        .map((row) => {
          const cells = row.map((cell) => `<td>${cell}</td>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `
        <div class="vaccine-table">
          <table>
            <thead>
              <tr>${headers}</tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    toggleMenu(menuName) {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    },

    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        this.isMenuOpen = false;
        this.activeSection = sectionId;
        this.autoExpandMenu(sectionId);

        if (window.innerWidth > 992) {
          this.$nextTick(() => {
            const activeItem = document.querySelector(".submenu-item.active");
            const sidebar = document.querySelector(".sidebar");
            if (activeItem && sidebar) {
              const sidebarRect = sidebar.getBoundingClientRect();
              const itemRect = activeItem.getBoundingClientRect();
              const offset =
                itemRect.top -
                sidebarRect.top -
                sidebar.clientHeight / 2 +
                itemRect.height / 2;
              sidebar.scrollBy({ top: offset, behavior: "smooth" });
            }
          });
        }
      }
    },

    handleScroll: _.throttle(function () {
      const allSectionIds = this.menuData.flatMap((cat) =>
        cat.subItems.map((sub) => sub.id)
      );

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let foundSection = "";
      for (let i = allSectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(allSectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          foundSection = allSectionIds[i];
          break;
        }
      }

      if (foundSection && foundSection !== this.activeSection) {
        this.activeSection = foundSection;
        this.autoExpandMenu(foundSection);

        if (window.innerWidth > 992) {
          this.$nextTick(() => {
            const activeItem = document.querySelector(".submenu-item.active");
            const sidebar = document.querySelector(".sidebar");
            if (activeItem && sidebar) {
              const sidebarRect = sidebar.getBoundingClientRect();
              const itemRect = activeItem.getBoundingClientRect();
              const offset =
                itemRect.top -
                sidebarRect.top -
                sidebar.clientHeight / 2 +
                itemRect.height / 2;
              sidebar.scrollBy({ top: offset, behavior: "smooth" });
            }
          });
        }
      }
    }, 150),

    autoExpandMenu(sectionId) {
      for (const category of this.menuData) {
        const found = category.subItems.some((sub) => sub.id === sectionId);
        if (found) {
          this.activeMenu = category.key;
          break;
        }
      }
    },

    isSectionActive(sectionId) {
      return this.activeSection === sectionId;
    },

    handleHashNavigation() {
      const hash = this.$route?.hash?.replace("#", "") || "";

      const matchedCategory = this.menuData.find((cat) => cat.key === hash);
      if (matchedCategory) {
        this.activeMenu = matchedCategory.key;
        this.$nextTick(() => {
          setTimeout(() => {
            const firstSectionId = matchedCategory.subItems[0]?.id;
            if (firstSectionId) {
              this.scrollToSection(firstSectionId);
            }
          }, 300);
        });
      }
    },
  },
};
</script>
