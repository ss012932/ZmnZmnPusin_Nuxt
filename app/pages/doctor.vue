<template>
  <div class="doctors-page">
    <!-- ════ 總覽頁 / 詳情頁載入中 / 詳情頁：三種狀態共用同一個 transition，
         並用 mode="out-in" 確保同一時間只有一個區塊存在於畫面上，
         避免切換時新舊內容同時撐開高度，造成畫面先往下跳再彈回正確位置。 ════ -->
    <transition name="page-fade" mode="out-in">
      <div v-if="!selectedDoctor && !hasDoctorDetailQuery" key="overview" class="overview-wrap">
        <!-- 頁面主視覺：參考圖片上方的深色橫幅與麵包屑排版，色系改用網站的藍色系 -->
        <section class="team-hero" aria-labelledby="doctor-page-title">
          <div class="team-hero-overlay"></div>

          <div class="team-hero-content fade-in-item">
            <p class="hero-eyebrow">Medical Team</p>
            <h1 id="doctor-page-title" class="hero-title">醫療團隊</h1>
          </div>
        </section>

        <main class="overview-section">
          <!-- 頁面說明：維持網站語氣，讓使用者知道此頁用途 -->
          <header class="team-intro fade-in-item fade-in-delay-1">
            <h2>認識我們的醫師</h2>
            <p>每一位醫師都承載著對醫療的熱忱與對病患的承諾。</p>
          </header>

          <!-- 載入中提示：避免 API 還沒回來時畫面空白 -->
          <div
            v-if="isFetching"
            class="loading-card"
            role="status"
            aria-live="polite"
            aria-label="醫師資料載入中"
          >
            <span class="loading-spinner" aria-hidden="true"></span>
          </div>

          <!-- 醫師卡片列表：改成參考圖的直式人像卡片，姓名直接壓在圖片左下角 -->
          <div v-else-if="filteredDoctors.length" class="doctors-grid fade-in-item fade-in-delay-2">
            <article
              v-for="doctor in filteredDoctors"
              :key="doctor.id"
              class="doctor-card"
              role="button"
              tabindex="0"
              :aria-label="`查看 ${doctor.name} 醫師介紹`"
              @click="openDoctor(doctor)"
              @keydown.enter.prevent="openDoctor(doctor)"
              @keydown.space.prevent="openDoctor(doctor)"
            >
              <div class="doctor-photo-frame">
                <!-- 醫師照片：鋪滿整張卡片，維持人物上半身構圖 -->
                <img :src="doctor.photo" :alt="doctor.name" class="card-bg-photo" />

                <!-- 底部漸層：讓白色姓名在各種照片上都能清楚閱讀 -->
                <div class="doctor-gradient" aria-hidden="true"></div>

                <!-- 醫師資訊：參考圖使用左下大字排版，職稱用小字補充 -->
                <div class="doctor-info-panel">
                  <p class="doctor-name">{{ doctor.name }}</p>
                  <p class="doctor-role">
                    {{ doctor.titleTags.length ? doctor.titleTags.join('／') : doctor.department }}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <!-- 無資料提示：篩選後沒有醫師時顯示 -->
          <div v-else class="state-card">
            目前沒有符合「{{ activeDepartmentLabel }}」的醫師資料。
          </div>
        </main>
      </div>

      <!-- ════ 詳情頁載入中 ════ -->
      <div
        v-else-if="!selectedDoctor && hasDoctorDetailQuery"
        key="detail-loading"
        class="detail-section detail-loading-section"
      >
        <div
          class="loading-card"
          role="status"
          aria-live="polite"
          aria-label="醫師資料載入中"
        >
          <span class="loading-spinner" aria-hidden="true"></span>
        </div>
      </div>

      <!-- ════ 詳情頁 ════ -->
      <div v-else key="detail" class="detail-section">
        <button class="back-btn" @click="closeDoctor">← 返回醫師列表</button>

        <div class="detail-layout fade-in-item">
          <!-- 左側：照片 + 基本資料 -->
          <aside class="detail-sidebar">
            <div class="sidebar-photo-wrap">
              <img
                :src="selectedDoctor.photo"
                :alt="selectedDoctor.name"
                class="sidebar-photo"
              />
            </div>

            <!-- 醫師姓名與科別 -->
            <div class="sidebar-name-block">
              <h1 class="sidebar-name">{{ selectedDoctor.name }}</h1>
              <p v-if="selectedDoctor.department" class="sidebar-dept">
                {{ selectedDoctor.department }}
              </p>
            </div>

            <!-- 醫師職稱 -->
            <div v-if="selectedDoctor.titleTags.length" class="sidebar-section">
              <h4 class="sidebar-section-title">職稱</h4>
              <div class="title-tags">
                <span
                  v-for="(tag, idx) in selectedDoctor.titleTags"
                  :key="idx"
                  class="title-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </aside>

          <!-- 右側：詳細資料 -->
          <main class="detail-main">
            <!-- 專業領域 -->
            <section v-if="selectedDoctor.specialties.length" class="detail-block">
              <h3 class="block-title">專業領域</h3>
              <div class="specialties-tags">
                <span
                  v-for="(spec, idx) in selectedDoctor.specialties"
                  :key="idx"
                  class="specialty-chip"
                >
                  {{ spec }}
                </span>
              </div>
            </section>

            <!-- 擅長診療項目 -->
            <section v-if="selectedDoctor.treatments.length" class="detail-block">
              <h3 class="block-title">擅長診療項目</h3>
              <div class="treatments-wrap">
                <div
                  v-for="(item, idx) in selectedDoctor.treatments"
                  :key="idx"
                  class="treatment-item"
                >
                  <span class="treatment-dot"></span>
                  <span>{{ item }}</span>
                </div>
              </div>
            </section>

            <!-- 就學／就職經歷 -->
            <section
              v-if="
                selectedDoctor.education.length ||
                selectedDoctor.workExperience.length ||
                selectedDoctor.otherExperience.length
              "
              class="detail-block"
            >
              <h3 class="block-title">就學／就職經歷</h3>

              <div v-if="selectedDoctor.education.length" class="exp-group">
                <h4 class="exp-group-title">學歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.education" :key="idx">{{ item }}</li>
                </ul>
              </div>

              <div v-if="selectedDoctor.workExperience.length" class="exp-group">
                <h4 class="exp-group-title">就職經歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.workExperience" :key="idx">{{ item }}</li>
                </ul>
              </div>

              <div
                v-if="selectedDoctor.otherExperience && selectedDoctor.otherExperience.length"
                class="exp-group"
              >
                <h4 class="exp-group-title">其他經歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.otherExperience" :key="idx">{{ item }}</li>
                </ul>
              </div>
            </section>

            <!-- 證照與資格 -->
            <section v-if="selectedDoctor.certifications.length" class="detail-block">
              <h3 class="block-title">證照與資格</h3>
              <ul class="exp-list">
                <li v-for="(cert, idx) in selectedDoctor.certifications" :key="idx">{{ cert }}</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { publicAPI } from '~/composables/utils/api';

