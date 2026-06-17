<template>
  <div class="doctor-admin">

    <!-- 頁首 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">醫師管理</h2>
        <p class="page-desc">管理前台「醫療團隊」頁面顯示的醫師資料</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <iconify-icon icon="mdi:plus" width="18"></iconify-icon>
        新增醫師
      </button>
    </div>

    <!-- 篩選列 -->
    <div class="filter-bar">
      <div class="search-wrap">
        <iconify-icon icon="mdi:magnify" width="17" class="search-icon"></iconify-icon>
        <input class="search-input" type="text" v-model="searchKeyword" placeholder="搜尋醫師姓名..." />
      </div>
      <select class="filter-select" v-model="filterDept">
        <option value="">全部科別</option>
        <option v-for="d in departments" :key="d.key" :value="d.key">{{ d.label }}</option>
      </select>
    </div>

    <!-- 表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:32px"></th>
            <th style="width:56px">照片</th>
            <th>姓名</th>
            <th>科別</th>
            <th>職稱</th>
            <th>專業領域</th>
            <th style="width:148px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isFetching">
            <td colspan="7" class="empty-row">
              <iconify-icon icon="mdi:loading" width="20" class="spin"></iconify-icon>
              載入中...
            </td>
          </tr>
          <tr v-else-if="filteredDoctors.length === 0">
            <td colspan="7" class="empty-row">目前沒有符合條件的醫師</td>
          </tr>
          <tr
            v-for="(doc, idx) in filteredDoctors"
            :key="doc.id"
            :data-doc-id="doc.id"
            draggable="true"
            :class="{
              'tr-dragging': drag.docId === doc.id,
              'tr-drag-over': drag.overDocId === doc.id && drag.docId !== doc.id,
            }"
            @dragstart="dragStart($event, doc.id)"
            @dragover.prevent="dragOver(doc.id)"
            @dragleave="dragLeave"
            @drop.prevent="drop(doc)"
            @dragend="dragEnd"
          >
            <td class="td-drag"
              @touchstart="touchDragStart($event, doc.id)"
            >
              <iconify-icon icon="mdi:drag-vertical" width="18" class="drag-handle"></iconify-icon>
            </td>
            <td>
              <img :src="doc.photo" :alt="doc.name" class="table-avatar" />
            </td>
            <td class="td-name">{{ doc.name }}</td>
            <td><span class="dept-badge">{{ doc.department }}</span></td>
            <td>
              <div class="tag-list">
                <span v-for="(t, i) in doc.titleTags" :key="i" class="title-tag">{{ t }}</span>
              </div>
            </td>
            <td>
              <div class="tag-list">
                <span v-for="(s, i) in doc.specialties.slice(0, 3)" :key="i" class="spec-chip">{{ s }}</span>
                <span v-if="doc.specialties.length > 3" class="spec-more">+{{ doc.specialties.length - 3 }}</span>
              </div>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-action btn-edit" @click="openEdit(doc)">
                  <iconify-icon icon="mdi:pencil-outline" width="14"></iconify-icon>編輯
                </button>
                <button class="btn-action btn-delete" @click="confirmDelete(doc)">
                  <iconify-icon icon="mdi:trash-can-outline" width="14"></iconify-icon>刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ 新增/編輯 Modal（橫向三區塊） ══ -->
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="modal modal-wide">

        <div class="modal-header">
          <h3 class="modal-title">
            <iconify-icon :icon="isEditing ? 'mdi:account-edit-outline' : 'mdi:account-plus-outline'" width="20"></iconify-icon>
            {{ isEditing ? '編輯醫師' : '新增醫師' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <iconify-icon icon="mdi:close" width="20"></iconify-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="doctor-form-layout">

            <!-- ── A 欄：照片 ── -->
            <div class="form-col col-photo">
              <span class="col-label">醫師照片</span>

              <!-- 隱藏 file input -->
              <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />

              <!-- 圓形照片預覽 / 上傳區 -->
              <div class="photo-circle-wrap" @click="$refs.fileInput.click()">
                <img v-if="form.photo" :src="form.photo" class="photo-circle-img" alt="醫師照片" />
                <div v-else class="photo-circle-placeholder">
                  <iconify-icon icon="mdi:camera-plus-outline" width="36"></iconify-icon>
                  <span>點擊上傳</span>
                </div>
                <div class="photo-circle-overlay">
                  <iconify-icon icon="mdi:camera-outline" width="24"></iconify-icon>
                  <span>更換照片</span>
                </div>
              </div>

              <p class="photo-hint">建議尺寸 400×400，支援 JPG / PNG<br>可拖曳與縮放進行裁切</p>
            </div>

            <!-- ── B 欄：基本資訊 ── -->
            <div class="form-col col-basic">
              <span class="col-label">基本資訊</span>

              <div class="form-group">
                <label class="form-label">姓名 <span class="required">*</span></label>
                <input class="form-input" type="text" v-model="form.name" placeholder="輸入醫師姓名" />
                <span class="form-error" v-if="formErrors.name">{{ formErrors.name }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">科別 <span class="required">*</span></label>
                <select class="form-input" v-model="form.deptKey">
                  <option value="">請選擇科別</option>
                  <option v-for="d in departments" :key="d.key" :value="d.key">{{ d.label }}</option>
                </select>
                <span class="form-error" v-if="formErrors.deptKey">{{ formErrors.deptKey }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">職稱（每行一個）</label>
                <textarea class="form-textarea" v-model="form.titleTagsRaw" rows="4"
                  placeholder="院長&#10;門診醫療部主任"></textarea>
              </div>
            </div>

            <!-- ── C 欄：詳細資料（內部 2 欄 grid） ── -->
            <div class="form-col col-detail">
              <span class="col-label">詳細資料</span>

              <div class="detail-grid">

                <div class="form-group">
                  <label class="form-label">專業領域（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.specialtiesRaw" rows="5"
                    placeholder="犬貓心臟病&#10;腎臟疾病&#10;內分泌疾病"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">擅長診療項目（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.treatmentsRaw" rows="5"
                    placeholder="心臟超音波與心電圖檢查&#10;腹腔鏡微創手術&#10;腫瘤切除與化療評估"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">學歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.educationRaw" rows="4"
                    placeholder="國立中興大學 獸醫學院 獸醫學系&#10;國立台灣大學 獸醫專業學院 獸醫系"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">證照與資格（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.certificationsRaw" rows="4"
                    placeholder="中華民國獸醫師執照&#10;小動物內科專科認證&#10;ISVS 外科認證"></textarea>
                </div>

                <div class="form-group dg-full">
                  <label class="form-label">就職經歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.workExperienceRaw" rows="4"
                    placeholder="台北動物醫院 住院獸醫師&#10;本院內科 主治獸醫師"></textarea>
                </div>

                <div class="form-group dg-full">
                  <label class="form-label">其他經歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.otherExperienceRaw" rows="3"
                    placeholder="台灣小動物獸醫師學會 會員&#10;亞洲獸醫心臟病學會 研究員"></textarea>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" @click="closeModal">
            <iconify-icon icon="mdi:close" width="16"></iconify-icon>取消
          </button>
          <button class="btn btn-primary" @click="handleSave" :disabled="isLoading">
            <iconify-icon v-if="isLoading" icon="mdi:loading" width="16" class="spin"></iconify-icon>
            <iconify-icon v-else icon="mdi:content-save-outline" width="16"></iconify-icon>
            {{ isLoading ? '處理中...' : (isEditing ? '儲存變更' : '新增醫師') }}
          </button>
        </div>

      </div>
    </div>

    <!-- ══ 圓形裁切 Modal ══ -->
    <div class="modal-backdrop crop-backdrop" v-if="crop.show">
      <div class="modal modal-crop">
        <div class="modal-header">
          <h3 class="modal-title">
            <iconify-icon icon="mdi:crop" width="20"></iconify-icon>
            裁切照片
          </h3>
        </div>
        <div class="modal-body crop-body">
          <p class="crop-hint">
            <iconify-icon icon="mdi:gesture-swipe" width="16"></iconify-icon>
            拖曳移動位置・滾輪縮放大小
          </p>
          <div class="crop-canvas-wrap">
            <canvas
              ref="cropCanvas"
              :width="crop.canvasSize"
              :height="crop.canvasSize"
              class="crop-canvas"
              @mousedown="cropDragStart"
              @mousemove="cropDragMove"
              @mouseup="cropDragEnd"
              @mouseleave="cropDragEnd"
              @wheel.prevent="cropWheel"
              @touchstart.prevent="cropTouchStart"
              @touchmove.prevent="cropTouchMove"
              @touchend="cropDragEnd"
            ></canvas>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="crop.show = false">取消</button>
          <button class="btn btn-primary" @click="confirmCrop">
            <iconify-icon icon="mdi:check" width="16"></iconify-icon>確認裁切
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'backoffice-auth' });
useHead({ title: '醫師管理' });
</script>

<script>
import Swal from 'sweetalert2';
import { doctorsAPI } from '~/composables/utils/api';

export default {
  name: 'AdminDoctorsPage',

  beforeUnmount() {
    this._removeTouchListeners();
  },

  data() {
    return {
      searchKeyword: '',
      filterDept: '',
      showModal: false,
      isEditing: false,
      isLoading: false,   // 新增/編輯送出 loading
      isFetching: false,  // 清單載入 loading
      formErrors: {},
      nextId: 5,
      _croppedBlob: null,   // confirmCrop 後存放，供 handleSave 上傳用
      form: this.emptyForm(),

      /* ── 圓形裁切狀態 ── */
      crop: {
        show: false,
        canvasSize: 340,
        img: null,
        x: 0,
        y: 0,
        scale: 1,
        dragging: false,
        dragStartX: 0,
        dragStartY: 0,
        dragStartImgX: 0,
        dragStartImgY: 0,
      },

      /* ── 拖曳排序狀態 ── */
      drag: {
        docId: null,      // 正在被拖曳的 doc.id
        overDocId: null,  // 目前懸停的目標 doc.id
      },

      departments: [
        { key: 'internal',      label: '犬貓內科' },
        { key: 'surgery',       label: '外科手術' },
        { key: 'cardiology',    label: '心臟科' },
        { key: 'dentistry',     label: '齒科' },
        { key: 'ophthalmology', label: '眼科' },
        { key: 'orthopedics',   label: '骨科' },
        { key: 'neurology',     label: '神經內科' },
        { key: 'obstetrics',    label: '產科' },
        { key: 'oncology',      label: '腫瘤科' },
        { key: 'laser',         label: '雷射治療' },
        { key: 'regenerative',  label: '再生醫療' },
      ],

      doctors: [],
    };
  },

  computed: {
    filteredDoctors() {
      return this.doctors.filter((d) => {
        const matchName = !this.searchKeyword || d.name.includes(this.searchKeyword);
        const matchDept = !this.filterDept || d.deptKey === this.filterDept;
        return matchName && matchDept;
      });
    },
  },

  async mounted() {
    await this.fetchDoctors();
  },

  methods: {
    /* ── 資料載入 ── */
    async fetchDoctors() {
      this.isFetching = true;
      try {
        const res = await doctorsAPI.getAll();
        this.doctors = (res.data || []).map(this.mapApiDoctor);
      } catch (err) {
        Swal.fire({ icon: 'error', title: '載入失敗', text: '無法取得醫師清單，請重新整理' });
      } finally {
        this.isFetching = false;
      }
    },

    /* ── 表單 ── */
    emptyForm() {
      return {
        name: '', photo: '', deptKey: '',
        titleTagsRaw: '', specialtiesRaw: '', treatmentsRaw: '',
        educationRaw: '', workExperienceRaw: '', otherExperienceRaw: '',
        certificationsRaw: '',
      };
    },

    parseLines(raw) {
      return (raw || '').split('\n').map((s) => s.trim()).filter(Boolean);
    },

    deptLabel(key) {
      return this.departments.find((d) => d.key === key)?.label || key;
    },

    openCreate() {
      this.isEditing = false;
      this.form = this.emptyForm();
      this.formErrors = {};
      this._croppedBlob = null;
      this.showModal = true;
    },

    openEdit(doc) {
      this.isEditing = true;
      this._editingId = doc.id;
      this._croppedBlob = null;   // 重置，確保不帶上次裁切的殘留
      this.form = {
        name: doc.name,
        photo: doc.photo,
        deptKey: doc.deptKey,
        titleTagsRaw:      (doc.titleTags      || []).join('\n'),
        specialtiesRaw:    (doc.specialties    || []).join('\n'),
        treatmentsRaw:     (doc.treatments     || []).join('\n'),
        educationRaw:      (doc.education      || []).join('\n'),
        workExperienceRaw: (doc.workExperience || []).join('\n'),
        otherExperienceRaw:(doc.otherExperience|| []).join('\n'),
        certificationsRaw: (doc.certifications || []).join('\n'),
      };
      this.formErrors = {};
      this.showModal = true;
    },

    closeModal() { this.showModal = false; },

    validate() {
      this.formErrors = {};
      if (!this.form.name.trim())  this.formErrors.name    = '請輸入醫師姓名';
      if (!this.form.deptKey)      this.formErrors.deptKey = '請選擇科別';
      return Object.keys(this.formErrors).length === 0;
    },

    async handleSave() {
      if (!this.validate()) return;

      // ── 編輯：呼叫 PUT API ──
      if (this.isEditing) {
        this.isLoading = true;
        try {
          const fd = new FormData();
          fd.append('name',           this.form.name.trim());
          fd.append('department',     this.deptLabel(this.form.deptKey));
          if (this.form.titleTagsRaw.trim())       fd.append('titles',          this.form.titleTagsRaw.trim());
          if (this.form.specialtiesRaw.trim())     fd.append('specialties',     this.form.specialtiesRaw.trim());
          if (this.form.treatmentsRaw.trim())      fd.append('treatmentItems',  this.form.treatmentsRaw.trim());
          if (this.form.educationRaw.trim())       fd.append('education',       this.form.educationRaw.trim());
          if (this.form.certificationsRaw.trim())  fd.append('licenses',        this.form.certificationsRaw.trim());
          if (this.form.workExperienceRaw.trim())  fd.append('experience',      this.form.workExperienceRaw.trim());
          if (this.form.otherExperienceRaw.trim()) fd.append('otherExperience', this.form.otherExperienceRaw.trim());
          // 有重新裁切才送新照片，否則後端保留舊照片
          if (this._croppedBlob) {
            fd.append('photo', this._croppedBlob, 'photo.png');
          }

          const res = await doctorsAPI.update(this._editingId, fd);
          const doc = this.mapApiDoctor(res.data);
          const idx = this.doctors.findIndex((d) => d.id === this._editingId);
          if (idx !== -1) this.doctors.splice(idx, 1, doc);
          this.closeModal();
          Swal.fire({ icon: 'success', title: '儲存成功', showConfirmButton: false, timer: 1400, timerProgressBar: true });
        } catch (err) {
          const msg = err?.response?.data?.message || '儲存失敗，請稍後再試';
          Swal.fire({ icon: 'error', title: '儲存失敗', text: msg });
        } finally {
          this.isLoading = false;
        }
        return;
      }

      // ── 新增：呼叫後端 API ──
      this.isLoading = true;
      try {
        const fd = new FormData();
        fd.append('name',           this.form.name.trim());
        fd.append('department',     this.deptLabel(this.form.deptKey));
        if (this.form.titleTagsRaw.trim())       fd.append('titles',          this.form.titleTagsRaw.trim());
        if (this.form.specialtiesRaw.trim())     fd.append('specialties',     this.form.specialtiesRaw.trim());
        if (this.form.treatmentsRaw.trim())      fd.append('treatmentItems',  this.form.treatmentsRaw.trim());
        if (this.form.educationRaw.trim())       fd.append('education',       this.form.educationRaw.trim());
        if (this.form.certificationsRaw.trim())  fd.append('licenses',        this.form.certificationsRaw.trim());
        if (this.form.workExperienceRaw.trim())  fd.append('experience',      this.form.workExperienceRaw.trim());
        if (this.form.otherExperienceRaw.trim()) fd.append('otherExperience', this.form.otherExperienceRaw.trim());
        // createdBy 由後端從 JWT 自動帶入，前端不傳
        if (this._croppedBlob) {
          fd.append('photo', this._croppedBlob, 'photo.png');
        }

        const res = await doctorsAPI.create(fd);
        const doc = this.mapApiDoctor(res.data);
        this.doctors.push(doc);
        this.closeModal();
        Swal.fire({ icon: 'success', title: '新增成功', showConfirmButton: false, timer: 1400, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.message || '新增失敗，請稍後再試';
        Swal.fire({ icon: 'error', title: '新增失敗', text: msg });
      } finally {
        this.isLoading = false;
      }
    },

    /* ── API 回傳資料 → 前端 doctors 格式 ── */
    mapApiDoctor(d) {
      const splitLines = (str) => str ? str.split('\n').map((s) => s.trim()).filter(Boolean) : [];
      const deptKey = this.departments.find((dep) => dep.label === d.department)?.key || '';
      return {
        id:              d.id,
        name:            d.name,
        photo:           d.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
        department:      d.department,
        deptKey,
        sortOrder:       d.sortOrder ?? 0,
        titleTags:       splitLines(d.titles),
        specialties:     splitLines(d.specialties),
        treatments:      splitLines(d.treatmentItems),
        education:       splitLines(d.education),
        workExperience:  splitLines(d.experience),
        otherExperience: splitLines(d.otherExperience),
        certifications:  splitLines(d.licenses),
      };
    },

    /* ── 拖曳排序 ── */
    dragStart(e, docId) {
      this.drag.docId = docId;
      e.dataTransfer.effectAllowed = 'move';
    },
    dragOver(docId) {
      this.drag.overDocId = docId;
    },
    dragLeave() {
      this.drag.overDocId = null;
    },
    dragEnd() {
      this.drag.docId     = null;
      this.drag.overDocId = null;
    },

    /* ── 手機觸控拖曳 ── */
    touchDragStart(e, docId) {
      e.preventDefault(); // 阻止 td 上的 click / scroll 干擾
      this.drag.docId = docId;
      // 掛 non-passive touchmove 到 document，才能 preventDefault() 阻止捲動
      this._touchMoveHandler = (ev) => this._onTouchMove(ev);
      this._touchEndHandler  = (ev) => this.touchDragEnd(ev);
      document.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
      document.addEventListener('touchend',  this._touchEndHandler,  { once: true });
    },

    _onTouchMove(e) {
      if (!this.drag.docId) return;
      e.preventDefault(); // 阻止頁面捲動
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const tr = el?.closest('[data-doc-id]');
      if (tr) {
        const targetId = parseInt(tr.dataset.docId);
        if (targetId && targetId !== this.drag.docId) {
          this.drag.overDocId = targetId;
        }
      } else {
        this.drag.overDocId = null;
      }
    },

    touchDragEnd(e) {
      this._removeTouchListeners();

      // changedTouches 取最終落點，補救 touchmove 沒更新到的情況
      const touch = e?.changedTouches?.[0];
      if (touch) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const tr = el?.closest('[data-doc-id]');
        if (tr) {
          const targetId = parseInt(tr.dataset.docId);
          if (targetId && targetId !== this.drag.docId) {
            this.drag.overDocId = targetId;
          }
        }
      }

      const toDoc = this.drag.overDocId
        ? this.doctors.find((d) => d.id === this.drag.overDocId)
        : null;
      if (toDoc) {
        this.drop(toDoc);
      } else {
        this.dragEnd();
      }
    },

    _removeTouchListeners() {
      if (this._touchMoveHandler) {
        document.removeEventListener('touchmove', this._touchMoveHandler);
        this._touchMoveHandler = null;
      }
      if (this._touchEndHandler) {
        document.removeEventListener('touchend', this._touchEndHandler);
        this._touchEndHandler = null;
      }
    },

    async drop(toDoc) {
      const fromId = this.drag.docId;
      this.drag.docId    = null;
      this.drag.overDocId = null;

      if (!fromId || fromId === toDoc.id) return;

      // 找到 doctors 陣列中的實際位置
      const fromIdx = this.doctors.findIndex((d) => d.id === fromId);
      const toIdx   = this.doctors.findIndex((d) => d.id === toDoc.id);
      if (fromIdx === -1 || toIdx === -1) return;

      // 重新排列 doctors 陣列
      const moved = this.doctors.splice(fromIdx, 1)[0];
      this.doctors.splice(toIdx, 0, moved);

      // 依新位置重新指派 sortOrder（從 1 開始）
      const items = this.doctors.map((d, i) => {
        d.sortOrder = i + 1;
        return { id: d.id, sortOrder: i + 1 };
      });

      // 呼叫後端儲存排序
      try {
        await doctorsAPI.updateSortOrders(items);
        await this.fetchDoctors();
        Swal.fire({ icon: 'success', title: '排序已儲存', showConfirmButton: false, timer: 1200, timerProgressBar: true });
      } catch (err) {
        const msg = err?.response?.data?.message || '排序儲存失敗，請重新整理';
        Swal.fire({ icon: 'error', title: '排序儲存失敗', text: msg });
        // 回滾：重新抓取正確資料
        await this.fetchDoctors();
      }
    },

    async confirmDelete(doc) {
      const confirm = await Swal.fire({
        title: '確認刪除',
        html: `確定要刪除醫師 <strong>${doc.name}</strong> 嗎？<br>此操作無法復原，照片也會一併刪除。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });

      if (!confirm.isConfirmed) return;

      try {
        await doctorsAPI.remove(doc.id);
        this.doctors = this.doctors.filter((d) => d.id !== doc.id);
        Swal.fire({ icon: 'success', title: '已刪除', showConfirmButton: false, timer: 1200 });
      } catch (err) {
        const msg = err?.response?.data?.message || '刪除失敗，請稍後再試';
        Swal.fire({ icon: 'error', title: '刪除失敗', text: msg });
      }
    },

    /* ── 照片上傳 ── */
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const cs = this.crop.canvasSize;
          this.crop.img = img;
          /* 初始縮放：短邊填滿 canvas，稍微放大一點有裁切空間 */
          const minDim = Math.min(img.width, img.height);
          this.crop.scale = (cs / minDim) * 1.15;
          /* 置中 */
          this.crop.x = (cs - img.width  * this.crop.scale) / 2;
          this.crop.y = (cs - img.height * this.crop.scale) / 2;
          this.crop.show = true;
          this.$nextTick(() => this.drawCrop());
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';   // 允許重複選同一檔案
    },

    /* ── Canvas 繪製 ── */
    drawCrop() {
      const canvas = this.$refs.cropCanvas;
      if (!canvas) return;
      const ctx   = canvas.getContext('2d');
      const cs    = this.crop.canvasSize;
      const r     = cs / 2 - 6;
      const { img, x, y, scale } = this.crop;

      ctx.clearRect(0, 0, cs, cs);

      /* 繪製圖片 */
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      /* 深色遮罩（圓形鏤空 → evenodd） */
      ctx.fillStyle = 'rgba(0,0,0,0.52)';
      ctx.beginPath();
      ctx.rect(0, 0, cs, cs);
      ctx.arc(cs / 2, cs / 2, r, 0, Math.PI * 2, true);
      ctx.fill('evenodd');

      /* 圓形引導線 */
      ctx.beginPath();
      ctx.arc(cs / 2, cs / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 2;
      ctx.stroke();
    },

    /* ── 確認裁切 → base64 預覽 + Blob 供上傳 ── */
    confirmCrop() {
      const out = 260;
      const cs  = this.crop.canvasSize;
      const ratio = out / cs;
      const canvas = document.createElement('canvas');
      canvas.width  = out;
      canvas.height = out;
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
      ctx.clip();

      const { img, x, y, scale } = this.crop;
      ctx.drawImage(img, x * ratio, y * ratio, img.width * scale * ratio, img.height * scale * ratio);

      // base64 用於圓形預覽
      this.form.photo = canvas.toDataURL('image/png');
      this.crop.show  = false;

      // Blob 用於 FormData 上傳
      canvas.toBlob((blob) => {
        this._croppedBlob = blob;
      }, 'image/png');
    },

    /* ── 拖曳（Mouse） ── */
    cropDragStart(e) {
      const rect = this.$refs.cropCanvas.getBoundingClientRect();
      this.crop.dragging       = true;
      this.crop.dragStartX     = e.clientX - rect.left;
      this.crop.dragStartY     = e.clientY - rect.top;
      this.crop.dragStartImgX  = this.crop.x;
      this.crop.dragStartImgY  = this.crop.y;
    },
    cropDragMove(e) {
      if (!this.crop.dragging) return;
      const rect = this.$refs.cropCanvas.getBoundingClientRect();
      this.crop.x = this.crop.dragStartImgX + (e.clientX - rect.left) - this.crop.dragStartX;
      this.crop.y = this.crop.dragStartImgY + (e.clientY - rect.top)  - this.crop.dragStartY;
      this.drawCrop();
    },
    cropDragEnd() { this.crop.dragging = false; },

    /* ── 拖曳（Touch） ── */
    cropTouchStart(e) {
      if (e.touches.length !== 1) return;
      const t    = e.touches[0];
      const rect = this.$refs.cropCanvas.getBoundingClientRect();
      this.crop.dragging       = true;
      this.crop.dragStartX     = t.clientX - rect.left;
      this.crop.dragStartY     = t.clientY - rect.top;
      this.crop.dragStartImgX  = this.crop.x;
      this.crop.dragStartImgY  = this.crop.y;
    },
    cropTouchMove(e) {
      if (!this.crop.dragging || e.touches.length !== 1) return;
      const t    = e.touches[0];
      const rect = this.$refs.cropCanvas.getBoundingClientRect();
      this.crop.x = this.crop.dragStartImgX + (t.clientX - rect.left) - this.crop.dragStartX;
      this.crop.y = this.crop.dragStartImgY + (t.clientY - rect.top)  - this.crop.dragStartY;
      this.drawCrop();
    },

    /* ── 縮放（滾輪） ── */
    cropWheel(e) {
      const factor = e.deltaY < 0 ? 1.08 : 0.93;
      const cs     = this.crop.canvasSize;
      const rect   = this.$refs.cropCanvas.getBoundingClientRect();
      const mx     = e.clientX - rect.left;
      const my     = e.clientY - rect.top;
      const newScale = this.crop.scale * factor;

      /* 不讓圖片縮得太小（短邊至少填滿圓形直徑的 90%） */
      const minScale = (cs * 0.9) / Math.min(this.crop.img.width, this.crop.img.height);
      if (newScale < minScale) return;

      this.crop.x     = mx - (mx - this.crop.x) * (newScale / this.crop.scale);
      this.crop.y     = my - (my - this.crop.y) * (newScale / this.crop.scale);
      this.crop.scale = newScale;
      this.drawCrop();
    },
  },
};
</script>

<style>
/* ── 通用（與其他 admin 頁面共用） ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.page-title  { font-size: 22px; font-weight: 700; color: #1a2744; margin-bottom: 4px; }
.page-desc   { font-size: 13px; color: #aaa; }

.btn {
  display: inline-flex;
  align-items: center;
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
}
.btn-primary { background: #2c5282; color: #fff; }
.btn-primary:hover { background: #1a3a5c; }
.btn-ghost { background: #f5f5f5; color: #555; border: 1.5px solid #e0e0e0; }
.btn-ghost:hover { background: #ebebeb; }

/* ── Filter ── */
.filter-bar { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 180px; }
.search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
.search-input {
  width: 30%;
  padding: 9px 14px 9px 34px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #2c5282; }
.filter-select { padding: 9px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #fff; cursor: pointer; }
.filter-select:focus { border-color: #2c5282; }

/* ── Table ── */
.table-wrap { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.06); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 700px; }
.data-table thead { background: #f8f9fb; }
.data-table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #888; letter-spacing: .06em; text-transform: uppercase; border-bottom: 1px solid #eee; }
.data-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; color: #333; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #fafafa; }
.table-avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; object-position: top; }
.td-name { font-weight: 600; color: #1a2744; }
.dept-badge { display: inline-block; padding: 3px 10px; background: #eef3fa; color: #2c5282; border-radius: 999px; font-size: 12px; font-weight: 600; }
.tag-list { display: flex; flex-wrap: wrap; gap: 4px; }
.title-tag { display: inline-block; padding: 2px 8px; background: #2c5282; color: #fff; border-radius: 999px; font-size: 11px; font-weight: 600; }
.spec-chip { display: inline-block; padding: 2px 8px; background: #f5f5f5; color: #555; border-radius: 999px; font-size: 11px; }
.spec-more { display: inline-block; padding: 2px 8px; background: #eef3fa; color: #2c5282; border-radius: 999px; font-size: 11px; font-weight: 600; }
.action-btns { display: flex; flex-direction: row; align-items: center; gap: 6px; flex-wrap: nowrap; }
.btn-action { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap; }
.btn-edit   { background: #eef3fa; color: #2c5282; }
.btn-edit:hover { background: #dce8f7; }
.btn-delete { background: #fff5f5; color: #e53e3e; }
.btn-delete:hover { background: #fed7d7; }
.empty-row { text-align: center; padding: 40px !important; color: #bbb; font-size: 14px; }

/* ── Modal 基礎 ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.46);
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
  box-shadow: 0 24px 64px rgba(0,0,0,.22);
}
.modal-wide { max-width: 1200px; width: 96vw; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px 14px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.modal-title  { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; color: #1a2744; }
.modal-close  { display: flex; align-items: center; justify-content: center; background: none; border: none; color: #aaa; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
.modal-close:hover { background: #f5f5f5; color: #555; }
.modal-body   { padding: 20px 24px; overflow-y: auto; flex: 1; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 24px; border-top: 1px solid #f0f0f0; flex-shrink: 0; }

/* ── 醫師表單三欄 ── */
.doctor-form-layout {
  display: grid;
  grid-template-columns: 180px 220px 1fr;
  gap: 0;
  min-height: 0;
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 24px 0 0;
  border-right: 1px solid #f0f0f0;
}

.form-col:last-child {
  border-right: none;
  padding-right: 0;
  padding-left: 24px;
}

.col-basic { padding-left: 24px; }

.col-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #b0b8c8;
  padding-bottom: 10px;
  border-bottom: 2px solid #eef3fa;
}

/* ── 圓形照片上傳 ── */
.photo-circle-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: #eef3fa;
  border: 3px solid #dce8f7;
  align-self: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.photo-circle-wrap:hover { border-color: #2c5282; }

.photo-circle-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}

.photo-circle-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ab;
  font-size: 12px;
}

.photo-circle-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26,39,68,.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}
.photo-circle-wrap:hover .photo-circle-overlay { opacity: 1; }

.photo-hint { font-size: 11px; color: #bbb; text-align: center; line-height: 1.6; }

/* ── Detail Grid（右欄內 2 欄） ── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.dg-full { grid-column: 1 / -1; }

/* ── Form Controls ── */
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label  { font-size: 13px; font-weight: 600; color: #444; }
.required    { color: #e53e3e; }
.form-input  { padding: 9px 12px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; background: #fff; }
.form-input:focus { border-color: #2c5282; }
.form-textarea { padding: 9px 12px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; resize: vertical; transition: border-color .2s; min-height: 80px; }
.form-textarea:focus { border-color: #2c5282; }
.form-error  { font-size: 12px; color: #e53e3e; }

/* ── 裁切 Modal ── */
.crop-backdrop { z-index: 1100; }
.modal-crop { max-width: 400px; }
.crop-body { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 20px 24px; }
.crop-hint { font-size: 13px; color: #888; display: flex; align-items: center; gap: 6px; }
.crop-canvas-wrap { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.18); }
.crop-canvas { display: block; cursor: grab; }
.crop-canvas:active { cursor: grabbing; }

/* ── 拖曳排序 ── */
.td-drag { width: 32px; text-align: center; cursor: grab; touch-action: none; user-select: none; }
.drag-handle { color: #ccc; display: block; transition: color 0.15s; }
tr:hover .drag-handle { color: #aaa; }
.tr-dragging { opacity: 0.4; }
.tr-drag-over td { background: #eef3fa !important; box-shadow: inset 0 -2px 0 #2c5282; }

/* ── Loading spin ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
.btn:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── RWD ── */
@media (max-width: 1100px) {
  .doctor-form-layout { grid-template-columns: 160px 200px 1fr; }
}
@media (max-width: 900px) {
  .doctor-form-layout { grid-template-columns: 1fr 1fr; }
  .col-photo { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 24px; border-right: none; border-bottom: 1px solid #f0f0f0; padding: 0 0 16px; }
  .form-col  { border-right: none; padding: 0; }
  .col-basic { border-right: 1px solid #f0f0f0; padding: 16px 16px 0 0; }
  .col-detail { padding: 16px 0 0; }
  .detail-grid { grid-template-columns: 1fr; }
  .dg-full { grid-column: auto; }
}
@media (max-width: 640px) {
  .modal-wide { width: 100%; border-radius: 14px 14px 0 0; align-self: flex-end; max-height: 96vh; }
  .doctor-form-layout { grid-template-columns: 1fr; }
  .col-basic { border-right: none; padding: 16px 0 0; }
}
</style>
