/**
 * Authentication Middleware
 * Protects routes by ensuring user is authenticated
 * Redirects to login if not authenticated
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token) {
    console.log("Auth middleware: Token found in URL, allowing through");
    return;
  }

  // Allow refresh_token URLs as well (for OAuth flow)
  if (to.query.refresh_token) {
    console.log(
      "Auth middleware: Refresh token found in URL, allowing through"
    );
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Only check localStorage on client side
    if (process.client) {
      const token = localStorage.getItem("access_token");

      if (token) {
        // Token exists but store not initialized, allow the page to load
        // The auth store will initialize on client side
        return;
      }
    }

    // No authentication found, redirect to login
    return navigateTo({
      path: "/login",
      query: { redirect: to.path }, // Use to.path instead of to.fullPath to avoid nested query params
    });
  }

  // User is authenticated, allow access
  return;
});