// ===== 醫師資料快取設定 =====
// 說明：醫師資料屬於低頻率變動資料，先快取在瀏覽器中，返回醫師頁時可以立即顯示。
const DOCTOR_CACHE_KEY = 'public-doctors-cache-v1';
const DOCTOR_CACHE_TTL = 10 * 60 * 1000;

// ===== 從 localStorage 讀取快取 =====
// 說明：只在瀏覽器端執行，避免 Nuxt SSR 階段讀取 window / localStorage 出錯。
function readDoctorCache() {
  if (!import.meta.client) return null;

  try {
    const rawCache = localStorage.getItem(DOCTOR_CACHE_KEY);
    if (!rawCache) return null;

    const cache = JSON.parse(rawCache);
    const isExpired = Date.now() - cache.cachedAt > DOCTOR_CACHE_TTL;

    if (isExpired || !Array.isArray(cache.data)) {
      localStorage.removeItem(DOCTOR_CACHE_KEY);
      return null;
    }

    return cache.data;
  } catch {
    localStorage.removeItem(DOCTOR_CACHE_KEY);
    return null;
  }
}

// ===== 寫入 localStorage 快取 =====
// 說明：API 成功回傳後更新快取，讓使用者下次進醫師頁可以更快看到資料。
function writeDoctorCache(data) {
  if (!import.meta.client) return;

  try {
    localStorage.setItem(
      DOCTOR_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        data,
      }),
    );
  } catch {
    // localStorage 可能因隱私模式或容量限制失敗，失敗時不影響頁面正常載入。
  }
}

