import React from 'react'
import GameControls from './GameControls'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="app-container flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">Sudoku</h1>
          <nav className="text-sm text-gray-600">
            <a className="mr-4 hover:underline" href="#/">Home</a>
            <a className="mr-4 hover:underline" href="#/learn">Learn</a>
            <a className="hover:underline" href="#/practice">Practice</a>
          </nav>
        </div>
        <GameControls />
      </div>
    </header>
  )
}
