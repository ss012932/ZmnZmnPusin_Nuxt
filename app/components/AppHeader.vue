<template>
  <header class="navbar">
    <div class="navbar-logo">
      <div class="logo-circle">
        <img src="@/assets/image/Maskgroup.png" alt="Logo" />
      </div>
      <span class="navbar-title">人人動物醫院埔心分院</span>
    </div>

    <button
      class="navbar-toggle"
      :class="{ active: isOpen }"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="primary-navigation"
      :aria-label="isOpen ? '關閉選單' : '開啟選單'"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav
      id="primary-navigation"
      :class="['navbar-menu', { open: isOpen }]"
      aria-label="主要導覽"
    >
      <ul class="primary-links">
          <li>
            <NuxtLink to="/" @click="closeAll">首頁</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/service" @click="closeAll">服務項目</NuxtLink>
          </li>
                    <li>
            <NuxtLink to="/doctor" @click="closeAll">醫療團隊</NuxtLink>
          </li>
          <li>
            <a
              href="https://www.facebook.com/PusinAH034315700"
              target="_blank"
              rel="noopener noreferrer"
              @click="closeAll"
            >
              最新消息
            </a>
          </li>

          <li
            ref="healthMenu"
            class="health-menu-item"
          >
            <button
              class="health-trigger"
              type="button"
              :aria-expanded="healthMenuExpanded"
              aria-controls="desktop-health-menu tablet-health-menu"
              @click="openHealthMenu"
            >
              衛教專區
              <svg
                class="menu-arrow"
                :class="{ rotate: healthMenuExpanded }"
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div
              v-show="healthMenuOpen"
              id="desktop-health-menu"
              class="desktop-health-menu"
            >
              <div class="desktop-category-list">
                <button
                  v-for="category in healthCategories"
                  :key="category.id"
                  type="button"
                  :class="{ active: activeDesktopCategoryId === category.id }"
                  :aria-expanded="activeDesktopCategoryId === category.id"
                  @mouseenter="activeDesktopCategoryId = category.id"
                  @focus="activeDesktopCategoryId = category.id"
                  @click="activeDesktopCategoryId = category.id"
                >
                  <span>{{ category.title }}</span>
                  <span class="category-arrow" aria-hidden="true">›</span>
                </button>
              </div>

              <div
                v-if="activeDesktopCategory"
                class="desktop-article-menu"
              >
                <p>{{ activeDesktopCategory.title }}</p>
                <NuxtLink
                  v-for="article in activeDesktopCategory.items"
                  :key="article.id"
                  :to="article.path"
                  :class="{ 'article-active': isArticleActive(article) }"
                  @click="closeAll"
                >
                  {{ article.title }}
                </NuxtLink>
              </div>
            </div>

            <div
              id="tablet-health-menu"
              v-show="healthMenuOpen"
              class="tablet-health-menu"
            >
              <section
                v-for="category in healthCategories"
                :key="category.id"
                class="accordion-category"
              >
                <button
                  class="accordion-trigger"
                  type="button"
                  :aria-expanded="activeTabletCategoryId === category.id"
                  :aria-controls="`tablet-category-${category.id}`"
                  @click="toggleTabletCategory(category.id)"
                >
                  <span>{{ category.title }}</span>
                  <svg
                    class="menu-arrow"
                    :class="{ rotate: activeTabletCategoryId === category.id }"
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <div
                  :id="`tablet-category-${category.id}`"
                  v-show="activeTabletCategoryId === category.id"
                  class="accordion-content"
                >
                  <NuxtLink
                    v-for="article in category.items"
                    :key="article.id"
                    :to="article.path"
                    :class="{ 'article-active': isArticleActive(article) }"
                    @click="closeAll"
                  >
                    {{ article.title }}
                  </NuxtLink>
                </div>
              </section>
            </div>
          </li>

          <li>
            <NuxtLink to="/healthcheck" @click="closeAll">健檢專區</NuxtLink>
          </li>
      </ul>
    </nav>

    <Transition name="overlay">
      <div
        v-if="overlayVisible"
        class="navigation-overlay"
        aria-hidden="true"
        @click="closeAll"
      ></div>
    </Transition>

  </header>
</template>

