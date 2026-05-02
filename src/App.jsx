import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import LoginScreen from './components/LoginScreen'
import Layout from './components/Layout'
import Home from './pages/Home'
import './index.css'

function AppInner() {
  const { user } = useAuth()

  // Still loading auth state
  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink3)', fontSize: '.9rem' }}>
          Loading…
        </div>
      </div>
    )
  }

  // Not logged in — show auth screen
  if (!user) return <LoginScreen />

  // Logged in — show game
  return (
    <GameProvider>
      <Layout>
        <Home />
      </Layout>
    </GameProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}