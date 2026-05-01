import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { updateEloRating } from '../utils/elo'

const leaderboardCollection = collection(db, 'leaderboard')

export async function saveUserScore({ userId, displayName, timeSeconds, difficulty, rating }) {
  const payload = {
    userId,
    displayName: displayName || 'Anonymous',
    timeSeconds,
    difficulty,
    rating,
    updatedAt: serverTimestamp()
  }

  if (userId) {
    await setDoc(doc(db, 'leaderboard', userId), payload, { merge: true })
    return { id: userId, ...payload }
  }

  const ref = await addDoc(leaderboardCollection, payload)
  return { id: ref.id, ...payload }
}

export async function recordGameResult({
  userId,
  displayName,
  timeSeconds,
  difficulty,
  result = 1,
  opponentRating = 1000,
  k = 32
}) {
  const userRef = doc(db, 'leaderboard', userId)
  const snapshot = await getDoc(userRef)
  const oldRating = snapshot.exists() && typeof snapshot.data().rating === 'number' ? snapshot.data().rating : 1000
  const rating = updateEloRating({ oldRating, opponentRating, result, k })

  await setDoc(userRef, {
    userId,
    displayName: displayName || 'Anonymous',
    timeSeconds,
    difficulty,
    rating,
    updatedAt: serverTimestamp()
  }, { merge: true })

  return { id: userId, userId, displayName: displayName || 'Anonymous', timeSeconds, difficulty, rating }
}

export async function getTopUsers(maxItems = 10) {
  const leaderboardQuery = query(
    leaderboardCollection,
    orderBy('rating', 'desc'),
    orderBy('timeSeconds', 'asc'),
    limit(maxItems)
  )

  const snapshot = await getDocs(leaderboardQuery)
  return snapshot.docs.map(entry => ({ id: entry.id, ...entry.data() }))
}

export function subscribeToTopUsers(callback, maxItems = 10) {
  const leaderboardQuery = query(
    leaderboardCollection,
    orderBy('rating', 'desc'),
    orderBy('timeSeconds', 'asc'),
    limit(maxItems)
  )

  return onSnapshot(leaderboardQuery, snapshot => {
    callback(snapshot.docs.map(entry => ({ id: entry.id, ...entry.data() })))
  })
}
