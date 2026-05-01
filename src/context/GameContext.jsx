import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createExampleGrid } from '../utils/sudoku'
import solver from '../utils/sudokuSolver'
import { createCell, createFixedCell } from '../models'
import { getCurrentUser, signInAnonymouslyUser } from '../services/authService'
import { recordGameResult } from '../services/leaderboardService'

const GameContext = createContext(null)

export function useGame() {
  return useContext(GameContext)
}

export function GameProvider({ children, initialGrid = null }) {
  // grid stored as cell objects created earlier by scaffolding utilities
  const [grid, setGrid] = useState(() => initialGrid || createExampleGrid())
  const [selected, setSelected] = useState(null) // {row,col}
  const [mistakes, setMistakes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [win, setWin] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const timerRef = useRef(null)
  const recordedWinRef = useRef(false)

  // compute solution from fixed cells
  const [solution, setSolution] = useState(null)

  useEffect(() => {
    // derive numeric puzzle from fixed cells and solve
    const numeric = grid.map(row => row.map(cell => (cell.isFixed ? cell.value : null)))
    const solved = solver.solveSudoku(numeric)
    setSolution(solved)
  }, [grid])

  useEffect(() => {
    if (!started) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [started])

  useEffect(() => {
    async function persistScore() {
      if (!win || recordedWinRef.current) return
      recordedWinRef.current = true

      let user = getCurrentUser()
      if (!user) {
        try {
          const result = await signInAnonymouslyUser()
          user = result.user
        } catch (error) {
          return
        }
      }

      await recordGameResult({
        userId: user.uid,
        displayName: user.displayName || (user.isAnonymous ? 'Anonymous' : 'Player'),
        timeSeconds: seconds,
        difficulty,
        result: 1,
        opponentRating: difficulty === 'hard' ? 1400 : difficulty === 'medium' ? 1200 : 1000
      })
    }

    persistScore()
  }, [win, seconds, difficulty])

  function selectCell(row, col) {
    setSelected({ row, col })
  }

  function resetGame(newGrid = null) {
    setGrid(newGrid || createExampleGrid())
    setSelected(null)
    setMistakes(0)
    setSeconds(0)
    setStarted(false)
    setWin(false)
    recordedWinRef.current = false
  }

  function checkAndMarkErrors(gridCells) {
    // create numeric grid from current values
    const numeric = gridCells.map(row => row.map(cell => (cell.value == null ? null : cell.value)))
    const errs = solver.detectErrors(numeric)
    // reset error flags then set
    const newGrid = gridCells.map(row => row.map(cell => ({ ...cell, isError: false })))
    errs.forEach(({ row, col }) => {
      newGrid[row][col].isError = true
    })
    return newGrid
  }

  function updateValue(row, col, value) {
    setGrid(prev => {
      const cell = prev[row][col]
      if (cell.isFixed) return prev
      // start timer on first action
      if (!started) setStarted(true)
      const newGrid = prev.map(r => r.map(c => ({ ...c })))
      newGrid[row][col].value = value == null ? null : value
      // mark errors
      const marked = checkAndMarkErrors(newGrid)
      // update mistakes if solution exists
      if (solution && value != null) {
        if (solution[row][col] !== value) {
          setMistakes(m => m + 1)
        }
      }
      // check win
      const numeric = marked.map(r => r.map(c => (c.value == null ? null : c.value)))
      if (solution && JSON.stringify(numeric) === JSON.stringify(solution)) {
        setWin(true)
        setStarted(false)
      }
      return marked
    })
  }

  function buildGridFromNumbers(numbersGrid) {
    // numbersGrid: 9x9 numbers or null
    return numbersGrid.map((row, r) =>
      row.map((v, c) => (v == null ? createCell({ row: r, col: c }) : createFixedCell(v, r, c)))
    )
  }

  function newGame(difficulty = 'medium') {
    setDifficulty(difficulty)
    const nums = solver.generatePuzzle(difficulty)
    const newGrid = buildGridFromNumbers(nums)
    resetGame(newGrid)
    // player starts timer by making first move
  }

  const value = {
    grid,
    selected,
    seconds,
    mistakes,
    started,
    win,
    difficulty,
    selectCell,
    updateValue,
    resetGame,
    newGame,
    solution
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export default GameContext
