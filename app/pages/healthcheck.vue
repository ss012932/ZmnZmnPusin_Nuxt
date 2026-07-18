<template>
  <a-config-provider>
    <main class="healthcheck-page">
      <!-- ===== 健康檢查主視覺：套用參考 HTML 的 Hero 排版 ===== -->
      <header class="hero">
        <div class="hero-inner">
          <h1>健康檢查<br />是理解牠現在的方式。</h1>
          <div class="hero-line"></div>
          <p>
            從年輕時建立基準，到成年期追蹤變化，再到熟齡階段的深度評估；我們依生命階段安排檢查，讓每一次數據都有脈絡，也讓每一份照護更有依據。
          </p>
        </div>
      </header>

      <div class="page-shell">
        <!-- ===== 健檢安排說明：保留參考稿的四步驟引導卡 ===== -->
        <section class="care-guide fade-in-item">
          <div class="care-guide-inner">
            <div class="guide-copy">
              <h2>先理解日常<br />再安排真正需要的檢查</h2>
            </div>
            <div class="guide-steps">
              <article class="guide-step">
                <span class="guide-number">01</span>
                <h3>整理基本資料</h3>
                <p>年齡、品種、用藥與過去病史</p>
              </article>
              <article class="guide-step">
                <span class="guide-number">02</span>
                <h3>觀察近期變化</h3>
                <p>食慾、飲水、體重、活動與排泄</p>
              </article>
              <article class="guide-step">
                <span class="guide-number">03</span>
                <h3>進行醫師評估</h3>
                <p>理學檢查、風險分層與必要檢驗</p>
              </article>
              <article class="guide-step">
                <span class="guide-number">04</span>
                <h3>說明後續方向</h3>
                <p>結果解讀、追蹤頻率與照護建議</p>
              </article>
            </div>
          </div>
        </section>
        <div class="content-wrapper">
          <!-- ===== 貓貓健康檢查套組：照護時間軸版面 ===== -->
          <section class="pet-section cat-section fade-in-item">
            <header class="section-header">
              <div class="section-title-group">
                <span class="pet-icon">🐱</span>
                <div>
                  <h2 class="section-title">貓貓健康檢查套組</h2>
                </div>
              </div>
            </header>

            <div class="timeline">
              <!-- 貓 套組 A -->
              <article class="timeline-phase">
                <div class="phase-age">三歲以下</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-primary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>三歲以下</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount primary-gradient">2,700</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$3,000</span
                        ><span class="discount">省 $300</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageA"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('cat-a', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-a', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>

              <!-- 貓 套組 A+B -->
              <article class="timeline-phase">
                <div class="phase-age">三到七歲</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-primary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A+B</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>三到七歲</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount primary-gradient">6,300</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$7,000</span
                        ><span class="discount">省 $700</span>
                      </div>
                      <div class="special-tag">※不包含ProBNP</div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count">5項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageAB"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('cat-ab', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-ab', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>

              <!-- 貓 套組 A+B+C -->
              <article class="timeline-phase">
                <div class="phase-age">七歲以上</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-primary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A+B+C</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>七歲以上</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount primary-gradient">8,400</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$10,400</span
                        ><span class="discount">省 $2,000</span>
                      </div>
                      <div class="special-tag">※不包含ProBNP</div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in catPackageABC"
                        :key="i"
                        class="grid-item"
                      >
                        <div class="item-number primary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('cat-abc', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('cat-abc', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>
            </div>
          </section>

          <!-- ===== 狗狗健康檢查套組：照護時間軸版面 ===== -->
          <section class="pet-section dog-section fade-in-item fade-in-delay-1">
            <header class="section-header">
              <div class="section-title-group">
                <span class="pet-icon">🐶</span>
                <div>
                  <h2 class="section-title">狗狗健康檢查套組</h2>
                </div>
              </div>
            </header>

            <div class="timeline">
              <!-- 狗 套組 A -->
              <article class="timeline-phase">
                <div class="phase-age">三歲以下</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-secondary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>三歲以下</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount secondary-gradient">2,700</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$3,000</span
                        ><span class="discount">省 $300</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageA"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('dog-a', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-a', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>

              <!-- 狗 套組 A+B -->
              <article class="timeline-phase">
                <div class="phase-age">三到七歲</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-secondary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A+B</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>三到七歲</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount secondary-gradient">5,800</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$6,800</span
                        ><span class="discount">省 $1,000</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageAB"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('dog-ab', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-ab', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>

              <!-- 狗 套組 A+B+C -->
              <article class="timeline-phase">
                <div class="phase-age">七歲以上</div>
                <div class="phase-dot" aria-hidden="true"></div>
                <div class="package-card card-secondary">
                  <div class="card-top">
                    <div>
                      <div class="card-badge">套組 A+B+C</div>
                      <div class="card-age">
                        <span class="age-icon">📅</span><span>七歲以上</span>
                      </div>
                    </div>
                    <div class="card-price-section">
                      <div class="price-label">優惠價</div>
                      <div class="price-amount">
                        <span class="currency">NT$</span
                        ><span class="amount secondary-gradient">8,000</span>
                      </div>
                      <div class="price-compare">
                        原價 <span class="original">$10,000</span
                        ><span class="discount">省 $2,000</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-divider"></div>
                  <div class="card-items-section">
                    <div class="items-header">
                      <span class="header-icon">✨</span
                      ><span class="header-text">包含項目</span
                      ><span class="items-count secondary-count">4項</span>
                    </div>
                    <ul class="items-grid">
                      <li
                        v-for="(item, i) in dogPackageABC"
                        :key="i"
                        class="grid-item secondary-item"
                      >
                        <div class="item-number secondary-bg">{{ i + 1 }}</div>
                        <div class="item-details-wrap">
                          <button
                            type="button"
                            class="item-summary"
                            @click="toggle('dog-abc', i)"
                          >
                            <span class="item-name-text">{{ item.name }}</span>
                            <span
                              class="item-help"
                              tabindex="0"
                              aria-label="檢查項目詳細說明"
                            >
                              ?
                              <span class="item-tooltip" role="tooltip">{{
                                item.desc
                              }}</span>
                            </span>
                            <span
                              class="arrow"
                              :class="{ open: isOpen('dog-abc', i) }"
                              >▼</span
                            >
                          </button>
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
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  </a-config-provider>
</template>

<style scoped>
/* ===== 頁面共用色彩與基礎設定 ===== */
.healthcheck-page {
  --ink: #18364e;
  --muted: #6d7b85;
  --line: #dde5e8;
  --page-bg: #f3f1ec;
  --cat: #245b80;
  --dog: #7555a0;
  min-height: 100vh;
  padding: 0 0 90px;
  background: var(--page-bg);
  color: #263640;
  font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
}

.healthcheck-page *,
.healthcheck-page *::before,
.healthcheck-page *::after {
  box-sizing: border-box;
}

.page-shell {
  width: min(1160px, calc(100% - 30px));
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ===== 主視覺 Hero 區域 ===== */
.hero {
  position: relative;
  min-height: clamp(430px, 38vw, 500px);
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #fff;
  background: url("~/assets/image/doctorhero.webp") center 38% / cover no-repeat;
}
.hero::before {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(
    90deg,
    rgba(8, 31, 49, 0.88) 0%,
    rgba(8, 31, 49, 0.72) 42%,
    rgba(8, 31, 49, 0.2) 72%,
    rgba(8, 31, 49, 0.08) 100%
  );
}
.hero::after {
  position: absolute;
  top: -42%;
  right: -8%;
  width: min(58vw, 720px);
  content: "";
  background: radial-gradient(
    circle,
    rgba(255, 250, 240, 0.5) 0%,
    rgba(100, 174, 210, 0.12) 42%,
    transparent 70%
  );
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 1;
  width: min(1160px, calc(100% - 38px));
  margin: auto;
  padding: 64px 0 72px;
}
.hero-eyebrow {
  font-size: 12px;
  letter-spacing: 0.22em;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
}
.hero h1 {
  max-width: 760px;
  margin: 14px 0 20px;
  font-family: "Noto Serif TC", "PMingLiU", serif;
  font-size: clamp(42px, 6vw, 45px);
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: 0.03em;
  text-shadow: 0 5px 24px rgba(0, 0, 0, 0.28);
}
.hero p {
  max-width: 670px;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  line-height: 1.95;
}
.hero-line {
  width: 62px;
  height: 3px;
  margin: 26px 0;
  background: #91c3de;
  border-radius: 999px;
}

/* ===== Hero 下方四步驟引導卡 ===== */
.care-guide {
  position: relative;
  z-index: 6;
  margin-top: -85px;
  padding-bottom: 28px;
}
.care-guide-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.65fr);
  gap: 42px;
  align-items: start;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 30px;
  box-shadow:
    0 34px 90px rgba(16, 43, 61, 0.22),
    0 8px 24px rgba(16, 43, 61, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
.guide-copy {
  position: relative;
  padding-left: 22px;
  margin-top: 1rem;
}
.guide-copy::before {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  width: 3px;
  content: "";
  background: linear-gradient(180deg, #245b80, #8ab5cb);
  border-radius: 999px;
}
.guide-kicker {
  display: block;
  margin-bottom: 10px;
  color: #6f8796;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.guide-copy h2 {
  margin: 0 0 12px;
  color: var(--ink);
  font-family: "Noto Serif TC", "PMingLiU", serif;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.35;
}
.guide-copy p {
  margin: 0;
  color: #697982;
  font-size: 13px;
  line-height: 1.75;
}
.guide-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid #dfe6e4;
  border-bottom: 1px solid #dfe6e4;
}
.guide-step {
  position: relative;
  min-height: 108px;
  padding: 14px 14px 12px;
  border-right: 1px solid #dfe6e4;
}
.guide-step:last-child {
  border-right: 0;
}
.guide-number {
  display: block;
  margin-bottom: 12px;
  color: #8da4b0;
  font-family: Georgia, serif;
  font-size: 13px;
}
.guide-step h3 {
  margin: 0 0 7px;
  color: #2b4658;
  font-size: 13px;
}
.guide-step p {
  margin: 0;
  color: #7a888f;
  font-size: 11px;
  line-height: 1.55;
}
.guide-step::after {
  position: absolute;
  right: 14px;
  bottom: 14px;
  color: #d6e0e3;
  font-size: 18px;
  content: "→";
}
.guide-step:last-child::after {
  content: "✓";
}

/* ===== 物件淡入動畫 ===== */
.fade-in-item {
  animation: objectFadeIn 0.32s ease-out both;
}
.fade-in-delay-1 {
  animation-delay: 0.08s;
}
@keyframes objectFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===== 貓／狗主要區塊 ===== */
.pet-section {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fff;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pet-icon {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border-radius: 16px;
  background: #eef4f8;
  font-size: 25px;
}
.section-kicker {
  display: block;
  margin-bottom: 3px;
  color: #7c8992;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.section-title {
  margin: 0;
  color: var(--ink);
  font-size: 27px;
  line-height: 1.3;
}

/* ===== 參考稿核心：年齡照護時間軸 ===== */
.timeline {
  position: relative;
}
.timeline::before {
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 106px;
  width: 1px;
  background: #cad5da;
  content: "";
}
.timeline-phase {
  display: grid;
  grid-template-columns: 80px 28px minmax(0, 1fr);
  gap: 14px;
  padding: 18px 0;
}
.phase-age {
  padding-top: 8px;
  color: #5c6c76;
  font-size: 13px;
  font-weight: 900;
  text-align: right;
}
.phase-dot {
  z-index: 1;
  width: 16px;
  height: 16px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--cat);
  box-shadow: 0 0 0 6px #e8f1f6;
}
.dog-section .phase-dot {
  background: var(--dog);
  box-shadow: 0 0 0 6px #f1ebf7;
}

/* ===== 套組卡片 ===== */
.package-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}
.card-badge {
  margin-bottom: 9px;
  color: #6d7c86;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}
.card-age {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
  font-size: 23px;
  font-weight: 800;
}
.age-icon {
  display: none;
}
.card-price-section {
  text-align: right;
}
.price-label {
  margin-bottom: 2px;
  color: #8b989f;
  font-size: 11px;
  font-weight: 700;
}
.price-amount {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
}
.currency {
  color: #6d7c86;
  font-size: 12px;
  font-weight: 700;
}
.amount {
  font-family: Georgia, serif;
  font-size: 31px;
  font-weight: 700;
}
.primary-gradient {
  color: var(--cat);
}
.secondary-gradient {
  color: var(--dog);
}
.price-compare {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: #8b989f;
  font-size: 11px;
}
.original {
  color: #a2aaaf;
  text-decoration: line-through;
}
.discount {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff3f3;
  color: #d34c59;
  font-weight: 700;
}
.special-tag {
  margin-top: 8px;
  color: #d34c59;
  font-size: 11px;
}
.card-divider {
  height: 1px;
  margin: 18px 0 0;
  background: #edf1f3;
}

/* ===== 檢查項目清單 ===== */
.items-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 4px;
}
.header-icon {
  display: none;
}
.header-text {
  flex: 1;
  color: #60717b;
  font-size: 12px;
  font-weight: 800;
}
.items-count {
  padding: 3px 9px;
  border-radius: 999px;
  background: #eef4f8;
  color: var(--cat);
  font-size: 11px;
  font-weight: 800;
}
.secondary-count {
  background: #f1ebf7;
  color: var(--dog);
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.grid-item {
  display: flex;
  gap: 10px;
  min-width: 0;
  padding: 12px 0;
  border-top: 1px solid #edf1f3;
}
.item-number {
  display: grid;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.primary-bg {
  background: var(--cat);
}
.secondary-bg {
  background: var(--dog);
}
.item-details-wrap {
  min-width: 0;
  width: 100%;
}
.item-summary {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}
.item-name-text {
  color: #334b5b;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}
.arrow {
  flex-shrink: 0;
  color: #9aa7ae;
  font-size: 9px;
  transition: transform 0.25s ease;
}
.arrow.open {
  transform: rotate(180deg);
}
.item-description {
  margin-top: 7px;
  padding: 9px 11px;
  border-left: 3px solid var(--cat);
  border-radius: 7px;
  background: #f8fbfc;
  color: #697982;
  font-size: 12px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  animation: slideDown 0.25s ease;
}
.secondary-border {
  border-left-color: var(--dog);
  background: #faf8fc;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .care-guide {
    margin-top: -32px;
  }
  .care-guide-inner {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 28px 26px;
    border-radius: 26px;
  }
  .guide-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .guide-step:nth-child(2) {
    border-right: 0;
  }
  .guide-step:nth-child(-n + 2) {
    border-bottom: 1px solid #dfe6e4;
  }
}

/* ===== 平板與手機版 ===== */
@media (max-width: 800px) {
  .healthcheck-page {
    padding: 0 0 60px;
  }
  .hero {
    min-height: 420px;
    background-position: 58% center;
  }
  .hero::before {
    background: linear-gradient(
      90deg,
      rgba(8, 31, 49, 0.9),
      rgba(8, 31, 49, 0.58)
    );
  }
  .hero-inner {
    padding: 54px 0 64px;
  }
  .pet-section {
    padding: 20px;
  }
  .items-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .hero {
    min-height: 390px;
    background-position: 62% center;
  }
  .hero-inner {
    width: min(100% - 28px, 1160px);
    padding: 44px 0 54px;
  }
  .hero h1 {
    font-size: 30px;
  }
  .hero p {
    font-size: 14px;
    line-height: 1.8;
  }
  .page-shell {
    width: min(100% - 18px, 1160px);
  }
  .care-guide {
    margin-top: -20px;
    padding-bottom: 24px;
  }
  .care-guide-inner {
    padding: 22px 18px;
    border-radius: 22px;
    box-shadow:
      0 24px 60px rgba(16, 43, 61, 0.18),
      0 6px 18px rgba(16, 43, 61, 0.08);
  }
  .guide-steps {
    grid-template-columns: 1fr;
  }
  .guide-step {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid #dfe6e4;
  }
  .guide-step:last-child {
    border-bottom: 0;
  }
  .content-wrapper {
    gap: 18px;
  }
  .pet-section {
    padding: 16px;
    border-radius: 20px;
  }
  .section-header {
    align-items: flex-start;
  }
  .pet-icon {
    width: 46px;
    height: 46px;
    font-size: 23px;
  }
  .section-kicker {
    font-size: 10px;
  }
  .section-title {
    font-size: 22px;
  }
  .timeline::before {
    left: 8px;
  }
  .timeline-phase {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 10px;
  }
  .phase-age {
    grid-column: 2;
    padding: 0;
    text-align: left;
  }
  .phase-dot {
    grid-row: 1 / 3;
    grid-column: 1;
  }
  .package-card {
    grid-column: 2;
    padding: 17px;
  }
  .card-top {
    display: block;
  }
  .card-age {
    font-size: 19px;
  }
  .card-price-section {
    margin-top: 14px;
    text-align: left;
  }
  .price-amount,
  .price-compare {
    justify-content: flex-start;
  }
  .amount {
    font-size: 28px;
  }
}

/* ===== 健檢步驟卡片微調：加寬、置中、移除箭頭 ===== */
@media (min-width: 901px) {
  .care-guide-inner {
    width: min(1240px, calc(100vw - 48px));
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

.guide-steps {
  align-items: stretch;
  margin-top: 0px;
}

.guide-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.guide-number {
  width: 100%;
  text-align: center;
}

.guide-step::after,
.guide-step:last-child::after {
  display: none;
  content: none;
}

/* ===== 中小尺寸引導卡與桌機檢查項目排列 ===== */
@media (min-width: 561px) and (max-width: 900px) {
  .care-guide-inner {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 24px 26px;
  }

  .guide-copy {
    max-width: 620px;
    margin-top: 0;
  }

  .guide-steps {
    width: 100%;
    margin-top: 2px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .guide-step {
    min-height: 112px;
    padding: 14px 18px;
  }
}

@media (min-width: 901px) {
  /* 桌機版每個套組最多四個項目排成同一橫列。 */
  .items-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 18px;
  }

  .grid-item {
    position: relative;
    min-width: 0;
  }

  .item-summary {
    justify-content: flex-start;
    cursor: default;
  }

  /* 桌機版不使用點擊展開箭頭與展開區塊。 */
  .item-summary .arrow,
  .item-description {
    display: none;
  }

  .item-help {
    position: relative;
    display: inline-grid;
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    margin-left: 4px;
    place-items: center;
    border: 1px solid #7f929d;
    border-radius: 50%;
    color: #607786;
    cursor: help;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    outline: none;
  }

  .item-tooltip {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 10px);
    z-index: 50;
    width: max-content;
    max-width: 260px;
    padding: 10px 12px;
    border: 1px solid #e1e7ea;
    border-radius: 9px;
    background: #fff;
    box-shadow: 0 10px 28px rgba(24, 54, 78, 0.18);
    color: #445761;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.65;
    text-align: left;
    white-space: normal;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, 6px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease,
      visibility 0.18s ease;
  }

  .item-tooltip::after {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-right: 1px solid #e1e7ea;
    border-bottom: 1px solid #e1e7ea;
    background: #fff;
    content: "";
    transform: translate(-50%, -4px) rotate(45deg);
  }

  .item-help:hover .item-tooltip,
  .item-help:focus .item-tooltip {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 900px) {
  /* 中小尺寸維持原本點擊展開，隱藏桌機專用問號。 */
  .item-help {
    display: none;
  }
}

/* ===== 中小尺寸 care guide 視覺重整 ===== */
@media (min-width: 561px) and (max-width: 900px) {
  .care-guide {
    margin-top: -28px;
  }

  .care-guide-inner {
    gap: 18px;
    padding: 26px;
    border-radius: 24px;
  }

  .guide-copy {
    margin-top: 0;
    padding: 0 0 0 18px;
  }

  .guide-copy h2 {
    font-size: 24px;
    line-height: 1.45;
  }

  .guide-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 0;
    border: 0;
  }

  .guide-step,
  .guide-step:nth-child(2),
  .guide-step:nth-child(-n + 2) {
    min-height: 118px;
    padding: 16px;
    border: 1px solid #e2e9ec;
    border-radius: 16px;
    background: #f8fafb;
  }

  .guide-number {
    width: 30px;
    height: 30px;
    margin: 0 0 10px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e8f1f6;
    color: #245b80;
    font-size: 12px;
    font-weight: 800;
  }

  .guide-step h3 {
    margin-bottom: 6px;
    font-size: 14px;
  }

  .guide-step p {
    font-size: 12px;
    line-height: 1.6;
  }
}

@media (max-width: 560px) {
  .care-guide {
    margin-top: -18px;
  }

  .care-guide-inner {
    gap: 18px;
    padding: 22px 18px 18px;
    border-radius: 22px;
  }

  .guide-copy {
    margin-top: 0;
    padding-left: 18px;
  }

  .guide-copy h2 {
    font-size: 22px;
    line-height: 1.45;
  }

  .guide-steps {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 0;
    border: 0;
  }

  .guide-step,
  .guide-step:nth-child(2),
  .guide-step:nth-child(-n + 2),
  .guide-step:last-child {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 12px;
    min-height: 0;
    padding: 14px 16px;
    align-items: center;
    justify-items: start;
    border: 1px solid #e2e9ec;
    border-radius: 14px;
    background: #f8fafb;
    text-align: left;
  }

  .guide-number {
    grid-row: 1 / 3;
    width: 32px;
    height: 32px;
    margin: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e8f1f6;
    color: #245b80;
    font-size: 12px;
    font-weight: 800;
    text-align: center;
  }

  .guide-step h3 {
    margin: 0 0 3px;
    font-size: 14px;
    text-align: left;
  }

  .guide-step p {
    margin: 0;
    font-size: 11px;
    line-height: 1.55;
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-item,
  .item-description {
    animation: none;
  }
  .arrow {
    transition: none;
  }
}
</style>

<script>
export default {
  name: "HealthCheck",

  setup() {
    useSeoMeta({
      title: "健康檢查套組｜人人動物醫院埔心分院",
      description:
        "人人動物醫院埔心分院提供貓咪與狗狗多種健康檢查套組，包含基礎、進階、完整心臟評估等方案，協助早期發現疾病、守護毛孩健康。",
      ogTitle: "健康檢查套組｜人人動物醫院埔心分院",
      ogDescription:
        "貓咪健康檢查、狗狗健康檢查，基礎到進階套組，人人動物醫院埔心分院為您的毛孩做好全面健康管理。",
      ogType: "website",
      ogUrl: "https://www.zmnzmnpusin.com.tw/healthcheck",
      ogImage: "https://www.zmnzmnpusin.com.tw/og-image.webp",
      twitterCard: "summary_large_image",
      twitterTitle: "健康檢查套組｜人人動物醫院埔心分院",
      twitterDescription: "貓咪與狗狗健康檢查套組，早期發現、早期治療。",
    });
    useHead({
      link: [
        {
          rel: "canonical",
          href: "https://www.zmnzmnpusin.com.tw/healthcheck",
        },
      ],
    });
  },

  data() {
    return {
      // 展開狀態：key 為 `${group}-${index}`
      openItems: {},

      // ── 貓咪資料 ──
      catPackageA: [
        { name: "基礎血液生化檢查", desc: "包含肝腎功能等 9 項基本生化指數" },
        { name: "血球計數", desc: "檢出有貧血或炎症反應的現象" },
        { name: "ProBNP快篩", desc: "檢出中等程度的心肌損傷" },
        { name: "X光片檢查", desc: "透過X光檢出胸腹腔及骨骼異常的影像" },
      ],
      catPackageAB: [
        { name: "血液離子檢查", desc: "評估體內電解質的平衡狀況" },
        {
          name: "基礎心臟超音波",
          desc: "檢出是否有心臟結構或功能異常（如有異常建議升級為完整心臟評估）",
        },
        {
          name: "全腹腔超音波",
          desc: "檢查腹腔內器官的大小、回音和內部結構，並且可以檢出腫瘤的存在",
        },
        {
          name: "血壓測量",
          desc: "檢出高低血壓，所得數值可以合併評估心血管及神經內分泌功能的狀態",
        },
        {
          name: "貓心絲蟲抗原抗體快篩",
          desc: "同時檢測貓血液中心絲蟲的抗原及抗體",
        },
      ],
      catPackageABC: [
        {
          name: "進階血液檢查",
          desc: "經由 15 項血液生化指數更深入評估身體器官功能",
        },
        { name: "血球計數", desc: "進階版血球分析，可以了解所有血球類型變化" },
        {
          name: "完整心臟超音波",
          desc: "完整評估心臟結構（包含瓣膜）、容積及壓力狀態以及數據化心臟的功能指數、心肌的運動能力",
        },
        { name: "內分泌檢查", desc: "總甲狀腺素（tT4）及早期腎病篩檢（SDMA）" },
      ],

      // ── 狗狗資料 ──
      dogPackageA: [
        { name: "基礎血液生化檢查", desc: "包含肝腎功能等 9 項基本生化指數" },
        { name: "血球計數", desc: "檢出有貧血或炎症反應的現象" },
        {
          name: "Snap四合一快篩",
          desc: "檢查包含心絲蟲等四項寄生在血液的寄生蟲",
        },
        { name: "X光片檢查", desc: "透過X光檢出胸腹腔及骨骼異常的影像" },
      ],
      dogPackageAB: [
        { name: "血液離子檢查", desc: "評估體內電解質的平衡狀況" },
        {
          name: "基礎心臟超音波",
          desc: "檢出是否有心臟結構或功能異常（如有異常建議升級為完整心臟評估）",
        },
        {
          name: "全腹腔超音波",
          desc: "檢查腹腔內器官的大小、回音和內部結構，並且可以檢出腫瘤的存在",
        },
        {
          name: "血壓測量",
          desc: "檢出高低血壓，所得數值可以合併評估心血管及神經內分泌的狀態",
        },
      ],
      dogPackageABC: [
        {
          name: "進階血液檢查",
          desc: "經由 15 項血液生化指數更深入評估身體臟器功能",
        },
        { name: "血球計數", desc: "進階版血球分析，可以了解所有血球類型變化" },
        {
          name: "完整心臟超音波",
          desc: "完整評估心臟結構（包含瓣膜）、容積及壓力狀態以及數據化心臟的功能指數、心肌的運動能力",
        },
        {
          name: "眼壓測量",
          desc: "早期發現青光眼及幫助檢測其他影響眼壓的疾病",
        },
      ],
    };
  },

  computed: {
    /** 貓咪表格列資料：每列 3 欄，對應三個套組 */
    catTableRows() {
      return this._buildRows(
        this.catPackageA,
        this.catPackageAB,
        this.catPackageABC,
      );
    },
    /** 狗狗表格列資料 */
    dogTableRows() {
      return this._buildRows(
        this.dogPackageA,
        this.dogPackageAB,
        this.dogPackageABC,
      );
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
        a[i] || null,
        ab[i] || null,
        abc[i] || null,
      ]);
    },
  },
};
</script>
