<template>
  <div class="doctors-page">

    <!-- ════ 總覽頁 ════ -->
    <transition name="page-fade">
      <div v-if="!selectedDoctor" class="overview-section">

        <header class="page-header">
          <div class="header-eyebrow">醫療團隊</div>
          <h1 class="page-title">認識我們的醫師</h1>
          <p class="page-subtitle">每一位醫師都承載著對醫療的熱忱與對病患的承諾</p>
        </header>

        <div class="filter-bar">
          <button
            v-for="dept in departments"
            :key="dept.key"
            class="filter-btn"
            :class="{ active: activeFilter === dept.key }"
            @click="activeFilter = dept.key"
          >
            {{ dept.label }}
          </button>
        </div>

        <div class="doctors-grid">
          <div
            v-for="doctor in filteredDoctors"
            :key="doctor.id"
            class="doctor-card"
            @click="openDoctor(doctor)"
          >
            <img :src="doctor.photo" :alt="doctor.name" class="card-bg-photo" />
            <span class="card-dept-badge">{{ doctor.department }}</span>
            <div class="card-overlay">
              <div class="card-overlay-info">
                <p class="overlay-name">{{ doctor.name }}</p>
                <p class="overlay-role">{{ doctor.titleTags.join('／') }}</p>
                <div class="overlay-specialties">
                  <span
                    v-for="(spec, idx) in doctor.specialties.slice(0, 3)"
                    :key="idx"
                    class="overlay-chip"
                  >{{ spec }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </transition>

    <!-- ════ 詳情頁 ════ -->
    <transition name="page-fade">
      <div v-if="selectedDoctor" class="detail-section">

        <button class="back-btn" @click="closeDoctor">← 返回醫師列表</button>

        <div class="detail-layout">

          <!-- ── 左側：照片 + 職稱 ── -->
          <aside class="detail-sidebar">
            <div class="sidebar-photo-wrap">
              <img
                :src="selectedDoctor.photo"
                :alt="selectedDoctor.name"
                class="sidebar-photo"
              />
            </div>

            <!-- 1. 醫師姓名 -->
            <div class="sidebar-name-block">
              <h1 class="sidebar-name">{{ selectedDoctor.name }}</h1>
              <p class="sidebar-dept">{{ selectedDoctor.department }}</p>
            </div>

            <!-- 3. 醫師職稱 -->
            <div class="sidebar-section">
              <h4 class="sidebar-section-title">職稱</h4>
              <div class="title-tags">
                <span
                  v-for="(tag, idx) in selectedDoctor.titleTags"
                  :key="idx"
                  class="title-tag"
                >{{ tag }}</span>
              </div>
            </div>

          </aside>

          <!-- ── 右側：詳細資料 ── -->
          <main class="detail-main">

            <!-- 4. 專業領域 -->
            <section class="detail-block">
              <h3 class="block-title">專業領域</h3>
              <div class="specialties-tags">
                <span
                  v-for="(spec, idx) in selectedDoctor.specialties"
                  :key="idx"
                  class="specialty-chip"
                >{{ spec }}</span>
              </div>
            </section>

            <!-- 5. 擅長診療項目 -->
            <section class="detail-block">
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

            <!-- 6. 就學／就職經歷 -->
            <section class="detail-block">
              <h3 class="block-title">就學／就職經歷</h3>

              <div class="exp-group">
                <h4 class="exp-group-title">學歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.education" :key="idx">{{ item }}</li>
                </ul>
              </div>

              <div class="exp-group">
                <h4 class="exp-group-title">就職經歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.workExperience" :key="idx">{{ item }}</li>
                </ul>
              </div>

              <div v-if="selectedDoctor.otherExperience && selectedDoctor.otherExperience.length" class="exp-group">
                <h4 class="exp-group-title">其他經歷</h4>
                <ul class="exp-list">
                  <li v-for="(item, idx) in selectedDoctor.otherExperience" :key="idx">{{ item }}</li>
                </ul>
              </div>
            </section>

            <!-- 7. 證照與資格 -->
            <section class="detail-block">
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

export default {
  name: 'DoctorsPage',

  setup() {
    useSeoMeta({
      title:            '醫療團隊｜人人動物醫院埔心分院',
      description:      '認識人人動物醫院埔心分院的專業獸醫師團隊，涵蓋犬貓內科、外科手術、心臟科、齒科、眼科、骨科、神經內科、腫瘤科、雷射治療與再生醫療等各科別。',
      ogTitle:          '醫療團隊｜人人動物醫院埔心分院',
      ogDescription:    '人人動物醫院埔心分院醫師團隊，專業分工涵蓋內外科、齒科、心臟科、骨科、雷射治療與再生醫療。',
      ogType:           'website',
      ogUrl:            'https://www.zmnzmnpusin.com.tw/doctor',
      ogImage:          'https://www.zmnzmnpusin.com.tw/og-image.jpg',
      twitterCard:      'summary_large_image',
      twitterTitle:     '醫療團隊｜人人動物醫院埔心分院',
      twitterDescription: '人人動物醫院埔心分院專業獸醫師團隊介紹。',
    })
    useHead({
      link: [{ rel: 'canonical', href: 'https://www.zmnzmnpusin.com.tw/doctor' }],
    })
  },

  data() {
    return {
      selectedDoctor: null,
      activeFilter: 'all',
      isFetching: false,
      doctors: [],
    };
  },

  computed: {
    // 從 API 資料動態產生科別清單，與後台對齊
    departments() {
      const unique = [...new Set(this.doctors.map((d) => d.department).filter(Boolean))];
      return [
        { key: 'all', label: '全部科別' },
        ...unique.map((dept) => ({ key: dept, label: dept })),
      ];
    },
    filteredDoctors() {
      if (this.activeFilter === 'all') return this.doctors;
      return this.doctors.filter((d) => d.department === this.activeFilter);
    },
  },

  async mounted() {
    await this.fetchDoctors();
  },

  methods: {
    async fetchDoctors() {
      this.isFetching = true;
      try {
        const list = await publicAPI.getDoctors();
        this.doctors = list.map((d) => this.mapDoctor(d));
      } catch (e) {
        console.error('載入醫師資料失敗', e);
      } finally {
        this.isFetching = false;
      }
    },

    mapDoctor(d) {
      const splitLines = (str) => str ? str.split('\n').map((s) => s.trim()).filter(Boolean) : [];
      return {
        id:              d.id,
        name:            d.name,
        photo:           d.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
        department:      d.department || '',
        sortOrder:       d.sortOrder ?? 0,
        titleTags:       splitLines(d.titles),
        specialties:     splitLines(d.specialties),
        treatments:      splitLines(d.treatmentItems),
        education:       splitLines(d.education),
        workExperience:  splitLines(d.experience),
        otherExperience: splitLines(d.otherExperience),
        certifications:  splitLines(d.licenses),
      };
    },

    openDoctor(doctor) {
      this.selectedDoctor = doctor;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    closeDoctor() {
      this.selectedDoctor = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>

<style>
/* ─── Reset & Base ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.doctors-page {
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
  background: #fffaf0;
  min-height: 100vh;
  color: #2b2b2b;
}

/* ─── Transitions ─── */
.page-fade-enter-active,
.page-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-fade-enter-from   { opacity: 0; transform: translateY(14px); }
.page-fade-leave-to     { opacity: 0; transform: translateY(-8px); }

/* ════════════════════════
   總覽頁
════════════════════════ */
.overview-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 32px 96px;
}

.page-header { text-align: center; margin-bottom: 48px; }

.header-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #2c5282;
  margin-bottom: 12px;
}

.page-title {
  font-family: 'Noto Serif TC', serif;
  font-size: 36px;
  font-weight: 700;
  color: #2b2b2b;
  margin-bottom: 14px;
}

.page-subtitle {
  font-size: 15px;
  color: #999;
  line-height: 1.8;
  max-width: 440px;
  margin: 0 auto;
}

/* Filter */
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 48px;
}

.filter-btn {
  padding: 7px 20px;
  border: 1.5px solid #ddd;
  border-radius: 999px;
  background: transparent;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.filter-btn:hover { border-color: #2c5282; color: #2c5282; }
.filter-btn.active { background: #2c5282; border-color: #2c5282; color: #fff; }

/* ─── Grid 卡片 ─── */
.doctors-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.doctor-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  cursor: pointer;
  background: #ddd;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.18);
}

.card-bg-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.4s ease;
}

.doctor-card:hover .card-bg-photo { transform: scale(1.04); }

.card-dept-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255,255,255,0.88);
  color: #2b2b2b;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  z-index: 1;
  background: linear-gradient(to bottom, transparent 55%, rgba(10,20,10,0.72) 100%);
  transition: background 0.35s ease;
}

.doctor-card:hover .card-overlay {
  background: linear-gradient(to bottom, transparent 20%, rgba(10,20,10,0.55) 50%, rgba(10,20,10,0.92) 100%);
}

.card-overlay-info {
  width: 100%;
  padding: 20px 20px 22px;
  color: #fff;
  transform: translateY(calc(100% - 62px));
  transition: transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.doctor-card:hover .card-overlay-info { transform: translateY(0); }

.overlay-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.overlay-role {
  font-size: 13px;
  color: rgba(255,255,255,0.70);
  margin-bottom: 10px;
  opacity: 0;
  transition: opacity 0.25s ease 0.12s;
}

.overlay-philosophy {
  font-size: 13px;
  color: rgba(255,255,255,0.82);
  line-height: 1.65;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.25s ease 0.16s;
}

.overlay-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.25s ease 0.20s;
}

.doctor-card:hover .overlay-role,
.doctor-card:hover .overlay-philosophy,
.doctor-card:hover .overlay-specialties { opacity: 1; }

.overlay-chip {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.30);
  color: rgba(255,255,255,0.90);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
}

