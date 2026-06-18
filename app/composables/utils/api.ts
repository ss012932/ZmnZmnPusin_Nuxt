import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { showCustom } from "~/composables/utils/alert.js";

const apiClient = axios.create({
  baseURL: "http://localhost:7129/api",
  //baseURL: "https://zmnzmnpusin-api.zmnzmnpusin.com.tw/api",
  withCredentials: true,
});

// ===============================
// Request interceptor
// ===============================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes("/upload")) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isShowing401 = false;
let isRedirecting = false;

// ===============================
// Response interceptor
// ===============================
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const config = error.config;
    const requestUrl = config?.url || "";

    const skipAuth401APIs = [
      "/Login", // ⭐ 登入失敗不應該調用登出
      "/staffs/login",
      "/staffs/logout",
      "/Register", // ⭐ 註冊失敗不應該調用登出
      "/reset-password",
      "/cart",
      "/auth/me",
    ];

    const shouldSkip401 = skipAuth401APIs.some((api) =>
      requestUrl.includes(api),
    );

    if (isRedirecting || shouldSkip401) {
      return Promise.reject(error);
    }

    const detail = data?.detail || "";
    const message = data?.message || "";

    // ===============================
    // ❗ 核心：401 一律處理
    // ===============================
    if (status === 401 && !isShowing401) {
      isShowing401 = true;
      isRedirecting = true;

      try {
        try {
          await apiClient.post("/staffs/logout");
        } catch {}

        if (import.meta.client) {
          await showCustom(
            "登入逾時",
            detail || message || "請重新登入",
            "warning",
          );

          // ===============================
          // 🔥 清狀態（你缺這個）
          // ===============================
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("currentWeddingId");

          // ⭐ 強制刷新（關鍵）
          window.location.href = "/admin/login";
        }
      } finally {
        setTimeout(() => {
          isShowing401 = false;
          isRedirecting = false;
        }, 1000);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default {
  get(endpoint: string, params = {}, config = {}) {
    return apiClient.get(endpoint, { params, ...config });
  },

  post(endpoint: string, data: any, config = {}) {
    return apiClient.post(endpoint, data, config);
  },

  put(endpoint: string, data: any, config = {}) {
    return apiClient.put(endpoint, data, config);
  },

  patch(endpoint: string, data: any, config = {}) {
    return apiClient.patch(endpoint, data, config);
  },

  delete(endpoint: string, data = {}, config = {}) {
    return apiClient.delete(endpoint, { data, ...config });
  },
};

// ===== 醫師相關 API =====
export const doctorsAPI = {
  // ===== 取得醫師清單（排除刪除 / 隱藏） =====
  async getAll() {
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  // ===== 新增醫師（含照片上傳，multipart/form-data） =====
  async create(formData: FormData) {
    const response = await apiClient.post('/doctors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ===== 更新醫師（photo 選填，不傳代表不換照片） =====
  async update(id: number, formData: FormData) {
    const response = await apiClient.put(`/doctors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ===== 軟刪除醫師 =====
  async remove(id: number) {
    const response = await apiClient.delete(`/doctors/${id}`);
    return response.data;
  },

  // ===== 批次更新排序（拖曳排序） =====
  async updateSortOrders(items: Array<{ id: number; sortOrder: number }>) {
    const response = await apiClient.patch('/doctors/sort-orders', { items });
    return response.data;
  },
};

// ===== 員工管理 API =====
export const staffsAPI = {
  // ===== 取得員工列表 =====
  async getAll() {
    const response = await apiClient.get('/staffs');
    return response.data;
  },

  // ===== 管理員新增員工（後端自動寄重設密碼信） =====
  async create(data: { name: string; email: string; isAdmin: boolean; isActive: boolean }) {
    const response = await apiClient.post('/staffs', data);
    return response.data;
  },

  // ===== 管理員編輯員工（姓名、權限、狀態；Email 不可改） =====
  async update(id: number, data: { name: string; isAdmin: boolean; isActive: boolean }) {
    const response = await apiClient.put(`/staffs/${id}`, data);
    return response.data;
  },

  // ===== 軟刪除員工 =====
  async remove(id: number) {
    const response = await apiClient.delete(`/staffs/${id}`);
    return response.data;
  },
};

// ===== 類別管理 API =====
export const categoriesAPI = {
  // ── 母類別 ──
  async getAllMain() {
    const response = await apiClient.get('/categories/main');
    return response.data;
  },
  async createMain(data: { name: string; description?: string; sortOrder?: number; isActive?: boolean }) {
    const response = await apiClient.post('/categories/main', data);
    return response.data;
  },
  async updateMain(id: number, data: { name: string; description?: string; sortOrder?: number; isActive?: boolean }) {
    const response = await apiClient.put(`/categories/main/${id}`, data);
    return response.data;
  },
  async deleteMain(id: number) {
    const response = await apiClient.delete(`/categories/main/${id}`);
    return response.data;
  },

  // ── 子類別 ──
  async getSubByMain(mainCategoryId: number) {
    const response = await apiClient.get('/categories/sub', { params: { mainCategoryId } });
    return response.data;
  },
  async createSub(data: { mainCategoryId: number; name: string; description?: string; sortOrder?: number; isActive?: boolean }) {
    const response = await apiClient.post('/categories/sub', data);
    return response.data;
  },
  async updateSub(id: number, data: { name: string; description?: string; sortOrder?: number; isActive?: boolean }) {
    const response = await apiClient.put(`/categories/sub/${id}`, data);
    return response.data;
  },
  async deleteSub(id: number) {
    const response = await apiClient.delete(`/categories/sub/${id}`);
    return response.data;
  },

  // ── 排序 ──
  async updateMainSortOrders(items: Array<{ id: number; sortOrder: number }>) {
    const response = await apiClient.patch('/categories/main/sort-orders', { items });
    return response.data;
  },
  async updateSubSortOrders(items: Array<{ id: number; sortOrder: number }>) {
    const response = await apiClient.patch('/categories/sub/sort-orders', { items });
    return response.data;
  },
};

// ===== 文章管理 API =====
export const articlesAPI = {
  // ===== 取得文章列表（可篩選） =====
  async getList(params: { status?: string; mainCategoryId?: number; keyword?: string } = {}) {
    const response = await apiClient.get('/articles', { params });
    return response.data;
  },

  // ===== 取得文章詳細（含段落） =====
  async getDetail(id: number) {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },

  // ===== 新增文章 =====
  async create(data: {
    title: string;
    mainCategoryId: number;
    subCategoryId?: number | null;
    summary?: string;
    status: string;
    isFeatured: boolean;
    sections: Array<{ sectionTitle: string; content?: string; sortOrder: number; isHide?: boolean }>;
  }) {
    const response = await apiClient.post('/articles', data);
    return response.data;
  },

  // ===== 更新文章 =====
  async update(id: number, data: {
    title: string;
    mainCategoryId: number;
    subCategoryId?: number | null;
    summary?: string;
    status: string;
    isFeatured: boolean;
    sections: Array<{ sectionTitle: string; content?: string; sortOrder: number; isHide?: boolean }>;
  }) {
    const response = await apiClient.put(`/articles/${id}`, data);
    return response.data;
  },

  // ===== 軟刪除文章 =====
  async remove(id: number) {
    const response = await apiClient.delete(`/articles/${id}`);
    return response.data;
  },

  // ===== 上傳封面圖（multipart/form-data，欄位名：cover） =====
  async uploadCover(id: number, file: File) {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await apiClient.post(`/articles/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ===== 上傳「內文圖片」（富文本編輯器用，與封面分開） =====
  // ⚠️ 請把下面的路徑改成你後端（AzureFunction）實際的內文圖片上傳端點，
  //    後端需：接收 multipart/form-data（欄位名 file）→ 存到 Blob → 回傳 { url } 或 { data: { url } }
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/articles/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// ===== 認證相關 API =====
export const authAPI = {
  // ===== 檢查登入狀態 =====
  async checkLoginStatus() {
    try {
      const response = await apiClient.get("/auth/me");
      const result = response.data;

      return {
        ...result,
        isLogin: Boolean(result?.success && result?.data),
        user: result?.data || null,
      };
    } catch (error) {
      return {
        success: false,
        isLogin: false,
        user: null,
      };
    }
  },

  // ===== 登出 =====
  async logout() {
    try {
      await apiClient.post("/staffs/logout");
    } catch (error) {
      // 即使 API 失敗也繼續清除本地資料
      console.error("登出 API 呼叫失敗，但仍會清除本地資料", error);
    } finally {
      // 不管 API 是否成功，都清除本地資料
      if (import.meta.client) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentWeddingId");
      }
    }
  },

  // ===== 忘記密碼 =====
  async forgotPassword(email: string) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  // ===== 驗證重設密碼 Token =====
  async validateResetToken(token: string) {
    const response = await apiClient.get("/auth/validate-reset-token", {
      params: { token },
    });
    return response.data;
  },

  // ===== 重設密碼 =====
  async resetPassword(token: string, newPassword: string) {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // ===== 綁定 Email =====
  async emailBind(token: string) {
    const response = await apiClient.post("/email-bind", { token });
    return response.data;
  },
};
