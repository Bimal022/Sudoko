/*
 Sudoku solver and puzzle generator (numeric grids)

 Grid representation used by these utilities:
 - 9x9 array of numbers where empty cells are null

 Exports:
 - isValid(grid, row, col, value)
 - validateFullBoard(grid)
 - detectErrors(grid) -> [{row,col}]
 - solveSudoku(grid) -> solvedGrid or null
 - countSolutions(grid, limit=2)
 - generateSolvedGrid() -> solved grid
 - generatePuzzle(difficulty) -> puzzle grid (numbers with nulls)

 Approach notes:
 - Backtracking solver used for solving and counting solutions.
 - Generator creates a full solved grid then removes cells randomly
   while ensuring uniqueness by checking solution counts.
 - Emphasized readability and separation from UI by working with plain numeric grids.
*/

function cloneGrid(grid) {
  return grid.map(row => row.slice())
}

export function isValid(grid, row, col, value) {
  if (value == null) return true
  // Row
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === value) return false
  }
  // Column
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === value) return false
  }
  // 3x3 box
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) return false
    }
  }
  return true
}

export function validateFullBoard(grid) {
  // ensure all cells filled and no conflicts
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c]
      if (v == null) return false
      if (!isValid(grid, r, c, v)) return false
    }
  }
  return true
}

export function detectErrors(grid) {
  const errors = []
  // For readability, detect duplicate occurrences per unit
  // row
  for (let r = 0; r < 9; r++) {
    const seen = {}
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c]
      if (v == null) continue
      const key = `${v}`
      if (seen[key]) {
        // mark both positions
        errors.push({ row: r, col: c })
        const prevCols = seen[key]
        prevCols.forEach(pc => errors.push({ row: r, col: pc }))
      } else {
        seen[key] = [c]
      }
    }
  }
  // column
  for (let c = 0; c < 9; c++) {
    const seen = {}
    for (let r = 0; r < 9; r++) {
      const v = grid[r][c]
      if (v == null) continue
      const key = `${v}`
      if (seen[key]) {
        errors.push({ row: r, col: c })
        const prevRows = seen[key]
        prevRows.forEach(pr => errors.push({ row: pr, col: c }))
      } else {
        seen[key] = [r]
      }
    }
  }
  // box
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const seen = {}
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          const v = grid[r][c]
          if (v == null) continue
          const key = `${v}`
          if (seen[key]) {
            errors.push({ row: r, col: c })
            const prev = seen[key]
            prev.forEach(p => errors.push({ row: p.r, col: p.c }))
          } else {
            seen[key] = [{ r, c }]
          }
        }
      }
    }
  }

  // remove duplicates in errors
  const unique = {}
  errors.forEach(e => {
    unique[`${e.row},${e.col}`] = e
  })
  return Object.values(unique)
}

function findEmpty(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] == null) return [r, c]
    }
  }
  return null
}

function shuffledNumbers() {
  const arr = [1,2,3,4,5,6,7,8,9]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function solveSudoku(grid) {
  const g = cloneGrid(grid)

  function backtrack() {
    const empty = findEmpty(g)
    if (!empty) return true
    const [r, c] = empty
    for (let n = 1; n <= 9; n++) {
      if (isValid(g, r, c, n)) {
        g[r][c] = n
        if (backtrack()) return true
        g[r][c] = null
      }
    }
    return false
  }

  const ok = backtrack()
  return ok ? g : null
}

export function countSolutions(grid, limit = 2) {
  let count = 0
  const g = cloneGrid(grid)

  function backtrack() {
    if (count >= limit) return
    const empty = findEmpty(g)
    if (!empty) {
      count++
      return
    }
    const [r, c] = empty
    for (let n = 1; n <= 9; n++) {
      if (isValid(g, r, c, n)) {
        g[r][c] = n
        backtrack()
        g[r][c] = null
        if (count >= limit) return
      }
    }
  }

  backtrack()
  return count
}

export function generateSolvedGrid() {
  const g = Array.from({ length: 9 }, () => Array(9).fill(null))

  function backtrack() {
    const empty = findEmpty(g)
    if (!empty) return true
    const [r, c] = empty
    const nums = shuffledNumbers()
    for (const n of nums) {
      if (isValid(g, r, c, n)) {
        g[r][c] = n
        if (backtrack()) return true
        g[r][c] = null
      }
    }
    return false
  }

  const ok = backtrack()
  if (!ok) throw new Error('Failed to generate solved grid')
  return g
}

export function generatePuzzle(difficulty = 'medium') {
  // difficulty controls number of clues left
  const cluesByDifficulty = {
    easy: 40,
    medium: 32,
    hard: 26
  }
  const minClues = cluesByDifficulty[difficulty] ?? cluesByDifficulty.medium

  const solved = generateSolvedGrid()
  const puzzle = cloneGrid(solved)

  // create list of cell indices and shuffle
  const cells = []
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c])
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cells[i], cells[j]] = [cells[j], cells[i]]
  }

  let clues = 81
  for (const [r, c] of cells) {
    if (clues <= minClues) break
    const backup = puzzle[r][c]
    puzzle[r][c] = null

    // ensure unique solution
    const solutions = countSolutions(puzzle, 2)
    if (solutions !== 1) {
      // revert removal
      puzzle[r][c] = backup
    } else {
      clues--
    }
  }

  return puzzle
}

export default {
  isValid,
  validateFullBoard,
  detectErrors,
  solveSudoku,
  countSolutions,
  generateSolvedGrid,
  generatePuzzle
}
