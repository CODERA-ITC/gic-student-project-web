/**
 * Teacher Role Middleware
 * Ensures only teachers can access teacher-specific routes
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token || to.query.refresh_token) {
    console.log("Teacher middleware: Token found in URL, allowing through");
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.path },
    });
  }

  // Check if user is a teacher
  if (!authStore.isTeacher) {
    console.warn("Access denied: Teacher role required");

    // Redirect to appropriate dashboard based on role
    if (authStore.isStudent) {
      return navigateTo("/student/dashboard");
    } else if (authStore.isAdmin) {
      return navigateTo("/dashboard");
    }

    return navigateTo("/");
  }

  // User is a teacher, allow access
  return;
});
