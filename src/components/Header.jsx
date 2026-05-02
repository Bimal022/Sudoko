import React from 'react'
import GameControls from './GameControls'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { user, logoutUser } = useAuth()

  const displayName = user?.isAnonymous
    ? 'Guest'
    : (user?.displayName || user?.email?.split('@')[0] || 'Player')

  const initials = displayName.slice(0, 1).toUpperCase()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.logo}>Sudoku Arena</h1>
          <nav className={styles.nav}>
            <a href="#/">Home</a>
            <a href="#/learn">Learn</a>
            <a href="#/practice">Practice</a>
            <a href="#/leaderboard">Leaderboard</a>
            <a href="#/multiplayer">Multiplayer</a>
          </nav>
        </div>

        <div className={styles.right}>
          <GameControls />
          <div className={styles.userChip}>
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.userName}>{displayName}</span>
          </div>
          <button className={styles.signOutBtn} onClick={logoutUser}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}