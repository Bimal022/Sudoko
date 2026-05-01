import React from 'react'
import Grid from '../components/Grid'
import NumberPad from '../components/NumberPad'
import MascotFeedback from '../components/MascotFeedback'

export default function Home() {
  return (
    <section className="animate-fade-up">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Play Sudoku</h2>
        <p className="mt-1 text-sm text-slate-600">Fast moves, clean focus, and gentle feedback while you solve.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[auto_320px]">
        <div className="stagger">
          <Grid />
        </div>
        <div className="stagger space-y-4">
          <NumberPad />
          <MascotFeedback />
        </div>
      </div>
    </section>
  )
}
