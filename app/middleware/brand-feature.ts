declare module "#app" {
  interface PageMeta {
    requiresAdmin?: boolean;
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  if (!to.meta.requiresAdmin) return;

  const auth = useBackofficeAuth();

  // 這段控制「需要管理員權限的功能每次都重新驗證」。
  // 避免登出後或權限變更後，仍使用前端快取的舊權限。
  const result = await auth.check(true);

  if (!result.isLogin) {
    return navigateTo("/admin/login", { replace: true });
  }

  if (!result.user?.isAdmin) {
    return navigateTo("/admin/doctors", { replace: true });
  }
});
