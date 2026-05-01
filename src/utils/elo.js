export function calculateExpectedScore(playerRating, opponentRating) {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))
}

export function calculateEloRating(oldRating, result, expected, k = 32) {
  return Math.round(oldRating + k * (result - expected))
}

export function updateEloRating({ oldRating, opponentRating, result, k = 32 }) {
  const expected = calculateExpectedScore(oldRating, opponentRating)
  return calculateEloRating(oldRating, result, expected, k)
}
