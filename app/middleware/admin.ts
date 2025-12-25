/**
 * Admin Role Middleware
 * Ensures only admins can access admin-specific routes
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token || to.query.refresh_token) {
    console.log("Admin middleware: Token found in URL, allowing through");
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.path },
    });
  }

  // Check if user is an admin
  if (!authStore.isAdmin) {
    console.warn("Access denied: Admin role required");

    // Redirect to appropriate dashboard based on role
    if (authStore.isStudent) {
      return navigateTo("/student/dashboard");
    } else if (authStore.isTeacher) {
      return navigateTo("/teacher/dashboard");
    }

    return navigateTo("/");
  }

  // User is an admin, allow access
  return;
});
