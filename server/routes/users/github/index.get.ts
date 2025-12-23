export default defineEventHandler(async (event) => {
  // Redirect to the backend OAuth endpoint
  // Backend will handle the OAuth flow and redirect back to frontend with token

  const config = useRuntimeConfig();
  const API_BASE_URL = config.apiBase;

  console.log(
    "🟢 Initiating GitHub OAuth, redirecting to:",
    `${API_BASE_URL}/users/github`
  );

  return sendRedirect(event, `${API_BASE_URL}/users/github`, 302);
});
