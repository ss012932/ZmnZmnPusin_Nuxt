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
              <th>狀態</th>
              <th>更新時間</th>
              <th style="width:190px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredArticles.length === 0">
              <td colspan="6" class="empty-row">目前沒有符合條件的文章</td>
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
                <span class="status-badge" :class="art.status">
                  {{ art.status === 'published' ? '已發布' : '草稿' }}
                </span>
              </td>
              <td class="td-date">{{ art.updatedAt }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-action btn-preview" @click="openPreview(art)" title="預覽">
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

    <!-- ══ 新增 / 編輯文章畫面 ══ -->
    <template v-if="view === 'editor'">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ isEditing ? '編輯文章' : '新增文章' }}</h2>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" @click="view = 'list'">
            <iconify-icon icon="mdi:close" width="16"></iconify-icon>
            取消
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

      <div class="editor-layout">
        <!-- 左欄：文章內容 -->
        <div class="editor-main">
          <div class="editor-card">
            <div class="form-group">
              <label class="form-label">文章標題 <span class="required">*</span></label>
              <input class="form-input form-input-lg" type="text" v-model="form.title" placeholder="輸入文章標題" />
              <span class="form-error" v-if="formErrors.title">{{ formErrors.title }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">文章內容 <span class="required">*</span></label>
              <div class="richtext-wrap">
                <client-only>
                  <ChristyRichtext v-model="form.content" :placeholder="'請輸入文章內容...'" />
                </client-only>
              </div>
              <span class="form-error" v-if="formErrors.content">{{ formErrors.content }}</span>
            </div>
          </div>
        </div>

        <!-- 右欄：設定 -->
        <div class="editor-side">
          <div class="editor-card">
            <h4 class="side-section-title">
              <iconify-icon icon="mdi:tag-outline" width="16"></iconify-icon>
              分類設定
            </h4>

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

            <NuxtLink to="/admin/categories" class="cat-manage-link">
              <iconify-icon icon="mdi:cog-outline" width="14"></iconify-icon>
              管理類別設定
            </NuxtLink>
          </div>

          <div class="editor-card">
            <h4 class="side-section-title">
              <iconify-icon icon="mdi:eye-outline" width="16"></iconify-icon>
              預覽
            </h4>
            <button
              class="btn btn-outline preview-btn"
              :disabled="!form.content"
              @click="previewForm"
            >
              <iconify-icon icon="mdi:eye-outline" width="16"></iconify-icon>
              預覽文章排版
            </button>
            <p class="preview-hint">預覽排版與前台相同</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ══ 預覽 Modal ══ -->
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
          <!-- 前台風格 -->
          <div class="protection-page-preview">
            <div class="unified-container-preview">
              <div class="content-header-preview">
                <h2 class="content-title-preview">{{ previewData.title }}</h2>
              </div>
              <div class="section-content-preview">
                <article class="rich-text-content-preview" v-html="previewData.content"></article>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showPreview = false">關閉</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { ChristyRichtext } from 'christy-richtext';
import 'christy-richtext/dist-lib/christy-richtext.css';
import Swal from 'sweetalert2';

definePageMeta({ layout: 'admin' });

export default {
  name: 'AdminArticlesPage',

  components: { ChristyRichtext },

  data() {
    return {
      view: 'list',
      searchKeyword: '',
      filterCat: '',
      filterStatus: '',
      showPreview: false,
      isEditing: false,
      previewData: { title: '', content: '' },
      nextArticleId: 4,
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
          content: '<p>關節退化是許多中高齡動物常見的問題。年齡增長、肥胖及過度使用，都可能加速軟骨磨損。</p><p><strong>高風險族群</strong>包括肥胖犬貓、曾有關節脫臼或韌帶損傷的動物，以及活動力旺盛、長期劇烈運動的寵物。</p>',
        },
        {
          id: 2,
          title: '子宮蓄膿的認識與預防',
          categoryId: 2,
          subCategoryId: 21,
          status: 'published',
          updatedAt: '2025-06-08',
          content: '<p>子宮蓄膿是未絕育母犬、母貓常見的生殖系統疾病，好發於發情期後。</p><p>最有效的預防方式是<strong>絕育手術</strong>，可大幅降低感染風險與高額的緊急手術費用。</p>',
        },
        {
          id: 3,
          title: '貓咪下泌尿道疾病衛教',
          categoryId: 3,
          subCategoryId: null,
          status: 'draft',
          updatedAt: '2025-06-05',
          content: '<p>貓咪下泌尿道疾病（FLUTD）是貓咪常見的泌尿系統問題，主要與壓力、飲水量不足及飲食有關。</p>',
        },
      ],
    };
  },

  computed: {
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
  },

  methods: {
    emptyForm() {
      return { title: '', content: '', categoryId: '', subCategoryId: '' };
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

    today() {
      return new Date().toISOString().slice(0, 10);
    },

    openCreate() {
      this.isEditing = false;
      this.form = this.emptyForm();
      this.formErrors = {};
      this.view = 'editor';
    },

    openEdit(art) {
      this.isEditing = true;
      this._editingId = art.id;
      this.form = {
        title: art.title,
        content: art.content,
        categoryId: art.categoryId,
        subCategoryId: art.subCategoryId || '',
      };
      this.formErrors = {};
      this.view = 'editor';
    },

    validate() {
      this.formErrors = {};
      if (!this.form.title.trim()) this.formErrors.title = '請輸入文章標題';
      if (!this.form.content || this.form.content === '<p></p>') this.formErrors.content = '請輸入文章內容';
      if (!this.form.categoryId) this.formErrors.categoryId = '請選擇母類別';
      return Object.keys(this.formErrors).length === 0;
    },

    handleSave(status) {
      if (!this.validate()) return;

      const payload = {
        title: this.form.title.trim(),
        content: this.form.content,
        categoryId: Number(this.form.categoryId),
        subCategoryId: this.form.subCategoryId ? Number(this.form.subCategoryId) : null,
        status,
        updatedAt: this.today(),
      };

      if (this.isEditing) {
        const idx = this.articles.findIndex((a) => a.id === this._editingId);
        if (idx !== -1) this.articles.splice(idx, 1, { id: this._editingId, ...payload });
      } else {
        this.articles.push({ id: this.nextArticleId++, ...payload });
      }

      this.view = 'list';
    },

    openPreview(art) {
      this.previewData = { title: art.title, content: art.content };
      this.showPreview = true;
    },

    previewForm() {
      this.previewData = { title: this.form.title || '（無標題）', content: this.form.content };
      this.showPreview = true;
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
  },
};
</script>

<style>
/* ── 頁首與按鈕沿用 doctor-admin 的通用樣式 ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── 連結型 btn-outline（NuxtLink） ── */
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

/* ── 操作按鈕（橫向） ── */
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

/* ── 狀態 badge ── */
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

.td-title {
  font-weight: 600;
  color: #1a2744;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.td-date { font-size: 13px; color: #aaa; white-space: nowrap; }

/* ── 編輯器佈局 ── */
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  align-items: start;
}

.editor-main { min-width: 0; }

.editor-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 22px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #1a2744;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.form-input-lg { font-size: 16px; padding: 11px 14px; }

.richtext-wrap {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  min-height: 360px;
  overflow: hidden;
}

.richtext-wrap:focus-within { border-color: #2c5282; }

.preview-btn {
  width: 100%;
  justify-content: center;
}

.preview-hint {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}

.cat-manage-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #2c5282;
  text-decoration: none;
  margin-top: 4px;
}

.cat-manage-link:hover { text-decoration: underline; }

/* ── 預覽 Modal ── */
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
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 3px solid #5aa0c8;
}

.content-title-preview {
  font-size: 20px;
  font-weight: bold;
  color: #143c64;
  margin: 0;
}

.section-content-preview { margin-bottom: 20px; }

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
  .editor-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .data-table { min-width: 680px; }
}
</style>
