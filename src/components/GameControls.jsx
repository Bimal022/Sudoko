import React from 'react'
import { useGame } from '../context/GameContext'

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function GameControls() {
  const { seconds, mistakes, newGame, difficulty, win } = useGame()

  return (
    <div className="stagger flex flex-wrap items-center gap-2 lg:gap-3">
      <div className="glass-panel px-3 py-2 text-sm text-slate-700">Time: <span className="font-mono font-semibold">{formatTime(seconds)}</span></div>
      <div className="glass-panel px-3 py-2 text-sm text-slate-700">Mistakes: <span className="font-semibold">{mistakes}</span></div>
      <div className="glass-panel px-3 py-2 text-xs uppercase tracking-wide text-slate-500">Mode: <span className="font-semibold text-slate-700">{difficulty}</span></div>
      <div className="flex gap-2">
        <button className="btn-soft interactive" onClick={() => newGame('easy')}>Easy</button>
        <button className="btn-soft interactive" onClick={() => newGame('medium')}>Medium</button>
        <button className="btn-primary interactive" onClick={() => newGame('hard')}>Hard</button>
      </div>
      {win && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 font-semibold pulse-soft">Solved!</div>}
    </div>
  )
}
