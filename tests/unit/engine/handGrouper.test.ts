import { describe, it, expect } from 'vitest'
import {
  findAllGroupings,
  isSevenPairs,
  isThirteenOrphans,
  toFrequencyMap,
} from '../../../src/engine/handGrouper'
import type { TileCode } from '../../../src/data/tiles'

/**
 * Validates: Requirements 5.6, 5.7
 *
 * 5.6 — The Fan_Calculator SHALL identify the optimal grouping of tiles into sets and pair
 * 5.7 — Invalid hands are detected when 14 tiles cannot form a valid winning structure
 */

describe('handGrouper', () => {
  describe('findAllGroupings', () => {
    it('returns empty array for non-14-tile input', () => {
      const tiles: TileCode[] = ['w1', 'w2', 'w3']
      expect(findAllGroupings(tiles)).toEqual([])
    })

    it('finds exactly one grouping for an all-pungs hand', () => {
      // 4 pungs + 1 pair: w2×3, t5×3, s7×3, f1×3, d1×2
      const tiles: TileCode[] = [
        'w2', 'w2', 'w2',
        't5', 't5', 't5',
        's7', 's7', 's7',
        'f1', 'f1', 'f1',
        'd1', 'd1',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings).toHaveLength(1)

      const g = groupings[0]
      expect(g.pair.tiles).toEqual(['d1', 'd1'])
      expect(g.sets).toHaveLength(4)

      const setTypes = g.sets.map(s => s.type)
      expect(setTypes.every(t => t === 'pung')).toBe(true)
    })

    it('finds exactly one grouping for a simple chow hand', () => {
      // 4 chows + 1 pair: w1w2w3, t4t5t6, t7t8t9, s2s3s4, s8×2
      const tiles: TileCode[] = [
        'w1', 'w2', 'w3',
        't4', 't5', 't6',
        't7', 't8', 't9',
        's2', 's3', 's4',
        's8', 's8',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings).toHaveLength(1)

      const g = groupings[0]
      expect(g.pair.tiles).toEqual(['s8', 's8'])
      expect(g.sets).toHaveLength(4)

      const setTypes = g.sets.map(s => s.type)
      expect(setTypes.every(t => t === 'chow')).toBe(true)
    })

    it('finds multiple groupings when tiles can be grouped as pungs or chows', () => {
      // w1×3, w2×3, w3×3 can be 3 pungs OR 3 chows (w1w2w3 × 3)
      // Plus another set and pair to make 14 tiles: f1×3, d1×2
      const tiles: TileCode[] = [
        'w1', 'w1', 'w1',
        'w2', 'w2', 'w2',
        'w3', 'w3', 'w3',
        'f1', 'f1', 'f1',
        'd1', 'd1',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings.length).toBeGreaterThan(1)

      // Should have at least one grouping with 3 pungs (w1, w2, w3) + 1 pung (f1)
      const allPungsGrouping = groupings.find(g =>
        g.sets.every(s => s.type === 'pung')
      )
      expect(allPungsGrouping).toBeDefined()

      // Should have at least one grouping with chows (w1w2w3)
      const hasChowGrouping = groupings.find(g =>
        g.sets.some(s => s.type === 'chow')
      )
      expect(hasChowGrouping).toBeDefined()
    })

    it('returns no groupings for 14 tiles that form no valid hand', () => {
      // 14 tiles that cannot be partitioned into 4 sets + 1 pair
      // Mix of unrelated tiles with no sequential or triple relationships
      const tiles: TileCode[] = [
        'w1', 'w3', 'w5', 'w7',
        't2', 't4', 't6', 't8',
        's1', 's3', 's5', 's7',
        'f1', 'f2',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings).toHaveLength(0)
    })

    it('handles a mixed chow and pung hand', () => {
      // w2w3w4 (chow), t6t7t8 (chow), s1s2s3 (chow), d1×3 (pung), w9×2 (pair)
      const tiles: TileCode[] = [
        'w2', 'w3', 'w4',
        't6', 't7', 't8',
        's1', 's2', 's3',
        'd1', 'd1', 'd1',
        'w9', 'w9',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings).toHaveLength(1)

      const g = groupings[0]
      expect(g.pair.tiles).toEqual(['w9', 'w9'])
      expect(g.sets).toHaveLength(4)

      const chows = g.sets.filter(s => s.type === 'chow')
      const pungs = g.sets.filter(s => s.type === 'pung')
      expect(chows).toHaveLength(3)
      expect(pungs).toHaveLength(1)
    })

    it('handles Great Four Winds hand (all honor pungs)', () => {
      // f1×3, f2×3, f3×3, f4×3, t5×2
      const tiles: TileCode[] = [
        'f1', 'f1', 'f1',
        'f2', 'f2', 'f2',
        'f3', 'f3', 'f3',
        'f4', 'f4', 'f4',
        't5', 't5',
      ]
      const groupings = findAllGroupings(tiles)
      expect(groupings).toHaveLength(1)

      const g = groupings[0]
      expect(g.pair.tiles).toEqual(['t5', 't5'])
      expect(g.sets.every(s => s.type === 'pung')).toBe(true)
    })
  })

  describe('isSevenPairs', () => {
    it('returns true for a valid seven pairs hand', () => {
      const tiles: TileCode[] = [
        'w1', 'w1',
        'w5', 'w5',
        't3', 't3',
        't9', 't9',
        's4', 's4',
        'f1', 'f1',
        'd2', 'd2',
      ]
      expect(isSevenPairs(tiles)).toBe(true)
    })

    it('returns false when tile count is not 14', () => {
      const tiles: TileCode[] = ['w1', 'w1', 't3', 't3']
      expect(isSevenPairs(tiles)).toBe(false)
    })

    it('returns false when not all groups are pairs (has a quad)', () => {
      // 4 copies of w1 means it's not 7 distinct pairs
      const tiles: TileCode[] = [
        'w1', 'w1', 'w1', 'w1',
        't3', 't3',
        't9', 't9',
        's4', 's4',
        'f1', 'f1',
        'd2', 'd2',
      ]
      expect(isSevenPairs(tiles)).toBe(false)
    })

    it('returns false when there are not exactly 7 distinct tiles', () => {
      // 6 distinct tiles — one tile has 4 copies
      const tiles: TileCode[] = [
        'w1', 'w1', 'w1', 'w1',
        't3', 't3',
        't9', 't9',
        's4', 's4',
        'f1', 'f1',
        'd2', 'd2',
      ]
      // freq.size = 6, not 7
      expect(isSevenPairs(tiles)).toBe(false)
    })

    it('returns false for a standard 4-sets-plus-pair hand', () => {
      // All pungs hand — not seven pairs
      const tiles: TileCode[] = [
        'w2', 'w2', 'w2',
        't5', 't5', 't5',
        's7', 's7', 's7',
        'f1', 'f1', 'f1',
        'd1', 'd1',
      ]
      expect(isSevenPairs(tiles)).toBe(false)
    })
  })

  describe('isThirteenOrphans', () => {
    it('returns true for a valid thirteen orphans hand', () => {
      // One each of the 13 terminals/honors + w1 doubled
      const tiles: TileCode[] = [
        'w1', 'w9', 't1', 't9', 's1', 's9',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
        'w1', // duplicate
      ]
      expect(isThirteenOrphans(tiles)).toBe(true)
    })

    it('returns true when the duplicate is a different terminal', () => {
      // Duplicate d3 instead of w1
      const tiles: TileCode[] = [
        'w1', 'w9', 't1', 't9', 's1', 's9',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
        'd3', // duplicate
      ]
      expect(isThirteenOrphans(tiles)).toBe(true)
    })

    it('returns false when tile count is not 14', () => {
      const tiles: TileCode[] = [
        'w1', 'w9', 't1', 't9', 's1', 's9',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
      ]
      expect(isThirteenOrphans(tiles)).toBe(false)
    })

    it('returns false when a terminal is missing', () => {
      // Missing s9, replaced with extra w1
      const tiles: TileCode[] = [
        'w1', 'w1', 'w9', 't1', 't9', 's1',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
        'w1', // 3 copies of w1, missing s9
      ]
      expect(isThirteenOrphans(tiles)).toBe(false)
    })

    it('returns false when a non-terminal tile is included', () => {
      // w5 is not a terminal/honor — replace s9 with w5
      const tiles: TileCode[] = [
        'w1', 'w9', 't1', 't9', 's1', 'w5',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
        'w1',
      ]
      expect(isThirteenOrphans(tiles)).toBe(false)
    })

    it('returns false for a standard hand', () => {
      const tiles: TileCode[] = [
        'w1', 'w2', 'w3',
        't4', 't5', 't6',
        't7', 't8', 't9',
        's2', 's3', 's4',
        's8', 's8',
      ]
      expect(isThirteenOrphans(tiles)).toBe(false)
    })
  })

  describe('toFrequencyMap', () => {
    it('counts tile occurrences correctly', () => {
      const tiles: TileCode[] = ['w1', 'w1', 'w2', 't3', 't3', 't3']
      const freq = toFrequencyMap(tiles)
      expect(freq.get('w1')).toBe(2)
      expect(freq.get('w2')).toBe(1)
      expect(freq.get('t3')).toBe(3)
      expect(freq.size).toBe(3)
    })

    it('returns empty map for empty input', () => {
      const freq = toFrequencyMap([])
      expect(freq.size).toBe(0)
    })
  })
})
