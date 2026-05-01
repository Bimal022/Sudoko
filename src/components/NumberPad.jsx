import React from 'react'
import { useGame } from '../context/GameContext'

export default function NumberPad() {
  const { selected, updateValue } = useGame()

  function handleNumber(n) {
    if (!selected) return
    updateValue(selected.row, selected.col, n)
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-9 gap-2 w-full max-w-md">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleNumber(n)} className="py-2 bg-gray-100 rounded hover:bg-gray-200">{n}</button>
        ))}
      </div>
      <div className="mt-3">
        <button onClick={() => { if (selected) updateValue(selected.row, selected.col, null) }} className="px-4 py-2 bg-red-100 text-red-700 rounded">Erase</button>
      </div>
    </div>
  )
}
