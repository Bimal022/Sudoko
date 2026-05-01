import React from 'react'
import { useGame } from '../context/GameContext'

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function GameControls() {
  const { seconds, mistakes, newGame, resetGame, started, win } = useGame()

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-700">Time: <span className="font-mono">{formatTime(seconds)}</span></div>
      <div className="text-sm text-gray-700">Mistakes: <span className="font-medium">{mistakes}</span></div>
      <div>
        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 text-sm" onClick={() => newGame('easy')}>New (Easy)</button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm" onClick={() => newGame('medium')}>New (Med)</button>
        <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm" onClick={() => newGame('hard')}>New (Hard)</button>
      </div>
      {win && <div className="text-green-600 font-semibold">Solved!</div>}
    </div>
  )
}
