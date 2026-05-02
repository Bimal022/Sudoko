import React from 'react'
import { useGame } from '../context/GameContext'
import styles from './WinModal.module.css'

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function WinModal({ onClose }) {
  const { seconds, mistakes, difficulty, newGame } = useGame()

  function handlePlayAgain() {
    newGame(difficulty)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <div className={styles.emoji}>\(^o^)/</div>
        <h2 className={styles.title}>Puzzle Solved!</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>Time</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{mistakes}</span>
            <span className={styles.statLabel}>Mistakes</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            <span className={styles.statLabel}>Difficulty</span>
          </div>
        </div>
        <button className={styles.primaryBtn} onClick={handlePlayAgain}>Play Again</button>
        <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}