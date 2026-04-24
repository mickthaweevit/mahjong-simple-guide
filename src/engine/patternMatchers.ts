import type { TileCode } from '../data/tiles'
import type { HandGrouping } from './types'

/** Dragon tile codes */
const DRAGON_TILES: TileCode[] = ['d1', 'd2', 'd3']

/** Wind tile codes */
const WIND_TILES: TileCode[] = ['f1', 'f2', 'f3', 'f4']

/** Terminal tile codes (1s and 9s of each suit) */
const TERMINAL_TILES: Set<TileCode> = new Set(['w1', 'w9', 't1', 't9', 's1', 's9'])

/**
 * All Green tiles: s2, s3, s4, s6, s8, d2
 * These are the only tiles that appear entirely green on the physical tiles.
 */
const ALL_GREEN_TILES: Set<TileCode> = new Set(['s2', 's3', 's4', 's6', 's8', 'd2'])

/**
 * Get the suit character from a tile code.
 * 'w' = Characters, 't' = Dots, 's' = Bamboo, 'f' = Winds, 'd' = Dragons
 */
function getSuit(tile: TileCode): string {
  return tile[0]
}

/**
 * Check if a tile is an honor tile (wind or dragon).
 */
function isHonor(tile: TileCode): boolean {
  const suit = getSuit(tile)
  return suit === 'f' || suit === 'd'
}

/**
 * Collect all tiles from a grouping (sets + pair) into a flat array.
 */
function allTilesFromGrouping(grouping: HandGrouping): TileCode[] {
  const tiles: TileCode[] = []
  for (const set of grouping.sets) {
    tiles.push(...set.tiles)
  }
  tiles.push(...grouping.pair.tiles)
  return tiles
}

/**
 * Common Hand (Ping Hu) — 平糊 — 1 Fan
 * Scoring ID: 'common-hand'
 *
 * All 4 sets are chows (no pungs), and the pair is not a dragon.
 * The hand must contain tiles from at least 2 different suits or include honors.
 * Essentially: the simplest valid winning hand with no special patterns.
 */
export function isCommonHand(grouping: HandGrouping): boolean {
  // All 4 sets must be chows
  for (const set of grouping.sets) {
    if (set.type !== 'chow') return false
  }
  // Pair must not be a dragon tile
  if (getSuit(grouping.pair.tiles[0]) === 'd') return false
  return true
}

/**
 * All Pungs (對對糊) — 3 Fan
 * Scoring ID: 'all-pungs'
 *
 * All 4 sets are pungs (or kongs). No chows.
 */
export function isAllPungs(grouping: HandGrouping): boolean {
  for (const set of grouping.sets) {
    if (set.type !== 'pung' && set.type !== 'kong') return false
  }
  return true
}

/**
 * Mixed One Suit (混一色) — 3 Fan
 * Scoring ID: 'mixed-one-suit'
 *
 * All tiles are from one numbered suit plus honor tiles.
 * Must have at least one honor tile (otherwise it's Full One Suit).
 * Must have at least one numbered suit tile (otherwise it's not a suit hand).
 */
export function isMixedOneSuit(tiles: TileCode[]): boolean {
  const suits = new Set<string>()
  let hasHonor = false
  let hasNumbered = false

  for (const tile of tiles) {
    const suit = getSuit(tile)
    if (isHonor(tile)) {
      hasHonor = true
    } else {
      hasNumbered = true
      suits.add(suit)
    }
  }

  // Must have exactly one numbered suit and at least one honor
  return hasNumbered && hasHonor && suits.size === 1
}

/**
 * Full One Suit (清一色) — 7 Fan
 * Scoring ID: 'full-one-suit'
 *
 * All 14 tiles are from the same numbered suit. No honors.
 */
export function isFullOneSuit(tiles: TileCode[]): boolean {
  if (tiles.length === 0) return false

  const firstSuit = getSuit(tiles[0])
  // Must be a numbered suit
  if (firstSuit === 'f' || firstSuit === 'd') return false

  for (const tile of tiles) {
    if (getSuit(tile) !== firstSuit) return false
  }
  return true
}

/**
 * Count the number of Dragon Pungs in a grouping.
 * Each dragon pung (d1, d2, or d3) adds +1 Fan.
 * Scoring ID: 'dragon-pung' (stackable)
 */
