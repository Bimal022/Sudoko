import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  limit,
  getDocs
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { generatePuzzle, solveSudoku } from '../utils/sudokuSolver'

const queueCollection = collection(db, 'matchmakingQueue')
const matchesCollection = collection(db, 'matches')

function buildMatchPayload({ difficulty = 'easy', players = [] } = {}) {
  const puzzle = generatePuzzle(difficulty)
  const solution = solveSudoku(puzzle)

  return {
    difficulty,
    puzzle,
    solution,
    players,
    status: 'waiting',
    winnerId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
}

export async function joinMatchmaking({ userId, displayName, difficulty = 'easy' }) {
  const queueEntry = {
    userId,
    displayName: displayName || 'Anonymous',
    difficulty,
    createdAt: serverTimestamp()
  }

  const existingMatchQuery = query(
    queueCollection,
    where('difficulty', '==', difficulty),
    orderBy('createdAt', 'asc'),
    limit(1)
  )

  const existing = await getDocs(existingMatchQuery)
  if (!existing.empty) {
    const other = existing.docs[0]
    const otherData = other.data()
    const matchRef = await addDoc(matchesCollection, buildMatchPayload({
      difficulty,
      players: [
        { userId: otherData.userId, displayName: otherData.displayName },
        { userId, displayName: displayName || 'Anonymous' }
      ]
    }))
    await updateDoc(doc(db, 'matchmakingQueue', other.id), { matched: true, matchId: matchRef.id })
    return { matchId: matchRef.id, status: 'matched' }
  }

  const ref = await addDoc(queueCollection, queueEntry)
  return { queueId: ref.id, status: 'queued' }
}

export function subscribeToMatch(matchId, callback) {
  return onSnapshot(doc(db, 'matches', matchId), snapshot => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }
    callback({ id: snapshot.id, ...snapshot.data() })
  })
}

export async function createSharedMatch({ difficulty = 'easy', players = [] } = {}) {
  const ref = await addDoc(matchesCollection, buildMatchPayload({ difficulty, players }))
  return ref.id
}

export async function submitMove({ matchId, row, col, value, userId }) {
  const matchRef = doc(db, 'matches', matchId)
  const snapshot = await getDoc(matchRef)
  if (!snapshot.exists()) return null

  const match = snapshot.data()
  const nextGrid = (match.currentGrid || match.puzzle).map(rowValues => rowValues.slice())
  nextGrid[row][col] = value

  const solved = match.solution
  const solvedCell = solved?.[row]?.[col]
  const isComplete = nextGrid.every((gridRow, r) =>
    gridRow.every((cell, c) => cell != null && cell === solved[r][c])
  )

  const update = {
    currentGrid: nextGrid,
    updatedAt: serverTimestamp(),
    lastMoveBy: userId
  }

  if (isComplete && !match.winnerId) {
    update.status = 'finished'
    update.winnerId = userId
  }

  await updateDoc(matchRef, update)
  return update
}

export function subscribeToQueue(difficulty, callback) {
  const queueQuery = query(
    queueCollection,
    where('difficulty', '==', difficulty),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(queueQuery, snapshot => {
    callback(snapshot.docs.map(entry => ({ id: entry.id, ...entry.data() })))
  })
}

export function subscribeToQueueEntry(queueId, callback) {
  return onSnapshot(doc(db, 'matchmakingQueue', queueId), snapshot => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }
    callback({ id: snapshot.id, ...snapshot.data() })
  })
}

