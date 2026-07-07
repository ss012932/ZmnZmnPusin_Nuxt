export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const auth = useBackofficeAuth();

  // 這段控制「管理員權限頁每次都強制重新驗證」。
  // 避免使用登出前殘留的前端 user 狀態判斷權限。
  const result = await auth.check(true);

  if (!result.isLogin) {
    return navigateTo("/admin/login", { replace: true });
  }

  if (!result.user?.isAdmin) {
    return navigateTo("/admin/doctors", { replace: true });
  }
});
