/**
 * User roles within the JanAwaaz platform.
 */
export type Role = 'citizen' | 'policymaker' | 'admin';

/**
 * User object returned by the backend (matches UserResponse schema).
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  country: string;
  is_verified: boolean;
  created_at: string;
}

/**
 * Payload for POST /api/v1/auth/login.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Payload for POST /api/v1/auth/register.
 */
export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  country: string;
}

/**
 * Payload for POST /api/v1/auth/forgot-password.
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Payload for POST /api/v1/auth/reset-password.
 */
export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}