export default {
  name: 'DoctorsPage',

  setup() {
    useSeoMeta({
      title: '醫療團隊｜人人動物醫院埔心分院',
      description: '認識人人動物醫院埔心分院的專業獸醫師團隊，涵蓋犬貓內科、外科手術、心臟科、齒科、眼科、骨科、神經內科、腫瘤科、雷射治療與再生醫療等各科別。',
      ogTitle: '醫療團隊｜人人動物醫院埔心分院',
      ogDescription: '人人動物醫院埔心分院醫師團隊，專業分工涵蓋內外科、齒科、心臟科、骨科、雷射治療與再生醫療。',
      ogType: 'website',
      ogUrl: 'https://www.zmnzmnpusin.com.tw/doctor',
      ogImage: 'https://www.zmnzmnpusin.com.tw/og-image.webp',
      twitterCard: 'summary_large_image',
      twitterTitle: '醫療團隊｜人人動物醫院埔心分院',
      twitterDescription: '人人動物醫院埔心分院專業獸醫師團隊介紹。',
    });

    useHead({
      link: [{ rel: 'canonical', href: 'https://www.zmnzmnpusin.com.tw/doctor' }],
    });
  },

  data() {
    return {
      selectedDoctor: null,
      activeFilter: 'all',
      isFetching: true,
      doctors: [],
    };
  },

  computed: {
    // 從 API 資料動態產生科別清單，未來後台新增科別時，前台不用另外改寫死清單
    departments() {
      const uniqueDepartments = [
        ...new Set(this.doctors.map((doctor) => doctor.department).filter(Boolean)),
      ];

      return [
        { key: 'all', label: '全部科別' },
        ...uniqueDepartments.map((department) => ({
          key: department,
          label: department,
        })),
      ];
    },

    // 目前選取科別的顯示文字，給狀態列與 select 的 aria-label 共用
    activeDepartmentLabel() {
      const matchedDepartment = this.departments.find((dept) => dept.key === this.activeFilter);
      return matchedDepartment?.label || '全部科別';
    },

    // 篩選提示文字，依照科別數量調整說明
    filterHelperText() {
      if (this.departments.length > 4) {
        return '手機與平板會自動收合成下拉選單，科別再多也好選。';
      }

      return '選擇科別查看對應醫師。';
    },

    // 醫師列表篩選邏輯
    filteredDoctors() {
      if (this.activeFilter === 'all') return this.doctors;
      return this.doctors.filter((doctor) => doctor.department === this.activeFilter);
    },

    // 判斷目前網址是否是醫師詳情頁，例如 /doctor?doctor=3。
    // 有 doctor query 時，不先渲染總覽頁，避免重整時畫面跳來跳去。
    hasDoctorDetailQuery() {
      const queryValue = this.$route.query.doctor;
      const id = Array.isArray(queryValue) ? queryValue[0] : queryValue;
      const parsedId = Number(id);

      return Number.isFinite(parsedId) && parsedId > 0;
    },
  },

  async mounted() {
    // 詳情頁重整時關閉瀏覽器自動還原舊捲動位置，避免畫面先出現在下方再跳回上方。
    if (import.meta.client && this.hasDoctorDetailQuery) {
      window.history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // 詳情頁：不要先用快取資料閃一次舊內容再被最新資料蓋掉（會造成版面跳動），
    // 直接等最新資料完整載入後才一次顯示，載入期間維持 loading 畫面。
    if (this.hasDoctorDetailQuery) {
      await this.fetchDoctors();
      return;
    }

    // 先讀取快取資料，讓使用者再次進入醫師頁時可以立即看到卡片。
    const cachedDoctors = readDoctorCache();

    if (cachedDoctors?.length) {
      this.doctors = cachedDoctors
        .map((doctor) => this.mapDoctor(doctor))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      this.isFetching = false;
      this.applyDoctorFromUrl();

      // 有快取時不顯示載入文字，改成背景同步最新資料。
      this.fetchDoctors({ silent: true });
      return;
    }

    // 沒有快取時才顯示載入狀態，通常只會發生在第一次進入醫師頁。
    await this.fetchDoctors();
  },

  methods: {
    // 從網址讀取目前醫師 id，例如 /doctor?doctor=3
    getDoctorIdFromUrl() {
      if (!import.meta.client) return null;

      const id = Number(new URLSearchParams(window.location.search).get('doctor'));
      return Number.isFinite(id) && id > 0 ? id : null;
    },

    // 依照網址上的 doctor id 還原醫師詳情頁，避免重整後回到總覽頁。
    applyDoctorFromUrl() {
      const doctorId = this.getDoctorIdFromUrl();

      if (!doctorId) {
        this.selectedDoctor = null;
        return;
      }

      if (!this.doctors.length) return;

      const matchedDoctor = this.doctors.find((doctor) => Number(doctor.id) === doctorId);
      if (!matchedDoctor) return;

      this.selectedDoctor = matchedDoctor;
    },

    // 從公開 API 取得醫師資料
    async fetchDoctors(options = {}) {
      const shouldShowLoading = !options.silent;

      if (shouldShowLoading) {
        this.isFetching = true;
      }

      try {
        const list = await publicAPI.getDoctors();

        // API 成功後保存原始 DTO，避免下次讀快取時資料格式不一致。
        writeDoctorCache(list);

        this.doctors = list
          .map((doctor) => this.mapDoctor(doctor))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        this.applyDoctorFromUrl();
      } catch (error) {
        console.error('載入醫師資料失敗', error);
      } finally {
        if (shouldShowLoading) {
          this.isFetching = false;
        }
      }
    },

    // 將後端 DTO 轉成畫面好使用的格式
    mapDoctor(doctor) {
      const splitLines = (value) => {
        if (!value) return [];
        return value
          .split('\n')
          .map((text) => text.trim())
          .filter(Boolean);
      };

      return {
        id: doctor.id,
        name: doctor.name,
        photo: doctor.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
        department: doctor.department || '',
        sortOrder: doctor.sortOrder ?? 0,
        titleTags: splitLines(doctor.titles),
        specialties: splitLines(doctor.specialties),
        treatments: splitLines(doctor.treatmentItems),
        education: splitLines(doctor.education),
        workExperience: splitLines(doctor.experience),
        otherExperience: splitLines(doctor.otherExperience),
        certifications: splitLines(doctor.licenses),
      };
    },

    // 開啟醫師詳情
    openDoctor(doctor) {
      this.selectedDoctor = doctor;

      // 將醫師 id 寫進網址，重整後可回到同一位醫師詳情。
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          doctor: doctor.id,
        },
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 返回醫師列表
    closeDoctor() {
      this.selectedDoctor = null;

      // 移除網址上的 doctor id，避免返回列表後重整又打開同一位醫師。
      const nextQuery = { ...this.$route.query };
      delete nextQuery.doctor;

      this.$router.replace({
        path: this.$route.path,
        query: nextQuery,
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>

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
  .fade-in-item,
  .loading-spinner {
    animation: none;
  }
}

/* ─── Reset & Base：只作用在醫師頁，避免影響其他頁 ─── */
.doctors-page,
.doctors-page * {
  box-sizing: border-box;
}

.doctors-page {
  --color-cream: #fffaf0;
  --color-card: #ffffff;
  --color-primary: #2c5282;
  --color-primary-dark: #133b63;
  --color-sky: #5ba4d4;
  --color-sky-soft: #dbe7f0;
  --color-text: #1e3551;
  --color-muted: #6c7d8e;
  --shadow-soft: 0 16px 36px rgba(22, 67, 99, 0.12);

  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-cream);
  font-family: 'Microsoft JhengHei', 'Noto Sans TC', 'PingFang TC', sans-serif;
}

/* ─── Transitions ─── */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ════════════════════════
   總覽頁：上方 Hero
════════════════════════ */
.overview-wrap {
  min-height: 100vh;
  background: linear-gradient(180deg, #fffaf0 0%, #ffffff 100%);
}

.team-hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: clamp(210px, 28vw, 330px);
  overflow: hidden;
  background:
    
    url('@/assets/image/doctor.webp') center / cover no-repeat;
}

/* Hero 光暈：做出圖片右側偏亮的層次，但仍保持網站藍色調 */
.team-hero::after {
  position: absolute;
  top: -35%;
  right: -10%;
  width: min(52vw, 560px);
  height: 170%;
  content: '';
  background: radial-gradient(circle, rgba(255, 250, 240, 0.55) 0%, rgba(91, 164, 212, 0.14) 44%, transparent 70%);
  pointer-events: none;
}

.team-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(8, 31, 49, 0.88) 0%,
    rgba(8, 31, 49, 0.72) 42%,
    rgba(8, 31, 49, 0.2) 72%,
    rgba(8, 31, 49, 0.08) 100%
  );
}

.team-hero-content {
  position: relative;
  z-index: 1;
  width: min(100%, 1180px);
  padding: clamp(36px, 6vw, 70px) clamp(18px, 5vw, 56px);
  margin: 0 auto;
  color: #fff;
}

.hero-eyebrow {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(12px, 1.4vw, 14px);
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0 0 14px;
  color: #fff;
  font-size: clamp(34px, 5.6vw, 62px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0.08em;
}

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
}

.breadcrumb a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #dbe7f0;
}

/* ════════════════════════
   總覽頁：內容與篩選
════════════════════════ */
.overview-section {
  width: min(100%, 1180px);
  padding: clamp(42px, 5vw, 76px) clamp(16px, 4vw, 36px) clamp(72px, 8vw, 112px);
  margin: 0 auto;
}

.team-intro {
  width: min(100%, 640px);
  margin: 0 auto clamp(22px, 3vw, 32px);
  text-align: center;
}

.section-kicker {
  margin: 0 0 8px;
  color: var(--color-sky);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.team-intro h2 {
  margin: 0 0 10px;
  color: var(--color-primary-dark);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: 0.05em;
}

.team-intro p {
  margin: 0;
  color: var(--color-muted);
  font-size: clamp(13px, 1.4vw, 15px);
  line-height: 1.8;
}

.filter-shell {
  width: min(100%, 920px);
  margin: 0 auto clamp(30px, 4vw, 48px);
}

.filter-card {
  padding: 10px;
  border: 1px solid rgba(44, 82, 130, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 28px rgba(19, 59, 99, 0.08);
  backdrop-filter: blur(10px);
}

.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  flex: 0 0 auto;
  min-height: 38px;
  padding: 8px 17px;
  color: var(--color-primary);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.filter-btn:hover {
  color: #fff;
  background: var(--color-sky);
  transform: translateY(-1px);
}

.filter-btn:focus-visible {
  outline: 3px solid rgba(91, 164, 212, 0.28);
  outline-offset: 2px;
}

.filter-btn.active {
  color: #fff;
  background: var(--color-primary);
  box-shadow: 0 10px 20px rgba(44, 82, 130, 0.2);
}

.filter-select-wrap {
  display: none;
}

/* 桌機版科別篩選：改成輕量分頁列，拿掉大外框；科別很多時在固定寬度內水平滑動 */
@media (min-width: 961px) {
  .filter-shell {
    width: min(100%, 760px);
    margin: 0 auto clamp(36px, 4vw, 56px);
  }

  .filter-card {
    padding: 0;
    overflow: hidden;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
  }

  .filter-card::before {
    display: none;
    content: none;
  }

  .filter-desktop {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    justify-content: flex-start;
    width: fit-content;
    max-width: 100%;
    min-width: 0;
    padding: 0 2px 12px;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;
  }

  .filter-desktop::-webkit-scrollbar {
    display: none;
  }

  .filter-btn {
    flex: 0 0 auto;
    min-height: 42px;
    padding: 10px 22px;
    color: #416787;
    font-size: 14px;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(91, 164, 212, 0.24);
    border-radius: 999px;
    box-shadow: none;
  }

  .filter-btn:hover {
    color: var(--color-primary-dark);
    background: #ffffff;
    border-color: rgba(91, 164, 212, 0.46);
    transform: none;
  }

  .filter-btn.active {
    color: #ffffff;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-sky) 100%);
    border-color: transparent;
    box-shadow: none;
  }

  .filter-btn:focus-visible {
    outline: 3px solid rgba(91, 164, 212, 0.26);
    outline-offset: 3px;
  }
}

.select-label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-primary-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.filter-select-control {
  position: relative;
  display: block;
}

.filter-select {
  width: 100%;
  padding: 11px 42px 11px 14px;
  color: var(--color-primary-dark);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #fff;
  border: 1.5px solid var(--color-sky-soft);
  border-radius: 12px;
  outline: none;
  appearance: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-select:focus {
  border-color: var(--color-sky);
  box-shadow: 0 0 0 4px rgba(91, 164, 212, 0.16);
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  color: var(--color-primary);
  font-size: 18px;
  pointer-events: none;
  transform: translateY(-56%);
}

.state-card {
  width: min(100%, 680px);
  padding: 18px 20px;
  margin: 0 auto;
  color: var(--color-primary-dark);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(44, 82, 130, 0.12);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(19, 59, 99, 0.08);
}

/* 醫師資料 loading 圓圈：資料尚未確認前顯示，避免先誤判成沒有資料。 */
.loading-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.loading-spinner {
  display: inline-block;
  width: 46px;
  height: 46px;
  border: 4px solid rgba(44, 82, 130, 0.16);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: doctorLoadingSpin 0.8s linear infinite;
}

@keyframes doctorLoadingSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ════════════════════════
   醫師卡片：參考圖片的直式人像卡片排版
════════════════════════ */
.doctors-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(22px, 2.6vw, 34px);
}

.doctor-card {
  position: relative;
  min-width: 0;
  cursor: pointer;
  outline: none;
  transition: transform 0.28s ease;
}

.doctor-card:hover,
.doctor-card:focus-visible {
  transform: translateY(-6px);
}

.doctor-card:focus-visible .doctor-photo-frame {
  outline: 4px solid rgba(91, 164, 212, 0.35);
  outline-offset: 4px;
}

.doctor-photo-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4.18;
  background: #e8f2f7;
  border: 1px solid rgba(44, 82, 130, 0.08);
  border-radius: 4px;
  box-shadow: 0 18px 34px rgba(19, 59, 99, 0.16);
  isolation: isolate;
}

/* 照片本體：參考圖是彩色人像，所以這裡取消黑白濾鏡 */
.card-bg-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transform: scale(1.01);
  transition: transform 0.42s ease, filter 0.42s ease;
}

.doctor-card:hover .card-bg-photo,
.doctor-card:focus-visible .card-bg-photo {
  filter: saturate(1.05) contrast(1.03);
  transform: scale(1.06);
}

/* 上方淡淡藍色光感：讓卡片跟網站主視覺的藍色系一致 */
.doctor-photo-frame::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  content: '';
  background: linear-gradient(180deg, rgba(91, 164, 212, 0.2) 0%, transparent 38%);
}

