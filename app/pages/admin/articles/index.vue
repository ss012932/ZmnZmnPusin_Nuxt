<template>
  <div class="article-admin">

    <!-- ══ 列表畫面 ══ -->
    <template v-if="view === 'list'">
      <div class="page-header">
        <div>
          <h2 class="page-title">文章管理</h2>
          <p class="page-desc">管理前台「衛教專區」的文章內容</p>
        </div>
        <div class="header-actions">
          <NuxtLink to="/admin/categories" class="btn btn-outline">
            <iconify-icon icon="mdi:tag-multiple-outline" width="17"></iconify-icon>
            管理類別
          </NuxtLink>
          <button class="btn btn-primary" @click="openCreate">
            <iconify-icon icon="mdi:plus" width="18"></iconify-icon>
            新增文章
          </button>
        </div>
      </div>

      <!-- 篩選列 -->
      <div class="filter-bar">
        <div class="search-wrap">
          <iconify-icon icon="mdi:magnify" width="17" class="search-icon"></iconify-icon>
          <input class="search-input" type="text" v-model="searchKeyword" placeholder="搜尋文章標題..." />
        </div>
        <select class="filter-select" v-model="filterCat">
          <option value="">全部類別</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <select class="filter-select" v-model="filterStatus">
          <option value="">全部狀態</option>
          <option value="published">已發布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      <!-- 表格 -->
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>標題</th>
              <th>母類別</th>
              <th>子類別</th>
              <th>段落數</th>
              <th>狀態</th>
              <th>更新時間</th>
              <th style="width:190px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredArticles.length === 0">
              <td colspan="7" class="empty-row">目前沒有符合條件的文章</td>
            </tr>
            <tr v-for="art in filteredArticles" :key="art.id">
              <td class="td-title">{{ art.title }}</td>
              <td>
                <span class="cat-badge parent">{{ getCategoryName(art.categoryId) }}</span>
              </td>
              <td>
                <span v-if="art.subCategoryId" class="cat-badge sub">
                  {{ getSubCategoryName(art.categoryId, art.subCategoryId) }}
                </span>
                <span v-else class="no-sub">—</span>
              </td>
              <td>
                <span class="section-count-badge">{{ art.sections.length }} 段</span>
              </td>
              <td>
                <span class="status-badge" :class="art.status">
                  {{ art.status === 'published' ? '已發布' : '草稿' }}
                </span>
              </td>
              <td class="td-date">{{ art.updatedAt }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-action btn-preview" @click="openListPreview(art)" title="預覽">
                    <iconify-icon icon="mdi:eye-outline" width="14"></iconify-icon>
                    預覽
                  </button>
                  <button class="btn-action btn-edit" @click="openEdit(art)" title="編輯">
                    <iconify-icon icon="mdi:pencil-outline" width="14"></iconify-icon>
                    編輯
                  </button>
                  <button class="btn-action btn-delete" @click="confirmDelete(art)" title="刪除">
                    <iconify-icon icon="mdi:trash-can-outline" width="14"></iconify-icon>
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ══ Step 1：基本設定 ══ -->
    <template v-if="view === 'step1'">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ isEditing ? '編輯文章' : '新增文章' }}</h2>
          <p class="page-desc">第 1 步：設定基本資訊與目錄段落</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" @click="tryGoToList">
            <iconify-icon icon="mdi:close" width="16"></iconify-icon>
            取消
          </button>
        </div>
      </div>

      <div class="step-card">
        <!-- 步驟指示器 -->
        <div class="step-indicator">
          <div class="step-item active">
            <span class="step-num">1</span>
            <span class="step-label">基本設定</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-item">
            <span class="step-num">2</span>
            <span class="step-label">內容編輯</span>
          </div>
        </div>

        <!-- 文章標題 -->
        <div class="form-group">
          <label class="form-label">文章標題 <span class="required">*</span></label>
          <input
            class="form-input form-input-lg"
            type="text"
            v-model="form.title"
            placeholder="輸入文章標題"
          />
          <span class="form-error" v-if="formErrors.title">{{ formErrors.title }}</span>
        </div>

        <!-- 類別 -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">母類別 <span class="required">*</span></label>
            <select class="form-input" v-model="form.categoryId" @change="form.subCategoryId = ''">
              <option value="">請選擇母類別</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <span class="form-error" v-if="formErrors.categoryId">{{ formErrors.categoryId }}</span>
          </div>
          <div class="form-group" v-if="currentSubCategories.length > 0">
            <label class="form-label">子類別</label>
            <select class="form-input" v-model="form.subCategoryId">
              <option value="">無（不指定子類別）</option>
              <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
            </select>
          </div>
        </div>

        <!-- 目錄段落 -->
        <div class="form-group">
          <div class="sections-header">
            <label class="form-label" style="margin-bottom:0">
              目錄段落 <span class="required">*</span>
            </label>
            <button class="btn btn-outline btn-sm" @click="addSection">
              <iconify-icon icon="mdi:plus" width="15"></iconify-icon>
              新增段落
            </button>
          </div>
          <span class="form-error" v-if="formErrors.sections">{{ formErrors.sections }}</span>

          <div class="sections-list">
            <div v-if="form.sections.length === 0" class="sections-empty">
              <iconify-icon icon="mdi:playlist-plus" width="32"></iconify-icon>
              <p>尚未新增任何目錄段落，請點選「新增段落」</p>
            </div>

            <div
              v-for="(sec, idx) in form.sections"
              :key="sec.id"
              class="section-row"
              :class="{ 'drag-over': dragOverIndex === idx, 'dragging': dragIndex === idx }"
              @dragover.prevent="onDragOver(idx)"
              @drop.prevent="onDrop(idx)"
              @dragend="onDragEnd"
            >
              <div
                class="section-drag-handle"
                title="拖曳排序"
                draggable="true"
                @dragstart="onDragStart(idx, $event)"
              >
                <iconify-icon icon="mdi:drag-vertical" width="20"></iconify-icon>
              </div>
              <span class="section-order-num">{{ idx + 1 }}</span>
              <input
                class="form-input section-title-input"
                type="text"
                v-model="sec.title"
                placeholder="輸入段落標題"
              />
              <button class="icon-btn danger" @click="removeSection(idx)" title="移除段落">
                <iconify-icon icon="mdi:trash-can-outline" width="16"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="step-footer">
          <button class="btn btn-primary" @click="goToStep2">
            下一步：編輯內容
            <iconify-icon icon="mdi:arrow-right" width="16"></iconify-icon>
          </button>
        </div>
      </div>
    </template>

    <!-- ══ Step 2：內容編輯 ══ -->
    <template v-if="view === 'step2'">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ form.title || '（無標題）' }}</h2>
          <p class="page-desc">第 2 步：編輯各段落內容</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" @click="view = 'step1'">
            <iconify-icon icon="mdi:arrow-left" width="16"></iconify-icon>
            上一步
          </button>
          <button class="btn btn-ghost" @click="tryGoToList">
            <iconify-icon icon="mdi:close" width="16"></iconify-icon>
            取消
          </button>
          <button class="btn btn-outline" @click="openPreviewAll">
            <iconify-icon icon="mdi:eye-outline" width="16"></iconify-icon>
            預覽
          </button>
          <button class="btn btn-outline" @click="handleSave('draft')">
            <iconify-icon icon="mdi:content-save-outline" width="16"></iconify-icon>
            儲存草稿
          </button>
          <button class="btn btn-primary" @click="handleSave('published')">
            <iconify-icon icon="mdi:publish" width="16"></iconify-icon>
            發布文章
          </button>
        </div>
      </div>

      <div class="editor2-layout">
        <!-- 左側：段落導航 -->
        <div class="section-nav-panel">
          <div class="section-nav-header">
            <iconify-icon icon="mdi:format-list-bulleted" width="15"></iconify-icon>
            目錄段落
          </div>
          <div
            v-for="(sec, idx) in form.sections"
            :key="sec.id"
            class="section-nav-item"
            :class="{ active: currentSectionIndex === idx }"
            @click="currentSectionIndex = idx"
          >
            <span class="section-nav-num">{{ idx + 1 }}</span>
            <span class="section-nav-title">{{ sec.title || '（未命名段落）' }}</span>
          </div>
        </div>

        <!-- 右側：富文本編輯 -->
        <div class="section-editor-main">
          <template v-if="currentSection">
            <div class="section-editor-header">
              <h3 class="section-editor-title">
                <span class="section-editor-num">{{ currentSectionIndex + 1 }}</span>
                {{ currentSection.title || '（未命名段落）' }}
              </h3>
              <span class="autosave-hint" v-if="lastSavedAt">
                <iconify-icon icon="mdi:cloud-check-outline" width="14"></iconify-icon>
                已自動暫存 {{ lastSavedAt }}
              </span>
            </div>

              <ClientOnly>
                <RichTextEditor v-model="currentSection.content" />
              </ClientOnly>

          </template>
        </div>
      </div>
    </template>

    <!-- ══ 預覽 Modal（編輯中） ══ -->
    <div class="modal-backdrop" v-if="showPreview" @click.self="showPreview = false">
      <div class="modal modal-preview">
        <div class="modal-header">
          <h3 class="modal-title">
            <iconify-icon icon="mdi:eye-outline" width="18"></iconify-icon>
            文章預覽
          </h3>
          <button class="modal-close" @click="showPreview = false">
            <iconify-icon icon="mdi:close" width="20"></iconify-icon>
          </button>
        </div>
        <div class="modal-body preview-body">
          <div class="protection-page-preview">
            <div class="unified-container-preview">
              <div class="content-header-preview">
                <h2 class="content-title-preview">{{ form.title || '（無標題）' }}</h2>
              </div>
              <div v-if="form.subCategoryId" class="preview-subcategory">
                {{ getSubCategoryName(form.categoryId, Number(form.subCategoryId)) }}
              </div>
              <div
                v-for="(sec, idx) in form.sections"
                :key="sec.id"
                class="preview-section-block"
              >
                <h3 class="preview-section-title">{{ sec.title || `段落 ${idx + 1}` }}</h3>
                <article
                  class="rich-text-content-preview"
                  v-html="sec.content || '<p><em>（此段落尚無內容）</em></p>'"
                ></article>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showPreview = false">關閉</button>
        </div>
      </div>
    </div>

    <!-- ══ 列表預覽 Modal ══ -->
    <div class="modal-backdrop" v-if="showListPreview" @click.self="showListPreview = false">
      <div class="modal modal-preview">
        <div class="modal-header">
          <h3 class="modal-title">
            <iconify-icon icon="mdi:eye-outline" width="18"></iconify-icon>
            文章預覽
          </h3>
          <button class="modal-close" @click="showListPreview = false">
            <iconify-icon icon="mdi:close" width="20"></iconify-icon>
          </button>
        </div>
        <div class="modal-body preview-body">
          <div class="protection-page-preview" v-if="previewArt">
            <div class="unified-container-preview">
              <div class="content-header-preview">
                <h2 class="content-title-preview">{{ previewArt.title }}</h2>
              </div>
              <div v-if="previewArt.subCategoryId" class="preview-subcategory">
                {{ getSubCategoryName(previewArt.categoryId, previewArt.subCategoryId) }}
              </div>
              <div
                v-for="(sec, idx) in previewArt.sections"
                :key="idx"
                class="preview-section-block"
              >
                <h3 class="preview-section-title">{{ sec.title || `段落 ${idx + 1}` }}</h3>
                <article
                  class="rich-text-content-preview"
                  v-html="sec.content || '<p><em>（此段落尚無內容）</em></p>'"
                ></article>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showListPreview = false">關閉</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { RichTextEditor } from 'christy-richtext';
