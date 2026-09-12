'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Protected dashboard page.
 * Metadata is exported from the co-located layout.tsx (server component).
 * This page is a client component wrapped with ProtectedRoute.
 */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-6">JanAwaaz Dashboard</h1>
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">
            Infrastructure demand visualization coming soon...
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}