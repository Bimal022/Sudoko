import React, { useEffect, useState } from 'react'
import Layout from './components/Layout'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'

function Router({ route }) {
  if (route === '/learn') return <Learn />
  if (route === '/practice') return <Practice />
  return <Home />
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/')

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash.replace('#', '') || '/')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <GameProvider>
      <Layout>
        <Router route={route} />
      </Layout>
    </GameProvider>
  )
}
