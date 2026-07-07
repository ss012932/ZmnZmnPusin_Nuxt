export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const auth = useBackofficeAuth();

  // 這段控制「每次進入後台頁面都重新向後端確認登入狀態」。
  // 不使用前端快取，避免登出後還能靠舊 user 狀態重新進後台。
  const result = await auth.check(true);

  if (!result.success || !result.isLogin) {
    return navigateTo({
      path: "/admin/login",
      query: {
        redirect: to.fullPath,
      },
      replace: true,
    });
  }
});
