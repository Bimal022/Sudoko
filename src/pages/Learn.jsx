import React from 'react'

export default function Learn() {
  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Learn Sudoku</h2>
      <div className="prose max-w-none">
        <h3>Rules</h3>
        <ol>
          <li>Fill the grid so every row, column and 3x3 box contains the numbers 1–9 exactly once.</li>
          <li>Given numbers are fixed and cannot be changed.</li>
        </ol>

        <h3>Examples</h3>
        <p>Look for forced placements, single candidates, and elimination techniques.</p>

        <h3>Step-by-step guidance</h3>
        <ol>
          <li>Scan rows, columns and boxes for obvious single candidates.</li>
          <li>Use pencil marks (notes) to track candidates.</li>
          <li>Apply techniques like naked singles, hidden singles, naked pairs.</li>
        </ol>

        <p className="mt-4">This page is a simple guide to get started. Practice mode contains small puzzles focused on techniques.</p>
      </div>
    </section>
  )
}
