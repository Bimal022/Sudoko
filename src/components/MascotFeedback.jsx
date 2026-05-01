import React, { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'

const mascot = {
  happy: '(*^_^*)',
  neutral: '(o_o)',
  warning: '(>_<)',
  win: '\\(^o^)/'
}

export default function MascotFeedback() {
  const { mistakes, win, selected } = useGame()
  const [enabled, setEnabled] = useState(true)

  const mood = useMemo(() => {
    if (win) return 'win'
    if (mistakes >= 5) return 'warning'
    if (selected) return 'happy'
    return 'neutral'
  }, [mistakes, selected, win])

  const message = useMemo(() => {
    if (win) return 'Brilliant finish. You solved the puzzle!'
    if (mistakes >= 5) return 'Slow down and scan rows/columns before placing.'
    if (selected) return 'Nice. Now place a value or erase to adjust.'
    return 'Pick a cell to begin. You got this.'
  }, [mistakes, selected, win])

  return (
    <section className="glass-panel p-4 animate-fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Mascot Coach</h3>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
          Enable
        </label>
      </div>

      {enabled ? (
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-3 text-slate-700 transition-all duration-200">
          <div className="text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{mascot[mood]}</div>
          <p className="mt-2 text-sm">{message}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">Mascot feedback is off.</div>
      )}
    </section>
  )
}
