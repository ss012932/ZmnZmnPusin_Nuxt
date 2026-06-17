<template>
  <div class="perm-admin">

    <!-- 頁首 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">權限管理</h2>
        <p class="page-desc">管理後台員工帳號與存取權限</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <iconify-icon icon="mdi:account-plus-outline" width="18"></iconify-icon>
        新增員工
      </button>
    </div>

    <!-- 統計卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <iconify-icon icon="mdi:account-group-outline" width="28" class="stat-icon"></iconify-icon>
        <div>
          <div class="stat-num">{{ admins.length }}</div>
          <div class="stat-label">員工總數</div>
        </div>
      </div>
      <div class="stat-card">
        <iconify-icon icon="mdi:account-check-outline" width="28" class="stat-icon active"></iconify-icon>
        <div>
          <div class="stat-num">{{ admins.filter(a => a.status === 'active').length }}</div>
          <div class="stat-label">啟用中</div>
        </div>
      </div>
      <div class="stat-card">
        <iconify-icon icon="mdi:account-off-outline" width="28" class="stat-icon inactive"></iconify-icon>
        <div>
          <div class="stat-num">{{ admins.filter(a => a.status === 'inactive').length }}</div>
          <div class="stat-label">已停用</div>
        </div>
      </div>
    </div>

    <div class="form-alert" v-if="loadError">{{ loadError }}</div>

    <!-- 篩選列 -->
    <div class="filter-bar">
      <div class="search-wrap">
        <iconify-icon icon="mdi:magnify" width="17" class="search-icon"></iconify-icon>
        <input class="search-input" type="text" v-model="searchKeyword" placeholder="搜尋姓名 / Email..." />
      </div>
      <select class="filter-select" v-model="filterStatus">
        <option value="">全部狀態</option>
        <option value="active">啟用中</option>
        <option value="inactive">已停用</option>
      </select>
    </div>

    <!-- 表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>Email</th>
            <th>權限</th>
            <th>狀態</th>
            <th>建立時間</th>
            <th>更新時間</th>
            <th style="width:220px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="empty-row">資料載入中...</td>
          </tr>
          <tr v-else-if="filteredAdmins.length === 0">
            <td colspan="7" class="empty-row">目前沒有符合條件的員工</td>
          </tr>
          <tr v-for="admin in filteredAdmins" :key="admin.id">
            <td>
              <div class="admin-name-cell">
                <div class="admin-avatar">{{ admin.name.slice(0, 1) }}</div>
                <span class="td-name">{{ admin.name }}</span>
              </div>
            </td>
            <td class="td-mono">{{ admin.email }}</td>
            <td>
              <span class="role-badge" :class="{ admin: admin.isAdmin }">
                {{ admin.isAdmin ? '管理員' : '一般員工' }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="admin.status">
                {{ admin.status === 'active' ? '啟用中' : '已停用' }}
              </span>
            </td>
            <td class="td-date">
              <div>{{ admin.createdAt }}</div>
              <div class="td-by" v-if="admin.createdBy !== '-'">{{ admin.createdBy }}</div>
            </td>
            <td class="td-date">
              <div>{{ admin.updatedAt }}</div>
              <div class="td-by" v-if="admin.updatedBy !== '-'">{{ admin.updatedBy }}</div>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-action btn-edit" @click="openEdit(admin)" title="編輯">
                  <iconify-icon icon="mdi:pencil-outline" width="14"></iconify-icon>
                  編輯
                </button>
                <button class="btn-action btn-send" @click="sendResetEmail(admin)" title="寄送重置密碼信">
                  <iconify-icon icon="mdi:email-lock-outline" width="14"></iconify-icon>
                  重置密碼
                </button>
                <button
                  class="btn-action btn-delete"
                  @click="confirmDelete(admin)"
                  title="刪除"
                >
                  <iconify-icon icon="mdi:trash-can-outline" width="14"></iconify-icon>
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ 新增/編輯 Modal ══ -->
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="modal modal-md">
        <div class="modal-header">
          <h3 class="modal-title">
            <iconify-icon :icon="isEditing ? 'mdi:account-edit-outline' : 'mdi:account-plus-outline'" width="20"></iconify-icon>
            {{ isEditing ? '編輯員工' : '新增員工' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <iconify-icon icon="mdi:close" width="20"></iconify-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid-2">

            <div class="form-group">
              <label class="form-label">姓名 <span class="required">*</span></label>
              <input class="form-input" type="text" v-model="form.name" placeholder="輸入管理員姓名" />
              <span class="form-error" v-if="formErrors.name">{{ formErrors.name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                信箱 <span class="required" v-if="!isEditing">*</span>
              </label>
              <input
                class="form-input"
                type="email"
                v-model="form.email"
                placeholder="example@clinic.com"
                :disabled="isEditing"
                :style="isEditing ? 'background:#f5f5f5; color:#999; cursor:not-allowed;' : ''"
              />
              <span class="form-hint" v-if="isEditing" style="font-size:12px;color:#aaa;margin-top:4px;display:block;">
                Email 不可修改
              </span>
              <span class="form-error" v-if="formErrors.email">{{ formErrors.email }}</span>
            </div>

            <div class="form-group fg-full">
              <label class="form-label">權限</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="form.isAdmin" :value="true" />
                  <span>管理員（可新增員工）</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="form.isAdmin" :value="false" />
                  <span>一般員工</span>
                </label>
              </div>
            </div>

            <div class="form-group fg-full">
              <label class="form-label">狀態</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="form.status" value="active" />
                  <span>啟用中</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="form.status" value="inactive" />
                  <span>停用</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="handleSave">
            <iconify-icon icon="mdi:content-save-outline" width="16"></iconify-icon>
            {{ isEditing ? '儲存變更' : '建立帳號' }}
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['backoffice-auth', 'auth'],
  requiresAdmin: true,
});
useHead({ title: '權限管理' });
</script>

<script>
import api, { authAPI, staffsAPI } from '~/composables/utils/api';
import Swal from 'sweetalert2';

export default {
  name: 'AdminPermissionsPage',

  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      loading: false,
      saving: false,
      loadError: '',
      showModal: false,
      isEditing: false,
      showPw: false,
      nextId: 3,
      formErrors: {},

      form: this.emptyForm(),

      admins: [],
    };
  },

  mounted() {
    this.loadStaffs();
  },

  computed: {
    filteredAdmins() {
      return this.admins.filter((a) => {
        const kw = this.searchKeyword.toLowerCase();
        const matchKw =
          !kw ||
          a.name.toLowerCase().includes(kw) ||
          a.email.toLowerCase().includes(kw);
        const matchStatus = !this.filterStatus || a.status === this.filterStatus;
        return matchKw && matchStatus;
      });
    },
  },

  methods: {
    async loadStaffs() {
      this.loading = true;
      this.loadError = '';

      try {
        const response = await api.get('/staffs');
        const result = response.data;

        if (!result?.success) {
          throw new Error(result?.message || '取得員工列表失敗');
        }

        this.admins = (result.data || []).map(this.normalizeStaff);
      } catch (error) {
        const responseData = error?.response?.data;
        this.loadError =
          responseData?.detail ||
          responseData?.message ||
          error?.message ||
          '取得員工列表失敗';
      } finally {
        this.loading = false;
      }
    },

    normalizeStaff(staff) {
      return {
        id: staff.id,
        name: staff.name || '',
        account: staff.email || '',
        email: staff.email || '',
        isAdmin: Boolean(staff.isAdmin),
        status: staff.isActive ? 'active' : 'inactive',
        createdAt: this.formatDate(staff.createdAt),
        updatedAt: this.formatDate(staff.updatedAt),
        lastLoginAt: this.formatDate(staff.lastLoginAt),
        createdBy: staff.createdBy || '-',
        updatedBy: staff.updatedBy || '-',
      };
    },

    formatDate(value) {
      if (!value) return '-';
      return String(value).slice(0, 10);
    },

    emptyForm() {
      return { name: '', email: '', isAdmin: false, status: 'active' };
    },

    openCreate() {
      this.isEditing = false;
      this.form = this.emptyForm();
      this.formErrors = {};
      this.showPw = false;
      this.showModal = true;
    },

    openEdit(admin) {
      this.isEditing = true;
      this._editingId = admin.id;
      this.form = {
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        status: admin.status,
      };
      this.formErrors = {};
      this.showModal = true;
    },

    closeModal() { this.showModal = false; },

    validate() {
      this.formErrors = {};
      if (!this.form.name.trim()) this.formErrors.name = '請輸入姓名';
      if (!this.isEditing) {
        if (!this.form.email.trim()) {
          this.formErrors.email = '請輸入 Email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          this.formErrors.email = 'Email 格式不正確';
        }
      }
      return Object.keys(this.formErrors).length === 0;
    },

    async handleSave() {
      if (!this.validate()) return;

      if (this.isEditing) {
        this.saving = true;
        this.closeModal();
        Swal.fire({
          title: '儲存中...',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });
        try {
          const result = await staffsAPI.update(this._editingId, {
            name:     this.form.name.trim(),
            isAdmin:  this.form.isAdmin,
            isActive: this.form.status === 'active',
          });

          if (!result?.success) throw new Error(result?.message || '更新失敗');

          await this.loadStaffs();

          Swal.fire({
            icon: 'success',
            title: '已更新',
            timer: 1800,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        } catch (err) {
          const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '更新失敗，請再試一次';
          Swal.fire({ icon: 'error', title: '更新失敗', text: msg });
        } finally {
          this.saving = false;
        }
        return;
      }

      // 新增員工
      this.saving = true;
      this.closeModal();
      Swal.fire({
        title: '建立帳號中...',
        text: '正在建立帳號並寄送重設密碼信，請稍候',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      try {
        const result = await staffsAPI.create({
          name:     this.form.name.trim(),
          email:    this.form.email.trim(),
          isAdmin:  this.form.isAdmin,
          isActive: this.form.status === 'active',
        });

        if (!result?.success) throw new Error(result?.message || '新增失敗');

        const newStaff = result.data;
        this.admins.unshift(this.normalizeStaff(newStaff));

        Swal.fire({
          icon: 'success',
          title: '帳號已建立',
          text: `員工帳號已建立，重設密碼信件已寄送至 ${newStaff.email}。`,
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '新增失敗，請再試一次';
        Swal.fire({ icon: 'error', title: '新增失敗', text: msg });
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(admin) {
      const confirm = await Swal.fire({
        title: '確認刪除員工',
        html: `確定要刪除 <strong>${admin.name}（${admin.email}）</strong> 嗎？<br>帳號將停用並無法登入。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (!confirm.isConfirmed) return;

      Swal.fire({
        title: '刪除中...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const result = await staffsAPI.remove(admin.id);
        if (!result?.success) throw new Error(result?.message || '刪除失敗');

        this.admins = this.admins.filter((a) => a.id !== admin.id);
        Swal.fire({
          icon: 'success',
          title: '已刪除',
          text: `員工「${admin.name}」已移除。`,
          timer: 1800,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '刪除失敗，請再試一次';
        Swal.fire({ icon: 'error', title: '刪除失敗', text: msg });
      }
    },

    async sendResetEmail(admin) {
      const result = await Swal.fire({
        title: '寄送重置密碼信件',
        html: `確定要寄送重置密碼連結至<br><strong>${admin.email}</strong> 嗎？`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2c5282',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認寄送',
        cancelButtonText: '取消',
      });
      if (!result.isConfirmed) return;

      Swal.fire({
        title: '寄送中...',
        text: `正在寄送重置密碼信件至 ${admin.email}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await authAPI.forgotPassword(admin.email);
        Swal.fire({
          icon: 'success',
          title: '已寄送',
          text: `重置密碼信件已送出至 ${admin.email}，請於 30 分鐘內完成重設。`,
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || '寄送失敗，請稍後再試';
        Swal.fire({ icon: 'error', title: '寄送失敗', text: msg });
      }
    },
  },
};
</script>

<style>
/* ── 統計卡片 ── */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-icon { color: #2c5282; }
.stat-icon.active { color: #38a169; }
.stat-icon.inactive { color: #aaa; }

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #1a2744;
  line-height: 1.1;
}

.stat-label {
  font-size: 13px;
  color: #aaa;
  margin-top: 2px;
}

.form-alert {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  color: #e53e3e;
  font-size: 13px;
  margin-bottom: 18px;
  padding: 10px 14px;
}

/* ── 表格 ── */
.admin-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2c5282;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.td-mono {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #555;
}

.td-date {
  font-size: 13px;
  color: #aaa;
  white-space: nowrap;
}

.td-by {
  font-size: 11px;
  color: #bbb;
  margin-top: 2px;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active { background: #e6f6ee; color: #276749; }
.status-badge.inactive { background: #f5f5f5; color: #888; }

.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background: #eef3fa;
  color: #2c5282;
}

/* ── 操作按鈕（橫向） ── */
.action-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  flex-wrap: nowrap;
}

.btn-send {
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
  background: #f0f9f0;
  color: #276749;
}

.btn-send:hover { background: #dcf0dc; }

/* ── Modal 中欄表單 ── */
.modal-md { max-width: 560px; }

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.fg-full { grid-column: 1 / -1; }

.input-with-icon {
  position: relative;
}

.input-with-icon .form-input {
  padding-right: 44px;
}

.input-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: color 0.2s;
}

.input-eye:hover { color: #2c5282; }

/* ── Radio 群組 ── */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #444;
}

.radio-label input[type="radio"] {
  accent-color: #2c5282;
  width: 15px;
  height: 15px;
}


/* ── RWD ── */
@media (max-width: 900px) {
  .stat-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
  .data-table {
    min-width: 700px;
  }
}
</style>
