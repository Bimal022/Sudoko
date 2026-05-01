import React from 'react'
import GameControls from './GameControls'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="app-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sudoku Arena</h1>
          <nav className="flex flex-wrap items-center text-sm text-slate-600">
            <a className="mr-4 transition-colors hover:text-blue-600" href="#/">Home</a>
            <a className="mr-4 transition-colors hover:text-blue-600" href="#/learn">Learn</a>
            <a className="mr-4 transition-colors hover:text-blue-600" href="#/practice">Practice</a>
            <a className="mr-4 transition-colors hover:text-blue-600" href="#/leaderboard">Leaderboard</a>
            <a className="transition-colors hover:text-blue-600" href="#/multiplayer">Multiplayer</a>
          </nav>
        </div>
        <GameControls />
      </div>
    </header>
  )
}