/* 底部藍色漸層：對應參考圖左下角藍色資訊區 */
.doctor-gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(18deg, rgba(44, 82, 130, 0.95) 0%, rgba(44, 82, 130, 0.82) 18%, rgba(91, 164, 212, 0.34) 38%, transparent 62%),
    linear-gradient(0deg, rgba(19, 59, 99, 0.46) 0%, transparent 45%);
  transition: opacity 0.28s ease;
}

.doctor-card:hover .doctor-gradient,
.doctor-card:focus-visible .doctor-gradient {
  opacity: 0.92;
}

.doctor-info-panel {
  position: absolute;
  right: 18px;
  bottom: 22px;
  left: 18px;
  z-index: 3;
  color: #fff;
}

.doctor-name {
  max-width: 9ch;
  margin: 0 0 8px;
  color: #fff;
  font-size: clamp(24px, 2.6vw, 36px);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: 0.06em;
  text-shadow: 0 3px 12px rgba(6, 28, 49, 0.42);
  word-break: keep-all;
}

.doctor-role {
  display: -webkit-box;
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 8px rgba(6, 28, 49, 0.35);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* ════════════════════════
   詳情頁
════════════════════════ */
.detail-section {
  width: min(100%, 1120px);
  padding: clamp(28px, 4vw, 44px) clamp(16px, 4vw, 40px) clamp(64px, 7vw, 104px);
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 9px 18px;
  margin-bottom: 40px;
  color: var(--color-primary);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #fff;
  border: 1.5px solid rgba(44, 82, 130, 0.14);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(19, 59, 99, 0.08);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.back-btn:hover {
  color: #fff;
  background: var(--color-primary);
  transform: translateY(-1px);
}

.detail-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: clamp(28px, 4vw, 52px);
  align-items: start;
}

.detail-sidebar {
  position: sticky;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.sidebar-photo-wrap {
  overflow: hidden;
  background: #e8f2f7;
  box-shadow: var(--shadow-soft);
}

.sidebar-photo {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1.22;
  object-fit: cover;
  object-position: top center;
}

.sidebar-name-block {
  padding: 22px 0 20px;
}

.sidebar-name {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.05em;
}

.sidebar-dept {
  margin: 6px 0 0;
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 700;
}

.sidebar-section {
  padding: 18px 0;
}

.sidebar-section-title {
  margin: 0 0 10px;
  color: #7f9caf;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.title-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.title-tag {
  padding: 5px 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  background: var(--color-primary);
  border-radius: 999px;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding-top: 4px;
}

.detail-block {
  min-width: 0;
  padding: 28px 32px;
  background: #fff;
  border: 1px solid rgba(44, 82, 130, 0.08);
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(19, 59, 99, 0.08);
}

.block-title {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-bottom: 12px;
  margin: 0 0 18px;
  color: var(--color-primary-dark);
  font-size: 15px;
  font-weight: 800;
  border-bottom: 2px solid var(--color-sky-soft);
}

.block-title::before {
  display: inline-block;
  width: 4px;
  height: 16px;
  content: '';
  background: var(--color-sky);
  border-radius: 2px;
}

.specialties-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.specialty-chip {
  padding: 6px 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  background: var(--color-primary);
  border-radius: 999px;
}

.treatments-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
}

.treatment-item {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #344b5d;
  font-size: 14px;
  line-height: 1.6;
}

.treatment-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  background: var(--color-sky);
  border-radius: 50%;
}

