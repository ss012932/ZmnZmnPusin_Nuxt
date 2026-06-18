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
        <select class="filter-select" v-model="filterMainCatId">
          <option value="">全部類別</option>
          <option v-for="cat in mainCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <select class="filter-select" v-model="filterStatus">
          <option value="">全部狀態</option>
          <option value="published">已發布</option>
          <option value="draft">草稿</option>
        </select>
        <button class="btn btn-outline btn-sm" @click="loadArticles">
          <iconify-icon icon="mdi:refresh" width="15"></iconify-icon>
          重新載入
        </button>
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
              <th>精選</th>
              <th>狀態</th>
              <th>更新時間</th>
              <th style="width:200px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="listLoading">
              <td colspan="8" class="empty-row">
                <iconify-icon icon="mdi:loading" width="20" class="spin"></iconify-icon>
                載入中...
              </td>
            </tr>
            <tr v-else-if="filteredArticles.length === 0">
              <td colspan="8" class="empty-row">目前沒有符合條件的文章</td>
            </tr>
            <tr v-for="art in filteredArticles" :key="art.id">
              <td class="td-title" :title="art.title">{{ art.title }}</td>
              <td>
                <span class="cat-badge parent">{{ art.mainCategoryName || '—' }}</span>
              </td>
              <td>
                <span v-if="art.subCategoryName" class="cat-badge sub">{{ art.subCategoryName }}</span>
                <span v-else class="no-sub">—</span>
              </td>
              <td>
                <span class="section-count-badge">{{ art.sectionCount }} 段</span>
              </td>
              <td>
                <iconify-icon v-if="art.isFeatured" icon="mdi:star" width="16" style="color:#f6ad55"></iconify-icon>
                <span v-else class="no-sub">—</span>
              </td>
              <td>
                <span class="status-badge" :class="art.status">
                  {{ art.status === 'published' ? '已發布' : '草稿' }}
                </span>
              </td>
              <td class="td-date">{{ formatDate(art.updatedAt) }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-action btn-preview" @click="openListPreview(art)" title="預覽">
                    <iconify-icon icon="mdi:eye-outline" width="14"></iconify-icon>
                    預覽
                  </button>
                  <button class="btn-action btn-edit" @click="openEdit(art.id)" title="編輯">
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
            <select class="form-input" v-model="form.mainCategoryId" @change="onMainCatChange">
              <option value="">請選擇母類別</option>
              <option v-for="cat in mainCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <span class="form-error" v-if="formErrors.mainCategoryId">{{ formErrors.mainCategoryId }}</span>
          </div>
          <div class="form-group" v-if="form.mainCategoryId">
            <label class="form-label">子類別</label>
            <select class="form-input" v-model="form.subCategoryId" :disabled="subCatsLoading">
              <option value="">{{ subCatsLoading ? '載入中...' : '無（不指定子類別）' }}</option>
              <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
            </select>
          </div>
        </div>

        <!-- 摘要 -->
        <div class="form-group">
          <label class="form-label">文章摘要</label>
          <textarea
            class="form-input"
            rows="3"
            v-model="form.summary"
            placeholder="簡短描述文章內容（也會作為 Meta Description 用於 SEO）"
          ></textarea>
          <div class="char-count" :class="{ warn: (form.summary || '').length > 160 }">
            {{ (form.summary || '').length }} / 160 字（建議 Meta Description 上限）
          </div>
        </div>

        <!-- 精選 -->
        <div class="form-group form-group-inline">
          <label class="toggle-label">
            <input type="checkbox" v-model="form.isFeatured" class="toggle-input" />
            <span class="toggle-track"></span>
            精選文章（首頁優先顯示）
          </label>
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
              :key="sec._key"
              class="section-row"
              :class="{ 'drag-over': dragOverIndex === idx, 'dragging': dragIndex === idx }"
              @dragover.prevent="dragOverIndex = idx"
              @drop.prevent="onSectionDrop(idx)"
              @dragend="dragIndex = null; dragOverIndex = null"
            >
              <div
                class="section-drag-handle"
                title="拖曳排序"
                draggable="true"
                @dragstart="dragIndex = idx; $event.dataTransfer.effectAllowed = 'move'"
              >
                <iconify-icon icon="mdi:drag-vertical" width="20"></iconify-icon>
              </div>
              <span class="section-order-num">{{ idx + 1 }}</span>
              <input
                class="form-input section-title-input"
                type="text"
                v-model="sec.sectionTitle"
                placeholder="輸入段落標題"
              />
              <label class="hide-toggle" :title="sec.isHide ? '已隱藏（前台不顯示）' : '顯示中'">
                <input type="checkbox" v-model="sec.isHide" />
                <iconify-icon :icon="sec.isHide ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="16"></iconify-icon>
              </label>
              <button class="icon-btn danger" @click="removeSection(idx)" title="移除段落">
                <iconify-icon icon="mdi:trash-can-outline" width="16"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- ══ SEO 預覽區 ══ -->
        <div class="seo-preview-card">
          <div class="seo-preview-header">
            <iconify-icon icon="mdi:google" width="16"></iconify-icon>
            SEO 預覽（Google 搜尋結果）
          </div>
          <div class="seo-preview-body">
            <div class="seo-url">
              zmnzmnpusin.com.tw /
              <span class="seo-slug">{{ seoUrlParts.mainSlug }}</span>
              <template v-if="seoUrlParts.subSlug"> / <span class="seo-slug">{{ seoUrlParts.subSlug }}</span></template>
               / <span class="seo-slug">{{ seoUrlParts.code }}</span>
            </div>
            <div class="seo-title">{{ form.title || '（文章標題）' }}</div>
            <div class="seo-desc">{{ form.summary || '（文章摘要將顯示於此，建議填寫 50–160 字）' }}</div>
          </div>
          <div class="seo-fields">
            <div class="seo-field-row">
              <span class="seo-field-label">Meta Title</span>
              <span class="seo-field-value">{{ form.title || '（同文章標題）' }}</span>
            </div>
            <div class="seo-field-row">
              <span class="seo-field-label">Meta Description</span>
              <span class="seo-field-value">{{ form.summary || '（同文章摘要）' }}</span>
            </div>
            <div class="seo-field-row">
              <span class="seo-field-label">URL Slug</span>
              <div class="seo-slug-input-wrap">
                <span class="form-input form-input-sm" style="background:#f3f4f6;color:#6b7280;display:block;padding:6px 10px;border-radius:4px;font-size:13px;">
                  {{ form.code || '（新增後由系統自動產生）' }}
                </span>
                <span class="seo-slug-hint">由系統自動產生，不可修改</span>
              </div>
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
          <button class="btn btn-outline" :disabled="saving" @click="handleSave('draft')">
            <iconify-icon icon="mdi:content-save-outline" width="16"></iconify-icon>
            {{ saving ? '儲存中...' : '儲存草稿' }}
          </button>
          <button class="btn btn-primary" :disabled="saving" @click="handleSave('published')">
            <iconify-icon icon="mdi:publish" width="16"></iconify-icon>
            {{ saving ? '發布中...' : '發布文章' }}
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
            :key="sec._key"
            class="section-nav-item"
            :class="{ active: currentSectionIndex === idx, hidden: sec.isHide }"
            @click="currentSectionIndex = idx"
          >
            <span class="section-nav-num">{{ idx + 1 }}</span>
            <span class="section-nav-title">{{ sec.sectionTitle || '（未命名段落）' }}</span>
            <iconify-icon v-if="sec.isHide" icon="mdi:eye-off-outline" width="12" class="nav-hide-icon"></iconify-icon>
          </div>

          <!-- 封面圖上傳（側欄） -->
          <div class="cover-upload-panel" v-if="isEditing && _editingId">
            <div class="cover-upload-header">
              <iconify-icon icon="mdi:image-outline" width="14"></iconify-icon>
              封面圖
            </div>
            <div class="cover-preview" v-if="coverPreviewUrl">
              <img :src="coverPreviewUrl" alt="封面圖預覽" />
            </div>
            <div class="cover-placeholder" v-else>
              <iconify-icon icon="mdi:image-plus-outline" width="28"></iconify-icon>
              <span>尚未上傳封面圖</span>
            </div>
            <label class="btn btn-outline btn-sm cover-upload-btn">
              <iconify-icon icon="mdi:upload" width="14"></iconify-icon>
              {{ coverUploading ? '上傳中...' : '選擇圖片' }}
              <input type="file" accept="image/jpeg,image/png,image/webp" style="display:none" @change="onCoverFileChange" :disabled="coverUploading" />
            </label>
            <span class="cover-hint">jpg / png / webp，最大 5 MB</span>
          </div>
        </div>

        <!-- 右側：富文本編輯 -->
        <div class="section-editor-main">
          <template v-if="currentSection">
            <div class="section-editor-header">
              <h3 class="section-editor-title">
                <span class="section-editor-num">{{ currentSectionIndex + 1 }}</span>
                {{ currentSection.sectionTitle || '（未命名段落）' }}
                <span v-if="currentSection.isHide" class="hide-badge">隱藏中</span>
              </h3>
              <span class="autosave-hint" v-if="lastSavedAt">
                <iconify-icon icon="mdi:cloud-check-outline" width="14"></iconify-icon>
                已自動暫存 {{ lastSavedAt }}
              </span>
            </div>
            <ClientOnly>
              <RichTextEditor
                :key="currentSection._key || currentSectionIndex"
                v-model="currentSection.content"
                :upload-handler="uploadHandler"
              />
            </ClientOnly>
          </template>
          <div class="no-section-hint" v-else>
            請從左側選擇一個段落開始編輯
          </div>
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
              <div
                v-for="(sec, idx) in form.sections.filter(s => !s.isHide)"
                :key="sec._key"
                class="preview-section-block"
              >
                <h2 class="preview-section-title">{{ sec.sectionTitle || `段落 ${idx + 1}` }}</h2>
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
          <div class="protection-page-preview" v-if="previewDetail">
            <div class="unified-container-preview">
              <div class="content-header-preview">
                <h2 class="content-title-preview">{{ previewDetail.title }}</h2>
              </div>
              <div
                v-for="(sec, idx) in previewDetail.sections.filter(s => !s.isHide)"
                :key="idx"
                class="preview-section-block"
              >
                <h2 class="preview-section-title">{{ sec.sectionTitle }}</h2>
                <article
                  class="rich-text-content-preview"
                  v-html="sec.content || '<p><em>（此段落尚無內容）</em></p>'"
                ></article>
              </div>
            </div>
          </div>
          <div v-else class="empty-row" style="padding:40px;text-align:center">
            <iconify-icon icon="mdi:loading" width="24" class="spin"></iconify-icon>
            載入中...
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showListPreview = false">關閉</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { RichTextEditor } from 'christy-richtext';

definePageMeta({ layout: 'admin', middleware: 'backoffice-auth' });
useHead({ title: '文章管理' });
</script>

<script>
import Swal from 'sweetalert2';
import { articlesAPI, categoriesAPI } from '~/composables/utils/api';

let _keyCounter = 0;
const newKey = () => ++_keyCounter;

export default {
  name: 'AdminArticlesPage',

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
      view: 'list',
      isEditing: false,
      _editingId: null,
      saving: false,

      // 列表
      articles: [],
      listLoading: false,
      searchKeyword: '',
      filterMainCatId: '',
      filterStatus: '',

      // 類別
      mainCategories: [],
      subCategoriesMap: {},
      subCatsLoading: false,

      // 預覽
      showPreview: false,
      showListPreview: false,
      previewDetail: null,

      // 封面
      coverPreviewUrl: null,
      coverUploading: false,

      // 編輯器
      currentSectionIndex: 0,
      lastSavedAt: '',
      dragIndex: null,
      dragOverIndex: null,

      formErrors: {},
      form: this.emptyForm(),
    };
  },

  computed: {
    isDirty() {
      return this.view === 'step1' || this.view === 'step2';
    },

    filteredArticles() {
      return this.articles.filter((a) => {
        const matchTitle  = !this.searchKeyword   || a.title.includes(this.searchKeyword);
        const matchCat    = !this.filterMainCatId || a.mainCategoryId === Number(this.filterMainCatId);
        const matchStatus = !this.filterStatus    || a.status === this.filterStatus;
        return matchTitle && matchCat && matchStatus;
      });
    },

    currentSubCategories() {
      if (!this.form.mainCategoryId) return [];
      return this.subCategoriesMap[this.form.mainCategoryId] || [];
    },

    currentSection() {
      return this.form.sections[this.currentSectionIndex] || null;
    },

    seoSlug() {
      const code = (this.form.code || '').trim();
      if (code) return code;
      return (this.form.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '')
        || '';
    },

    seoUrlParts() {
      const slugify = (str) => (str || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9一-鿿\-]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '') || str;

      const mainCat = this.mainCategories.find(c => c.id === Number(this.form.mainCategoryId));
      const mainSlug = mainCat ? slugify(mainCat.name) : '（母類別）';

      const subCat = this.currentSubCategories.find(s => s.id === Number(this.form.subCategoryId));
      const subSlug = subCat ? slugify(subCat.name) : null;

      const code = this.seoSlug || '（文章代碼）';

      return { mainSlug, subSlug, code };
    },
  },

  watch: {
    form: {
      handler() {
        if (!this.isDirty) return;
        this.autoSaveToStorage();
      },
      deep: true,
    },
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.loadMainCategories();
    this.loadArticles();
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },

  methods: {
    emptyForm() {
      return { title: '', mainCategoryId: '', subCategoryId: '', summary: '', code: '', isFeatured: false, sections: [] }; // code 唯讀，僅顯示用
    },

    formatDate(dateStr) {
      if (!dateStr) return '—';
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    async loadMainCategories() {
      try {
        const res = await categoriesAPI.getAllMain();
        this.mainCategories = (res.data || []).map(c => ({ id: c.id, name: c.name }));
      } catch (_) {}
    },

    async loadSubCatsForMain(id) {
      if (!id) return;
      if (this.subCategoriesMap[id] !== undefined) return;
      this.subCatsLoading = true;
      try {
        const res = await categoriesAPI.getSubByMain(id);
        this.subCategoriesMap = { ...this.subCategoriesMap, [id]: (res.data || []).map(s => ({ id: s.id, name: s.name })) };
      } catch (e) {
        console.error('載入子類別失敗', e);
        this.subCategoriesMap = { ...this.subCategoriesMap, [id]: [] };
      } finally {
        this.subCatsLoading = false;
      }
    },

    async onMainCatChange() {
      this.form.subCategoryId = '';
      await this.loadSubCatsForMain(Number(this.form.mainCategoryId));
    },

    async loadArticles() {
      this.listLoading = true;
      try {
        const res = await articlesAPI.getList();
        this.articles = res.data || [];
      } catch (e) {
        Swal.fire({ icon: 'error', title: '載入失敗', text: e?.response?.data?.message || '無法取得文章列表', timer: 3000, showConfirmButton: false });
      } finally {
        this.listLoading = false;
      }
    },

    autoSaveToStorage() {
      const data = { form: JSON.parse(JSON.stringify(this.form)), isEditing: this.isEditing, _editingId: this._editingId, coverPreviewUrl: this.coverPreviewUrl };
      localStorage.setItem('Article', JSON.stringify(data));
      const now = new Date();
      this.lastSavedAt = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    },

    clearStorage() { localStorage.removeItem('Article'); this.lastSavedAt = ''; },

    handleBeforeUnload(e) { if (this.isDirty) { e.preventDefault(); e.returnValue = ''; } },

    async tryGoToList() {
      const result = await Swal.fire({
        title: '確認取消編輯', text: '確認要取消嗎？未儲存的內容將會遺失。', icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#e53e3e', cancelButtonColor: '#6b7280',
        confirmButtonText: '確認離開', cancelButtonText: '繼續編輯',
      });
      if (result.isConfirmed) { this.clearStorage(); this.view = 'list'; }
    },

    async openCreate() {
      const saved = localStorage.getItem('Article');
      if (saved) {
        const r = await Swal.fire({
          title: '發現未完成的草稿', text: '偵測到上次未完成的編輯，是否還原繼續？', icon: 'question',
          showCancelButton: true, confirmButtonColor: '#2c5282', cancelButtonColor: '#6b7280',
          confirmButtonText: '還原草稿', cancelButtonText: '重新開始',
        });
        if (r.isConfirmed) {
          try {
            const data = JSON.parse(saved);
            this.isEditing = data.isEditing || false;
            this._editingId = data._editingId || null;
            this.coverPreviewUrl = data.coverPreviewUrl || null;
            this.form = data.form || this.emptyForm();
            this.form.sections.forEach(s => { if (!s._key) s._key = newKey(); });
            this.formErrors = {};
            this.currentSectionIndex = 0;
            this.view = 'step1';
            return;
          } catch (_) {}
        }
        this.clearStorage();
      }
      this.isEditing = false;
      this._editingId = null;
      this.coverPreviewUrl = null;
      this.form = this.emptyForm();
      this.formErrors = {};
      this.currentSectionIndex = 0;
      this.view = 'step1';
    },

    async openEdit(id) {
      Swal.fire({ title: '載入中...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const res = await articlesAPI.getDetail(id);
        const art = res.data;
        Swal.close();
        this.isEditing = true;
        this._editingId = id;
        this.coverPreviewUrl = art.coverImageUrl || null;
        this.form = {
          title: art.title,
          mainCategoryId: art.mainCategoryId,
          subCategoryId: art.subCategoryId || '',
          summary: art.summary || '',
          code: art.code || '',
          isFeatured: art.isFeatured || false,
          sections: (art.sections || []).map(s => ({
            _key: newKey(),
            sectionTitle: s.sectionTitle,
            content: s.content || '',
            sortOrder: s.sortOrder,
            isHide: s.isHide || false,
          })),
        };
        if (art.mainCategoryId) {
          await this.loadSubCatsForMain(art.mainCategoryId);
        }
        this.formErrors = {};
        this.currentSectionIndex = 0;
        this.view = 'step1';
      } catch (e) {
        Swal.fire({ icon: 'error', title: '載入失敗', text: '無法讀取文章資料', timer: 2500, showConfirmButton: false });
      }
    },

    async openListPreview(artItem) {
      this.previewDetail = null;
      this.showListPreview = true;
      try {
        const res = await articlesAPI.getDetail(artItem.id);
        this.previewDetail = res.data;
      } catch (_) {
        this.showListPreview = false;
        Swal.fire({ icon: 'error', title: '預覽失敗', timer: 2000, showConfirmButton: false });
      }
    },

    async confirmDelete(art) {
      const result = await Swal.fire({
        title: '確認刪除',
        html: `確定要刪除文章 <strong>「${art.title}」</strong> 嗎？<br>此操作無法復原。`,
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#e53e3e', cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除', cancelButtonText: '取消',
      });
      if (!result.isConfirmed) return;
      Swal.fire({ title: '刪除中...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        await articlesAPI.remove(art.id);
        await this.loadArticles();
        Swal.fire({ icon: 'success', title: '已刪除', timer: 1600, showConfirmButton: false });
      } catch (e) {
        Swal.fire({ icon: 'error', title: '刪除失敗', text: e?.response?.data?.message || '請稍後再試', timer: 3000, showConfirmButton: false });
      }
    },

    addSection() {
      this.form.sections.push({ _key: newKey(), sectionTitle: '', content: '', sortOrder: this.form.sections.length, isHide: false });
    },

    removeSection(idx) {
      this.form.sections.splice(idx, 1);
      if (this.currentSectionIndex >= this.form.sections.length) {
        this.currentSectionIndex = Math.max(0, this.form.sections.length - 1);
      }
    },

    onSectionDrop(toIdx) {
      const fromIdx = this.dragIndex;
      if (fromIdx === null || fromIdx === toIdx) return;
      const secs = [...this.form.sections];
      const [moved] = secs.splice(fromIdx, 1);
      secs.splice(toIdx, 0, moved);
      this.form.sections = secs;
      this.dragIndex = null;
      this.dragOverIndex = null;
    },

    validateStep1() {
      this.formErrors = {};
      if (!this.form.title.trim()) this.formErrors.title = '請輸入文章標題';
      if (!this.form.mainCategoryId) this.formErrors.mainCategoryId = '請選擇母類別';
      if (this.form.sections.length === 0) {
        this.formErrors.sections = '請至少新增一個目錄段落';
      } else if (this.form.sections.some(s => !s.sectionTitle.trim())) {
        this.formErrors.sections = '所有段落標題不能為空';
      }
      return Object.keys(this.formErrors).length === 0;
    },

    goToStep2() {
      if (!this.validateStep1()) return;
      this.currentSectionIndex = 0;
      this.view = 'step2';
    },

    openPreviewAll() { this.showPreview = true; },

    async handleSave(status) {
      if (this.saving) return;
      this.saving = true;
      Swal.fire({ title: status === 'published' ? '發布中...' : '儲存中...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const payload = {
          title: this.form.title.trim(),
          mainCategoryId: Number(this.form.mainCategoryId),
          subCategoryId: this.form.subCategoryId ? Number(this.form.subCategoryId) : null,
          summary: this.form.summary?.trim() || null,
          status,
          isFeatured: this.form.isFeatured,
          sections: this.form.sections.map((s, idx) => ({
            sectionTitle: s.sectionTitle.trim(),
            content: s.content || '',
            sortOrder: idx,
            isHide: s.isHide || false,
          })),
        };
        if (this.isEditing && this._editingId) {
          await articlesAPI.update(this._editingId, payload);
        } else {
          await articlesAPI.create(payload);
        }
        this.clearStorage();
        await this.loadArticles();
        this.view = 'list';
        Swal.fire({ icon: 'success', title: status === 'published' ? '文章已發布' : '草稿已儲存', timer: 1600, showConfirmButton: false });
      } catch (e) {
        Swal.fire({ icon: 'error', title: '儲存失敗', text: e?.response?.data?.message || '請檢查欄位後重試', timer: 3500, showConfirmButton: false });
      } finally {
        this.saving = false;
      }
    },

    // ===== 上傳前將圖片壓縮並轉成 WebP =====
    // 透過 canvas 重新繪製後輸出 webp，可大幅降低容量、加快網站反應速度。
    // 動圖（gif）轉 webp 會失去動畫、瀏覽器不支援或轉檔後反而更大時，皆退回原檔。
    async compressToWebp(file, { maxSize = 1920, quality = 0.82 } = {}) {
      if (!file || !file.type.startsWith('image/') || file.type === 'image/gif') return file;

      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = dataUrl;
        });

        let width = img.naturalWidth;
        let height = img.naturalHeight;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
        // 瀏覽器不支援 webp 輸出，或轉檔後反而更大時，保留原檔
        if (!blob || blob.size >= file.size) return file;

        const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
        return new File([blob], newName, { type: 'image/webp', lastModified: Date.now() });
      } catch (_) {
        return file; // 轉檔發生例外時退回原檔，確保上傳流程不中斷
      }
    },

    async onCoverFileChange(e) {
      const file = e.target.files?.[0];
      if (!file || !this._editingId) return;
      this.coverUploading = true;
      try {
        const webpFile = await this.compressToWebp(file);
        const res = await articlesAPI.uploadCover(this._editingId, webpFile);
        this.coverPreviewUrl = res.data?.url || null;
        Swal.fire({ icon: 'success', title: '封面圖已上傳', timer: 1400, showConfirmButton: false });
      } catch (e) {
        Swal.fire({ icon: 'error', title: '上傳失敗', text: e?.response?.data?.message || '請稍後再試', timer: 3000, showConfirmButton: false });
      } finally {
        this.coverUploading = false;
        e.target.value = '';
      }
    },

    // ===== 富文本編輯器：內文圖片上傳處理器 =====
    // 回傳圖片網址字串給編輯器，編輯器就會插入該 URL 而不是 base64。
    // 相容後端回傳 { url } 或 { data: { url } } 兩種格式。
    async uploadHandler(file) {
      const webpFile = await this.compressToWebp(file);
      const res = await articlesAPI.uploadImage(webpFile);
      const url = res?.data?.url || res?.url;
      if (!url) throw new Error('伺服器未回傳圖片 URL');
      return url;
    },
  },
};
</script>

