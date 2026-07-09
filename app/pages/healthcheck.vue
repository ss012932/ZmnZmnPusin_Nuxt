<template>
  <a-config-provider>
    <main class="page-container">
      <div class="container">
        <div class="content-wrapper">

          <!-- ===== 貓貓健康檢查套組 ===== -->
          <section class="pet-section">
            <div class="section-header fade-in-item">
              <span class="pet-icon">🐱</span>
              <h2 class="section-title">貓貓健康檢查套組</h2>
            </div>

            <!-- 手機版：橫向滑動卡片 -->
            <div class="mobile-cards fade-in-item fade-in-delay-1">
              <div class="cards-scroll-wrapper">

                <!-- 貓 套組 A -->
                <div class="package-card card-primary">
                  <div class="card-badge">套組 A</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>三歲以下</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount primary-gradient">2,700</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$3,000</span>
                      <span class="discount">省 $300</span>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageA"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('cat-a', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-a', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('cat-a', i)"
                            class="item-description primary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 貓 套組 A+B -->
                <div class="package-card card-primary">
                  <div class="card-badge">套組 A+B</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>三到七歲</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount primary-gradient">6,300</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$7,000</span>
                      <span class="discount">省 $700</span>
                    </div>
                    <div class="special-tag">※不包含ProBNP</div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count">5項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageAB"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('cat-ab', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-ab', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('cat-ab', i)"
                            class="item-description primary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 貓 套組 A+B+C -->
                <div class="package-card card-primary">
                  <div class="card-badge">套組 A+B+C</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>七歲以上</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount primary-gradient">8,400</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$10,400</span>
                      <span class="discount">省 $2,000</span>
                    </div>
                    <div class="special-tag">※不包含ProBNP</div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageABC"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('cat-abc', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-abc', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('cat-abc', i)"
                            class="item-description primary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
              <div class="scroll-hint">← 滑動查看更多套組 →</div>
            </div>

            <!-- 電腦版：比較表格 -->
            <div class="desktop-table fade-in-item fade-in-delay-1">
              <table class="comparison-table">
                <thead>
                  <tr class="table-head-row bg-primary">
                    <th class="th-left">檢查項目</th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">三歲以下</div>
                        <div class="code-text">套組 A</div>
                      </div>
                    </th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">三到七歲</div>
                        <div class="code-text">套組 A+B</div>
                      </div>
                    </th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">七歲以上</div>
                        <div class="code-text">套組 A+B+C</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 價格列 -->
                  <tr class="price-row">
                    <td class="td-label">價格</td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-primary">$2,700</div>
                        <div class="price-original">$3,000</div>
                      </div>
                    </td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-primary">$6,300</div>
                        <div class="price-original">$7,000</div>
                        <div class="price-note">※不包含ProBNP</div>
                      </div>
                    </td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-primary">$8,400</div>
                        <div class="price-original">$10,400</div>
                        <div class="price-note">※不包含ProBNP</div>
                      </div>
                    </td>
                  </tr>
                  <!-- 動態渲染各列 -->
                  <tr
                    v-for="(row, ri) in catTableRows"
                    :key="ri"
                    class="item-row"
                  >
                    <td class="td-label-light">檢查項目 {{ ri + 1 }}</td>
                    <td
                      v-for="(cell, ci) in row"
                      :key="ci"
                      class="td-center"
                    >
                      <div v-if="cell" class="item-content">
                        <span class="check-icon text-primary">✓</span>
                        <span class="item-name">
                          {{ cell.name }}
                          <span class="popover">
                            <button
                              type="button"
                              class="info-icon"
                              :aria-label="`${cell.name}說明`"
                            >
                              ?
                            </button>
                            <span class="popover-content" role="tooltip">
                              {{ cell.desc }}
                            </span>
                          </span>
                        </span>
                      </div>
                      <span v-else class="empty-mark">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- ===== 狗狗健康檢查套組 ===== -->
          <section class="pet-section">
            <div class="section-header fade-in-item fade-in-delay-1">
              <span class="pet-icon">🐶</span>
              <h2 class="section-title">狗狗健康檢查套組</h2>
            </div>

            <!-- 手機版：橫向滑動卡片 -->
            <div class="mobile-cards fade-in-item fade-in-delay-2">
              <div class="cards-scroll-wrapper">

                <!-- 狗 套組 A -->
                <div class="package-card card-secondary">
                  <div class="card-badge">套組 A</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>三歲以下</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount secondary-gradient">2,700</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$3,000</span>
                      <span class="discount">省 $300</span>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageA"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('dog-a', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-a', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('dog-a', i)"
                            class="item-description secondary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 狗 套組 A+B -->
                <div class="package-card card-secondary">
                  <div class="card-badge">套組 A+B</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>三到七歲</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount secondary-gradient">5,800</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$6,800</span>
                      <span class="discount">省 $1,000</span>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageAB"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('dog-ab', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-ab', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('dog-ab', i)"
                            class="item-description secondary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- 狗 套組 A+B+C -->
                <div class="package-card card-secondary">
                  <div class="card-badge">套組 A+B+C</div>
                  <div class="card-age">
                    <span class="age-icon">📅</span>
                    <span>七歲以上</span>
                  </div>
                  <div class="card-price-section">
                    <div class="price-label">優惠價</div>
                    <div class="price-amount">
                      <span class="currency">NT$</span>
                      <span class="amount secondary-gradient">8,000</span>
                    </div>
                    <div class="price-compare">
                      原價 <span class="original">$10,000</span>
                      <span class="discount">省 $2,000</span>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span>
                      <span class="header-text">包含項目</span>
                      <span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageABC"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <div
                            class="item-summary"
                            @click="toggle('dog-abc', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-abc', i) }"
                            >▼</span>
                          </div>
                          <div
                            v-if="isOpen('dog-abc', i)"
                            class="item-description secondary-border"
                          >
                            {{ item.desc }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
              <div class="scroll-hint">← 滑動查看更多套組 →</div>
            </div>

            <!-- 電腦版：比較表格 -->
            <div class="desktop-table fade-in-item fade-in-delay-2">
              <table class="comparison-table">
                <thead>
                  <tr class="table-head-row bg-secondary">
                    <th class="th-left">檢查項目</th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">三歲以下</div>
                        <div class="code-text">套組 A</div>
                      </div>
                    </th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">三到七歲</div>
                        <div class="code-text">套組 A+B</div>
                      </div>
                    </th>
                    <th class="th-center">
                      <div class="package-header">
                        <div class="age-text">七歲以上</div>
                        <div class="code-text">套組 A+B+C</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="price-row">
                    <td class="td-label">價格</td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-secondary">$2,700</div>
                        <div class="price-original">$3,000</div>
                      </div>
                    </td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-secondary">$5,800</div>
                        <div class="price-original">$6,800</div>
                      </div>
                    </td>
                    <td class="td-center">
                      <div class="price-wrapper">
                        <div class="price-main text-secondary">$8,000</div>
                        <div class="price-original">$10,000</div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="(row, ri) in dogTableRows"
                    :key="ri"
                    class="item-row"
                  >
                    <td class="td-label-light">檢查項目 {{ ri + 1 }}</td>
                    <td
                      v-for="(cell, ci) in row"
                      :key="ci"
                      class="td-center"
                    >
                      <div v-if="cell" class="item-content">
                        <span class="check-icon text-secondary">✓</span>
                        <span class="item-name">
                          {{ cell.name }}
                          <span class="popover">
                            <button
                              type="button"
                              class="info-icon"
                              :aria-label="`${cell.name}說明`"
                            >
                              ?
                            </button>
                            <span class="popover-content" role="tooltip">
                              {{ cell.desc }}
                            </span>
                          </span>
                        </span>
                      </div>
                      <span v-else class="empty-mark">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </main>
  </a-config-provider>
</template>

<style scoped>
/* =============================================
   物件淡入動畫
   說明：只讓頁面內的主要物件淡入，不套在整個頁面，避免 Header 或背景跟著閃動。
   ============================================= */
.fade-in-item {
  animation: objectFadeIn 0.32s ease-out both;
  will-change: opacity;
}

.fade-in-delay-1 {
  animation-delay: 0.08s;
}

.fade-in-delay-2 {
  animation-delay: 0.16s;
}

@keyframes objectFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 使用者若設定減少動態效果，就停用動畫，避免造成不適。 */
@media (prefers-reduced-motion: reduce) {
  .fade-in-item {
    animation: none;
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }

/* =============================================
   頁面底色
   ============================================= */
.page-container {
  background-color: #fffaf0;
  min-height: 100vh;
  padding: 16px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 12px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* =============================================
   Section Header
   ============================================= */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.pet-icon { font-size: 26px; }

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f4b79;
}

/* =============================================
   手機版：橫向滑動卡片
   ============================================= */
.mobile-cards { position: relative; }

.cards-scroll-wrapper {
  display: flex;
  gap: 12px;

  /* 控制橫向滑動 */
  overflow-x: auto;

  /* 讓展開內容不要被垂直裁切 */
  overflow-y: visible;

  scroll-snap-type: x mandatory;
  padding: 4px 12px 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.cards-scroll-wrapper::-webkit-scrollbar { display: none; }

/* 手機版卡片 */
.package-card {
  flex: 0 0 82%;
  min-width: 280px;
  max-width: 340px;
  scroll-snap-align: center;
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  position: relative;

  /* 原本是 overflow: hidden，會裁掉展開內容 */
  overflow: visible;
}

/* ── 套組標籤 ── */
.card-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  color: #fff;
}
.card-primary .card-badge {
  background: linear-gradient(135deg, #1f4b79, #2d5f8f);
}
.card-secondary .card-badge {
  background: linear-gradient(135deg, #6b4e99, #8b6bb8);
}

/* ── 年齡 ── */
.card-age {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #1f4b79;
  background: #f0f7ff;
  padding: 8px 14px;
  border-radius: 10px;
  margin-bottom: 14px;
}
.age-icon { font-size: 14px; }

/* ── 價格 ── */
.card-price-section {
  text-align: center;
  padding: 14px 0;
  background: linear-gradient(180deg, #f8fbff 0%, #fff 100%);
  border-radius: 14px;
  margin-bottom: 16px;
}
.price-label {
  font-size: 11px;
  color: #666;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.price-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
}
.currency {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}
.amount {
  font-size: 28px;
  font-weight: 800;
}
.primary-gradient {
  background: linear-gradient(135deg, #1f4b79, #2d5f8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.secondary-gradient {
  background: linear-gradient(135deg, #6b4e99, #8b6bb8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.price-compare {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: #666;
}
.original { text-decoration: line-through; color: #999; }
.discount {
  background: #fff3f3;
  color: #e63946;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
}
.special-tag {
  display: inline-block;
  margin-top: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
}

/* ── 分隔線 ── */
.card-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 14px 0;
}

/* ── 包含項目 ── */
.card-items-section { margin-top: 4px; }

.items-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}
.header-icon { font-size: 16px; }
.header-text {
  font-size: 13px;
  font-weight: 700;
  color: #1f4b79;
  flex: 1;
}
.items-count {
  font-size: 11px;
  font-weight: 700;
  background: #f0f7ff;
  color: #1f4b79;
  padding: 3px 10px;
  border-radius: 10px;
}
.secondary-count {
  background: #f4f0fa;
  color: #6b4e99;
}

.items-grid {
  list-style: none;
  display: grid;
  gap: 10px;
}

.grid-item {
   display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fbff;
  border-radius: 10px;
  border-left: 3px solid #1f4b79;

  /* 讓內容可以自然撐開高度 */
  height: auto;
  overflow: visible;
}

/* 右側文字區 */
.item-details-wrap {
  width: 100%;
  min-width: 0;

  /* 避免描述區被內層裁切 */
  overflow: visible;
}
.secondary-item {
  background: #f9f7fc;
  border-left-color: #6b4e99;
}

.item-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  margin-top: 1px;
}
.primary-bg   { background: linear-gradient(135deg, #1f4b79, #2d5f8f); }
.secondary-bg { background: linear-gradient(135deg, #6b4e99, #8b6bb8); }

.item-details-wrap { width: 100%; min-width: 0; }

.item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 6px;
}

.item-name-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  line-height: 1.5;
}

.arrow {
  font-size: 9px;
  color: #888;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.arrow.open { transform: rotate(180deg); }

.item-description {
    margin-top: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.65;
  color: #555;
  border-left: 3px solid #1f4b79;

  /* 手機版長文字換行 */
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;

  animation: slideDown 0.25s ease;
}
.primary-border   { border-left-color: #1f4b79; }
.secondary-border { border-left-color: #6b4e99; }

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 滑動提示 */
.scroll-hint {
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #aaa;
  padding: 4px 0 8px;
  animation: blink 2s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* =============================================
   電腦版表格（預設隱藏）
   ============================================= */
.desktop-table { display: none; }

.popover {
  position: relative;
  display: inline-block;
}

.info-icon {
  display: none;
  margin-left: 5px;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid #888;
  border-radius: 50%;
  background: #fff;
  color: #666;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  opacity: 0.55;
  transition: opacity 0.2s, color 0.2s, border-color 0.2s;
}

.info-icon:hover,
.info-icon:focus-visible {
  border-color: #1f4b79;
  color: #1f4b79;
  opacity: 1;
  outline: none;
}

.popover-content {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  z-index: 20;
  width: max-content;
  max-width: 240px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  text-align: left;
  white-space: normal;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 6px);
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
}

.popover-content::after {
  position: absolute;
  z-index: 20;
  top: 100%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  content: "";
  transform: translate(-50%, -4px) rotate(45deg);
}

.popover:hover .popover-content,
.popover:focus-within .popover-content {
  visibility: visible;
  opacity: 1;
  transform: translate(-50%, 0);
}

/* =============================================
   RWD Breakpoints
   ============================================= */

/* ── 640px+：卡片拿掉 vw 限制，稍微加大 ── */
@media (min-width: 640px) {
  .page-container {
    padding: 24px 0;
  }

  .container {
    padding: 0 20px;
  }

  .content-wrapper {
    gap: 36px;
  }

  .section-header {
    margin-bottom: 22px;
  }

  .pet-icon {
    font-size: 32px;
  }

  .section-title {
    font-size: 22px;
  }

  .cards-scroll-wrapper {
    gap: 16px;
    padding: 4px 16px 20px;
  }

  .package-card {
    flex: 0 0 42%;
    min-width: 300px;
    max-width: 380px;
    padding: 22px;
  }

  .card-age {
    font-size: 15px;
    margin-bottom: 18px;
  }

  .age-icon {
    font-size: 16px;
  }

  .card-price-section {
    padding: 17px 0;
    margin-bottom: 19px;
  }

  .amount {
    font-size: 32px;
  }

  .card-divider {
    margin: 17px 0;
  }

  .header-text {
    font-size: 14px;
  }

  .item-name-text {
    font-size: 13px;
  }

  .item-description {
    font-size: 12px;
  }

  .scroll-hint {
    font-size: 13px;
  }
}

/* ── 1024px+：顯示表格，隱藏卡片 ── */
@media (min-width: 1024px) {
  .page-container {
    padding: 32px 0;
  }

  .container {
    padding: 0 24px;
    margin-bottom: 4rem;
  }

  .content-wrapper {
    gap: 48px;
  }

  .pet-section {
    background: #fff;
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  }

  .section-header {
    justify-content: flex-start;
    margin-bottom: 28px;
  }

  .mobile-cards  { display: none; }
  .desktop-table { display: block; overflow: visible; }
  .info-icon     { display: inline-block; }

  /* ── 表格 ── */
  .comparison-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: visible;
  }

  .table-head-row { color: #fff; font-weight: 700; }
  .bg-primary   { background: linear-gradient(135deg, #1f4b79 0%, #2d5f8f 100%); }
  .bg-secondary { background: linear-gradient(135deg, #6b4e99 0%, #8b6bb8 100%); }

  .th-left {
    text-align: left;
    padding: 18px 20px;
    font-size: 15px;
    width: 170px;
  }
  .th-center {
    text-align: center;
    padding: 18px 14px;
    min-width: 190px;
  }
  .package-header { display: flex; flex-direction: column; gap: 3px; }
  .age-text { font-size: 16px; }
  .code-text { font-size: 13px; opacity: 0.9; }

  tbody tr { border-bottom: 1px solid #e8f0f7; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #f8f9fb; }

  .td-label {
    padding: 18px 20px;
    font-weight: 700;
    color: #1f4b79;
    font-size: 14px;
    background: #f0f7ff;
  }
  .td-label-light {
    padding: 14px 20px;
    font-weight: 600;
    color: #555;
    font-size: 13px;
  }
  .td-center {
    position: relative;
    padding: 14px;
    text-align: center;
  }
  .td-center:hover,
  .td-center:focus-within {
    z-index: 30;
  }

  .price-row { background: #f8f9fa; }
  .price-wrapper { display: flex; flex-direction: column; gap: 3px; }
  .price-main {
    font-size: 24px;
    font-weight: 800;
  }
  .text-primary   { color: #1f4b79; }
  .text-secondary { color: #6b4e99; }
  .price-original {
    font-size: 13px;
    color: #aaa;
    text-decoration: line-through;
  }
  .price-note {
    font-size: 11px;
    color: #e63946;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 10px;
    display: inline-block;
    margin-top: 3px;
  }

  .item-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .check-icon {
    font-size: 16px;
    font-weight: 800;
  }
  .item-name {
    font-size: 14px;
    color: #333;
  }
  .empty-mark { color: #ccc; font-size: 16px; }
}

/* ── 1280px+：表格更寬鬆 ── */
@media (min-width: 1280px) {
  .pet-section {
    padding: 48px;
  }

  .th-left {
    padding: 20px 24px;
    font-size: 16px;
    width: 200px;
  }

  .th-center {
    padding: 20px 16px;
    min-width: 220px;
  }

  .age-text {
    font-size: 18px;
  }

  .code-text {
    font-size: 14px;
  }

  .td-label {
    padding: 20px 24px;
    font-size: 15px;
  }

  .td-label-light {
    padding: 16px 24px;
    font-size: 14px;
  }

  .td-center {
    padding: 16px;
  }

  .price-main {
    font-size: 26px;
  }

  .price-original {
    font-size: 14px;
  }

  .check-icon {
    font-size: 18px;
  }

  .item-name {
    font-size: 15px;
  }
}
</style>

<script>
export default {
  name: 'HealthCheck',

  setup() {
    useSeoMeta({
      title:            '健康檢查套組｜人人動物醫院埔心分院',
      description:      '人人動物醫院埔心分院提供貓咪與狗狗多種健康檢查套組，包含基礎、進階、完整心臟評估等方案，協助早期發現疾病、守護毛孩健康。',
      ogTitle:          '健康檢查套組｜人人動物醫院埔心分院',
      ogDescription:    '貓咪健康檢查、狗狗健康檢查，基礎到進階套組，人人動物醫院埔心分院為您的毛孩做好全面健康管理。',
      ogType:           'website',
      ogUrl:            'https://www.zmnzmnpusin.com.tw/healthcheck',
      ogImage:          'https://www.zmnzmnpusin.com.tw/og-image.webp',
      twitterCard:      'summary_large_image',
      twitterTitle:     '健康檢查套組｜人人動物醫院埔心分院',
      twitterDescription: '貓咪與狗狗健康檢查套組，早期發現、早期治療。',
    })
    useHead({
      link: [{ rel: 'canonical', href: 'https://www.zmnzmnpusin.com.tw/healthcheck' }],
    })
  },

  data() {
    return {
      // 展開狀態：key 為 `${group}-${index}`
      openItems: {},

      // ── 貓咪資料 ──
      catPackageA: [
        { name: '基礎血液生化檢查', desc: '包含肝腎功能等 9 項基本生化指數' },
        { name: '血球計數',         desc: '檢出有貧血或炎症反應的現象' },
        { name: 'ProBNP快篩',       desc: '檢出中等程度的心肌損傷' },
        { name: 'X光片檢查',        desc: '透過X光檢出胸腹腔及骨骼異常的影像' },
      ],
      catPackageAB: [
        { name: '血液離子檢查',       desc: '評估體內電解質的平衡狀況' },
        { name: '基礎心臟超音波',     desc: '檢出是否有心臟結構或功能異常（如有異常建議升級為完整心臟評估）' },
        { name: '全腹腔超音波',       desc: '檢查腹腔內器官的大小、回音和內部結構，並且可以檢出腫瘤的存在' },
        { name: '血壓測量',           desc: '檢出高低血壓，所得數值可以合併評估心血管及神經內分泌功能的狀態' },
        { name: '貓心絲蟲抗原抗體快篩', desc: '同時檢測貓血液中心絲蟲的抗原及抗體' },
      ],
      catPackageABC: [
        { name: '進階血液檢查',   desc: '經由 15 項血液生化指數更深入評估身體器官功能' },
        { name: '血球計數',       desc: '進階版血球分析，可以了解所有血球類型變化' },
        { name: '完整心臟超音波', desc: '完整評估心臟結構（包含瓣膜）、容積及壓力狀態以及數據化心臟的功能指數、心肌的運動能力' },
        { name: '內分泌檢查',     desc: '總甲狀腺素（tT4）及早期腎病篩檢（SDMA）' },
      ],

      // ── 狗狗資料 ──
      dogPackageA: [
        { name: '基礎血液生化檢查', desc: '包含肝腎功能等 9 項基本生化指數' },
        { name: '血球計數',         desc: '檢出有貧血或炎症反應的現象' },
        { name: 'Snap四合一快篩',   desc: '檢查包含心絲蟲等四項寄生在血液的寄生蟲' },
        { name: 'X光片檢查',        desc: '透過X光檢出胸腹腔及骨骼異常的影像' },
      ],
      dogPackageAB: [
        { name: '血液離子檢查',   desc: '評估體內電解質的平衡狀況' },
        { name: '基礎心臟超音波', desc: '檢出是否有心臟結構或功能異常（如有異常建議升級為完整心臟評估）' },
        { name: '全腹腔超音波',   desc: '檢查腹腔內器官的大小、回音和內部結構，並且可以檢出腫瘤的存在' },
        { name: '血壓測量',       desc: '檢出高低血壓，所得數值可以合併評估心血管及神經內分泌的狀態' },
      ],
      dogPackageABC: [
        { name: '進階血液檢查',   desc: '經由 15 項血液生化指數更深入評估身體臟器功能' },
        { name: '血球計數',       desc: '進階版血球分析，可以了解所有血球類型變化' },
        { name: '完整心臟超音波', desc: '完整評估心臟結構（包含瓣膜）、容積及壓力狀態以及數據化心臟的功能指數、心肌的運動能力' },
        { name: '眼壓測量',       desc: '早期發現青光眼及幫助檢測其他影響眼壓的疾病' },
      ],
    };
  },

  computed: {
    /** 貓咪表格列資料：每列 3 欄，對應三個套組 */
    catTableRows() {
      return this._buildRows(this.catPackageA, this.catPackageAB, this.catPackageABC);
    },
    /** 狗狗表格列資料 */
    dogTableRows() {
      return this._buildRows(this.dogPackageA, this.dogPackageAB, this.dogPackageABC);
    },
  },

  methods: {
    /** 切換展開/收合 */
    toggle(group, index) {
      const key = `${group}-${index}`;
      this.openItems[key] = !this.openItems[key];
    },

    /** 判斷是否展開 */
    isOpen(group, index) {
      return !!this.openItems[`${group}-${index}`];
    },

    /**
     * 將三個套組陣列轉成 row-based 二維陣列
     * e.g. [[pkgA[0], pkgAB[0], pkgABC[0]], [pkgA[1], ...], ...]
     * 不足的位置填 null（表格顯示 —）
     */
    _buildRows(a, ab, abc) {
      const maxLen = Math.max(a.length, ab.length, abc.length);
      return Array.from({ length: maxLen }, (_, i) => [
        a[i]   || null,
        ab[i]  || null,
        abc[i] || null,
      ]);
    },
  },
};
</script>
