import React from 'react'
import Grid from '../components/Grid'
import NumberPad from '../components/NumberPad'

export default function Home() {
  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Play</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div>
          <Grid />
        </div>
        <div>
          <NumberPad />
        </div>
      </div>
    </section>
  )
}
