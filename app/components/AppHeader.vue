<template>
  <header
    class="navbar"
    :class="{ 'menu-open': isOpen }"
    :style="{ backgroundColor: displayBgWhite ? '#ffffff' : '#fffaf0' }"
  >
    <div class="navbar-logo">
      <div class="logo-circle">
        <img src="@/assets/image/Maskgroup.webp" alt="Logo" />
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
              <!-- 第一欄：母類別 -->
              <div class="desktop-category-list">
                <button
                  v-for="category in healthCategories"
                  :key="category.id"
                  type="button"
                  :class="{ active: activeDesktopCategoryId === category.id }"
                  :aria-expanded="activeDesktopCategoryId === category.id"
                  @mouseenter="onMainCatEnter(category.id)"
                  @focus="onMainCatEnter(category.id)"
                  @click="onMainCatEnter(category.id)"
                >
                  <span>{{ category.title }}</span>
                  <span class="category-arrow" aria-hidden="true">›</span>
                </button>
              </div>

              <!-- 第二欄：子類別 -->
              <div
                v-if="activeDesktopCategory && activeDesktopCategory.subGroups.length"
                class="desktop-subcategory-list"
              >
                <button
                  v-for="sub in activeDesktopCategory.subGroups"
                  :key="sub.id"
                  type="button"
                  :class="{ active: activeDesktopSubCategoryId === sub.id }"
                  @mouseenter="activeDesktopSubCategoryId = sub.id"
                  @focus="activeDesktopSubCategoryId = sub.id"
                  @click="activeDesktopSubCategoryId = sub.id"
                >
                  <span>{{ sub.name }}</span>
                  <span v-if="sub.articles.length" class="category-arrow" aria-hidden="true">›</span>
                </button>
              </div>

              <!-- 第三欄：文章 -->
              <div
                v-if="activeDesktopSubCategory && activeDesktopSubCategory.articles.length"
                class="desktop-article-menu"
              >
                <p>{{ activeDesktopSubCategory.name }}</p>
                <NuxtLink
                  v-for="article in activeDesktopSubCategory.articles"
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
              <!-- 母類別 accordion -->
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
                    width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <div
                  :id="`tablet-category-${category.id}`"
                  v-show="activeTabletCategoryId === category.id"
                  class="accordion-content"
                >
                  <!-- 直屬文章（無子類別） -->
                  <NuxtLink
                    v-for="art in category.directArticles"
                    :key="`d${art.id}`"
                    :to="art.path"
                    :class="{ 'article-active': isArticleActive(art) }"
                    @click="closeAll"
                  >
                    {{ art.title }}
                  </NuxtLink>

                  <!-- 子類別 accordion -->
                  <section
                    v-for="sub in category.subGroups"
                    :key="sub.id"
                    class="accordion-subcategory"
                  >
                    <button
                      class="accordion-sub-trigger"
                      type="button"
                      :aria-expanded="activeTabletSubCategoryId === sub.id"
                      @click="toggleTabletSubCategory(sub.id)"
                    >
                      <span>{{ sub.name }}</span>
                      <svg
                        class="menu-arrow"
                        :class="{ rotate: activeTabletSubCategoryId === sub.id }"
                        width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>

                    <div
                      v-show="activeTabletSubCategoryId === sub.id"
                      class="accordion-sub-content"
                    >
                      <NuxtLink
                        v-for="art in sub.articles"
                        :key="art.id"
                        :to="art.path"
                        :class="{ 'article-active': isArticleActive(art) }"
                        @click="closeAll"
                      >
                        {{ art.title }}
                      </NuxtLink>
                    </div>
                  </section>
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
import { publicAPI } from '~/composables/utils/api';

