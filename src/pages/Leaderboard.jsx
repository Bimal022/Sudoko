import React, { useEffect, useState } from 'react'
import { getTopUsers, subscribeToTopUsers } from '../services/leaderboardService'

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remaining = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${remaining}`
}

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let unsubscribe = null

    async function load() {
      try {
        setError('')
        const initial = await getTopUsers(10)
        setUsers(initial)
        unsubscribe = subscribeToTopUsers(setUsers, 10)
      } catch (err) {
        setError(err?.message || 'Unable to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Leaderboard</h2>
      <p className="text-sm text-gray-600 mb-4">Top players ranked by rating and time.</p>

      {loading && <div className="text-sm text-gray-500">Loading leaderboard...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{user.displayName || 'Anonymous'}</td>
                <td className="px-4 py-3 capitalize">{user.difficulty || '-'}</td>
                <td className="px-4 py-3">{user.rating ?? '-'}</td>
                <td className="px-4 py-3">{typeof user.timeSeconds === 'number' ? formatTime(user.timeSeconds) : '-'}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan="5">No scores yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
