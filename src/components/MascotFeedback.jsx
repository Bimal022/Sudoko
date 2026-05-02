import React, { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import styles from './MascotFeedback.module.css'

const MASCOTS = {
  happy:   '(*^_^*)',
  neutral: '(o_o)',
  warning: '(>_<)',
  win:     '\\(^o^)/',
}

const MESSAGES = {
  happy:   'Nice. Now place a value or erase to adjust.',
  neutral: 'Pick a cell to begin. You got this.',
  warning: 'Slow down — scan rows and columns before placing.',
  win:     'Brilliant finish. You solved the puzzle!',
}

export default function MascotFeedback() {
  const { mistakes, win, selected } = useGame()
  const [enabled, setEnabled] = useState(true)

  const mood = useMemo(() => {
    if (win)           return 'win'
    if (mistakes >= 5) return 'warning'
    if (selected)      return 'happy'
    return 'neutral'
  }, [mistakes, selected, win])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <p className={styles.label}>Mascot Coach</p>
        <label className={styles.toggle}>
          <div
            className={`${styles.switch} ${enabled ? styles.on : ''}`}
            onClick={() => setEnabled(e => !e)}
          >
            <div className={styles.knob} />
          </div>
          <span>{enabled ? 'On' : 'Off'}</span>
        </label>
      </div>

      {enabled ? (
        <div className={`${styles.bubble} ${styles[mood]}`}>
          <div className={styles.face}>{MASCOTS[mood]}</div>
          <p className={styles.message}>{MESSAGES[mood]}</p>
        </div>
      ) : (
        <div className={styles.disabled}>Mascot feedback is off.</div>
      )}
    </div>
  )
}