<style>
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.btn-outline {
  display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px;
  border-radius: 8px; font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; background: #fff; border: 1.5px solid #2c5282; color: #2c5282;
  text-decoration: none; transition: all 0.2s; white-space: nowrap;
}
.btn-outline:hover { background: #eef3fa; }
.btn-outline:disabled { opacity: 0.45; cursor: not-allowed; }

.action-btns { display: flex; flex-direction: row; align-items: center; gap: 5px; flex-wrap: nowrap; }
.btn-preview {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px;
  border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit;
  cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap;
  background: #f0f9f0; color: #276749;
}
.btn-preview:hover { background: #dcf0dc; }

.status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.status-badge.published { background: #e6f6ee; color: #276749; }
.status-badge.draft { background: #f5f5f5; color: #888; }
.cat-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.cat-badge.parent { background: #eef3fa; color: #2c5282; }
.cat-badge.sub { background: #f0f9f0; color: #276749; }
.no-sub { color: #ccc; font-size: 13px; }
.section-count-badge { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #f0f0f0; color: #666; }
.td-title { font-weight: 600; color: #1a2744; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-date { font-size: 13px; color: #aaa; white-space: nowrap; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Step 1 */
.step-card {
  background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 28px 32px; max-width: 820px; display: flex; flex-direction: column; gap: 22px;
}
.step-indicator { display: flex; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
.step-item { display: flex; align-items: center; gap: 8px; }
.step-num {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%; font-size: 13px; font-weight: 700;
  background: #e0e0e0; color: #999; flex-shrink: 0;
}
.step-item.active .step-num { background: #2c5282; color: #fff; }
.step-label { font-size: 14px; font-weight: 600; color: #999; }
.step-item.active .step-label { color: #1a2744; }
.step-divider { flex: 1; height: 2px; background: #e0e0e0; margin: 0 16px; max-width: 80px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-input-lg { font-size: 15px; padding: 11px 14px; }
.form-input-sm { font-size: 13px; padding: 6px 10px; }
.form-group-inline { display: flex; align-items: center; }
.char-count { font-size: 12px; color: #aaa; margin-top: 4px; text-align: right; }
.char-count.warn { color: #e53e3e; }
.toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; color: #444; }
.toggle-input { display: none; }
.toggle-track {
  width: 40px; height: 22px; border-radius: 999px; background: #d0d0d0;
  position: relative; transition: background 0.2s; flex-shrink: 0;
}
.toggle-input:checked + .toggle-track { background: #2c5282; }
.toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left 0.2s;
}
.toggle-input:checked + .toggle-track::after { left: 21px; }

.sections-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.btn-sm { padding: 6px 12px !important; font-size: 13px !important; }
.sections-list { display: flex; flex-direction: column; gap: 6px; }
.sections-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 32px 16px; color: #bbb; font-size: 13px;
  background: #fafafa; border-radius: 8px; border: 1.5px dashed #ddd;
}
.section-row {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  background: #f8f9fb; border: 1.5px solid #e8e8e8; border-radius: 8px; transition: all 0.15s;
}
.section-row:hover { border-color: #c0cfe8; background: #f2f5fa; }
.section-row.drag-over { border-color: #2c5282; background: #eef3fa; }
.section-row.dragging { opacity: 0.45; }
.section-drag-handle { color: #bbb; cursor: grab; flex-shrink: 0; display: flex; align-items: center; }
.section-drag-handle:active { cursor: grabbing; }
.section-order-num {
  flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%;
  background: #2c5282; color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.section-title-input { flex: 1; background: #fff; }
.hide-toggle { display: flex; align-items: center; cursor: pointer; padding: 4px 6px; border-radius: 6px; color: #aaa; }
.hide-toggle:hover { background: #f0f0f0; }
.hide-toggle input { display: none; }
.step-footer { display: flex; justify-content: flex-end; padding-top: 8px; border-top: 1px solid #f0f0f0; }

/* SEO 預覽 */
.seo-preview-card { background: #f8f9ff; border: 1.5px solid #d0daf0; border-radius: 10px; overflow: hidden; }
.seo-preview-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 16px;
  font-size: 13px; font-weight: 700; color: #555;
  background: #eef0f8; border-bottom: 1px solid #d0daf0;
}
.seo-preview-body { padding: 14px 18px; border-bottom: 1px solid #d0daf0; }
.seo-url { font-size: 12px; color: #0a7c42; margin-bottom: 4px; }
.seo-slug { font-weight: 600; }
.seo-title { font-size: 17px; color: #1a0dab; font-weight: 600; margin-bottom: 4px; line-height: 1.4; }
.seo-desc { font-size: 13px; color: #4d5156; line-height: 1.5; }
.seo-fields { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; }
.seo-field-row { display: flex; align-items: flex-start; gap: 12px; }
.seo-field-label { flex-shrink: 0; width: 120px; font-size: 12px; font-weight: 700; color: #888; padding-top: 5px; }
.seo-field-value { font-size: 13px; color: #333; flex: 1; }
.seo-slug-input-wrap { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.seo-slug-hint { font-size: 11px; color: #aaa; }

/* Step 2 */
.editor2-layout { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: start; }
.section-nav-panel {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; position: sticky; top: 80px;
}
.section-nav-header {
  display: flex; align-items: center; gap: 6px; padding: 12px 14px;
  font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase;
  letter-spacing: 0.5px; border-bottom: 1px solid #f0f0f0; background: #f8f9fb;
}
.section-nav-item {
  display: flex; align-items: center; gap: 8px; padding: 11px 14px;
  cursor: pointer; transition: all 0.15s; border-bottom: 1px solid #f5f5f5;
}
.section-nav-item:last-of-type { border-bottom: none; }
.section-nav-item:hover { background: #f5f7fa; }
.section-nav-item.active { background: #eef3fa; }
.section-nav-item.hidden { opacity: 0.5; }
.section-nav-num {
  flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
  background: #e0e0e0; color: #888; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.section-nav-item.active .section-nav-num { background: #2c5282; color: #fff; }
.section-nav-title { font-size: 13px; color: #444; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.section-nav-item.active .section-nav-title { color: #1a2744; font-weight: 600; }
.nav-hide-icon { color: #ccc; flex-shrink: 0; }

.cover-upload-panel { padding: 14px; border-top: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 8px; }
.cover-upload-header { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #888; }
.cover-preview img { width: 100%; border-radius: 6px; object-fit: cover; max-height: 120px; }
.cover-placeholder {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 16px 8px; color: #ccc; font-size: 12px;
  background: #f8f9fb; border-radius: 6px; border: 1.5px dashed #ddd;
}
.cover-upload-btn { display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; font-size: 12px; }
.cover-hint { font-size: 11px; color: #bbb; text-align: center; }

.section-editor-main { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.section-editor-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid #f0f0f0; background: #f8f9fb;
}
.section-editor-title { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; color: #1a2744; }
.section-editor-num {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: #2c5282; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.hide-badge {
  font-size: 11px; font-weight: 600; color: #e53e3e;
  background: #fff0f0; padding: 2px 8px; border-radius: 999px; border: 1px solid #fecaca;
}
.autosave-hint { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #52a169; }
.no-section-hint { padding: 60px 24px; text-align: center; color: #aaa; font-size: 14px; }

/* Modal */
.modal-preview { max-width: 860px; width: 95vw; max-height: 88vh; }
.preview-body { padding: 0 !important; background: #fffaf0; }
.protection-page-preview { padding: 24px 20px; background: #fffaf0; min-height: 300px; }
.unified-container-preview { background: white; border-radius: 12px; padding: 28px 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 780px; margin: 0 auto; }
.content-header-preview { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px solid #5aa0c8; }
.content-title-preview { font-size: 26px; font-weight: bold; color: #143c64; margin: 0; }
.preview-section-block { margin-bottom: 28px; }
.preview-section-title { display: flex; align-items: center; font-size: 26px; font-weight: 700; color: #b7791f; margin: 0 0 12px; padding-left: 14px; border-left: 4px solid #ecc94b; }
.rich-text-content-preview { color: #333; font-size: 15px; line-height: 1.8; }
.rich-text-content-preview p { margin: 0 0 12px; }
.rich-text-content-preview strong { font-weight: 700; }
.rich-text-content-preview h1 { color: #143c64; font-size: 18px; margin: 16px 0 8px; }
.rich-text-content-preview h2 { color: #143c64; font-size: 16px; margin: 16px 0 8px; }
.rich-text-content-preview h3 { color: #143c64; font-size: 14px; margin: 12px 0 6px; }
.rich-text-content-preview ul,.rich-text-content-preview ol { padding-left: 24px; margin: 12px 0; }
.rich-text-content-preview li { margin-bottom: 6px; }
.rich-text-content-preview blockquote { border-left: 4px solid #5aa0c8; margin: 16px 0; padding: 10px 16px; background: #f8f9ff; border-radius: 0 8px 8px 0; }

@media (max-width: 960px) {
  .editor2-layout { grid-template-columns: 1fr; }
  .section-nav-panel { position: static; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .data-table { min-width: 720px; }
  .step-card { padding: 20px 16px; }
}
</style>
