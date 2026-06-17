<template>
  <div class="admin-wrapper">
    <!-- 行動版遮罩 -->
    <div class="sidebar-overlay" v-if="mobileOpen" @click="mobileOpen = false"></div>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileOpen"
      :user="user"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @close="mobileOpen = false"
    />

    <div class="admin-body" :class="{ collapsed: sidebarCollapsed }">
      <header class="admin-topbar">
        <button class="topbar-toggle" @click="handleMenuToggle" aria-label="開關選單">
          <iconify-icon icon="mdi:menu" width="22"></iconify-icon>
        </button>
        <div class="topbar-right">
          <span class="topbar-admin">
            <iconify-icon icon="mdi:account-circle" width="18"></iconify-icon>
            {{ user?.name || '後台使用者' }}
          </span>
          <button class="topbar-logout" @click="handleLogout">
            <iconify-icon icon="mdi:logout" width="16"></iconify-icon>
            登出
          </button>
        </div>
      </header>

      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { authAPI } from '~/composables/utils/api';

export default {
  name: 'AdminLayout',

  data() {
    return {
      sidebarCollapsed: false,
      mobileOpen: false,
      isMobile: false,
      user: null,
    };
  },

  async mounted() {
    const auth = useBackofficeAuth();
    const result = await auth.check();
    this.user = result.user;

    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
      if (this.isMobile) {
        this.sidebarCollapsed = false;
        this.mobileOpen = false;
      }
    },

    handleMenuToggle() {
      if (this.isMobile) {
        this.mobileOpen = !this.mobileOpen;
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed;
      }
    },

    async handleLogout() {
      const result = await Swal.fire({
        title: '確認登出',
        text: '確定要登出後台管理系統嗎？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2c5282',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認登出',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        const auth = useBackofficeAuth();
        await authAPI.logout();
        auth.clear();
        navigateTo('/admin/login');
      }
    },
  },
};
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
  background: #f0f2f5;
  color: #2b2b2b;
}

.admin-wrapper {
  display: flex;
  min-height: 100vh;
}

/* ── 行動版遮罩 ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 190;
}

/* ── 主體區 ── */
.admin-body {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  min-width: 0;
}

.admin-body.collapsed {
  margin-left: 64px;
}

/* ── 頂部欄 ── */
.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.topbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
}

.topbar-toggle:hover {
  background: #f0f2f5;
  color: #2c5282;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-admin {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
}

.topbar-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: none;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.topbar-logout:hover {
  border-color: #e53e3e;
  color: #e53e3e;
  background: #fff5f5;
}

/* ── 主內容 ── */
.admin-main {
  flex: 1;
  padding: 28px 32px;
}

/* ── Admin page shared UI ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2744;
  margin-bottom: 4px;
}

.page-desc {
  font-size: 13px;
  color: #aaa;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
}

.btn-primary {
  background: #2c5282;
  color: #fff;
}

.btn-primary:hover {
  background: #1a3a5c;
}

.btn-ghost {
  background: #f5f5f5;
  color: #555;
  border: 1.5px solid #e0e0e0;
}

.btn-ghost:hover {
  background: #ebebeb;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
}

.search-input {
  width: 100%;
  max-width: 360px;
  padding: 9px 14px 9px 34px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2c5282;
}

.filter-select {
  padding: 9px 14px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: #fff;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #2c5282;
}

.table-wrap {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 700px;
}

.data-table thead {
  background: #f8f9fb;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  letter-spacing: .06em;
  text-transform: uppercase;
  border-bottom: 1px solid #eee;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
  color: #333;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover td {
  background: #fafafa;
}

.td-name {
  font-weight: 600;
  color: #1a2744;
}

.td-date {
  color: #999;
  font-size: 13px;
}

.td-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
}

.action-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-edit {
  background: #eef3fa;
  color: #2c5282;
}

.btn-edit:hover {
  background: #dce8f7;
}

.btn-delete {
  background: #fff5f5;
  color: #e53e3e;
}

.btn-delete:hover {
  background: #fed7d7;
}

.btn-delete:disabled,
.btn-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #bbb;
  font-size: 14px;
}

.status-badge,
.cat-badge,
.dept-badge,
.section-count-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.published,
.status-badge.active {
  background: #e8f8ee;
  color: #22804b;
}

.status-badge.draft,
.status-badge.inactive {
  background: #f5f5f5;
  color: #777;
}

.cat-badge.parent,
.dept-badge {
  background: #eef3fa;
  color: #2c5282;
}

.cat-badge.sub,
.section-count-badge {
  background: #e8f8ee;
  color: #22804b;
}

.no-sub {
  color: #aaa;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.46);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
}

.modal-sm { max-width: 420px; }
.modal-md { max-width: 640px; }
.modal-wide { max-width: 1200px; width: 96vw; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 14px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: #1a2744;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #555;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #2c5282;
}

.form-textarea {
  resize: vertical;
  min-height: 84px;
}

.form-error,
.required {
  color: #e53e3e;
}

.form-error {
  font-size: 12px;
}

/* ── RWD ── */
@media (max-width: 1024px) {
  .admin-main {
    padding: 20px 20px;
  }
}

@media (max-width: 768px) {
  .admin-body {
    margin-left: 0 !important;
  }
  .admin-main {
    padding: 16px 14px;
  }
  .topbar-admin {
    display: none;
  }
}
</style>