import Swal from 'sweetalert2';

definePageMeta({ layout: 'admin' });

export default {
  name: 'AdminArticlesPage',

  components: { RichTextEditor },

  /* ── 離開確認（vue-router 4 component guard） ── */
  async beforeRouteLeave() {
    if (this.isDirty) {
      const result = await Swal.fire({
        title: '編輯尚未完成',
        text: '確認要離開此頁面嗎？未儲存的內容將會遺失。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認離開',
        cancelButtonText: '繼續編輯',
      });
      return result.isConfirmed;
    }
    return true;
  },

  data() {
    return {
      view: 'list',           // 'list' | 'step1' | 'step2'
      isEditing: false,
      _editingId: null,

      searchKeyword: '',
      filterCat: '',
      filterStatus: '',

      showPreview: false,
      showListPreview: false,
      previewArt: null,

      currentSectionIndex: 0,
      lastSavedAt: '',

      /* 拖曳排序 */
      dragIndex: null,
      dragOverIndex: null,

      formErrors: {},

      form: this.emptyForm(),

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

      articles: [
        {
          id: 1,
          title: '關節退化的常見原因與預防',
          categoryId: 1,
          subCategoryId: 11,
          status: 'published',
          updatedAt: '2025-06-10',
          sections: [
            {
              id: 101,
              title: '退化成因',
              content: '<p>關節退化是許多中高齡動物常見的問題。年齡增長、肥胖及過度使用，都可能加速軟骨磨損。</p>',
            },
            {
              id: 102,
              title: '高風險族群',
              content: '<p><strong>高風險族群</strong>包括肥胖犬貓、曾有關節脫臼或韌帶損傷的動物，以及活動力旺盛、長期劇烈運動的寵物。</p>',
            },
          ],
        },
        {
          id: 2,
          title: '子宮蓄膿的認識與預防',
          categoryId: 2,
          subCategoryId: 21,
          status: 'published',
          updatedAt: '2025-06-08',
          sections: [
            {
              id: 201,
              title: '疾病認識',
              content: '<p>子宮蓄膿是未絕育母犬、母貓常見的生殖系統疾病，好發於發情期後。</p>',
            },
            {
              id: 202,
              title: '預防方式',
              content: '<p>最有效的預防方式是<strong>絕育手術</strong>，可大幅降低感染風險與高額的緊急手術費用。</p>',
            },
          ],
        },
        {
          id: 3,
          title: '貓咪下泌尿道疾病衛教',
          categoryId: 3,
          subCategoryId: null,
          status: 'draft',
          updatedAt: '2025-06-05',
          sections: [
            {
              id: 301,
              title: '疾病概述',
              content: '<p>貓咪下泌尿道疾病（FLUTD）是貓咪常見的泌尿系統問題，主要與壓力、飲水量不足及飲食有關。</p>',
            },
          ],
        },
      ],

      nextArticleId: 4,
      nextSectionId: 400,
    };
  },

  computed: {
    isDirty() {
      return this.view === 'step1' || this.view === 'step2';
    },

    filteredArticles() {
      return this.articles.filter((a) => {
        const matchTitle = !this.searchKeyword || a.title.includes(this.searchKeyword);
        const matchCat = !this.filterCat || a.categoryId === Number(this.filterCat);
        const matchStatus = !this.filterStatus || a.status === this.filterStatus;
        return matchTitle && matchCat && matchStatus;
      });
    },

    currentSubCategories() {
      if (!this.form.categoryId) return [];
      const cat = this.categories.find((c) => c.id === Number(this.form.categoryId));
      return cat ? cat.subCategories : [];
    },

    currentSection() {
      return this.form.sections[this.currentSectionIndex] || null;
    },
  },

  watch: {
    form: {
      handler() {
        if (!this.isDirty) return;
        this.saveToLocalStorage();
      },
      deep: true,
    },
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },

  methods: {
    /* ── 工具 ── */
    emptyForm() {
      return { title: '', categoryId: '', subCategoryId: '', sections: [] };
    },

    today() {
      return new Date().toISOString().slice(0, 10);
    },

    getCategoryName(id) {
      const cat = this.categories.find((c) => c.id === id);
      return cat ? cat.name : '—';
    },

    getSubCategoryName(catId, subId) {
      const cat = this.categories.find((c) => c.id === catId);
      if (!cat) return '—';
      const sub = cat.subCategories.find((s) => s.id === subId);
      return sub ? sub.name : '—';
    },

    /* ── localStorage ── */
    saveToLocalStorage() {
      const data = {
        form: JSON.parse(JSON.stringify(this.form)),
        isEditing: this.isEditing,
        _editingId: this._editingId,
      };
      localStorage.setItem('Article', JSON.stringify(data));
      const now = new Date();
      this.lastSavedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    },

    clearLocalStorage() {
      localStorage.removeItem('Article');
      this.lastSavedAt = '';
    },

    /* ── 離開確認 ── */
    handleBeforeUnload(e) {
      if (this.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    },

    async tryGoToList() {
      const result = await Swal.fire({
        title: '確認取消編輯',
        text: '確認要取消嗎？未儲存的內容將會遺失。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認離開',
        cancelButtonText: '繼續編輯',
      });
      if (result.isConfirmed) {
        this.clearLocalStorage();
        this.view = 'list';
      }
    },

    /* ── 列表操作 ── */
    async openCreate() {
      const saved = localStorage.getItem('Article');
      if (saved) {
        const result = await Swal.fire({
          title: '發現未完成的草稿',
          text: '偵測到上次未完成的編輯內容，是否要還原繼續編輯？',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#2c5282',
          cancelButtonColor: '#6b7280',
          confirmButtonText: '還原草稿',
          cancelButtonText: '重新開始',
        });
        if (result.isConfirmed) {
          try {
            const data = JSON.parse(saved);
            this.isEditing = data.isEditing || false;
            this._editingId = data._editingId || null;
            this.form = data.form || this.emptyForm();
            this.formErrors = {};
            this.currentSectionIndex = 0;
            this.view = 'step1';
            return;
          } catch (_) { /* 還原失敗則重新開始 */ }
        }
        this.clearLocalStorage();
      }
      this.isEditing = false;
      this._editingId = null;
      this.form = this.emptyForm();
      this.formErrors = {};
      this.currentSectionIndex = 0;
      this.view = 'step1';
    },

    openEdit(art) {
      this.isEditing = true;
      this._editingId = art.id;
      this.form = {
        title: art.title,
        categoryId: art.categoryId,
        subCategoryId: art.subCategoryId || '',
        sections: art.sections.map((s) => ({ ...s })),
      };
      this.formErrors = {};
      this.currentSectionIndex = 0;
      this.view = 'step1';
    },

    openListPreview(art) {
      this.previewArt = art;
      this.showListPreview = true;
    },

    async confirmDelete(art) {
      const result = await Swal.fire({
        title: '確認刪除',
        html: `確定要刪除文章 <strong>「${art.title}」</strong> 嗎？<br>此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        this.articles = this.articles.filter((a) => a.id !== art.id);
        Swal.fire({ icon: 'success', title: '已刪除', text: '文章已成功刪除。', timer: 1800, showConfirmButton: false });
      }
    },

    /* ── Step 1：目錄段落管理 ── */
    addSection() {
      this.form.sections.push({ id: this.nextSectionId++, title: '', content: '' });
    },

    removeSection(idx) {
      this.form.sections.splice(idx, 1);
      if (this.currentSectionIndex >= this.form.sections.length) {
        this.currentSectionIndex = Math.max(0, this.form.sections.length - 1);
      }
    },

    /* 拖曳排序 */
    onDragStart(idx, event) {
      this.dragIndex = idx;
      event.dataTransfer.effectAllowed = 'move';
    },

    onDragOver(idx) {
      this.dragOverIndex = idx;
    },

    onDrop(idx) {
      if (this.dragIndex === null || this.dragIndex === idx) return;
      const sections = [...this.form.sections];
      const [moved] = sections.splice(this.dragIndex, 1);
      sections.splice(idx, 0, moved);
      this.form.sections = sections;
      this.dragIndex = null;
      this.dragOverIndex = null;
    },

    onDragEnd() {
      this.dragIndex = null;
      this.dragOverIndex = null;
    },

    /* ── Step 1 → Step 2 ── */
    validateStep1() {
      this.formErrors = {};
      if (!this.form.title.trim()) this.formErrors.title = '請輸入文章標題';
      if (!this.form.categoryId) this.formErrors.categoryId = '請選擇母類別';
      if (this.form.sections.length === 0) {
        this.formErrors.sections = '請至少新增一個目錄段落';
      } else if (this.form.sections.some((s) => !s.title.trim())) {
        this.formErrors.sections = '所有段落標題不能為空';
      }
      return Object.keys(this.formErrors).length === 0;
    },

    goToStep2() {
      if (!this.validateStep1()) return;
      this.currentSectionIndex = 0;
      this.view = 'step2';
    },

    /* ── 預覽（所有段落） ── */
    openPreviewAll() {
      this.showPreview = true;
    },

    /* ── 儲存 ── */
    handleSave(status) {
      const payload = {
        title: this.form.title.trim(),
        categoryId: Number(this.form.categoryId),
        subCategoryId: this.form.subCategoryId ? Number(this.form.subCategoryId) : null,
        sections: this.form.sections.map((s) => ({ ...s })),
        status,
        updatedAt: this.today(),
      };

      if (this.isEditing) {
        const idx = this.articles.findIndex((a) => a.id === this._editingId);
        if (idx !== -1) this.articles.splice(idx, 1, { id: this._editingId, ...payload });
      } else {
        this.articles.push({ id: this.nextArticleId++, ...payload });
      }

      this.clearLocalStorage();
      this.view = 'list';

      Swal.fire({
        icon: 'success',
        title: status === 'published' ? '文章已發布' : '草稿已儲存',
        timer: 1600,
        showConfirmButton: false,
      });
    },
  },
};
</script>

<style>
/* ── 頁首 ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  background: #fff;
  border: 1.5px solid #2c5282;
  color: #2c5282;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-outline:hover { background: #eef3fa; }
.btn-outline:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── 操作按鈕 ── */
.action-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  flex-wrap: nowrap;
}

.btn-preview {
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
.btn-preview:hover { background: #dcf0dc; }

/* ── Badge ── */
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.status-badge.published { background: #e6f6ee; color: #276749; }
.status-badge.draft { background: #f5f5f5; color: #888; }

.cat-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.cat-badge.parent { background: #eef3fa; color: #2c5282; }
.cat-badge.sub { background: #f0f9f0; color: #276749; }
.no-sub { color: #ccc; font-size: 13px; }

.section-count-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #f0f0f0;
  color: #666;
}

.td-title {
  font-weight: 600;
  color: #1a2744;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.td-date { font-size: 13px; color: #aaa; white-space: nowrap; }

/* ══════════════════════════════
   Step 1：步驟卡片
══════════════════════════════ */
.step-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 28px 32px;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* 步驟指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  gap: 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  background: #e0e0e0;
  color: #999;
  flex-shrink: 0;
}

.step-item.active .step-num {
  background: #2c5282;
  color: #fff;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #999;
}

.step-item.active .step-label {
  color: #1a2744;
}

.step-divider {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 16px;
  max-width: 80px;
}

/* 表單列 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-input-lg { font-size: 15px; padding: 11px 14px; }

/* 目錄段落 */
.sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.btn-sm {
  padding: 6px 12px !important;
  font-size: 13px !important;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sections-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: #bbb;
  font-size: 13px;
  background: #fafafa;
  border-radius: 8px;
  border: 1.5px dashed #ddd;
}

.section-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f8f9fb;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.15s;
  cursor: default;
}

.section-row:hover { border-color: #c0cfe8; background: #f2f5fa; }

.section-row.drag-over {
  border-color: #2c5282;
  background: #eef3fa;
}

.section-row.dragging {
  opacity: 0.45;
}

.section-drag-handle {
  color: #bbb;
  cursor: grab;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.section-drag-handle:active { cursor: grabbing; }

.section-order-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2c5282;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title-input {
  flex: 1;
  background: #fff;
}

/* 步驟底部 */
.step-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* ══════════════════════════════
   Step 2：兩欄編輯
══════════════════════════════ */
.editor2-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  align-items: start;
}

/* 左側段落導航 */
.section-nav-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: sticky;
  top: 80px;
}

.section-nav-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fb;
}

.section-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 1px solid #f5f5f5;
}

.section-nav-item:last-child { border-bottom: none; }
.section-nav-item:hover { background: #f5f7fa; }
.section-nav-item.active { background: #eef3fa; }

.section-nav-num {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #888;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-nav-item.active .section-nav-num {
  background: #2c5282;
  color: #fff;
}

.section-nav-title {
  font-size: 13px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-nav-item.active .section-nav-title {
  color: #1a2744;
  font-weight: 600;
}

/* 右側編輯主區 */
.section-editor-main {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fb;
}

.section-editor-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #1a2744;
}

.section-editor-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #2c5282;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.autosave-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52a169;
}

/* 富文本編輯區（無外框） */
.section-richtext {
  padding: 0;
  min-height: 680px;
}

/* ══════════════════════════════
   預覽 Modal
══════════════════════════════ */
.modal-preview {
  max-width: 860px;
  width: 95vw;
  max-height: 88vh;
}

.preview-body {
  padding: 0 !important;
  background: #fffaf0;
}

.protection-page-preview {
  padding: 24px 20px;
  background: #fffaf0;
  min-height: 300px;
}

.unified-container-preview {
  background: white;
  border-radius: 12px;
  padding: 28px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 780px;
  margin: 0 auto;
}

.content-header-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid #5aa0c8;
}

.content-title-preview {
  font-size: 26px;
  font-weight: bold;
  color: #143c64;
  margin: 0;
}

.preview-subcategory {
  font-size: 26px;
  font-weight: bold;
  color: #143c64;
  margin: 0 0 20px;
}

.preview-section-block {
  margin-bottom: 28px;
}

.preview-section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #143c64;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 4px solid #5aa0c8;
}

.rich-text-content-preview {
  color: #333;
  font-size: 15px;
  line-height: 1.8;
}
.rich-text-content-preview p { margin: 0 0 12px; }
.rich-text-content-preview strong { font-weight: 700; }
.rich-text-content-preview h1,
.rich-text-content-preview h2,
.rich-text-content-preview h3 { color: #143c64; margin: 16px 0 8px; }
.rich-text-content-preview ul,
.rich-text-content-preview ol { padding-left: 24px; margin: 12px 0; }
.rich-text-content-preview li { margin-bottom: 6px; }
.rich-text-content-preview blockquote {
  border-left: 4px solid #5aa0c8;
  margin: 16px 0;
  padding: 10px 16px;
  background: #f8f9ff;
  border-radius: 0 8px 8px 0;
}

/* ── RWD ── */
@media (max-width: 960px) {
  .editor2-layout {
    grid-template-columns: 1fr;
  }
  .section-nav-panel {
    position: static;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .data-table { min-width: 720px; }
  .step-card { padding: 20px 16px; }
}
</style>
