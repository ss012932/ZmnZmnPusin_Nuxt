export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const auth = useBackofficeAuth();
  const result = await auth.check();

  if (!result.success || !result.isLogin) {
    return navigateTo({
      path: "/admin/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
