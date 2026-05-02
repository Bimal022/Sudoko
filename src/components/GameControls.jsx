import React from 'react'
import { useGame } from '../context/GameContext'
import styles from './GameControls.module.css'

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

const DIFFICULTIES = ['easy', 'medium', 'hard']

export default function GameControls() {
  const { seconds, mistakes, newGame, difficulty, win } = useGame()

  return (
    <div className={styles.bar}>
      <div className={styles.stats}>
        <div className={styles.pill}>
          <span className={styles.pillIcon}>⏱</span>
          <span className={styles.pillVal}>{formatTime(seconds)}</span>
        </div>
        <div className={styles.pill}>
          <span className={styles.pillIcon}>✕</span>
          <span className={styles.pillVal}>{mistakes}</span>
          <span className={styles.pillSub}>/5</span>
        </div>
        <div className={`${styles.pill} ${styles.diffPill}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
      </div>

      <div className={styles.buttons}>
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            className={`${styles.diffBtn} ${difficulty === d ? styles.active : ''}`}
            onClick={() => newGame(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {win && (
        <div className={styles.winBadge}>
          ✓ Solved!
        </div>
      )}
    </div>
  )
}