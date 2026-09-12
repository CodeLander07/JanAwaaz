import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - JanAwaaz',
  description:
    'AI-powered platform to transform citizen feedback into actionable infrastructure development insights.',
};

/**
 * Dashboard layout — server component that exports metadata.
 * The actual page content is rendered as a client component with ProtectedRoute.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