export function countDragonPungs(grouping: HandGrouping): number {
  let count = 0
  for (const set of grouping.sets) {
    if ((set.type === 'pung' || set.type === 'kong') && DRAGON_TILES.includes(set.tiles[0])) {
      count++
    }
  }
  return count
}

/**
 * Small Three Dragons (小三元) — 5 Fan
 * Scoring ID: 'small-three-dragons'
 *
 * Two dragon pungs and a pair of the third dragon.
 */
export function isSmallThreeDragons(grouping: HandGrouping): boolean {
  const dragonPungCount = countDragonPungs(grouping)
  const pairIsDragon = DRAGON_TILES.includes(grouping.pair.tiles[0])
  return dragonPungCount === 2 && pairIsDragon
}

/**
 * Great Three Dragons (大三元) — 8 Fan (Limit)
 * Scoring ID: 'great-three-dragons'
 *
 * Three dragon pungs (one for each dragon: Red, Green, White).
 */
export function isGreatThreeDragons(grouping: HandGrouping): boolean {
  return countDragonPungs(grouping) === 3
}

/**
 * Great Four Winds (大四喜) — 8 Fan (Limit)
 * Scoring ID: 'great-four-winds'
 *
 * Four wind pungs (one for each wind: East, South, West, North).
 */
export function isGreatFourWinds(grouping: HandGrouping): boolean {
  let windPungCount = 0
  for (const set of grouping.sets) {
    if ((set.type === 'pung' || set.type === 'kong') && WIND_TILES.includes(set.tiles[0])) {
      windPungCount++
    }
  }
  return windPungCount === 4
}

/**
 * All Green (緑一色) — 8 Fan (Limit)
 * Scoring ID: 'all-green'
 *
 * Every tile in the hand is one of: s2, s3, s4, s6, s8, d2.
 * These are the tiles that are entirely green on the physical Mahjong tiles.
 */
export function isAllGreen(tiles: TileCode[]): boolean {
  if (tiles.length === 0) return false
  for (const tile of tiles) {
    if (!ALL_GREEN_TILES.has(tile)) return false
  }
  return true
}

/**
 * Small Four Winds (小四喜) — 6 Fan
 * Scoring ID: 'small-four-winds'
 *
 * Three wind pungs and a pair of the fourth wind.
 */
export function isSmallFourWinds(grouping: HandGrouping): boolean {
  let windPungCount = 0
  for (const set of grouping.sets) {
    if ((set.type === 'pung' || set.type === 'kong') && WIND_TILES.includes(set.tiles[0])) {
      windPungCount++
    }
  }
  const pairIsWind = WIND_TILES.includes(grouping.pair.tiles[0])
  return windPungCount === 3 && pairIsWind
}

/**
 * All Honors (字一色) — 8 Fan (Limit)
 * Scoring ID: 'all-honors'
 *
 * Every tile in the hand is an honor tile (wind or dragon). No suited tiles.
 */
export function isAllHonors(tiles: TileCode[]): boolean {
  if (tiles.length === 0) return false
  for (const tile of tiles) {
    if (!isHonor(tile)) return false
  }
  return true
}

/**
 * Check if a tile is a terminal (1 or 9 of any suit).
 */
function isTerminal(tile: TileCode): boolean {
  return TERMINAL_TILES.has(tile)
}

/**
 * Mixed Terminals (混么九) — 5 Fan
 * Scoring ID: 'mixed-terminals'
 *
 * All tiles are terminals (1s and 9s) or honor tiles.
 * Must have at least one terminal and at least one honor.
 */
export function isMixedTerminals(tiles: TileCode[]): boolean {
  if (tiles.length === 0) return false
  let hasTerminal = false
  let hasHonorTile = false
  for (const tile of tiles) {
    if (isTerminal(tile)) {
      hasTerminal = true
    } else if (isHonor(tile)) {
      hasHonorTile = true
    } else {
      return false // non-terminal suited tile
    }
  }
  return hasTerminal && hasHonorTile
}

/**
 * All Terminals (清么九) — 8 Fan (Limit)
 * Scoring ID: 'all-terminals'
 *
 * All tiles are terminals (1s and 9s only). No honors.
 */
export function isAllTerminals(tiles: TileCode[]): boolean {
  if (tiles.length === 0) return false
  for (const tile of tiles) {
    if (!isTerminal(tile)) return false
  }
  return true
}

