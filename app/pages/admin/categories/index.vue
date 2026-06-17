<template>
  <div class="cat-admin">

    <!-- 頁首 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">類別管理</h2>
        <p class="page-desc">管理文章的母類別與子類別</p>
      </div>
    </div>

    <div class="form-alert" v-if="loadError">{{ loadError }}</div>

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
          <li v-if="loadingMain" class="cat-empty">載入中...</li>
          <li v-else-if="mainCategories.length === 0" class="cat-empty">尚未建立任何母類別</li>
          <li
            v-for="(cat, index) in mainCategories"
            :key="cat.id"
            :data-main-cat-id="cat.id"
            class="cat-item"
            :class="{
              active: selectedId === cat.id,
              'drag-over': mainDrag.overIndex === index,
            }"
            draggable="true"
            @click="selectMain(cat.id)"
            @dragstart="onMainDragStart(index)"
            @dragover.prevent="onMainDragOver(index)"
            @dragleave="onMainDragLeave"
            @drop.prevent="onMainDrop(index)"
            @dragend="onMainDragEnd"
          >
            <div class="cat-item-left">
              <iconify-icon icon="mdi:drag-vertical" width="16" class="drag-handle" title="拖曳排序"
                @touchstart.prevent="onMainTouchStart($event, index)"
              ></iconify-icon>
              <iconify-icon icon="mdi:folder-outline" width="16" class="cat-folder-icon"></iconify-icon>
              <span class="cat-item-name">{{ cat.name }}</span>
              <span class="sub-count">{{ cat.subCategoryCount }} 個子類別</span>
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
          <li v-if="loadingSub" class="cat-empty">載入中...</li>
          <li v-else-if="subCategories.length === 0" class="cat-empty">
            此母類別尚未建立子類別
          </li>
          <li
            v-for="(sub, index) in subCategories"
            :key="sub.id"
            :data-sub-cat-id="sub.id"
            class="cat-item sub-item"
            :class="{ 'drag-over': subDrag.overIndex === index }"
            draggable="true"
            @dragstart="onSubDragStart(index)"
            @dragover.prevent="onSubDragOver(index)"
            @dragleave="onSubDragLeave"
            @drop.prevent="onSubDrop(index)"
            @dragend="onSubDragEnd"
          >
            <div class="cat-item-left">
              <iconify-icon icon="mdi:drag-vertical" width="16" class="drag-handle" title="拖曳排序"
                @touchstart.prevent="onSubTouchStart($event, index)"
              ></iconify-icon>
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
    <div class="modal-backdrop" v-if="showModal">
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
useHead({ title: '類別管理' });
</script>

<script>
import Swal from 'sweetalert2';
import { categoriesAPI } from '~/composables/utils/api';

