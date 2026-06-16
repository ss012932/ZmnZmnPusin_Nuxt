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
            <th style="width:56px">照片</th>
            <th>姓名</th>
            <th>科別</th>
            <th>職稱</th>
            <th>專業領域</th>
            <th style="width:148px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredDoctors.length === 0">
            <td colspan="6" class="empty-row">目前沒有符合條件的醫師</td>
          </tr>
          <tr v-for="doc in filteredDoctors" :key="doc.id">
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
                    placeholder="糖尿病管理&#10;高血壓&#10;高血脂"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">擅長診療項目（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.treatmentsRaw" rows="5"
                    placeholder="胰島素治療與血糖監測規劃&#10;心血管風險評估與預防"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">學歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.educationRaw" rows="4"
                    placeholder="國立台灣大學 醫學院 醫學系"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">證照與資格（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.certificationsRaw" rows="4"
                    placeholder="中華民國內科專科醫師&#10;內分泌暨糖尿病專科醫師"></textarea>
                </div>

                <div class="form-group dg-full">
                  <label class="form-label">就職經歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.workExperienceRaw" rows="4"
                    placeholder="台大醫院 內科 住院醫師&#10;本院內科 主治醫師"></textarea>
                </div>

                <div class="form-group dg-full">
                  <label class="form-label">其他經歷（每行一個）</label>
                  <textarea class="form-textarea" v-model="form.otherExperienceRaw" rows="3"
                    placeholder="台灣內分泌暨糖尿病學會 理事"></textarea>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" @click="closeModal">
            <iconify-icon icon="mdi:close" width="16"></iconify-icon>取消
          </button>
          <button class="btn btn-primary" @click="handleSave">
            <iconify-icon icon="mdi:content-save-outline" width="16"></iconify-icon>
            {{ isEditing ? '儲存變更' : '新增醫師' }}
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

<script>
import Swal from 'sweetalert2';

definePageMeta({ layout: 'admin' });