<script>
export default {
  name: 'AppHeader',

  data() {
    return {
      isOpen: false,
      healthMenuOpen: false,
      activeDesktopCategoryId: null,
      activeTabletCategoryId: null,
      originalBodyOverflow: '',

      // 模擬未來 API 回傳的「分類 -> 文章」階層資料
      healthCategories: [
        // {
        //   id: 'disease',
        //   title: '疾病分享',
        //   items: [
        //     { id: 'joint', title: '關節活動照護', path: '/disease#joint' },
        //     { id: 'uterus', title: '子宮蓄膿介紹', path: '/disease#uterus' },
        //     { id: 'urinary', title: '貓咪下泌尿道疾病', path: '/disease#urinary' },
        //     {
        //       id: 'ivdd',
        //       title: '椎間盤疾病 (IVDD 相關資訊)',
        //       path: '/disease#ivdd',
        //     },
        //   ],
        // },
        // {
        //   id: 'healthy',
        //   title: '健康照護須知',
        //   items: [
        //     { id: 'surgery', title: '手術照顧小提醒', path: '/healthy#surgery' },
        //     { id: 'oral', title: '口腔清潔照護', path: '/healthy#oral' },
        //     { id: 'kitten-guide', title: '幼貓照護指南', path: '/healthy#kitten-guide' },
        //     { id: 'puppy-guide', title: '幼犬照護指南', path: '/healthy#puppy-guide' },
        //   ],
        // },
        // {
        //   id: 'protection',
        //   title: '疫苗與寄生蟲防護',
        //   items: [
        //     { id: 'vaccine', title: '毛孩疫苗小知識', path: '/protection#vaccine' },
        //     { id: 'rabies', title: '狂犬病疫苗說明', path: '/protection#rabies' },
        //     { id: 'heartworm', title: '心絲蟲防護觀念', path: '/protection#heartworm' },
        //     { id: 'parasite', title: '體內外寄生蟲須知', path: '/protection#parasite' },
        //   ],
        // },
      ],
    }
  },

  computed: {
    overlayVisible() {
      return this.isOpen
    },

    healthMenuExpanded() {
      return this.healthMenuOpen
    },

    activeDesktopCategory() {
      return (
        this.healthCategories.find(
          (category) => category.id === this.activeDesktopCategoryId,
        ) || null
      )
    },

  },

  watch: {
    overlayVisible(visible) {
      this.setBodyScrollLocked(visible)
    },

    '$route.fullPath'() {
      this.closeAll()
    },
  },

  mounted() {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('pointerdown', this.handleDocumentPointerDown)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown)
    this.setBodyScrollLocked(false)
  },

  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        this.resetNestedMenus()
      }
    },

    openHealthMenu() {
      this.healthMenuOpen = !this.healthMenuOpen

      if (this.healthMenuOpen) {
        this.activeDesktopCategoryId = null
        return
      }

      this.activeDesktopCategoryId = null
      this.activeTabletCategoryId = null
    },

    toggleTabletCategory(categoryId) {
      this.activeTabletCategoryId =
        this.activeTabletCategoryId === categoryId ? null : categoryId
    },

    closeAll() {
      this.isOpen = false
      this.healthMenuOpen = false
      this.activeDesktopCategoryId = null
      this.resetNestedMenus()
    },

    handleDocumentPointerDown(event) {
      if (
        this.healthMenuOpen &&
        !this.$refs.healthMenu?.contains(event.target)
      ) {
        this.closeAll()
      }
    },

    resetNestedMenus() {
      this.activeTabletCategoryId = null
    },

    handleResize() {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.closeAll()
      }
    },

    handleKeydown(event) {
      if (event.key === 'Escape' && (this.overlayVisible || this.healthMenuOpen)) {
        this.closeAll()
      }
    },

    setBodyScrollLocked(locked) {
      if (!document?.body) return

      if (locked) {
        this.originalBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = this.originalBodyOverflow
      }
    },

    isArticleActive(article) {
      const [path, hash = ''] = article.path.split('#')
      return this.$route.path === path && this.$route.hash === (hash ? `#${hash}` : '')
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.navbar {
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: clamp(8px, 1.2vw, 16px) clamp(16px, 3vw, 36px);
  background-color: #fffaf0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: clamp(6px, 1vw, 12px);
}

.logo-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: clamp(36px, 3.2vw, 52px);
  height: clamp(36px, 3.2vw, 52px);
  overflow: hidden;
  background: #5ba4d4;
  border-radius: 50%;
}

