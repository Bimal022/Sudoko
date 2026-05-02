import React, { useMemo } from 'react'
import { useGame } from '../context/GameContext'
import styles from './NumberPad.module.css'

export default function NumberPad() {
  const { grid, selected, updateValue } = useGame()

  const usedCounts = useMemo(() => {
    const counts = Array(10).fill(0)
    grid.forEach(row => row.forEach(cell => {
      if (cell.value && !cell.error) counts[cell.value]++
    }))
    return counts
  }, [grid])

  function handleNumber(n) {
    if (!selected) return
    updateValue(selected.row, selected.col, n)
  }

  function handleErase() {
    if (!selected) return
    updateValue(selected.row, selected.col, null)
  }

  return (
    <div className={styles.panel}>
      <p className={styles.label}>Number Input</p>
      <div className={styles.pad}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            className={`${styles.numBtn} ${usedCounts[n] >= 9 ? styles.used : ''}`}
            onClick={() => handleNumber(n)}
            aria-label={`Place ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className={styles.footer}>
        <button className={styles.eraseBtn} onClick={handleErase}>
          ✕ Erase
        </button>
        <span className={styles.tip}>Select a cell first</span>
      </div>
    </div>
  )
}