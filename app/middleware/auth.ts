export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const auth = useBackofficeAuth();
  const result = await auth.check();

  if (!result.isLogin) {
    return navigateTo("/admin/login");
  }

  if (!result.user?.isAdmin) {
    return navigateTo("/admin/doctors");
  }
});
