import React from 'react'
import Cell from './Cell'
import { useGame } from '../context/GameContext'

function borderClass(r, c) {
  let cls = ''
  if (c % 3 === 2 && c !== 8) cls += ' border-r-2 '
  if (r % 3 === 2 && r !== 8) cls += ' border-b-2 '
  return cls
}

export default function Grid() {
  const { grid } = useGame()

  return (
    <div className="inline-block glass-panel p-3 animate-fade-up">
      <div className="grid grid-cols-9 gap-0">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className={borderClass(r, c)}>
              <Cell cell={cell} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
