<template>
  <aside class="sidebar" :class="{ collapsed: collapsed, 'mobile-open': mobileOpen }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-mark">人人</div>
      <span class="logo-text" v-show="!collapsed">後台管理</span>
      <!-- 行動版關閉按鈕 -->
      <button class="mobile-close-btn" v-if="mobileOpen" @click="$emit('close')">
        <iconify-icon icon="mdi:close" width="20"></iconify-icon>
      </button>
    </div>

    <!-- 選單 -->
    <nav class="sidebar-nav">
      <ul class="nav-list">

        <li class="nav-item">
          <NuxtLink to="/admin/doctors" class="nav-link" active-class="active">
            <iconify-icon icon="healthicons:doctor" width="20" class="nav-icon"></iconify-icon>
            <span class="nav-label" v-show="!collapsed">醫師管理</span>
          </NuxtLink>
        </li>

        <li class="nav-item">
          <NuxtLink to="/admin/articles" class="nav-link" active-class="active">
            <iconify-icon icon="mdi:file-document-outline" width="20" class="nav-icon"></iconify-icon>
            <span class="nav-label" v-show="!collapsed">文章管理</span>
          </NuxtLink>
        </li>

        <li class="nav-item">
          <NuxtLink to="/admin/categories" class="nav-link" active-class="active">
            <iconify-icon icon="mdi:tag-multiple-outline" width="20" class="nav-icon"></iconify-icon>
            <span class="nav-label" v-show="!collapsed">類別管理</span>
          </NuxtLink>
        </li>

        <li class="nav-item" v-if="user?.isAdmin">
          <NuxtLink to="/admin/permissions" class="nav-link" active-class="active">
            <iconify-icon icon="mdi:shield-account-outline" width="20" class="nav-icon"></iconify-icon>
            <span class="nav-label" v-show="!collapsed">權限管理</span>
          </NuxtLink>
        </li>

      </ul>
    </nav>

    <!-- 底部收合按鈕（桌面版） -->
    <div class="sidebar-footer" v-if="!mobileOpen">
      <button class="collapse-btn" @click="$emit('toggle')">
        <iconify-icon
          :icon="collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'"
          width="18"
          class="collapse-icon"
        ></iconify-icon>
        <span class="collapse-text" v-show="!collapsed">收合選單</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',

  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    mobileOpen: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
  },

  emits: ['toggle', 'close'],
};
</script>

<style>
/* ── Sidebar ── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: #1a2744;
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: width 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
  min-height: 60px;
}

.logo-mark {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: #2c5282;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
}

.mobile-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  margin-left: auto;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-list {
  list-style: none;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.60);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-link.active {
  background: #2c5282;
  color: #fff;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.nav-label {
  font-size: 14px;
  overflow: hidden;
}

/* ── Footer ── */
.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
}

.collapse-text {
  font-size: 13px;
}

/* ── RWD：行動版 ── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 240px !important;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-footer {
    display: none;
  }
}
</style>
