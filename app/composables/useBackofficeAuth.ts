import { authAPI } from "~/composables/utils/api";

export interface BackofficeUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export function useBackofficeAuth() {
  const user = useState<BackofficeUser | null>("backoffice:user", () => null);
  const loaded = useState("backoffice:loaded", () => false);

  const check = async (force = false) => {
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
  };

  return {
    user,
    loaded,
    check,
    clear,
  };
}