/* ════════════════════════
   詳情頁
════════════════════════ */
.detail-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 32px 96px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1.5px solid #ddd;
  color: #888;
  font-size: 14px;
  font-family: inherit;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 40px;
  transition: all 0.2s;
}

.back-btn:hover { background: #f5f0eb; border-color: #2c5282; color: #2c5282; }

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: start;
}

/* ── 左側 Sidebar ── */
.detail-sidebar {
  position: sticky;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 2. 醫師照片 */
.sidebar-photo-wrap {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.10);
}

.sidebar-photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: top;
  display: block;
}

/* 1. 醫師姓名 */
.sidebar-name-block {
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebebeb;
}

.sidebar-name {
  font-size: 26px;
  font-weight: 700;
  color: #2c5282;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.sidebar-dept {
  font-size: 13px;
  color: #aaa;
  margin-top: 5px;
}

/* sidebar 各區塊 */
.sidebar-section {
  padding: 18px 0;
  border-bottom: 1px solid #ebebeb;
}

.sidebar-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 10px;
}

/* 3. 職稱 tags */
.title-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.title-tag {
  background: #2c5282;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}

/* 7. 證照與資格 */
.sidebar-cert-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-cert-list li {
  font-size: 13px;
  color: #555;
  line-height: 1.55;
  padding-left: 14px;
  position: relative;
}

.sidebar-cert-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #2c5282;
  font-size: 11px;
  top: 2px;
}

