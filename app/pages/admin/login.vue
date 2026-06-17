<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <img src="/Mask group.png" alt="人人動物醫院" class="logo-img" />
        <h1 class="login-title">後台管理系統</h1>
        <p class="login-subtitle">人人動物醫院埔心分院</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group" :class="{ error: errors.account }">
          <label class="form-label">信箱</label>
          <input
            class="form-input"
            type="text"
            v-model="form.account"
            placeholder="請輸入信箱"
            autocomplete="username"
          />
          <span class="form-error" v-if="errors.account">{{ errors.account }}</span>
        </div>

        <div class="form-group" :class="{ error: errors.password }">
          <label class="form-label">密碼</label>
          <div class="input-wrap">
            <input
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="請輸入密碼"
              autocomplete="current-password"
            />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
              {{ showPassword ? '隱藏' : '顯示' }}
            </button>
          </div>
          <span class="form-error" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-alert" v-if="loginError">{{ loginError }}</div>

        <button class="login-btn" type="submit" :disabled="loading">
          <span v-if="loading">登入中...</span>
          <span v-else>登入</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });
</script>

<script>
import api from '~/composables/utils/api';

export default {
  name: 'AdminLoginPage',

  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      errors: {},
      loginError: '',
      loading: false,
      showPassword: false,
    };
  },

  methods: {
    validate() {
      this.errors = {};
      if (!this.form.account.trim()) {
        this.errors.account = '請輸入帳號';
      }
      if (!this.form.password.trim()) {
        this.errors.password = '請輸入密碼';
      }
      return Object.keys(this.errors).length === 0;
    },

    async handleLogin() {
      this.loginError = '';
      if (!this.validate()) return;

      this.loading = true;

      try {
        await api.post('/staffs/login', {
          email: this.form.account,
          password: this.form.password,
        });

        const auth = useBackofficeAuth();
        await auth.check(true);

        await navigateTo(this.$route.query.redirect || '/admin/doctors');
      } catch (error) {
        const responseData = error?.response?.data;
        this.loginError =
          responseData?.detail ||
          responseData?.message ||
          '帳號或密碼錯誤，請重新輸入';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2744 0%, #2c5282 100%);
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

/* ── Logo ── */
.login-logo {
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

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2744;
  margin-bottom: 4px;
}

.login-subtitle {
  font-size: 13px;
  color: #aaa;
}

/* ── Form ── */
.login-form {
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

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #2b2b2b;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2c5282;
}

.form-group.error .form-input {
  border-color: #e53e3e;
}

.form-error {
  font-size: 12px;
  color: #e53e3e;
}

.input-wrap {
  position: relative;
}

.input-wrap .form-input {
  padding-right: 56px;
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

.form-alert {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #e53e3e;
  text-align: center;
}

.login-btn {
  width: 100%;
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

.login-btn:hover:not(:disabled) {
  background: #1a3a5c;
}

.login-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
