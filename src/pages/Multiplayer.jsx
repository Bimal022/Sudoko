import React, { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, signInAnonymouslyUser } from '../services/authService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  joinMatchmaking,
  subscribeToMatch,
  subscribeToQueueEntry,
  submitMove
} from '../services/multiplayerService'

function createEmptyBoard(puzzle = []) {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => puzzle?.[row]?.[col] ?? null)
  )
}

export default function Multiplayer() {
  const [user, setUser] = useState(getCurrentUser())
  const [difficulty, setDifficulty] = useState('easy')
  const [status, setStatus] = useState('idle')
  const [queueId, setQueueId] = useState('')
  const [match, setMatch] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function ensureAuth() {
      if (getCurrentUser()) {
        setUser(getCurrentUser())
        return
      }
      try {
        const result = await signInAnonymouslyUser()
        setUser(result.user)
      } catch (error) {
        setStatus('auth-error')
      }
    }

    ensureAuth()
  }, [])

  useEffect(() => {
    if (!queueId) return undefined

    return subscribeToQueueEntry(queueId, queueEntry => {
      if (!queueEntry) return
      if (queueEntry.matchId) {
        setStatus('matched')
        setQueueId('')
        getDoc(doc(db, 'matches', queueEntry.matchId)).then(snapshot => {
          if (snapshot.exists()) {
            setMatch({ id: snapshot.id, ...snapshot.data() })
          }
        })
      }
    })
  }, [queueId])

  useEffect(() => {
    if (!match?.id) return undefined

    return subscribeToMatch(match.id, nextMatch => {
      setMatch(nextMatch)
      if (nextMatch?.status === 'finished') {
        setStatus('finished')
      }
    })
  }, [match?.id])

  const board = useMemo(() => {
    if (!match) return createEmptyBoard([])
    return createEmptyBoard(match.currentGrid || match.puzzle)
  }, [match])

  async function handleJoin() {
    if (!user) return
    setStatus('searching')
    const result = await joinMatchmaking({
      userId: user.uid,
      displayName: user.displayName || (user.isAnonymous ? 'Anonymous' : 'Player'),
      difficulty
    })

    if (result.matchId) {
      setStatus('matched')
      return
    }

    if (result.queueId) {
      setQueueId(result.queueId)
      setStatus('queued')
      return
    }
  }

  async function handleNumber(value) {
    if (!match || !selected || !user) return
    const { row, col } = selected
    await submitMove({
      matchId: match.id,
      row,
      col,
      value,
      userId: user.uid
    })
  }

  const isWinner = match?.winnerId && user?.uid && match.winnerId === user.uid

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Online Multiplayer</h2>
      <p className="text-sm text-gray-600 mb-4">Matchmaking uses Firestore listeners and a shared puzzle.</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm" onClick={handleJoin}>
          Find Match
        </button>
        <div className="text-sm text-gray-700">Status: {status}</div>
      </div>

      {match && (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="inline-block rounded-lg border bg-white p-2 shadow-sm">
            <div className="grid grid-cols-9 gap-0">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const fixed = match.puzzle?.[rowIndex]?.[colIndex] != null
                  const isSelected = selected?.row === rowIndex && selected?.col === colIndex
                  const boxBorder =
                    (colIndex % 3 === 2 && colIndex !== 8 ? ' border-r-2' : '') +
                    (rowIndex % 3 === 2 && rowIndex !== 8 ? ' border-b-2' : '')

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => setSelected({ row: rowIndex, col: colIndex })}
                      className={`flex h-10 w-10 items-center justify-center border text-sm ${boxBorder} ${fixed ? 'bg-gray-100 font-semibold' : 'bg-white'} ${isSelected ? 'bg-blue-200' : ''}`}
                    >
                      {cell ?? ''}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm text-gray-700">Players: {match.players?.map(player => player.displayName).join(' vs ')}</div>
            <div className="grid grid-cols-9 gap-2 max-w-md">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                <button
                  key={number}
                  type="button"
                  className="rounded bg-gray-100 py-2 hover:bg-gray-200"
                  onClick={() => handleNumber(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="rounded bg-red-100 px-4 py-2 text-red-700"
                onClick={() => handleNumber(null)}
              >
                Erase
              </button>
            </div>
            <div className="mt-4 rounded border bg-white p-4 text-sm">
              <div className="font-medium">Match state</div>
              <div>Winner: {match.winnerId || 'none yet'}</div>
              <div>Current user: {user?.displayName || user?.uid || 'loading...'}</div>
              {isWinner && <div className="mt-2 text-green-600 font-semibold">You won this match.</div>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
