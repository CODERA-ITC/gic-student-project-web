/**
 * Guest Middleware
 * Redirects authenticated users away from guest-only pages (login, signup)
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If user is authenticated, redirect to appropriate dashboard
  if (authStore.isAuthenticated) {
    // Redirect based on role
    if (authStore.isStudent) {
      return navigateTo("/student/dashboard");
    } else if (authStore.isTeacher) {
      return navigateTo("/teacher/dashboard");
    } else if (authStore.isAdmin) {
      return navigateTo("/dashboard");
    }

    // Default redirect
    return navigateTo("/");
  }

  // User is not authenticated, allow access to guest pages
  return;
});
