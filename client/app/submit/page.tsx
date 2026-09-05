'use client'

import { useState } from 'react'
import { submitFeedback } from '../lib/api'

export default function SubmitPage() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Submitting...')
    setError('')
    
    try {
      const result = await submitFeedback(text)
      setStatus(`Submitted successfully! ID: ${result.request_id}`)
      setText('')
    } catch (err) {
      setError('Failed to submit. Please try again.')
      setStatus('')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Submit Feedback</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the infrastructure issue in your area..."
          className="w-full h-40 p-4 border rounded-lg mb-4"
          required
        />
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Language (optional, e.g., 'hi' for Hindi)"
          className="w-full p-2 border rounded-lg mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
        {status && <p className="mt-4 text-green-600">{status}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </main>
  )
}