export default {
  name: 'AppHeader',

  data() {
    return {
      isOpen: false,
      healthMenuOpen: false,
      activeDesktopCategoryId: null,
      activeDesktopSubCategoryId: null,
      activeTabletCategoryId: null,
      activeTabletSubCategoryId: null,
      originalBodyOverflow: '',
      healthCategories: [],
      displayBgWhite: false,
      _bgTimer: null,
    }
  },

  computed: {
    isArticlePage() {
      return !!this.$route.params.articleCode
    },

    overlayVisible() {
      return this.isOpen
    },

    healthMenuExpanded() {
      return this.healthMenuOpen
    },

    activeDesktopCategory() {
      return this.healthCategories.find(c => c.id === this.activeDesktopCategoryId) || null
    },

    activeDesktopSubCategory() {
      if (!this.activeDesktopCategory) return null
      return this.activeDesktopCategory.subGroups.find(s => s.id === this.activeDesktopSubCategoryId) || null
    },
  },

  watch: {
    overlayVisible(visible) {
      this.setBodyScrollLocked(visible)
    },

    '$route.fullPath'() {
      this.closeAll()
    },

    isArticlePage(val) {
      clearTimeout(this._bgTimer)
      // 進入文章頁：稍微延遲讓頁面先穩定再換色
      // 離開文章頁：立刻還原，避免殘留白底
      const delay = val ? 120 : 0
      this._bgTimer = setTimeout(() => {
        this.displayBgWhite = val
      }, delay)
    },
  },

  async mounted() {
    this.displayBgWhite = this.isArticlePage
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('pointerdown', this.handleDocumentPointerDown)
    await this.loadCategories()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown)
    this.setBodyScrollLocked(false)
  },

  methods: {
    async loadCategories() {
      try {
        const cats = await publicAPI.getCategories();
        this.healthCategories = cats.map(main => ({
          id: main.id,
          title: main.name,
          code: main.code,
          // 直屬母類別（無子類別）的文章
          directArticles: (main.articles || []).map(art => ({
            id: art.id,
            title: art.title,
            path: `/${main.code || main.id}/${art.code || art.id}`,
          })),
          // 子類別（含各自文章，過濾掉沒有文章的子類別）
          subGroups: (main.subCategories || []).map(sub => ({
            id: sub.id,
            name: sub.name,
            code: sub.code,
            articles: (sub.articles || []).map(art => ({
              id: art.id,
              title: art.title,
              path: `/${main.code || main.id}/${sub.code || sub.id}/${art.code || art.id}`,
            })),
          })).filter(sub => sub.articles.length > 0),
        }));

        // 預設展開第一個母類別及其第一個子類別
        if (this.healthCategories.length > 0) {
          this.activeDesktopCategoryId = this.healthCategories[0].id;
          const firstSub = this.healthCategories[0].subGroups[0];
          if (firstSub) this.activeDesktopSubCategoryId = firstSub.id;
        }
      } catch (e) {
        console.error('載入衛教類別失敗', e);
      }
    },

    onMainCatEnter(categoryId) {
      this.activeDesktopCategoryId = categoryId;
      const cat = this.healthCategories.find(c => c.id === categoryId);
      if (cat && cat.subGroups.length > 0) {
        this.activeDesktopSubCategoryId = cat.subGroups[0].id;
      } else {
        this.activeDesktopSubCategoryId = null;
      }
    },

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
      this.activeDesktopSubCategoryId = null
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

    toggleTabletSubCategory(subId) {
      this.activeTabletSubCategoryId =
        this.activeTabletSubCategoryId === subId ? null : subId
    },

    resetNestedMenus() {
      this.activeTabletCategoryId = null
      this.activeTabletSubCategoryId = null
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
  position: sticky;
  top: 0;
  /* Header 必須高於首頁飼主反饋區塊（z-index: 9999），才不會在滑動時被蓋住。 */
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: clamp(8px, 1.2vw, 16px) clamp(16px, 3vw, 36px);
  transition: background-color 0.6s ease-in-out;
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
  /* 行動版選單開啟時，提高整個 Header stacking context，避免被頁面高 z-index 區塊蓋住。 */
  .navbar.menu-open {
    z-index: 11500;
  }

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
    display: flex;
    flex-direction: row;
    align-items: stretch;
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

  /* 第一欄：母類別 */
  .desktop-category-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 200px;
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

  /* 第二欄：子類別 */
  .desktop-subcategory-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 190px;
    padding: 4px 8px;
    margin-left: 8px;
    border-left: 1px solid rgba(44, 82, 130, 0.12);
  }

  .desktop-subcategory-list button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 44px;
    padding: 10px 14px;
    color: #3a5f80;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 4px;
    transition: color 0.18s ease, background 0.18s ease;
  }

  .desktop-subcategory-list button:hover,
  .desktop-subcategory-list button:focus-visible,
  .desktop-subcategory-list button.active {
    color: #fff;
    background: #3a7ca5;
    outline: none;
  }

  /* 第三欄：文章 */
  .desktop-article-menu {
    min-width: 260px;
    max-width: 320px;
    padding: 4px 8px 8px 16px;
    margin-left: 8px;
    border-left: 1px solid rgba(44, 82, 130, 0.12);
  }

  .desktop-article-menu p {
    padding: 8px 10px 12px;
    margin: 0;
    color: #2c5282;
    font-size: 15px;
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

/* ── 子類別 accordion（手機/平板） ── */
.accordion-subcategory {
  border-bottom: 1px solid rgba(44, 82, 130, 0.07);
}

.accordion-sub-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 8px 10px 16px;
  color: #3a5f80;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  background: #edf4f9;
  border: 0;
}

.accordion-sub-trigger:hover,
.accordion-sub-trigger[aria-expanded='true'] {
  background: #d9eaf4;
}

.accordion-sub-content {
  padding: 2px 8px 6px 24px;
  background: #f7fafc;
}

.accordion-sub-content a {
  display: block;
  padding: 9px 4px;
  color: #496b8c;
  font-size: 13px;
  line-height: 1.45;
  text-decoration: none;
}

.accordion-sub-content a:hover,
.accordion-sub-content a.article-active {
  color: #2f83ba;
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .navbar-menu,
  .navigation-overlay,
  .menu-arrow {
    transition-duration: 0.01ms !important;
  }
}
</style>
