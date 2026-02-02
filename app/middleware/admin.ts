/**
 * Admin Role Middleware
 * Ensures only admins can access admin-specific routes
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  if (import.meta.server) return;

  // Only allow bypass for the actual auth callback route
  const isAuthCallback = to.path === "/auth/callback";
  if (isAuthCallback && (to.query.token || to.query.refresh_token)) return;

  // Restore if needed
  if (!authStore.isAuthenticated) {
    await authStore.restoreAuth();
  }

  // If token invalid, refresh (store should lock concurrent refresh calls)
  if (authStore.isAuthenticated && !authStore.isTokenValid()) {
    const ok = await authStore.refreshAccessToken();
    if (!ok) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }
  }

  // Must be authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }

  // Must be admin
  if (!authStore.isAdmin) {
    if (authStore.isStudent) return navigateTo("/student/dashboard");
    if (authStore.isTeacher) return navigateTo("/teacher/dashboard");
    return navigateTo("/");
  }
});
