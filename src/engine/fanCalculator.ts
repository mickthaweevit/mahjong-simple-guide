import type { TileCode } from '../data/tiles'
import type { WindTile, HandGrouping, MatchedPattern, ScoreResult } from './types'
import { scoringEntries } from '../data/scoring'
import { findAllGroupings, isSevenPairs, isThirteenOrphans } from './handGrouper'
import { matchPatterns } from './patternMatchers'
import { isMixedOneSuit, isFullOneSuit, isAllHonors, isAllTerminals, isMixedTerminals } from './patternMatchers'

/** Maximum Fan cap per Hong Kong Mahjong rules */
const FAN_CAP = 8

/**
 * Look up a scoring entry by ID and return its MatchedPattern metadata.
 */
function toMatchedPattern(id: string, fan: number): MatchedPattern {
  const entry = scoringEntries.find(e => e.id === id)
  return {
    id,
    englishName: entry?.englishName ?? id,
    chineseName: entry?.chineseName ?? id,
    fan,
  }
}

/**
 * Calculate wind Fan bonus for a grouping.
 *
 * A pung of the round wind tile gives +1 Fan.
 * A pung of the seat wind tile gives +1 Fan.
 * When round wind equals seat wind and the hand has a pung of that wind,
 * this naturally yields +2 Fan (one for each role).
 */
export function calculateWindFan(
  grouping: HandGrouping,
  roundWind: WindTile,
  seatWind: WindTile
): number {
  let fan = 0
  for (const set of grouping.sets) {
    if (set.type === 'pung' || set.type === 'kong') {
      if (set.tiles[0] === roundWind) fan += 1
      if (set.tiles[0] === seatWind) fan += 1
    }
  }
  return fan
}

/**
 * Calculate payout per person using the exponential formula.
 * Payout = 2^totalFan
 */
export function calculatePayout(totalFan: number): number {
  return Math.pow(2, totalFan)
}

/** Options for score calculation */
export interface CalculateScoreOptions {
  roundWind: WindTile
  seatWind: WindTile
  selfDraw: boolean
  bonusTileCount: number
}

/**
 * Score a Seven Pairs hand.
 * Seven Pairs is 4 Fan. Additional patterns that operate on raw tiles
 * (Mixed One Suit, Full One Suit) can stack on top.
 */
function scoreSevenPairs(
  tiles: TileCode[],
  options: CalculateScoreOptions
): ScoreResult {
  const patterns: MatchedPattern[] = []

  // Seven Pairs base: 4 Fan
  patterns.push(toMatchedPattern('seven-pairs', 4))

  // Check tile-based patterns that can stack with Seven Pairs
  // Limit hands first
  if (isAllHonors(tiles)) {
    patterns.push(toMatchedPattern('all-honors', 8))
  } else if (isAllTerminals(tiles)) {
    patterns.push(toMatchedPattern('all-terminals', 8))
  } else if (isFullOneSuit(tiles)) {
    patterns.push(toMatchedPattern('full-one-suit', 7))
  } else if (isMixedTerminals(tiles)) {
    patterns.push(toMatchedPattern('mixed-terminals', 5))
  } else if (isMixedOneSuit(tiles)) {
    patterns.push(toMatchedPattern('mixed-one-suit', 3))
  }

  const patternFan = patterns.reduce((sum, p) => sum + p.fan, 0)
  const bonusFan = options.bonusTileCount
  const selfDrawFan = options.selfDraw ? 1 : 0
  // No wind fan for Seven Pairs (no grouping with sets)
  const windFan = 0

  const rawTotal = patternFan + bonusFan + windFan + selfDrawFan
  const totalFan = Math.min(FAN_CAP, rawTotal)

  return {
    isValid: true,
    handType: 'seven-pairs',
    grouping: null,
    matchedPatterns: patterns,
    bonusFan,
    windFan,
    selfDrawFan,
    totalFan,
    payoutPerPerson: calculatePayout(totalFan),
  }
}

