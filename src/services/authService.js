import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/config'

const googleProvider = new GoogleAuthProvider()

export function signInAnonymouslyUser() {
  return signInAnonymously(auth)
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser() {
  return auth.currentUser
}