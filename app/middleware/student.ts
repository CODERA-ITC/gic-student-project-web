/**
 * Student Role Middleware
 * Ensures only students can access student-specific routes
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Skip authentication on server side - we can't access localStorage there
  if (typeof window === "undefined") {
    console.log("Student middleware: Server side, skipping auth check");
    return;
  }

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token || to.query.refresh_token) {
    console.log("Student middleware: Token found in URL, allowing through");
    return;
  }

  // PRIORITY CHECK: If token exists in localStorage, always allow through
  const token = localStorage.getItem("access_token");
  if (token) {
    console.log("Student middleware: Token exists, allowing through for retry");
    return;
  }

  // If auth is still loading, allow through - the page will show loading state
  if (authStore.isLoading) {
    console.log("Student middleware: Auth is loading, allowing through");
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    console.log("Student middleware: No auth, redirecting to login");
    return navigateTo({
      path: "/login",
      query: { redirect: to.path },
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
