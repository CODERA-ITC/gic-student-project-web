/**
 * Teacher Role Middleware
 * Ensures only teachers can access teacher-specific routes
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (import.meta.server) return;


  const isAuthCallback = to.path === "/auth/callback";
  if (isAuthCallback && (to.query.token || to.query.refresh_token)) return;

  // if (authStore.isLoading && typeof authStore.whenReady === "function") {
  //   await authStore.whenReady();
  // }

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

  // Teacher or Admin allowed
  if (!authStore.isTeacher && !authStore.isAdmin) {
    if (authStore.isStudent) return navigateTo("/student/dashboard");
    return navigateTo("/");
  }
});
