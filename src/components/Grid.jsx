import React from 'react'
import Cell from './Cell'
import { useGame } from '../context/GameContext'
import styles from './Grid.module.css'

function getBorderClass(r, c) {
  let cls = ''
  if (c % 3 === 2 && c !== 8) cls += ` ${styles.boxRight}`
  if (r % 3 === 2 && r !== 8) cls += ` ${styles.boxBottom}`
  return cls.trim()
}

export default function Grid() {
  const { grid } = useGame()

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`${styles.cellWrap} ${getBorderClass(r, c)}`}>
              <Cell cell={cell} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}