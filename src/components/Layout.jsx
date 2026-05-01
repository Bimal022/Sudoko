import React from 'react'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 app-container mt-6">{children}</main>
    </div>
  )
}