.logo-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navbar-title {
  overflow: hidden;
  color: #2c5282;
  font-size: clamp(15px, 4vw, 23px);
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar-toggle {
  position: relative;
  z-index: 1120;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.navbar-toggle span {
  width: 22px;
  height: 2.5px;
  background: #2c5282;
  border-radius: 2px;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform-origin: center;
}

.navbar-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.navbar-toggle.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.navbar-menu {
    position: static;
  display: flex;
  width: auto;
  height: auto;
  padding: 0;
  overflow: visible;
  pointer-events: auto;
  background: transparent;
  box-shadow: none;
  opacity: 1;
  transform: none;
  backdrop-filter: none;
}

@media (max-width: 1023px) {
  .navbar-menu {
    position: fixed;
    z-index: 1110;
    top: 0;
    right: 0;
    display: none;          /* ← 行動版才 none */
    width: min(86vw, 360px);
    height: 100dvh;
    padding: 76px 20px 28px;
    overflow-y: auto;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: -5px 0 24px rgba(26, 55, 85, 0.16);
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s ease, transform 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .navbar-menu.open {
    display: block;
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
  }
}

.primary-links {
  padding: 0;
  margin: 0;
  list-style: none;
}

.primary-links > li {
  margin-bottom: 12px;
}

.primary-links > li > a,
.health-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 2px;
  color: #2c5282;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(44, 82, 130, 0.12);
  transition: color 0.2s ease;
}

.primary-links > li > a:hover,
.health-trigger:hover {
  color: #5ba4d4;
}

.primary-links a.router-link-active {
  color: #3b82b9;
}

.menu-arrow {
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.menu-arrow.rotate {
  transform: rotate(180deg);
}

.desktop-health-menu {
  display: none;
}

.tablet-health-menu {
  padding: 8px 0 2px 12px;
}

.accordion-category {
  overflow: hidden;
  border-bottom: 1px solid rgba(44, 82, 130, 0.1);
}

.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 8px;
  color: #234f79;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  background: #f5f9fc;
  border: 0;
}

.accordion-content {
  padding: 4px 8px 10px 16px;
}

.accordion-content a {
  display: block;
  padding: 10px 4px;
  color: #496b8c;
  font-size: 14px;
  line-height: 1.45;
  text-decoration: none;
}

.accordion-content a:hover,
.accordion-content a.article-active {
  color: #2f83ba;
  font-weight: 700;
}

.navigation-overlay {
  position: fixed;
  z-index: 1090;
  inset: 0;
  background: rgba(14, 35, 55, 0.52);
  backdrop-filter: blur(2px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .navbar-menu {
    width: min(62vw, 460px);
    padding-inline: 28px;
  }

  .primary-links > li > a,
  .health-trigger {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .tablet-health-menu {
    padding-left: 8px;
  }

  .accordion-trigger {
    color: #1f4f73;
    background: #dceaf2;
  }

  .accordion-trigger:hover,
  .accordion-trigger[aria-expanded='true'] {
    background: #ccdee9;
  }

  .accordion-content {
    background: #f7fafc;
  }
}

@media (min-width: 1024px) {
  .navigation-overlay,
  .tablet-health-menu {
    display: none;
  }

  .navbar {
    justify-content: center;
    gap: clamp(60px, 18vw, 400px);
    border-bottom: 0;
    box-shadow: none;
  }

  .navbar-logo {
    margin-left: clamp(0px, 2vw, 40px);
  }

  .navbar-title {
    font-size: 23px;
  }

  .navbar-toggle {
    display: none;
  }

  .primary-links {
    display: flex;
    align-items: center;
    gap: clamp(12px, 1.8vw, 32px);
  }

  .primary-links > li {
    position: relative;
    margin: 0;
  }

  .health-menu-item {
    position: relative;
  }

  .primary-links > li > a,
  .health-trigger {
    padding: 6px 0;
    font-size: 20px;
    white-space: nowrap;
    border: 0;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .primary-links > li > a:hover,
  .health-trigger:hover {
    color: #5ba4d4;
    transform: translateY(-1px);
  }

  .desktop-health-menu {
    position: absolute;
    z-index: 1200;
    top: calc(100% + 14px);
    left: 50%;
    display: block;
    width: 250px;
    padding: 10px;
    background: #fff;
    border: 1px solid rgba(44, 82, 130, 0.12);
    border-radius: 6px;
    box-shadow: 0 12px 34px rgba(24, 63, 95, 0.2);
    transform: translateX(-50%);
  }

  .desktop-health-menu::before {
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;
    height: 15px;
    content: '';
  }

  .desktop-category-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .desktop-category-list button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    color: #2c5282;
    font-size: 15px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 4px;
    transition: color 0.18s ease, background 0.18s ease;
  }

  .desktop-category-list button:hover,
  .desktop-category-list button:focus-visible,
  .desktop-category-list button.active {
    color: #fff;
    background: #2c5282;
    outline: none;
  }

  .category-arrow {
    margin-left: 14px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
  }

  .desktop-article-menu {
    position: absolute;
    top: 0;
    left: calc(100% + 8px);
    width: 280px;
    min-height: 100%;
    padding: 14px 18px 18px;
    background: #fff;
    border: 1px solid rgba(44, 82, 130, 0.12);
    border-radius: 6px;
    box-shadow: 0 12px 34px rgba(24, 63, 95, 0.2);
  }

  .desktop-article-menu::before {
    position: absolute;
    top: 0;
    right: 100%;
    width: 9px;
    height: 100%;
    content: '';
  }

  .desktop-article-menu p {
    padding: 8px 10px 12px;
    margin: 0;
    color: #2c5282;
    font-size: 16px;
    font-weight: 800;
    border-bottom: 1px solid #dbe8ed;
  }

  .desktop-article-menu a {
    display: block;
    padding: 12px 10px;
    color: #4b6577;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.45;
    text-decoration: none;
    border-bottom: 1px solid #edf2f4;
    transition: color 0.18s ease, background 0.18s ease, padding 0.18s ease;
  }

  .desktop-article-menu a:last-child {
    border-bottom: 0;
  }

  .desktop-article-menu a:hover,
  .desktop-article-menu a.article-active {
    padding-left: 14px;
    color: #2f83a2;
    background: rgba(91, 164, 212, 0.1);
  }
}

@media (max-width: 480px) {
  .navbar-title {
    max-width: calc(100vw - 105px);
  }

  .navbar-menu {
    width: min(90vw, 340px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .navbar-menu,
  .navigation-overlay,
  .menu-arrow {
    transition-duration: 0.01ms !important;
  }
}
</style>
