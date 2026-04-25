/**
 * Student Role Middleware
 * Ensures only students can access student-specific routes
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (import.meta.server) return;

  const isAuthCallback = to.path === "/auth/callback";
  if (isAuthCallback && (to.query.token || to.query.refresh_token)) return;

  if (!authStore.isAuthenticated) {
    await authStore.restoreAuth();
  }

  if (authStore.isAuthenticated && !authStore.isTokenValid()) {
    const ok = await authStore.refreshAccessToken();
    if (!ok) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }
  }

  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }

  if (!authStore.isStudent) {
    if (authStore.isTeacher || authStore.isAdmin) {
      return navigateTo("/teacher/dashboard");
    }
    return navigateTo("/");
  }

  return;
});