/**
 * Score a Thirteen Orphans hand.
 * Thirteen Orphans is always 8 Fan (limit hand).
 */
function scoreThirteenOrphans(
  options: CalculateScoreOptions
): ScoreResult {
  const patterns: MatchedPattern[] = [
    toMatchedPattern('thirteen-orphans', 8),
  ]

  const bonusFan = options.bonusTileCount
  const selfDrawFan = options.selfDraw ? 1 : 0
  const windFan = 0

  // Thirteen Orphans is a limit hand, total is capped at 8
  const rawTotal = 8 + bonusFan + windFan + selfDrawFan
  const totalFan = Math.min(FAN_CAP, rawTotal)

  return {
    isValid: true,
    handType: 'thirteen-orphans',
    grouping: null,
    matchedPatterns: patterns,
    bonusFan,
    windFan,
    selfDrawFan,
    totalFan,
    payoutPerPerson: calculatePayout(totalFan),
  }
}

/**
 * Score a single standard grouping (4 sets + 1 pair).
 * Returns the total Fan for this grouping including all bonuses.
 */
function scoreGrouping(
  grouping: HandGrouping,
  options: CalculateScoreOptions
): {
  matchedPatterns: MatchedPattern[]
  patternFan: number
  windFan: number
  bonusFan: number
  selfDrawFan: number
  totalFan: number
} {
  const rawPatterns = matchPatterns(grouping)
  const matchedPatterns = rawPatterns.map(p => toMatchedPattern(p.id, p.fan))

  const patternFan = matchedPatterns.reduce((sum, p) => sum + p.fan, 0)
  const windFan = calculateWindFan(grouping, options.roundWind, options.seatWind)
  const bonusFan = options.bonusTileCount
  const selfDrawFan = options.selfDraw ? 1 : 0

  const rawTotal = patternFan + windFan + bonusFan + selfDrawFan
  const totalFan = Math.min(FAN_CAP, rawTotal)

  return { matchedPatterns, patternFan, windFan, bonusFan, selfDrawFan, totalFan }
}

/**
 * Calculate the complete score for a 14-tile hand.
 *
 * The algorithm:
 * 1. Check for special hands (Seven Pairs, Thirteen Orphans) first
 * 2. Find all valid standard groupings (4 sets + 1 pair)
 * 3. Score each grouping with pattern matchers and bonuses
 * 4. Select the grouping that yields the highest total Fan
 * 5. Cap total Fan at 8
 * 6. Return the complete ScoreResult
 *
 * If no valid grouping exists, returns isValid: false.
 */
export function calculateScore(
  tiles: TileCode[],
  options: CalculateScoreOptions
): ScoreResult {
  // Check special hands first
  if (isSevenPairs(tiles)) {
    return scoreSevenPairs(tiles, options)
  }

  if (isThirteenOrphans(tiles)) {
    return scoreThirteenOrphans(options)
  }

  // Find all valid standard groupings
  const groupings = findAllGroupings(tiles)

  if (groupings.length === 0) {
    // No valid grouping — invalid hand
    return {
      isValid: false,
      handType: 'invalid',
      grouping: null,
      matchedPatterns: [],
      bonusFan: 0,
      windFan: 0,
      selfDrawFan: 0,
      totalFan: 0,
      payoutPerPerson: 0,
    }
  }

  // Score each grouping and pick the one with the highest total Fan
  let bestResult: ScoreResult | null = null
  let bestTotalFan = -1

  for (const grouping of groupings) {
    const scored = scoreGrouping(grouping, options)

    if (scored.totalFan > bestTotalFan) {
      bestTotalFan = scored.totalFan
      bestResult = {
        isValid: true,
        handType: 'standard',
        grouping,
        matchedPatterns: scored.matchedPatterns,
        bonusFan: scored.bonusFan,
        windFan: scored.windFan,
        selfDrawFan: scored.selfDrawFan,
        totalFan: scored.totalFan,
        payoutPerPerson: calculatePayout(scored.totalFan),
      }
    }
  }

  return bestResult!
}
