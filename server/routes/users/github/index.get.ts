export default defineEventHandler(async (event) => {
    // Redirect to the backend OAuth endpoint
    // The backend will handle the OAuth flow and eventually return to our callback
    const API_BASE_URL = 'https://gic-project.darororo.dev';
    return sendRedirect(event, `${API_BASE_URL}/users/github`, 302);
});
