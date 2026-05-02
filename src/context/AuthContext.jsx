import React, { createContext, useContext, useState, useEffect } from 'react'
import { subscribeToAuthChanges, signInWithGoogle, signInAnonymouslyUser, logout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    const unsub = subscribeToAuthChanges(u => setUser(u))
    return unsub
  }, [])

  const loginWithGoogle = () => signInWithGoogle()
  const loginAsGuest   = () => signInAnonymouslyUser()
  const logoutUser     = () => logout()

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsGuest, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}