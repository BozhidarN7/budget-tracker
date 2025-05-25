import { AuthService } from '@/utils/auth';

function getAuthHeaders(): HeadersInit {
  const tokens = AuthService.getTokens();

  if (!tokens?.accessToken) {
    throw new Error('No access token available. Please sign in again.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokens.idToken}`,
  };
}

// Helper function to handle API responses
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      // Try to refresh tokens
      const newTokens = await AuthService.refreshTokens();
      if (!newTokens) {
        // If refresh fails, sign out the user
        AuthService.signOut();
        throw new Error('Session expired. Please sign in again.');
      }
      throw new Error('Authentication failed. Please try again.');
    }

    // Handle other HTTP errors
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Helper function to make authenticated API calls with retry logic
export async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit = {},
) {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    // If it's an auth error, try refreshing tokens and retry once
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      (error.message as string).includes('Authentication failed')
    ) {
      try {
        const newTokens = await AuthService.refreshTokens();
        if (newTokens) {
          // Retry with new tokens
          const headers = getAuthHeaders();
          const response = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              ...options.headers,
            },
          });
          return await handleApiResponse(response);
        }
      } catch (retryError) {
        console.error('Retry with refreshed tokens failed:', retryError);
      }
    }
    throw error;
  }
}
