<template>
  <div class="error-page">

    <!-- 背景裝飾泡泡 -->
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>

    <div class="error-container">

      <!-- 貓咪圖片 + 問號裝飾 -->
      <div class="illustration-wrap">
        <span class="q-mark q-mark-right" aria-hidden="true">?</span>
        <img src="@/assets/image/cat.png" alt="迷路的貓咪醫師" class="cat-img" />
      </div>

      <!-- 404 數字 -->
      <div class="error-code">
        <span class="code-4">4</span>
        <span class="code-paw">
          <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <!-- 主掌墊 -->
            <ellipse cx="45" cy="64" rx="24" ry="19" fill="#5aa0c8" />
            <!-- 趾墊（四個，扇形展開，互不黏連） -->
            <ellipse cx="12" cy="42" rx="9" ry="12" fill="#5aa0c8" transform="rotate(-22,12,42)" />
            <ellipse cx="31" cy="26" rx="9" ry="12" fill="#5aa0c8" transform="rotate(-7,31,26)" />
            <ellipse cx="59" cy="26" rx="9" ry="12" fill="#5aa0c8" transform="rotate(7,59,26)" />
            <ellipse cx="78" cy="42" rx="9" ry="12" fill="#5aa0c8" transform="rotate(22,78,42)" />
          </svg>
        </span>
        <span class="code-4">4</span>
      </div>

      <!-- 標題 -->
      <h1 class="error-title">這個頁面去散步了…</h1>

      <!-- 說明文字 -->
      <p class="error-desc">
        很抱歉，您找尋的頁面不存在或已被移除。<br class="br-md" />
      </p>

      <!-- 按鈕組 -->
      <div class="error-actions">
        <a href="/" class="btn-home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" />
          </svg>
          回到首頁
        </a>
       
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',

  props: {
    error: {
      type: Object,
      default: null,
    },
  },

  methods: {
    goHome() {
      clearError({ redirect: '/' });
    },
  },
};
</script>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── 全頁底色 ── */
.error-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  min-height: 100vh;
  padding: clamp(32px, 8vw, 80px) clamp(16px, 5vw, 48px);
  overflow: hidden;
  background: #fffaf0;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}

/* ── 背景裝飾泡泡 ── */
.bubble {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.bubble-1 {
  width: clamp(180px, 35vw, 420px);
  height: clamp(180px, 35vw, 420px);
  top: -80px;
  left: -80px;
  background: radial-gradient(circle at 40% 40%, #d1e8f4, transparent 70%);
  opacity: 0.6;
}

.bubble-2 {
  width: clamp(140px, 28vw, 340px);
  height: clamp(140px, 28vw, 340px);
  bottom: -60px;
  right: -60px;
  background: radial-gradient(circle at 60% 60%, #fde9a0, transparent 70%);
  opacity: 0.5;
}

.bubble-3 {
  width: clamp(80px, 14vw, 180px);
  height: clamp(80px, 14vw, 180px);
  top: 30%;
  right: 8%;
  background: radial-gradient(circle, #c8e6f5, transparent 70%);
  opacity: 0.4;
}

/* ── 內容容器 ── */
.error-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: min(100%, 640px);
}

/* ── 插圖 ── */
.illustration-wrap {
  position: relative;
  width: min(100%, clamp(200px, 50vw, 300px));
  margin-bottom: clamp(16px, 3vw, 28px);
  animation: float 4s ease-in-out infinite;
}

.cat-img {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 12px 24px rgba(19, 59, 99, 0.18));
  margin-left: -8%;
}

/* 問號裝飾 */
.q-mark {
  position: absolute;
  font-weight: 900;
  color: #5aa0c8;
  line-height: 1;
  font-family: 'Microsoft JhengHei', sans-serif;
  pointer-events: none;
  user-select: none;
}

.q-mark-right {
  top: 2%;
  right: 8%;
  font-size: clamp(36px, 8vw, 52px);
  opacity: 0.88;
  animation: q-bob 2.8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

@keyframes q-bob {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%       { transform: translateY(-8px) rotate(4deg); }
}

/* ── 404 數字 ── */
.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1.5vw, 10px);
  margin-bottom: clamp(12px, 2.5vw, 20px);
  line-height: 1;
}

.code-4 {
  font-size: clamp(72px, 16vw, 130px);
  font-weight: 900;
  color: #133b63;
  letter-spacing: -0.02em;
  line-height: 1;
}

.code-paw {
  display: flex;
  align-items: center;
  width: clamp(56px, 12vw, 100px);
  height: clamp(56px, 12vw, 100px);
  animation: wiggle 2.4s ease-in-out infinite;
}

.code-paw svg {
  width: 100%;
  height: 100%;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50%       { transform: rotate(8deg); }
}

/* ── 標題 ── */
.error-title {
  font-size: clamp(20px, 4.5vw, 32px);
  font-weight: 800;
  color: #133b63;
  margin-bottom: clamp(10px, 2vw, 16px);
  line-height: 1.3;
}

/* ── 說明文字 ── */
.error-desc {
  font-size: clamp(14px, 2.2vw, 17px);
  color: #4a6680;
  line-height: 1.8;
  margin-bottom: clamp(24px, 5vw, 40px);
}

.br-md { display: none; }

@media (min-width: 480px) {
  .br-md { display: inline; }
}

/* ── 按鈕組 ── */
.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(10px, 2vw, 16px);
  justify-content: center;
  margin-bottom: clamp(24px, 5vw, 40px);
}

.btn-home,
.btn-contact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: clamp(11px, 1.5vw, 14px) clamp(22px, 3vw, 32px);
  border-radius: 999px;
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  white-space: nowrap;
}

.btn-home {
  background: #133b63;
  color: #fff;
  box-shadow: 0 4px 16px rgba(19, 59, 99, 0.28);
}

.btn-home:hover {
  background: #1a4e82;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(19, 59, 99, 0.36);
}

.btn-contact {
  background: #fff;
  color: #133b63;
  border: 2px solid #5aa0c8;
}

.btn-contact:hover {
  background: #eef6fc;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(90, 160, 200, 0.2);
}

/* ── 底部提示 ── */
.error-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: clamp(12px, 1.4vw, 14px);
  color: #9ab4c8;
}

.paw-icon {
  font-size: 14px;
}

/* ── RWD ── */
@media (max-width: 359px) {
  .error-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-home,
  .btn-contact {
    justify-content: center;
  }
}
</style>
