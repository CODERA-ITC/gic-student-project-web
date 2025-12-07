export default defineEventHandler(async (event) => {
    try {
        // Get the code from query parameters
        const query = getQuery(event);
        const code = query.code;

        if (!code) {
            return sendRedirect(event, '/login?error=No authorization code received');
        }

        // Forward the request to the backend
        const API_BASE_URL = 'https://gic-project.darororo.dev';
        const response = await $fetch(`${API_BASE_URL}/users/github/callback?code=${code}`, {
            method: 'GET',
        });

        // Extract tokens from the response
        // Handle structure: {success: true, tokens: {access_token, refresh_token}}
        if (response && typeof response === 'object') {
            let access_token, refresh_token;

            // Check for tokens nested under 'tokens' key
            if ('tokens' in response) {
                const tokens = (response as any).tokens;
                access_token = tokens.access_token;
                refresh_token = tokens.refresh_token;
            }
            // Check for tokens directly in response
            else if ('access_token' in response) {
                access_token = (response as any).access_token;
                refresh_token = (response as any).refresh_token;
            }
            // Check for tokens nested under 'data' key
            else if ('data' in response) {
                const data = (response as any).data;
                if (data && data.access_token) {
                    access_token = data.access_token;
                    refresh_token = data.refresh_token;
                } else if (data && data.tokens) {
                    access_token = data.tokens.access_token;
                    refresh_token = data.tokens.refresh_token;
                }
            }

            if (access_token) {
                const redirectUrl = `/auth/callback?token=${access_token}${refresh_token ? `&refresh_token=${refresh_token}` : ''}`;
                return sendRedirect(event, redirectUrl);
            }
        }        // If we couldn't find the tokens, redirect with error
        return sendRedirect(event, '/login?error=Invalid response from authentication server');
    } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        return sendRedirect(event, '/login?error=Authentication failed');
    }
});
