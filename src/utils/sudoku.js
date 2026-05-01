import { createCell, createFixedCell } from '../models'

/**
 * Create an empty 9x9 grid of Sudoku cells
 * Returns an array of 9 rows, each row is an array of 9 cell objects
 */
export function createEmptyGrid() {
  const grid = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => createCell({ row, col }))
  )
  return grid
}

/**
 * Create an example grid (common starter puzzle) where given numbers are marked as fixed
 * Values are numbers 1-9 or null
 */
export function createExampleGrid() {
  const template = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9]
  ]

  const grid = createEmptyGrid()

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = template[r][c]
      if (v !== null && v !== undefined) {
        grid[r][c] = createFixedCell(v, r, c)
      }
    }
  }

  return grid
}

/**
 * Utility: clone grid (deepish clone of cells)
 */
export function cloneGrid(grid) {
  return grid.map(row => row.map(cell => ({ ...cell, notes: Array.isArray(cell.notes) ? cell.notes.slice() : [] })))
}

export default {
  createEmptyGrid,
  createExampleGrid,
  cloneGrid
}