.exp-group {
  margin-bottom: 20px;
}

.exp-group:last-child {
  margin-bottom: 0;
}

.exp-group-title {
  margin: 0 0 10px;
  color: #7f9caf;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.exp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.exp-list li {
  position: relative;
  padding-left: 14px;
  color: #344b5d;
  font-size: 14px;
  line-height: 1.65;
}

.exp-list li::before {
  position: absolute;
  left: 0;
  color: var(--color-sky);
  font-size: 18px;
  line-height: 1.2;
  content: '·';
}

/* ════════════════════════
   Responsive：大 / 中 / 小尺寸
════════════════════════ */
@media (max-width: 1180px) {
  .doctors-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .detail-layout {
    grid-template-columns: 250px minmax(0, 1fr);
  }
}

@media (max-width: 960px) {
  .overview-section {
    padding-top: 44px;
  }

  .filter-shell {
    width: min(100%, 680px);
  }

  .filter-card {
    padding: 16px;
    border-radius: 20px;
  }

  .filter-desktop {
    display: none;
  }

  .filter-select-wrap {
    display: block;
  }

  .doctors-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-items: center;
  }

  /* 中小尺寸醫師卡片：圖片維持滿版，縮小的是整張卡片本身 */
  .doctor-card {
    width: min(100%, 300px);
  }

  .doctor-photo-frame {
    background: linear-gradient(180deg, #e8f2f7 0%, #d7eaf5 100%);
  }

  .card-bg-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transform: none;
  }

  .doctor-card:hover .card-bg-photo,
  .doctor-card:focus-visible .card-bg-photo {
    filter: none;
    transform: none;
  }

  .detail-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  /* 平板版詳情頁：上方變成照片 + 基本資料橫向區塊 */
  .detail-sidebar {
    position: static;
    display: grid;
    grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
    gap: 18px 24px;
    align-items: start;
    padding: 20px;
    background: #fff;
    border: 1px solid rgba(44, 82, 130, 0.08);
    border-radius: 18px;
    box-shadow: 0 12px 28px rgba(19, 59, 99, 0.08);
  }

  .sidebar-photo-wrap {
    grid-row: 1 / span 3;
  }

  .sidebar-name-block {
    padding: 0 0 16px;
    text-align: center;
  }

  .sidebar-section {
    padding: 0 0 16px;
    text-align: center;
  }

  .title-tags {
    justify-content: center;
  }

  .detail-main {
    gap: 24px;
  }

  .treatments-wrap {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .team-hero {
    min-height: 190px;
  }

  .team-hero-content {
    padding: 34px 18px;
  }

  .hero-title {
    letter-spacing: 0.05em;
  }

  .overview-section,
  .detail-section {
    padding-right: 16px;
    padding-left: 16px;
  }

  .team-intro {
    margin-bottom: 22px;
  }

  .filter-shell {
    position: static;
    top: auto;
    z-index: auto;
    width: 100%;
    margin-bottom: 28px;
  }

  .filter-card {
    padding: 14px;
    background: rgba(255, 255, 255, 0.94);
  }

  .doctors-grid {
    grid-template-columns: 1fr;
    gap: 22px;
    justify-items: center;
  }

  .doctor-card {
    width: min(100%, 320px);
  }

  .doctor-photo-frame {
    aspect-ratio: 4 / 5.25;
  }

  .doctor-info-panel {
    right: 16px;
    bottom: 18px;
    left: 16px;
  }

  .doctor-name {
    font-size: clamp(24px, 8vw, 32px);
  }

  .back-btn {
    justify-content: flex-start;
    width: fit-content;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 24px;
  }

  .detail-sidebar {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
  }

  .sidebar-photo-wrap {
    width: min(100%, 320px);
    margin: 0 auto;
  }

  .sidebar-name-block {
    width: min(100%, 320px);
    padding: 18px 0;
    margin: 0 auto;
    text-align: center;
  }

  .sidebar-name {
    font-size: 24px;
  }

  .sidebar-section {
    width: min(100%, 320px);
    padding: 16px 0;
    margin: 0 auto;
    text-align: center;
  }

  .title-tags,
  .specialties-tags {
    justify-content: center;
  }

  .detail-main {
    gap: 18px;
  }

  .detail-block {
    padding: 22px 18px;
    border-radius: 14px;
  }

  .block-title {
    font-size: 14px;
  }

  .treatment-item,
  .exp-list li {
    font-size: 14px;
  }
}

@media (max-width: 420px) {
  .overview-section,
  .detail-section {
    padding-right: 14px;
    padding-left: 14px;
  }

  .filter-card {
    padding: 12px;
  }

  .filter-select {
    padding: 10px 42px 10px 14px;
  }

  .doctor-card {
    width: min(100%, 300px);
  }

  .doctor-photo-frame {
    aspect-ratio: 4 / 5.35;
  }

  .doctor-info-panel {
    right: 14px;
    bottom: 16px;
    left: 14px;
  }

  .doctor-name {
    font-size: 24px;
  }

  .detail-block {
    padding: 20px 16px;
  }

  .specialty-chip,
  .title-tag {
    padding: 5px 10px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active,
  .card-bg-photo,
  .doctor-info-panel,
  .doctor-gradient,
  .filter-btn,
  .back-btn {
    transition-duration: 0.01ms !important;
  }
}
</style>
