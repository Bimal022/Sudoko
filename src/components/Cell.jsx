import React, { useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import styles from './Cell.module.css'

export default function Cell({ cell }) {
  const { selected, selectCell, updateValue } = useGame()
  const { row, col, value, fixed, error } = cell
  const ref = useRef(null)

  const isSelected  = selected?.row === row && selected?.col === col
  const sameRow     = selected?.row === row
  const sameCol     = selected?.col === col
  const sameBox     = selected &&
    Math.floor(selected.row / 3) === Math.floor(row / 3) &&
    Math.floor(selected.col / 3) === Math.floor(col / 3)

  // pop animation on correct value placed
  const prevValue = useRef(value)
  useEffect(() => {
    if (value && value !== prevValue.current && !error && ref.current) {
      ref.current.classList.remove(styles.pop)
      void ref.current.offsetWidth
      ref.current.classList.add(styles.pop)
    }
    if (error && ref.current) {
      ref.current.classList.remove(styles.shake)
      void ref.current.offsetWidth
      ref.current.classList.add(styles.shake)
    }
    prevValue.current = value
  }, [value, error])

  function handleClick() { selectCell(row, col) }

  function handleKeyDown(e) {
    if (/^[1-9]$/.test(e.key)) updateValue(row, col, Number(e.key))
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') updateValue(row, col, null)
    if (e.key === 'ArrowRight') moveFocus(row, col + 1)
    if (e.key === 'ArrowLeft')  moveFocus(row, col - 1)
    if (e.key === 'ArrowDown')  moveFocus(row + 1, col)
    if (e.key === 'ArrowUp')    moveFocus(row - 1, col)
  }

  function moveFocus(r, c) {
    const nr = Math.max(0, Math.min(8, r))
    const nc = Math.max(0, Math.min(8, c))
    selectCell(nr, nc)
    document.querySelector(`[data-cell="${nr}-${nc}"]`)?.focus()
  }

  const cls = [
    styles.cell,
    fixed      ? styles.fixed    : '',
    error      ? styles.error    : '',
    isSelected ? styles.selected : (sameRow || sameCol || sameBox) ? styles.highlight : '',
    !fixed && !error && !isSelected ? styles.interactive : '',
    value && !fixed ? styles.userVal : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="button"
      aria-label={`Row ${row + 1} Column ${col + 1}${value ? ` value ${value}` : ''}`}
      data-cell={`${row}-${col}`}
      className={cls}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {value || ''}
    </div>
  )
}