/* ── 右側主內容 ── */
.detail-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 4px;
}

/* 共用區塊 */
.detail-block {
  background: #fff;
  border-radius: 18px;
  padding: 28px 32px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.05);
}

.block-title {
  font-size: 15px;
  font-weight: 700;
  color: #2b2b2b;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0ebe5;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.block-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #2c5282;
  border-radius: 2px;
}

/* 4. 專業領域 chips */
.specialties-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.specialty-chip {
  background: #2c5282;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 999px;
  transition: background 0.2s, color 0.2s;
}

.specialty-chip:hover {
  background: #2c5282;
  color: #fff;
}

/* 5. 擅長診療項目 */
.treatments-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
}

.treatment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}

.treatment-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2c5282;
}

/* 6. 就學／就職經歷 */
.exp-group {
  margin-bottom: 20px;
}

.exp-group:last-child { margin-bottom: 0; }

.exp-group-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 10px;
}

.exp-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-list li {
  font-size: 14px;
  color: #444;
  line-height: 1.65;
  padding-left: 14px;
  position: relative;
}

.exp-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: #2c5282;
  font-size: 18px;
  line-height: 1.2;
}

/* ════════════════════════
   Responsive
════════════════════════ */
@media (max-width: 1024px) {
  .doctors-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .detail-sidebar {
    position: static;
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 0 24px;
  }
  .sidebar-photo-wrap { grid-row: 1 / 5; }
  .treatments-wrap { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .overview-section,
  .detail-section { padding: 32px 16px 60px; }
  .doctors-grid { grid-template-columns: 1fr; gap: 16px; }
  .doctor-card { aspect-ratio: 4 / 5; }
  .page-title { font-size: 26px; }
  .detail-sidebar {
    display: flex;
    flex-direction: column;
  }
  .detail-block { padding: 22px 18px; }
  .treatments-wrap { grid-template-columns: 1fr; }
}
</style>