import React, { useState, useEffect } from 'react'
import Grid from '../components/Grid'
import NumberPad from '../components/NumberPad'
import MascotFeedback from '../components/MascotFeedback'
import WinModal from '../components/WinModal'
import { useGame } from '../context/GameContext'
import styles from './Home.module.css'

export default function Home() {
  const { win } = useGame()
  const [showWin, setShowWin] = useState(false)

  useEffect(() => {
    if (win) setShowWin(true)
  }, [win])

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.heading}>Play Sudoku</h2>
        <p className={styles.sub}>Fast moves, clean focus, and gentle feedback while you solve.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.gridArea}>
          <Grid />
        </div>
        <div className={styles.sideArea}>
          <NumberPad />
          <MascotFeedback />
        </div>
      </div>

      {showWin && <WinModal onClose={() => setShowWin(false)} />}
    </section>
  )
}