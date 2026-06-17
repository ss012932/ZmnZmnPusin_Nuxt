<template>
  <div class="cat-admin">

    <!-- 頁首 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">類別管理</h2>
        <p class="page-desc">管理文章的母類別與子類別</p>
      </div>
    </div>

    <!-- 雙欄面板 -->
    <div class="cat-panels">

      <!-- ── 母類別 ── -->
      <div class="cat-panel">
        <div class="cat-panel-header">
          <h3 class="cat-panel-title">
            <iconify-icon icon="mdi:folder-multiple-outline" width="18"></iconify-icon>
            母類別
          </h3>
          <button class="btn btn-primary btn-sm" @click="openAddParent">
            <iconify-icon icon="mdi:plus" width="16"></iconify-icon>
            新增
          </button>
        </div>

        <ul class="cat-list">
          <li v-if="categories.length === 0" class="cat-empty">尚未建立任何母類別</li>
          <li
            v-for="cat in categories"
            :key="cat.id"
            class="cat-item"
            :class="{ active: selectedId === cat.id }"
            @click="selectedId = cat.id"
          >
            <div class="cat-item-left">
              <iconify-icon icon="mdi:folder-outline" width="16" class="cat-folder-icon"></iconify-icon>
              <span class="cat-item-name">{{ cat.name }}</span>
              <span class="sub-count">{{ cat.subCategories.length }} 個子類別</span>
            </div>
            <div class="cat-item-actions">
              <button class="icon-btn" @click.stop="openEditParent(cat)" title="編輯">
                <iconify-icon icon="mdi:pencil-outline" width="16"></iconify-icon>
              </button>
              <button class="icon-btn danger" @click.stop="confirmDeleteParent(cat)" title="刪除">
                <iconify-icon icon="mdi:trash-can-outline" width="16"></iconify-icon>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- ── 子類別 ── -->
      <div class="cat-panel">
        <div class="cat-panel-header">
          <h3 class="cat-panel-title">
            <iconify-icon icon="mdi:tag-outline" width="18"></iconify-icon>
            子類別
            <span class="panel-subtitle" v-if="selectedCat">— {{ selectedCat.name }}</span>
          </h3>
          <button class="btn btn-primary btn-sm" :disabled="!selectedId" @click="openAddSub">
            <iconify-icon icon="mdi:plus" width="16"></iconify-icon>
            新增
          </button>
        </div>

        <div class="cat-placeholder" v-if="!selectedId">
          <iconify-icon icon="mdi:arrow-left-circle-outline" width="32"></iconify-icon>
          <p>請先點選左側的母類別</p>
        </div>

        <ul class="cat-list" v-else>
          <li v-if="selectedCat.subCategories.length === 0" class="cat-empty">
            此母類別尚未建立子類別
          </li>
          <li
            v-for="sub in selectedCat.subCategories"
            :key="sub.id"
            class="cat-item sub-item"
          >
            <div class="cat-item-left">
              <iconify-icon icon="mdi:tag-outline" width="15" class="cat-tag-icon"></iconify-icon>
              <span class="cat-item-name">{{ sub.name }}</span>
            </div>
            <div class="cat-item-actions">
              <button class="icon-btn" @click="openEditSub(sub)" title="編輯">
                <iconify-icon icon="mdi:pencil-outline" width="16"></iconify-icon>
              </button>
              <button class="icon-btn danger" @click="confirmDeleteSub(sub)" title="刪除">
                <iconify-icon icon="mdi:trash-can-outline" width="16"></iconify-icon>
              </button>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <!-- ══ 新增/編輯 Modal ══ -->
    <div class="modal-backdrop" v-if="showModal" @click.self="showModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3 class="modal-title">{{ modal.title }}</h3>
          <button class="modal-close" @click="showModal = false">
            <iconify-icon icon="mdi:close" width="20"></iconify-icon>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">類別名稱 <span class="required">*</span></label>
            <input
              class="form-input"
              type="text"
              v-model="modal.name"
              placeholder="輸入類別名稱"
              @keyup.enter="saveModal"
            />
            <span class="form-error" v-if="modal.error">{{ modal.error }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="saveModal">
            <iconify-icon icon="mdi:content-save-outline" width="16"></iconify-icon>
            確認
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'backoffice-auth' });
</script>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AdminCategoriesPage',

  data() {
    return {
      selectedId: null,
      showModal: false,
      nextCatId: 10,
      nextSubId: 100,

      modal: {
        title: '',
        name: '',
        error: '',
        mode: '',        // 'add-parent' | 'edit-parent' | 'add-sub' | 'edit-sub'
        targetCat: null,
        targetSub: null,
      },

      categories: [
        {
          id: 1,
          name: '關節活動照護',
          subCategories: [
            { id: 11, name: '退化原因' },
            { id: 12, name: '保養與治療' },
          ],
        },
        {
          id: 2,
          name: '子宮蓄膿介紹',
          subCategories: [
            { id: 21, name: '認識子宮蓄膿' },
            { id: 22, name: '症狀與預防' },
          ],
        },
        {
          id: 3,
          name: '貓咪下泌尿道疾病',
          subCategories: [
            { id: 31, name: '原因及症狀' },
            { id: 32, name: '預防與注意' },
          ],
        },
      ],
    };
  },

  computed: {
    selectedCat() {
      return this.categories.find((c) => c.id === this.selectedId) || null;
    },
  },

  methods: {
    /* ── 母類別 ── */
    openAddParent() {
      this.modal = { title: '新增母類別', name: '', error: '', mode: 'add-parent', targetCat: null, targetSub: null };
      this.showModal = true;
    },

    openEditParent(cat) {
      this.modal = { title: '編輯母類別', name: cat.name, error: '', mode: 'edit-parent', targetCat: cat, targetSub: null };
      this.showModal = true;
    },

    async confirmDeleteParent(cat) {
      const result = await Swal.fire({
        title: '確認刪除母類別',
        html: `確定要刪除 <strong>「${cat.name}」</strong> 嗎？<br>其下所有子類別也會一併移除，此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        const idx = this.categories.findIndex((c) => c.id === cat.id);
        if (idx !== -1) this.categories.splice(idx, 1);
        if (this.selectedId === cat.id) this.selectedId = null;
        Swal.fire({ icon: 'success', title: '已刪除', text: `母類別「${cat.name}」已移除。`, timer: 1800, showConfirmButton: false });
      }
    },

    /* ── 子類別 ── */
    openAddSub() {
      if (!this.selectedId) return;
      this.modal = { title: `新增子類別（${this.selectedCat.name}）`, name: '', error: '', mode: 'add-sub', targetCat: this.selectedCat, targetSub: null };
      this.showModal = true;
    },

    openEditSub(sub) {
      this.modal = { title: '編輯子類別', name: sub.name, error: '', mode: 'edit-sub', targetCat: this.selectedCat, targetSub: sub };
      this.showModal = true;
    },

    async confirmDeleteSub(sub) {
      const result = await Swal.fire({
        title: '確認刪除子類別',
        html: `確定要刪除子類別 <strong>「${sub.name}」</strong> 嗎？`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        const cat = this.selectedCat;
        const idx = cat.subCategories.findIndex((s) => s.id === sub.id);
        if (idx !== -1) cat.subCategories.splice(idx, 1);
        Swal.fire({ icon: 'success', title: '已刪除', text: `子類別「${sub.name}」已移除。`, timer: 1800, showConfirmButton: false });
      }
    },

    /* ── Modal 儲存 ── */
    saveModal() {
      const name = this.modal.name.trim();
      if (!name) {
        this.modal.error = '請輸入類別名稱';
        return;
      }

      const { mode, targetCat, targetSub } = this.modal;

      if (mode === 'add-parent') {
        this.categories.push({ id: this.nextCatId++, name, subCategories: [] });
      } else if (mode === 'edit-parent') {
        targetCat.name = name;
      } else if (mode === 'add-sub') {
        targetCat.subCategories.push({ id: this.nextSubId++, name });
      } else if (mode === 'edit-sub') {
        targetSub.name = name;
      }

      this.showModal = false;
    },

  },
};
</script>

<style>
/* ── 雙欄面板 ── */
.cat-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.cat-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.cat-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fb;
  flex-shrink: 0;
}

.cat-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1a2744;
}

.panel-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #2c5282;
}

.btn-sm {
  padding: 6px 12px !important;
  font-size: 13px !important;
}

/* ── 類別列表 ── */
.cat-list {
  list-style: none;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
  border: 1.5px solid transparent;
  margin-bottom: 4px;
}

.cat-item:hover {
  background: #f5f7fa;
}

.cat-item.active {
  background: #eef3fa;
  border-color: #2c5282;
}

.sub-item {
  cursor: default;
  margin-left: 8px;
}

.sub-item:hover {
  background: #f8f9fb;
}

.cat-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.cat-folder-icon {
  color: #f0a500;
  flex-shrink: 0;
}

.cat-tag-icon {
  color: #2c5282;
  flex-shrink: 0;
}

.cat-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #2b2b2b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-count {
  font-size: 11px;
  color: #bbb;
  white-space: nowrap;
  background: #f0f0f0;
  padding: 2px 7px;
  border-radius: 999px;
}

.cat-item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.cat-item:hover .cat-item-actions {
  opacity: 1;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #eee;
  color: #2c5282;
}

.icon-btn.danger:hover {
  background: #fff5f5;
  color: #e53e3e;
}

.cat-empty {
  padding: 28px 16px;
  text-align: center;
  color: #bbb;
  font-size: 13px;
  cursor: default;
}

.cat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ccc;
  padding: 40px;
}

.cat-placeholder p {
  font-size: 14px;
}

/* ── RWD ── */
@media (max-width: 768px) {
  .cat-panels {
    grid-template-columns: 1fr;
  }

  .cat-panel {
    min-height: 260px;
  }
}
</style>