/**
 * Nine Gates (九蓮寶燈) — 8 Fan (Limit)
 * Scoring ID: 'nine-gates'
 *
 * A hand of a single suit containing 1112345678999 plus any one extra tile
 * of the same suit. The base pattern requires at least 3×1, 1×2, 1×3, 1×4,
 * 1×5, 1×6, 1×7, 1×8, 3×9 of one suit, with one additional tile from that suit.
 */
export function isNineGates(tiles: TileCode[]): boolean {
  if (tiles.length !== 14) return false

  // All tiles must be from the same numbered suit
  const firstSuit = tiles[0][0]
  if (firstSuit !== 'w' && firstSuit !== 't' && firstSuit !== 's') return false
  for (const tile of tiles) {
    if (tile[0] !== firstSuit) return false
  }

  // Count occurrences of each number
  const counts = new Array(10).fill(0) // index 1-9
  for (const tile of tiles) {
    const num = parseInt(tile[1], 10)
    counts[num]++
  }

  // Base pattern: 1112345678999 (3+1+1+1+1+1+1+1+3 = 13) + 1 extra = 14
  const basePattern = [0, 3, 1, 1, 1, 1, 1, 1, 1, 3]
  for (let i = 1; i <= 9; i++) {
    if (counts[i] < basePattern[i]) return false
  }

  return true
}

/**
 * Run all pattern matchers against a standard grouping and return matched pattern metadata.
 * This is a convenience function used by the Fan calculator.
 *
 * Note: Seven Pairs and Thirteen Orphans are handled separately by the caller
 * since they don't use the standard grouping structure.
 */
export function matchPatterns(grouping: HandGrouping): { id: string; fan: number }[] {
  const tiles = allTilesFromGrouping(grouping)
  const matched: { id: string; fan: number }[] = []

  // Limit hands (8 Fan) — check first, these override other patterns
  if (isGreatThreeDragons(grouping)) {
    matched.push({ id: 'great-three-dragons', fan: 8 })
    return matched // Limit hand, no stacking
  }

  if (isGreatFourWinds(grouping)) {
    matched.push({ id: 'great-four-winds', fan: 8 })
    return matched // Limit hand, no stacking
  }

  if (isAllGreen(tiles)) {
    matched.push({ id: 'all-green', fan: 8 })
    return matched // Limit hand, no stacking
  }

  if (isAllHonors(tiles)) {
    matched.push({ id: 'all-honors', fan: 8 })
    return matched // Limit hand, no stacking
  }

  if (isAllTerminals(tiles)) {
    matched.push({ id: 'all-terminals', fan: 8 })
    return matched // Limit hand, no stacking
  }

  if (isNineGates(tiles)) {
    matched.push({ id: 'nine-gates', fan: 8 })
    return matched // Limit hand, no stacking
  }

  // Full One Suit (7 Fan)
  if (isFullOneSuit(tiles)) {
    matched.push({ id: 'full-one-suit', fan: 7 })
  }

  // Small Four Winds (6 Fan)
  if (isSmallFourWinds(grouping)) {
    matched.push({ id: 'small-four-winds', fan: 6 })
  }

  // Small Three Dragons (5 Fan)
  if (isSmallThreeDragons(grouping)) {
    matched.push({ id: 'small-three-dragons', fan: 5 })
  }

  // Mixed Terminals (5 Fan)
  if (isMixedTerminals(tiles)) {
    matched.push({ id: 'mixed-terminals', fan: 5 })
  }

  // All Pungs (3 Fan)
  if (isAllPungs(grouping)) {
    matched.push({ id: 'all-pungs', fan: 3 })
  }

  // Mixed One Suit (3 Fan) — only if not Full One Suit or Mixed Terminals
  if (!isFullOneSuit(tiles) && !isMixedTerminals(tiles) && isMixedOneSuit(tiles)) {
    matched.push({ id: 'mixed-one-suit', fan: 3 })
  }

  // Dragon Pungs (+1 Fan each, stackable)
  // Don't count dragon pungs separately if Small Three Dragons matched
  // (Small Three Dragons already accounts for the dragon pungs)
  if (!isSmallThreeDragons(grouping)) {
    const dragonPungs = countDragonPungs(grouping)
    for (let i = 0; i < dragonPungs; i++) {
      matched.push({ id: 'dragon-pung', fan: 1 })
    }
  }

  // Common Hand (1 Fan) — only if no other patterns matched
  if (matched.length === 0 && isCommonHand(grouping)) {
    matched.push({ id: 'common-hand', fan: 1 })
  }

  return matched
}
