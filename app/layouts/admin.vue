<template>
  <div class="admin-wrapper">
    <!-- 行動版遮罩 -->
    <div class="sidebar-overlay" v-if="mobileOpen" @click="mobileOpen = false"></div>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileOpen"
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
            管理員
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

export default {
  name: 'AdminLayout',

  data() {
    return {
      sidebarCollapsed: false,
      mobileOpen: false,
      isMobile: false,
    };
  },

  mounted() {
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
