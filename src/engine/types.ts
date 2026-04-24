import type { TileCode } from '../data/tiles'

export type { TileCode }

/** Wind tile codes: East, South, West, North */
export type WindTile = 'f1' | 'f2' | 'f3' | 'f4'

/** A group of tiles in a winning hand */
export interface TileGroup {
  type: 'chow' | 'pung' | 'kong' | 'pair'
  tiles: TileCode[]
}

/** A valid partition of 14 tiles into sets + pair */
export interface HandGrouping {
  sets: TileGroup[] // 4 sets (chow/pung/kong)
  pair: TileGroup // 1 pair
}

/** A matched scoring pattern */
export interface MatchedPattern {
  id: string // matches ScoringEntry.id
  englishName: string
  chineseName: string
  fan: number
}

/** Complete scoring result for a hand */
export interface ScoreResult {
  isValid: boolean
  handType: 'standard' | 'seven-pairs' | 'thirteen-orphans' | 'invalid'
  grouping: HandGrouping | null
  matchedPatterns: MatchedPattern[]
  bonusFan: number // flowers + seasons
  windFan: number // round wind + seat wind
  selfDrawFan: number // 0 or 1
  totalFan: number // capped at 8
  payoutPerPerson: number // 2^totalFan
}

/** Frequency map: tile code → count of that tile in the hand */
export type TileFrequencyMap = Map<TileCode, number>

/** Convert a flat tile array to a frequency map */
export function toFrequencyMap(tiles: TileCode[]): TileFrequencyMap {
  const map = new Map<TileCode, number>()
  for (const tile of tiles) {
    map.set(tile, (map.get(tile) ?? 0) + 1)
  }
  return map
}
