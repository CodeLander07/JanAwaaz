import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - JanAwaaz',
  description: 'AI-powered platform to transform citizen feedback into actionable infrastructure development insights.',
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">JanAwaaz Dashboard</h1>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">
          Infrastructure demand visualization coming soon...
        </p>
      </div>
    </main>
  )
}