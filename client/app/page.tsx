import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">CivicPulse</h1>
      <p className="text-xl text-gray-600 mb-8">
        Multilingual AI Platform for Citizen-Driven Infrastructure Planning
      </p>
      <div className="flex gap-4">
        <Link 
          href="/dashboard" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          View Dashboard
        </Link>
        <Link 
          href="/submit" 
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Submit Feedback
        </Link>
      </div>
    </main>
  )
}