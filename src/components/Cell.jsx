import React from 'react'
import { useGame } from '../context/GameContext'

export default function Cell({ cell }) {
  const { selected, selectCell, updateValue } = useGame()
  const { row, col, value, isFixed, isError } = cell

  const isSelected = selected && selected.row === row && selected.col === col
  const sameRow = selected && selected.row === row
  const sameCol = selected && selected.col === col
  const sameBox = selected && Math.floor(selected.row / 3) === Math.floor(row / 3) && Math.floor(selected.col / 3) === Math.floor(col / 3)

  const base = 'interactive w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-lg cursor-pointer select-none transition-all duration-150'
  let classes = base + ' border'
  if (isFixed) classes += ' bg-slate-200/90 font-semibold text-slate-700'
  if (isSelected) classes += ' bg-blue-300 shadow-inner ring-2 ring-blue-500/35'
  else if (sameRow || sameCol || sameBox) classes += ' bg-blue-50'
  if (isError) classes += ' bg-red-200 text-red-900'
  if (!isFixed && !isError && !isSelected) classes += ' hover:bg-blue-100'

  function onClick() {
    selectCell(row, col)
  }

  function onKeyDown(e) {
    const k = e.key
    if (/^[1-9]$/.test(k)) updateValue(row, col, Number(k))
    if (k === 'Backspace' || k === 'Delete' || k === '0') updateValue(row, col, null)
  }

  return (
    <div
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={classes + ' outline-none focus:ring-2 focus:ring-blue-400/50'}
      role="button"
      aria-label={`Cell ${row + 1}-${col + 1}`}>
      {value || ''}
    </div>
  )
}
