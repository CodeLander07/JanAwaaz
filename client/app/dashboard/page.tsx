'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      router.push('/auth/signin');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="4" height="12" x="2" y="8" rx="2" fill="currentColor" />
                <rect width="4" height="20" x="8" y="4" rx="2" fill="currentColor" />
                <rect width="4" height="28" x="14" y="0" rx="2" fill="currentColor" />
                <rect width="4" height="16" x="20" y="6" rx="2" fill="currentColor" />
              </svg>
              <span className="font-bold tracking-tight text-lg">JanAwaaz</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-black leading-tight">
                  {user?.full_name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
                {user?.role}
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-600 hover:text-black font-medium px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-black">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Citizen'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Community infrastructure insights and voice submissions portal
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                User Status
              </span>
              <p className="mt-2 text-2xl font-bold text-black capitalize">
                {user?.role}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Country: {user?.country || 'India'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                Active Hotspots
              </span>
              <p className="mt-2 text-2xl font-bold text-black">3 Regions</p>
              <p className="mt-1 text-xs text-gray-500">
                High priority infrastructure demands
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                Session Status
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-semibold text-black">Authenticated</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Protected HTTP-only session</p>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center sm:text-left">
            <h2 className="text-lg font-bold text-black mb-2">
              Citizen Demand Feed & AI Clustering
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mb-6">
              JanAwaaz AI clusters multi-dialect voice and text submissions into prioritized infrastructure interventions across water, roads, power, and healthcare.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/" variant="secondary" size="default">
                Explore Public Landing
              </Button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}