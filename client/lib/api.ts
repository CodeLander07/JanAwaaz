import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Extended request config with a `_retry` flag to prevent infinite
 * refresh loops on 401 responses.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Callback invoked when token refresh fails and the user needs
 * to re-authenticate. Set by AuthContext to use Next.js router.
 */
let onAuthFailure: (() => void) | null = null;

/**
 * Register a callback to be called when the auth session is
 * irrecoverably expired (refresh token rejected).
 */
export function setAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

/**
 * Axios instance configured for auth-related API calls.
 *
 * - `withCredentials: true` ensures httpOnly cookies are sent/received.
 * - A response interceptor handles 401s by attempting a single token
 *   refresh via POST /api/v1/auth/refresh, then retrying the original
 *   request. On refresh failure, the registered auth failure handler
 *   is invoked (typically a redirect to /auth/signin).
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh logic for auth endpoints themselves to avoid loops
    const isAuthRequest = originalRequest.url?.includes('/auth/');
    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${BASE_URL}/api/v1/auth/refresh`, null, {
          withCredentials: true,
        });
        return api(originalRequest);
      } catch {
        // Refresh failed — invoke auth failure handler
        onAuthFailure?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export { api };

