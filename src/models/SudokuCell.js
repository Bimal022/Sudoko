/**
 * Sudoku cell factory
 * Each cell has:
 * - id: string (r{row}c{col})
 * - row, col: 0-based indices
 * - value: number 1-9 or null
 * - isFixed: boolean (given by puzzle)
 * - isError: boolean (validation state)
 * - notes: array of small-candidate numbers
 */

export function createCell({ row = 0, col = 0, value = null, isFixed = false, isError = false, notes = null, id = null } = {}) {
  return {
    id: id ?? `r${row}c${col}`,
    row,
    col,
    value: value === undefined ? null : value,
    isFixed: !!isFixed,
    isError: !!isError,
    notes: Array.isArray(notes) ? notes.slice() : []
  }
}

export function createFixedCell(value, row, col) {
  return createCell({ row, col, value, isFixed: true })
}

export default createCell
