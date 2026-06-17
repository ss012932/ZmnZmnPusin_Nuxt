<template>
  <div class="rp-page">
    <div class="rp-card">

      <!-- Logo -->
      <div class="rp-logo">
        <img src="/Mask group.png" alt="人人動物醫院" class="logo-img" />
        <h1 class="rp-title">重設密碼</h1>
        <p class="rp-subtitle">人人動物醫院埔心分院</p>
      </div>

      <!-- 驗證中 -->
      <div v-if="state === 'validating'" class="rp-state">
        <iconify-icon icon="mdi:loading" width="36" class="spin state-icon"></iconify-icon>
        <p class="state-text">驗證連結中，請稍候...</p>
      </div>

      <!-- Token 無效 / 過期 -->
      <div v-else-if="state === 'invalid'" class="rp-state">
        <iconify-icon icon="mdi:link-variant-off" width="40" class="state-icon icon-error"></iconify-icon>
        <p class="state-text">此連結已失效或過期</p>
        <p class="state-hint">請重新申請密碼重設信件</p>
        <NuxtLink to="/admin/login" class="rp-link-btn">
          <iconify-icon icon="mdi:arrow-left" width="16"></iconify-icon>
          返回登入
        </NuxtLink>
      </div>

      <!-- 重設成功 -->
      <div v-else-if="state === 'success'" class="rp-state">
        <iconify-icon icon="mdi:check-circle-outline" width="40" class="state-icon icon-success"></iconify-icon>
        <p class="state-text">密碼已成功重設！</p>
        <p class="state-hint">{{ countdown }} 秒後自動跳轉至登入頁...</p>
        <NuxtLink to="/admin/login" class="rp-link-btn">
          <iconify-icon icon="mdi:arrow-left" width="16"></iconify-icon>
          立即前往登入
        </NuxtLink>
      </div>

      <!-- 重設表單 -->
      <form v-else class="rp-form" @submit.prevent="handleSubmit">

        <div class="form-group" :class="{ error: errors.password }">
          <label class="form-label">新密碼</label>
          <div class="input-wrap">
            <input
              class="form-input"
              :type="show.password ? 'text' : 'password'"
              v-model="form.password"
              placeholder="請輸入新密碼（至少 8 碼）"
              autocomplete="new-password"
            />
            <button type="button" class="toggle-pw" @click="show.password = !show.password">
              {{ show.password ? '隱藏' : '顯示' }}
            </button>
          </div>
          <span class="form-error" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group" :class="{ error: errors.confirm }">
          <label class="form-label">確認新密碼</label>
          <div class="input-wrap">
            <input
              class="form-input"
              :type="show.confirm ? 'text' : 'password'"
              v-model="form.confirm"
              placeholder="再次輸入新密碼"
              autocomplete="new-password"
            />
            <button type="button" class="toggle-pw" @click="show.confirm = !show.confirm">
              {{ show.confirm ? '隱藏' : '顯示' }}
            </button>
          </div>
          <span class="form-error" v-if="errors.confirm">{{ errors.confirm }}</span>
        </div>

        <!-- 密碼強度 -->
        <div class="strength-bar" v-if="form.password">
          <div class="strength-track">
            <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }"></div>
          </div>
          <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
        </div>

        <div class="form-alert" v-if="apiError">{{ apiError }}</div>

        <button class="rp-btn" type="submit" :disabled="loading">
          <iconify-icon v-if="loading" icon="mdi:loading" width="17" class="spin"></iconify-icon>
          <iconify-icon v-else icon="mdi:lock-reset" width="17"></iconify-icon>
          {{ loading ? '處理中...' : '確認重設密碼' }}
        </button>

        <NuxtLink to="/admin/login" class="back-link">
          <iconify-icon icon="mdi:arrow-left" width="14"></iconify-icon>
          返回登入
        </NuxtLink>

      </form>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });
</script>

<script>
import { authAPI } from '~/composables/utils/api';

