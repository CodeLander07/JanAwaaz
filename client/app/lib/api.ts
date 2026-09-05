import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function submitFeedback(text: string, location?: { lat: number; lon: number }) {
  try {
    const response = await api.post('/api/v1/submit/text', {
      text,
      location,
    })
    return response.data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export async function getHotspots(sector?: string) {
  try {
    const response = await api.get('/api/v1/hotspots', {
      params: { sector },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching hotspots:', error)
    throw error
  }
}