<template>
  <div class="perm-admin">

    <!-- 頁首 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">權限管理</h2>
        <p class="page-desc">管理後台管理員帳號與存取權限</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <iconify-icon icon="mdi:account-plus-outline" width="18"></iconify-icon>
        新增管理員
      </button>
    </div>

    <!-- 統計卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <iconify-icon icon="mdi:account-group-outline" width="28" class="stat-icon"></iconify-icon>
        <div>
          <div class="stat-num">{{ admins.length }}</div>
          <div class="stat-label">管理員總數</div>
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

    <!-- 篩選列 -->
    <div class="filter-bar">
      <div class="search-wrap">
        <iconify-icon icon="mdi:magnify" width="17" class="search-icon"></iconify-icon>
        <input class="search-input" type="text" v-model="searchKeyword" placeholder="搜尋姓名 / 帳號 / Email..." />
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
            <th>帳號</th>
            <th>Email</th>
            <th>狀態</th>
            <th>建立時間</th>
            <th style="width:220px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredAdmins.length === 0">
            <td colspan="6" class="empty-row">目前沒有符合條件的管理員</td>
          </tr>
          <tr v-for="admin in filteredAdmins" :key="admin.id">
            <td>
              <div class="admin-name-cell">
                <div class="admin-avatar">{{ admin.name.slice(0, 1) }}</div>
                <span class="td-name">{{ admin.name }}</span>
              </div>
            </td>
            <td class="td-mono">{{ admin.account }}</td>
            <td class="td-mono">{{ admin.email }}</td>
            <td>
              <span class="status-badge" :class="admin.status">
                {{ admin.status === 'active' ? '啟用中' : '已停用' }}
              </span>
            </td>
            <td class="td-date">{{ admin.createdAt }}</td>
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
                  :disabled="admin.account === 'admin'"
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
            {{ isEditing ? '編輯管理員' : '新增管理員' }}
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
              <label class="form-label">帳號 <span class="required">*</span></label>
              <input class="form-input" type="text" v-model="form.account" placeholder="輸入登入帳號" :disabled="isEditing" />
              <span class="form-error" v-if="formErrors.account">{{ formErrors.account }}</span>
            </div>

            <div class="form-group fg-full">
              <label class="form-label">Email <span class="required">*</span></label>
              <input class="form-input" type="email" v-model="form.email" placeholder="example@clinic.com" />
              <span class="form-error" v-if="formErrors.email">{{ formErrors.email }}</span>
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

<script>
import Swal from 'sweetalert2';

definePageMeta({ layout: 'admin' });

export default {
  name: 'AdminPermissionsPage',

  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      showModal: false,
      isEditing: false,
      showPw: false,
      nextId: 3,
      formErrors: {},

      form: this.emptyForm(),

      admins: [
        {
          id: 1,
          name: '系統管理員',
          account: 'admin',
          email: 'admin@clinic.com',
          status: 'active',
          createdAt: '2024-01-01',
        },
        {
          id: 2,
          name: '林小華',
          account: 'lin_hua',
          email: 'linhua@clinic.com',
          status: 'active',
          createdAt: '2024-06-10',
        },
      ],
    };
  },

  computed: {
    filteredAdmins() {
      return this.admins.filter((a) => {
        const kw = this.searchKeyword.toLowerCase();
        const matchKw = !kw || a.name.includes(kw) || a.account.includes(kw) || a.email.toLowerCase().includes(kw);
        const matchStatus = !this.filterStatus || a.status === this.filterStatus;
        return matchKw && matchStatus;
      });
    },
  },

  methods: {
    emptyForm() {
      return { name: '', account: '', email: '', password: '', status: 'active' };
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
      this.form = { name: admin.name, account: admin.account, email: admin.email, password: '', status: admin.status };
      this.formErrors = {};
      this.showModal = true;
    },

    closeModal() { this.showModal = false; },

    validate() {
      this.formErrors = {};
      if (!this.form.name.trim()) this.formErrors.name = '請輸入姓名';
      if (!this.form.account.trim()) this.formErrors.account = '請輸入帳號';
      if (!this.form.email.trim()) {
        this.formErrors.email = '請輸入 Email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.formErrors.email = 'Email 格式不正確';
      }
      if (!this.isEditing && this.form.password.length < 8) {
        this.formErrors.password = '密碼至少需要 8 個字元';
      }
      return Object.keys(this.formErrors).length === 0;
    },

    handleSave() {
      if (!this.validate()) return;

      if (this.isEditing) {
        const idx = this.admins.findIndex((a) => a.id === this._editingId);
        if (idx !== -1) {
          this.admins[idx].name = this.form.name.trim();
          this.admins[idx].email = this.form.email.trim();
          this.admins[idx].status = this.form.status;
        }
      } else {
        this.admins.push({
          id: this.nextId++,
          name: this.form.name.trim(),
          account: this.form.account.trim(),
          email: this.form.email.trim(),
          status: this.form.status,
          createdAt: new Date().toISOString().slice(0, 10),
        });
      }

      this.closeModal();
    },

    async confirmDelete(admin) {
      const result = await Swal.fire({
        title: '確認刪除管理員',
        html: `確定要刪除 <strong>${admin.name}（${admin.account}）</strong> 嗎？<br>此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        this.admins = this.admins.filter((a) => a.id !== admin.id);
        Swal.fire({ icon: 'success', title: '已刪除', text: `管理員「${admin.name}」已移除。`, timer: 1800, showConfirmButton: false });
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
      if (result.isConfirmed) {
        Swal.fire({ icon: 'success', title: '已寄送', text: `重置密碼信件已送出至 ${admin.email}。`, timer: 2200, showConfirmButton: false });
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

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active { background: #e6f6ee; color: #276749; }
.status-badge.inactive { background: #f5f5f5; color: #888; }

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
