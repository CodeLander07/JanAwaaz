'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types/auth';

/**
 * Props for the ProtectedRoute component.
 * @property children - Content to render when the user is authenticated and authorized.
 * @property allowedRoles - Optional whitelist of roles. If set, users with roles
 *   not in the list are redirected to /dashboard.
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

/**
 * Client-side route guard that checks authentication and optional role authorization.
 *
 * Behavior:
 * - While loading: renders a centered spinner.
 * - If not authenticated: redirects to /auth/signin.
 * - If authenticated but role not in allowedRoles: redirects to /dashboard.
 * - If authenticated (and authorized): renders children.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, loading, router, allowedRoles]);

  // Loading state — centered spinner
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-label="Loading"
      >
        <svg
          className="animate-spin h-8 w-8 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Not authenticated — don't render children (redirect is happening)
  if (!user) {
    return null;
  }

  // Role mismatch — don't render children (redirect is happening)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