export default {
  name: 'AdminCategoriesPage',

  data() {
    return {
      mainCategories: [],
      subCategories: [],
      selectedId: null,
      loadingMain: false,
      loadingSub: false,
      loadError: '',
      showModal: false,

      modal: {
        title: '',
        name: '',
        error: '',
        mode: '',        // 'add-parent' | 'edit-parent' | 'add-sub' | 'edit-sub'
        targetCat: null,
        targetSub: null,
      },

      // 拖曳狀態
      mainDrag: { fromIndex: null, overIndex: null },
      subDrag:  { fromIndex: null, overIndex: null },
    };
  },

  computed: {
    selectedCat() {
      return this.mainCategories.find((c) => c.id === this.selectedId) || null;
    },
  },

  mounted() {
    this.loadMain();
  },

  methods: {
    /* ── 載入資料 ── */
    async loadMain() {
      this.loadingMain = true;
      this.loadError = '';
      try {
        const result = await categoriesAPI.getAllMain();
        if (!result?.success) throw new Error(result?.message || '取得母類別失敗');
        this.mainCategories = result.data || [];
      } catch (err) {
        this.loadError = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '取得母類別失敗';
      } finally {
        this.loadingMain = false;
      }
    },

    async loadSub(mainCategoryId) {
      this.loadingSub = true;
      this.subCategories = [];
      try {
        const result = await categoriesAPI.getSubByMain(mainCategoryId);
        if (!result?.success) throw new Error(result?.message || '取得子類別失敗');
        this.subCategories = result.data || [];
      } catch (err) {
        Swal.fire({ icon: 'error', title: '載入失敗', text: err?.response?.data?.detail || err?.message || '取得子類別失敗', timer: 2000, showConfirmButton: false });
      } finally {
        this.loadingSub = false;
      }
    },

    selectMain(id) {
      this.selectedId = id;
      this.loadSub(id);
    },

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
      const confirm = await Swal.fire({
        title: '確認刪除母類別',
        html: `確定要刪除 <strong>「${cat.name}」</strong> 嗎？<br>其下所有子類別也會一併移除。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (!confirm.isConfirmed) return;

      Swal.fire({ title: '刪除中...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
      try {
        const result = await categoriesAPI.deleteMain(cat.id);
        if (!result?.success) throw new Error(result?.message || '刪除失敗');

        if (this.selectedId === cat.id) {
          this.selectedId = null;
          this.subCategories = [];
        }
        await this.loadMain();
        Swal.fire({ icon: 'success', title: '已刪除', text: `母類別「${cat.name}」已移除。`, timer: 1800, showConfirmButton: false, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '刪除失敗';
        Swal.fire({ icon: 'error', title: '刪除失敗', text: msg });
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
      const confirm = await Swal.fire({
        title: '確認刪除子類別',
        html: `確定要刪除子類別 <strong>「${sub.name}」</strong> 嗎？`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (!confirm.isConfirmed) return;

      Swal.fire({ title: '刪除中...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
      try {
        const result = await categoriesAPI.deleteSub(sub.id);
        if (!result?.success) throw new Error(result?.message || '刪除失敗');

        await Promise.all([this.loadMain(), this.loadSub(this.selectedId)]);
        Swal.fire({ icon: 'success', title: '已刪除', text: `子類別「${sub.name}」已移除。`, timer: 1800, showConfirmButton: false, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '刪除失敗';
        Swal.fire({ icon: 'error', title: '刪除失敗', text: msg });
      }
    },

    /* ── 母類別拖曳排序 ── */
    onMainDragStart(index) {
      this.mainDrag.fromIndex = index;
    },
    onMainDragOver(index) {
      this.mainDrag.overIndex = index;
    },
    onMainDragLeave() {
      this.mainDrag.overIndex = null;
    },
    async onMainDrop(toIndex) {
      const fromIndex = this.mainDrag.fromIndex;
      this.mainDrag = { fromIndex: null, overIndex: null };
      if (fromIndex === null || fromIndex === toIndex) return;

      // 重排陣列
      const list = [...this.mainCategories];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);

      // 重新指定 sortOrder（1-based）
      list.forEach((item, i) => { item.sortOrder = i + 1; });
      this.mainCategories = list;

      try {
        const items = list.map((c) => ({ id: c.id, sortOrder: c.sortOrder }));
        await categoriesAPI.updateMainSortOrders(items);
        await this.loadMain();
        Swal.fire({ icon: 'success', title: '排序已更新', timer: 1200, showConfirmButton: false, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || '排序更新失敗';
        Swal.fire({ icon: 'error', title: '排序更新失敗', text: msg, timer: 2000, showConfirmButton: false });
        this.loadMain();
      }
    },
    onMainDragEnd() {
      this.mainDrag = { fromIndex: null, overIndex: null };
    },

    /* ── 母類別手機觸控拖曳 ── */
    onMainTouchStart(e, index) {
      e.preventDefault();
      this.mainDrag.fromIndex = index;
      this._mainTouchMoveHandler = (ev) => this._onMainTouchMove(ev);
      this._mainTouchEndHandler  = (ev) => this._onMainTouchEnd(ev);
      document.addEventListener('touchmove', this._mainTouchMoveHandler, { passive: false });
      document.addEventListener('touchend',  this._mainTouchEndHandler,  { once: true });
    },

    _onMainTouchMove(e) {
      if (this.mainDrag.fromIndex === null) return;
      e.preventDefault();
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const li = el?.closest('[data-main-cat-id]');
      if (li) {
        const catId = parseInt(li.dataset.mainCatId);
        const overIndex = this.mainCategories.findIndex((c) => c.id === catId);
        this.mainDrag.overIndex = overIndex >= 0 ? overIndex : null;
      } else {
        this.mainDrag.overIndex = null;
      }
    },

    _onMainTouchEnd(e) {
      if (this._mainTouchMoveHandler) {
        document.removeEventListener('touchmove', this._mainTouchMoveHandler);
        this._mainTouchMoveHandler = null;
      }
      const touch = e?.changedTouches?.[0];
      if (touch) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const li = el?.closest('[data-main-cat-id]');
        if (li) {
          const catId = parseInt(li.dataset.mainCatId);
          const toIndex = this.mainCategories.findIndex((c) => c.id === catId);
          if (toIndex >= 0) this.mainDrag.overIndex = toIndex;
        }
      }
      const toIndex = this.mainDrag.overIndex;
      this.mainDrag.overIndex = null;
      if (toIndex !== null && toIndex !== this.mainDrag.fromIndex) {
        this.onMainDrop(toIndex);
      } else {
        this.mainDrag.fromIndex = null;
      }
    },

    /* ── 子類別拖曳排序 ── */
    onSubDragStart(index) {
      this.subDrag.fromIndex = index;
    },
    onSubDragOver(index) {
      this.subDrag.overIndex = index;
    },
    onSubDragLeave() {
      this.subDrag.overIndex = null;
    },
    async onSubDrop(toIndex) {
      const fromIndex = this.subDrag.fromIndex;
      this.subDrag = { fromIndex: null, overIndex: null };
      if (fromIndex === null || fromIndex === toIndex) return;

      const list = [...this.subCategories];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);

      list.forEach((item, i) => { item.sortOrder = i + 1; });
      this.subCategories = list;

      try {
        const items = list.map((s) => ({ id: s.id, sortOrder: s.sortOrder }));
        await categoriesAPI.updateSubSortOrders(items);
        await this.loadSub(this.selectedId);
        Swal.fire({ icon: 'success', title: '排序已更新', timer: 1200, showConfirmButton: false, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || '排序更新失敗';
        Swal.fire({ icon: 'error', title: '排序更新失敗', text: msg, timer: 2000, showConfirmButton: false });
        this.loadSub(this.selectedId);
      }
    },
    onSubDragEnd() {
      this.subDrag = { fromIndex: null, overIndex: null };
    },

    /* ── 子類別手機觸控拖曳 ── */
    onSubTouchStart(e, index) {
      e.preventDefault();
      this.subDrag.fromIndex = index;
      this._subTouchMoveHandler = (ev) => this._onSubTouchMove(ev);
      this._subTouchEndHandler  = (ev) => this._onSubTouchEnd(ev);
      document.addEventListener('touchmove', this._subTouchMoveHandler, { passive: false });
      document.addEventListener('touchend',  this._subTouchEndHandler,  { once: true });
    },

    _onSubTouchMove(e) {
      if (this.subDrag.fromIndex === null) return;
      e.preventDefault();
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const li = el?.closest('[data-sub-cat-id]');
      if (li) {
        const subId = parseInt(li.dataset.subCatId);
        const overIndex = this.subCategories.findIndex((s) => s.id === subId);
        this.subDrag.overIndex = overIndex >= 0 ? overIndex : null;
      } else {
        this.subDrag.overIndex = null;
      }
    },

    _onSubTouchEnd(e) {
      if (this._subTouchMoveHandler) {
        document.removeEventListener('touchmove', this._subTouchMoveHandler);
        this._subTouchMoveHandler = null;
      }
      const touch = e?.changedTouches?.[0];
      if (touch) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const li = el?.closest('[data-sub-cat-id]');
        if (li) {
          const subId = parseInt(li.dataset.subCatId);
          const toIndex = this.subCategories.findIndex((s) => s.id === subId);
          if (toIndex >= 0) this.subDrag.overIndex = toIndex;
        }
      }
      const toIndex = this.subDrag.overIndex;
      this.subDrag.overIndex = null;
      if (toIndex !== null && toIndex !== this.subDrag.fromIndex) {
        this.onSubDrop(toIndex);
      } else {
        this.subDrag.fromIndex = null;
      }
    },

    /* ── Modal 儲存 ── */
    async saveModal() {
      const name = this.modal.name.trim();
      if (!name) {
        this.modal.error = '請輸入類別名稱';
        return;
      }
      this.modal.error = '';

      const { mode, targetCat, targetSub } = this.modal;
      this.showModal = false;
      Swal.fire({ title: '儲存中...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });

      try {
        if (mode === 'add-parent') {
          const result = await categoriesAPI.createMain({ name });
          if (!result?.success) throw new Error(result?.message || '新增失敗');
          await this.loadMain();

        } else if (mode === 'edit-parent') {
          const result = await categoriesAPI.updateMain(targetCat.id, { name });
          if (!result?.success) throw new Error(result?.message || '更新失敗');
          await this.loadMain();

        } else if (mode === 'add-sub') {
          const result = await categoriesAPI.createSub({ mainCategoryId: targetCat.id, name });
          if (!result?.success) throw new Error(result?.message || '新增失敗');
          await Promise.all([this.loadMain(), this.loadSub(targetCat.id)]);

        } else if (mode === 'edit-sub') {
          const result = await categoriesAPI.updateSub(targetSub.id, { name });
          if (!result?.success) throw new Error(result?.message || '更新失敗');
          await this.loadSub(this.selectedId);
        }

        Swal.fire({ icon: 'success', title: '已儲存', timer: 1500, showConfirmButton: false, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || '操作失敗，請再試一次';
        Swal.fire({ icon: 'error', title: '儲存失敗', text: msg });
      }
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
  cursor: grab;
  margin-left: 8px;
}

.sub-item:hover {
  background: #f8f9fb;
}

/* 拖曳相關 */
.drag-handle {
  color: #ccc;
  flex-shrink: 0;
  cursor: grab;
  transition: color 0.15s;
}

.cat-item:hover .drag-handle {
  color: #aaa;
}

.cat-item[draggable='true'] {
  cursor: grab;
}

.cat-item.drag-over {
  border-color: #2c5282;
  background: #eef3fa;
  box-shadow: 0 0 0 2px rgba(44, 82, 130, 0.18);
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

.form-alert {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  color: #e53e3e;
  font-size: 13px;
  margin-bottom: 18px;
  padding: 10px 14px;
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
