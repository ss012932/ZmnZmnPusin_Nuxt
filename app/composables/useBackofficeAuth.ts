import { authAPI } from "~/composables/utils/api";

export interface BackofficeUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

const LOGGED_OUT_STORAGE_KEY = "backoffice:loggedOut";

function isClientLoggedOut() {
  if (!import.meta.client) return false;
  return sessionStorage.getItem(LOGGED_OUT_STORAGE_KEY) === "1";
}

function setClientLoggedOut(value: boolean) {
  if (!import.meta.client) return;

  if (value) {
    sessionStorage.setItem(LOGGED_OUT_STORAGE_KEY, "1");
    return;
  }

  sessionStorage.removeItem(LOGGED_OUT_STORAGE_KEY);
}

export function useBackofficeAuth() {
  const user = useState<BackofficeUser | null>("backoffice:user", () => null);
  const loaded = useState("backoffice:loaded", () => false);
  const loggedOut = useState("backoffice:loggedOut", () => false);

  const check = async (force = false) => {
    // 這段控制「登出後不能靠 SPA 快取重新進入後台」。
    // 使用者登出後，除非重新登入成功，否則直接視為未登入。
    if (loggedOut.value || isClientLoggedOut()) {
      user.value = null;
      loaded.value = false;
      loggedOut.value = true;

      return {
        success: false,
        isLogin: false,
        user: null,
      };
    }

    // 這段控制「一般快取」。
    // 注意：後台路由守衛會傳 force=true，避免用舊狀態放行。
    if (loaded.value && !force) {
      return {
        success: Boolean(user.value),
        isLogin: Boolean(user.value),
        user: user.value,
      };
    }

    const result = await authAPI.checkLoginStatus();
    user.value = result.isLogin ? result.user : null;
    loaded.value = true;

    return {
      ...result,
      user: user.value,
    };
  };

  const clear = () => {
    user.value = null;
    loaded.value = false;
    loggedOut.value = true;
    setClientLoggedOut(true);
  };

  const markLoggedIn = () => {
    loggedOut.value = false;
    setClientLoggedOut(false);
  };

  return {
    user,
    loaded,
    loggedOut,
    check,
    clear,
    markLoggedIn,
  };
}
