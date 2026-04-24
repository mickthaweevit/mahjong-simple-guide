import type { TileCode } from '../data/tiles'
import type { TileFrequencyMap, TileGroup, HandGrouping } from './types'
import { toFrequencyMap } from './types'

export { toFrequencyMap }

/**
 * All 34 unique tile codes in a fixed order used for deterministic iteration.
 * Suits: Characters (w1-w9), Dots (t1-t9), Bamboo (s1-s9), Winds (f1-f4), Dragons (d1-d3)
 */
const ALL_TILES: TileCode[] = [
  'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
  't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
  'f1', 'f2', 'f3', 'f4',
  'd1', 'd2', 'd3',
]

/** The 13 terminal and honor tiles required for Thirteen Orphans */
const THIRTEEN_ORPHAN_TILES: TileCode[] = [
  'w1', 'w9', 't1', 't9', 's1', 's9',
  'f1', 'f2', 'f3', 'f4',
  'd1', 'd2', 'd3',
]

/**
 * Check if a tile code can form chows (sequential sets).
 * Only numbered suit tiles (Characters, Dots, Bamboo) can form chows.
 */
function isNumberedSuit(tile: TileCode): boolean {
  const suit = tile[0]
  return suit === 'w' || suit === 't' || suit === 's'
}

/**
 * Get the next sequential tile in the same suit, or null if at the end.
 * e.g. w1 → w2, w8 → w9, w9 → null, f1 → null
 */
function nextTile(tile: TileCode): TileCode | null {
  if (!isNumberedSuit(tile)) return null
  const suit = tile[0]
  const num = parseInt(tile[1], 10)
  if (num >= 9) return null
  return `${suit}${num + 1}` as TileCode
}

/**
 * Check if 14 tiles form Seven Pairs: exactly 7 distinct pairs.
 */
export function isSevenPairs(tiles: TileCode[]): boolean {
  if (tiles.length !== 14) return false
  const freq = toFrequencyMap(tiles)
  if (freq.size !== 7) return false
  for (const count of freq.values()) {
    if (count !== 2) return false
  }
  return true
}

/**
 * Check if 14 tiles form Thirteen Orphans:
 * one each of the 13 terminals/honors plus one duplicate.
 */
export function isThirteenOrphans(tiles: TileCode[]): boolean {
  if (tiles.length !== 14) return false
  const freq = toFrequencyMap(tiles)
  // Must have exactly the 13 orphan tiles
  if (freq.size !== 13) return false
  let hasDouble = false
  for (const tile of THIRTEEN_ORPHAN_TILES) {
    const count = freq.get(tile)
    if (count === undefined || count < 1) return false
    if (count === 2) {
      if (hasDouble) return false // only one tile can be doubled
      hasDouble = true
    } else if (count !== 1) {
      return false
    }
  }
  // Ensure no tiles outside the orphan set
  for (const tile of freq.keys()) {
    if (!THIRTEEN_ORPHAN_TILES.includes(tile)) return false
  }
  return hasDouble
}

/**
 * Find all valid standard groupings of 14 tiles into 4 sets + 1 pair.
 *
 * Algorithm: iterate through tiles in a fixed order. For each tile with
 * remaining count, try extracting a pung (3 identical) or chow (3 sequential),
 * then recurse. When exactly one tile type remains with count 2, that's the pair.
 *
 * This exhaustive approach is tractable because:
 * - Only 34 unique tile types, max 4 copies each
 * - Hand is exactly 14 tiles
 * - Branching factor is small (at most 2 choices per tile: pung or chow)
 */
export function findAllGroupings(tiles: TileCode[]): HandGrouping[] {
  if (tiles.length !== 14) return []

  const freq = toFrequencyMap(tiles)
  const results: HandGrouping[] = []

  // Try each possible pair first, then find 4 sets from the remaining 12 tiles
  for (const tile of ALL_TILES) {
    const count = freq.get(tile) ?? 0
    if (count < 2) continue

    // Remove pair
    const remaining = new Map(freq)
    remaining.set(tile, count - 2)
    if (remaining.get(tile) === 0) remaining.delete(tile)

    const pair: TileGroup = { type: 'pair', tiles: [tile, tile] }
    const sets: TileGroup[] = []

    extractSets(remaining, sets, pair, results)
  }

  return deduplicateGroupings(results)
}

/**
 * Recursively extract sets (pungs and chows) from the frequency map.
 * When the map is empty, we've found a valid grouping.
 */
function extractSets(
  freq: TileFrequencyMap,
  sets: TileGroup[],
  pair: TileGroup,
  results: HandGrouping[]
): void {
  // If we have 4 sets and no tiles remain, we found a valid grouping
  if (sets.length === 4) {
    // Verify no tiles remain
    let remaining = 0
    for (const count of freq.values()) remaining += count
    if (remaining === 0) {
      results.push({ sets: [...sets], pair })
    }
    return
  }

  // Find the first tile in our fixed order that still has remaining count
  const firstTile = findFirstTile(freq)
  if (firstTile === null) return

  const count = freq.get(firstTile)!

  // Try pung (3 identical tiles)
  if (count >= 3) {
    const next = new Map(freq)
    next.set(firstTile, count - 3)
    if (next.get(firstTile) === 0) next.delete(firstTile)

    sets.push({ type: 'pung', tiles: [firstTile, firstTile, firstTile] })
    extractSets(next, sets, pair, results)
    sets.pop()
  }

  // Try chow (3 sequential tiles in the same suit)
  if (isNumberedSuit(firstTile)) {
    const second = nextTile(firstTile)
    const third = second ? nextTile(second) : null

    if (second && third) {
      const countSecond = freq.get(second) ?? 0
      const countThird = freq.get(third) ?? 0

      if (countSecond >= 1 && countThird >= 1) {
        const next = new Map(freq)
        next.set(firstTile, count - 1)
        if (next.get(firstTile) === 0) next.delete(firstTile)
        next.set(second, countSecond - 1)
        if (next.get(second) === 0) next.delete(second)
        next.set(third, countThird - 1)
        if (next.get(third) === 0) next.delete(third)

        sets.push({ type: 'chow', tiles: [firstTile, second, third] })
        extractSets(next, sets, pair, results)
        sets.pop()
      }
    }
  }
}

/**
 * Find the first tile (in ALL_TILES order) that has a non-zero count.
 */
function findFirstTile(freq: TileFrequencyMap): TileCode | null {
  for (const tile of ALL_TILES) {
    if ((freq.get(tile) ?? 0) > 0) return tile
  }
  return null
}

/**
 * Deduplicate groupings that have the same sets (possibly in different order).
 * Two groupings are considered identical if they have the same pair and
 * the same multiset of sets.
 */
function deduplicateGroupings(groupings: HandGrouping[]): HandGrouping[] {
  const seen = new Set<string>()
  const unique: HandGrouping[] = []

  for (const g of groupings) {
    const key = groupingKey(g)
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(g)
    }
  }

  return unique
}

/**
 * Create a canonical string key for a grouping for deduplication.
 * Sets are sorted to ensure order-independence.
 */
function groupingKey(g: HandGrouping): string {
  const setKeys = g.sets
    .map(s => `${s.type}:${s.tiles.join(',')}`)
    .sort()
  return `pair:${g.pair.tiles.join(',')}|${setKeys.join('|')}`
}
