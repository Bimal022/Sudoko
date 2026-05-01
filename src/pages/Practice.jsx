import React, { useState } from 'react'
import { useGame } from '../context/GameContext'

export default function Practice() {
  const { selected, solution, updateValue } = useGame()
  const [message, setMessage] = useState(null)

  function checkSelection() {
    if (!selected || !solution) {
      setMessage('Select a cell to check')
      return
    }
    const { row, col } = selected
    const correct = solution[row][col]
    setMessage(`Correct value for selected cell is ${correct}`)
  }

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Practice Mode</h2>
      <p className="mb-3">Focus: Find pairs and simple elimination techniques.</p>
      <div className="mb-3">
        <button className="px-3 py-1 bg-indigo-500 text-white rounded" onClick={() => checkSelection()}>Check Selection</button>
      </div>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </section>
  )
}
