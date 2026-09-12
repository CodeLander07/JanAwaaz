'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';

/**
 * Props for the Providers component.
 * @property children - The app content to wrap with providers.
 */
interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side provider wrapper.
 * Wraps the application with AuthProvider and ToastProvider
 * so the root layout can remain a server component (preserving metadata exports).
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
