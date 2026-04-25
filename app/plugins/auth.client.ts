export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  // This is a .client.ts plugin, so it only runs on client
  // Check if token exists synchronously
  const hasToken = localStorage.getItem("access_token");

  if (hasToken) {
    // Set loading state immediately to prevent middleware redirect
    authStore.isLoading = true;
    console.log("Auth plugin: Token found, starting restoration");

    // Start auth restoration immediately (don't wait for mounted)
    authStore.restoreAuth().catch((error) => {
      console.error("Auth restoration failed:", error);
      authStore.isLoading = false;
    });
  } else {
    // No token, keep loading as false
    console.log("Auth plugin: No token found");
    authStore.isLoading = false;
  }
});
