declare module "#app" {
  interface PageMeta {
    requiresAdmin?: boolean;
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  if (!to.meta.requiresAdmin) return;

  const auth = useBackofficeAuth();
  const result = await auth.check();

  if (!result.isLogin) {
    return navigateTo("/admin/login");
  }

  if (!result.user?.isAdmin) {
    return navigateTo("/admin/doctors");
  }
});
