import { api } from '@/lib/api';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth';

/**
 * Register a new user.
 * POST /api/v1/auth/register → 201 + UserResponse
 */
export async function register(payload: RegisterPayload): Promise<User> {
  const response = await api.post<User>('/api/v1/auth/register', payload);
  return response.data;
}

/**
 * Log in an existing user.
 * POST /api/v1/auth/login → 200 + UserResponse
 */
export async function login(payload: LoginPayload): Promise<User> {
  const response = await api.post<User>('/api/v1/auth/login', payload);
  return response.data;
}

/**
 * Log out the current user.
 * POST /api/v1/auth/logout → 204 + clear cookies
 */
export async function logout(): Promise<void> {
  await api.post('/api/v1/auth/logout');
}

/**
 * Fetch the currently authenticated user.
 * GET /api/v1/auth/me → 200 + UserResponse
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/api/v1/auth/me');
  return response.data;
}

/**
 * Request a password reset email.
 * POST /api/v1/auth/forgot-password → 202 (always same response)
 */
export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await api.post('/api/v1/auth/forgot-password', payload);
}

/**
 * Reset password using a token from the reset email.
 * POST /api/v1/auth/reset-password → 200 or 400
 */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await api.post('/api/v1/auth/reset-password', payload);
}
