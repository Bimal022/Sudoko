import React from 'react'
import { useGame } from '../context/GameContext'

export default function NumberPad() {
  const { selected, updateValue } = useGame()

  function handleNumber(n) {
    if (!selected) return
    updateValue(selected.row, selected.col, n)
  }

  return (
    <div className="glass-panel mt-2 p-4 animate-fade-up">
      <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Number Input</div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[220px]">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            className="interactive rounded-lg border border-slate-200 bg-slate-50 py-2 text-lg font-semibold text-slate-700 hover:bg-blue-100"
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => { if (selected) updateValue(selected.row, selected.col, null) }}
          className="interactive rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
        >
          Erase
        </button>
        <div className="text-xs text-slate-500">Tip: select a cell first</div>
      </div>
    </div>
  )
}
