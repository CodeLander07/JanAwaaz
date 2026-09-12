'use client';

import type { ReactNode } from 'react';

/**
 * Props for the AuthCard component.
 * @property children - Form content rendered inside the card.
 * @property className - Optional additional CSS classes.
 */
interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered card wrapper for authentication pages.
 * Provides consistent padding, border radius, and max-width
 * across sign-in, sign-up, forgot-password, and reset-password forms.
 */
export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div
      className={`w-full max-w-[420px] mx-auto bg-white border border-gray-200 rounded-2xl p-8 ${className}`}
    >
      {children}
    </div>
  );
}
