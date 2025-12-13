export default defineEventHandler(async (event) => {
    // This endpoint initiates Google OAuth
    // We need to proxy to the backend but the backend will redirect to Google
    // Then Google redirects back to backend's callback
    // We need to intercept that callback

    const API_BASE_URL = 'https://gic-project.darororo.dev';
    const frontendUrl = getRequestURL(event).origin;

    const redirectUrl = `${API_BASE_URL}/users/google?redirect_uri=${encodeURIComponent(frontendUrl + '/auth/callback')}`;
    console.log('🟢 Initiating Google OAuth, redirecting to:', redirectUrl);

    // If the backend supports a redirect_uri parameter, use it
    // Otherwise, just redirect to backend (but this will show JSON)
    return sendRedirect(event, redirectUrl, 302);
});