export default {
  name: 'AdminDoctorsPage',

  data() {
    return {
      searchKeyword: '',
      filterDept: '',
      showModal: false,
      isEditing: false,
      formErrors: {},
      nextId: 5,
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

      departments: [
        { key: 'internal',   label: '一般內科' },
        { key: 'surgery',    label: '外科手術' },
        { key: 'cardiology', label: '心臟科' },
        { key: 'pediatrics', label: '兒科' },
      ],

      doctors: [
        {
          id: 1,
          name: '陳建志',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          titleTags: ['院長', '門診醫療部主任'],
          department: '一般內科', deptKey: 'internal',
          specialties: ['糖尿病管理', '高血壓', '高血脂', '甲狀腺疾病', '肥胖症'],
          treatments: ['胰島素治療與血糖監測規劃', '心血管風險評估與預防', '荷爾蒙失調與甲狀腺疾病', '慢性病整合管理'],
          education: ['國立台灣大學 醫學院 醫學系'],
          workExperience: ['台大醫院 內科 住院醫師', '台大醫院 內分泌科 研究員', '本院內科 主治醫師', '本院 內科部主任（現任）'],
          otherExperience: ['台灣內分泌暨糖尿病學會 理事', '衛生福利部 糖尿病照護品質評估委員'],
          certifications: ['中華民國內科專科醫師', '內分泌暨糖尿病專科醫師', '美國內分泌學會會員（AACE）'],
        },
        {
          id: 2,
          name: '林淑芬',
          photo: 'https://randomuser.me/api/portraits/women/44.jpg',
          titleTags: ['副院長', '住院照護部主任'],
          department: '心臟科', deptKey: 'cardiology',
          specialties: ['心律不整', '心臟衰竭', '冠狀動脈疾病', '心臟超音波', '導管消融術'],
          treatments: ['心律不整診斷與導管消融術', '心臟衰竭藥物治療與追蹤', '冠狀動脈疾病評估與處置', '心臟超音波判讀'],
          education: ['陽明交通大學 醫學院 醫學系'],
          workExperience: ['台北榮民總醫院 內科 住院醫師', '台北榮民總醫院 心臟科 研究員', '本院心臟科 主治醫師'],
          otherExperience: ['台灣心律不整學會 會員', '歐洲心臟學會 會員（FESC）'],
          certifications: ['中華民國心臟內科專科醫師', '心律不整電氣生理學認證'],
        },
        {
          id: 3,
          name: '張偉明',
          photo: 'https://randomuser.me/api/portraits/men/67.jpg',
          titleTags: ['外科部副主任', '主治醫師'],
          department: '外科手術', deptKey: 'surgery',
          specialties: ['腹腔鏡手術', '疝氣修補', '大腸直腸外科', '機器人輔助手術'],
          treatments: ['腹腔鏡膽囊切除術', '疝氣修補手術', '大腸直腸腫瘤切除', '機器人輔助微創手術'],
          education: ['國立成功大學 醫學院 醫學系'],
          workExperience: ['成大醫院 外科 住院醫師及總醫師', 'Johns Hopkins Hospital 研修（美國）', '本院外科 主治醫師'],
          otherExperience: ['SAGES 腹腔鏡外科學會 會員', '達文西機器手臂術式認證醫師'],
          certifications: ['中華民國外科專科醫師', '腹腔鏡手術技術認證（SAGES）'],
        },
        {
          id: 4,
          name: '吳雅婷',
          photo: 'https://randomuser.me/api/portraits/women/28.jpg',
          titleTags: ['主治醫師'],
          department: '兒科', deptKey: 'pediatrics',
          specialties: ['新生兒照護', '兒童氣喘', '過敏疾病', '兒童發展評估'],
          treatments: ['新生兒照護與早產兒評估', '兒童氣喘與過敏疾病治療', '兒童生長發展評估', '疫苗接種計畫與衛教'],
          education: ['台北醫學大學 醫學系'],
          workExperience: ['馬偕紀念醫院 小兒科 住院醫師', '馬偕紀念醫院 新生兒科 研究員', '本院兒科 主治醫師（現任）'],
          otherExperience: ['兒童發展聯合評估中心 認定醫師', '台灣兒科醫學會 會員'],
          certifications: ['中華民國兒科專科醫師', '新生兒急救（NRP）認證'],
        },
      ],
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

  methods: {
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
      this.showModal = true;
    },

    openEdit(doc) {
      this.isEditing = true;
      this._editingId = doc.id;
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

    handleSave() {
      if (!this.validate()) return;
      const payload = {
        name:           this.form.name.trim(),
        photo:          this.form.photo || 'https://randomuser.me/api/portraits/lego/1.jpg',
        deptKey:        this.form.deptKey,
        department:     this.deptLabel(this.form.deptKey),
        titleTags:      this.parseLines(this.form.titleTagsRaw),
        specialties:    this.parseLines(this.form.specialtiesRaw),
        treatments:     this.parseLines(this.form.treatmentsRaw),
        education:      this.parseLines(this.form.educationRaw),
        workExperience: this.parseLines(this.form.workExperienceRaw),
        otherExperience:this.parseLines(this.form.otherExperienceRaw),
        certifications: this.parseLines(this.form.certificationsRaw),
      };
      if (this.isEditing) {
        const idx = this.doctors.findIndex((d) => d.id === this._editingId);
        if (idx !== -1) this.doctors.splice(idx, 1, { id: this._editingId, ...payload });
      } else {
        this.doctors.push({ id: this.nextId++, ...payload });
      }
      this.closeModal();
      Swal.fire({
        icon: 'success',
        title: this.isEditing ? '儲存成功' : '新增成功',
        showConfirmButton: false,
        timer: 1400,
        timerProgressBar: true,
      });
    },

    async confirmDelete(doc) {
      const result = await Swal.fire({
        title: '確認刪除',
        html: `確定要刪除醫師 <strong>${doc.name}</strong> 嗎？<br>此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
      });
      if (result.isConfirmed) {
        this.doctors = this.doctors.filter((d) => d.id !== doc.id);
        Swal.fire({ icon: 'success', title: '已刪除', showConfirmButton: false, timer: 1200 });
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

    /* ── 確認裁切 → 輸出 base64 ── */
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

      this.form.photo  = canvas.toDataURL('image/png');
      this.crop.show   = false;
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
