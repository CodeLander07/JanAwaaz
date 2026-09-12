import type { Metadata } from 'next';
import { AuthLayoutShell } from '@/components/auth/AuthLayoutShell';

export const metadata: Metadata = {
  title: 'Auth — JanAwaaz',
  description: 'Sign in or create an account to access JanAwaaz.',
};

/**
 * Layout for all /auth/* routes.
 * Uses the minimal AuthLayoutShell with centered content on a gray-50 background.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
