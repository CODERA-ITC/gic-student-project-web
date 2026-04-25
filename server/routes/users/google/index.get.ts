export default defineEventHandler(async (event) => {
  // This endpoint initiates Google OAuth
  // Backend will redirect to Google, then Google redirects back to backend's callback
  // Backend then redirects to frontend's /auth/callback with token

  const config = useRuntimeConfig();
  const API_BASE_URL = config.apiBase;

  console.log(
    "🟢 Initiating Google OAuth, redirecting to:",
    `${API_BASE_URL}/users/google`
  );

  // Simply redirect to backend OAuth endpoint
  return sendRedirect(event, `${API_BASE_URL}/users/google`, 302);
});
