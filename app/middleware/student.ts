/**
 * Student Role Middleware
 * Ensures only students can access student-specific routes
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token || to.query.refresh_token) {
    console.log("Student middleware: Token found in URL, allowing through");
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.path }, // Use to.path to avoid nested query params
    });
  }

  // Check if user is a student
  if (!authStore.isStudent) {
    console.warn("Access denied: Student role required");

    // Redirect to appropriate dashboard based on role
    if (authStore.isTeacher) {
      return navigateTo("/teacher/dashboard");
    } else if (authStore.isAdmin) {
      return navigateTo("/dashboard");
    }

    return navigateTo("/");
  }

  // User is a student, allow access
  return;
});