export default {
  name: 'AdminResetPasswordPage',

  data() {
    return {
      state: 'validating',   // validating | invalid | form | success
      token: '',
      loading: false,
      apiError: '',
      countdown: 5,
      _countdownTimer: null,

      form: {
        password: '',
        confirm:  '',
      },
      errors: {},
      show: {
        password: false,
        confirm:  false,
      },
    };
  },

  computed: {
    /* 密碼強度 0–100 */
    strengthScore() {
      const pw = this.form.password;
      if (!pw) return 0;
      let score = 0;
      if (pw.length >= 8)  score += 25;
      if (pw.length >= 12) score += 15;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
      if (/\d/.test(pw))   score += 20;
      if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
      return Math.min(score, 100);
    },

    strengthPct()   { return this.strengthScore; },

    strengthClass() {
      const s = this.strengthScore;
      if (s < 40)  return 'weak';
      if (s < 70)  return 'medium';
      return 'strong';
    },

    strengthLabel() {
      const s = this.strengthScore;
      if (s < 40)  return '強度：弱';
      if (s < 70)  return '強度：中';
      return '強度：強';
    },
  },

  async mounted() {
    // 從 URL query 取得 token
    this.token = this.$route.query.token || '';

    if (!this.token) {
      this.state = 'invalid';
      return;
    }

    try {
      await authAPI.validateResetToken(this.token);
      this.state = 'form';
    } catch {
      this.state = 'invalid';
    }
  },

  beforeUnmount() {
    if (this._countdownTimer) clearInterval(this._countdownTimer);
  },

  methods: {
    validate() {
      this.errors = {};

      if (!this.form.password) {
        this.errors.password = '請輸入新密碼';
      } else if (this.form.password.length < 8) {
        this.errors.password = '密碼至少需要 8 個字元';
      }

      if (!this.form.confirm) {
        this.errors.confirm = '請再次輸入密碼';
      } else if (this.form.password !== this.form.confirm) {
        this.errors.confirm = '兩次輸入的密碼不一致';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.apiError = '';
      if (!this.validate()) return;

      this.loading = true;
      try {
        await authAPI.resetPassword(this.token, this.form.password);
        this.state = 'success';
        this.startCountdown();
      } catch (err) {
        this.apiError =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          '重設失敗，連結可能已過期，請重新申請';
      } finally {
        this.loading = false;
      }
    },

    startCountdown() {
      this.countdown = 5;
      this._countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this._countdownTimer);
          this.$router.push('/admin/login');
        }
      }, 1000);
    },
  },
};
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rp-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2744 0%, #2c5282 100%);
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
  padding: 20px;
}

.rp-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

/* ── Logo ── */
.rp-logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 12px;
  margin: 0 auto 16px;
  display: block;
}

.rp-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2744;
  margin-bottom: 4px;
}

.rp-subtitle {
  font-size: 13px;
  color: #aaa;
}

/* ── 狀態頁（驗證中 / 無效 / 成功） ── */
.rp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0 4px;
  text-align: center;
}

.state-icon   { color: #aaa; }
.icon-error   { color: #e53e3e; }
.icon-success { color: #38a169; }

.state-text {
  font-size: 15px;
  font-weight: 600;
  color: #1a2744;
  margin-top: 4px;
}

.state-hint {
  font-size: 13px;
  color: #888;
}

.rp-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 10px 20px;
  background: #2c5282;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.rp-link-btn:hover { background: #1a3a5c; }

/* ── 表單 ── */
.rp-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.input-wrap {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  padding-right: 56px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #2b2b2b;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus { border-color: #2c5282; }

.form-group.error .form-input { border-color: #e53e3e; }

.form-error {
  font-size: 12px;
  color: #e53e3e;
}

.toggle-pw {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  font-family: inherit;
}

/* ── 密碼強度 ── */
.strength-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -8px;
}

.strength-track {
  flex: 1;
  height: 4px;
  background: #eee;
  border-radius: 99px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s, background 0.3s;
}

.strength-fill.weak   { background: #e53e3e; }
.strength-fill.medium { background: #dd6b20; }
.strength-fill.strong { background: #38a169; }

.strength-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.strength-label.weak   { color: #e53e3e; }
.strength-label.medium { color: #dd6b20; }
.strength-label.strong { color: #38a169; }

/* ── Alert ── */
.form-alert {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #e53e3e;
  text-align: center;
}

/* ── 按鈕 ── */
.rp-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #2c5282;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.rp-btn:hover:not(:disabled) { background: #1a3a5c; }
.rp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: #2c5282; }

/* ── Spin ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
</style>
