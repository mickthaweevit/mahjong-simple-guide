import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { TileCode } from '../../../src/data/tiles'
import type { HandGrouping, TileGroup } from '../../../src/engine/types'
import { calculateScore, calculateWindFan, calculatePayout, type CalculateScoreOptions } from '../../../src/engine/fanCalculator'
import { findAllGroupings, isSevenPairs, isThirteenOrphans } from '../../../src/engine/handGrouper'
import { matchPatterns } from '../../../src/engine/patternMatchers'

/**
 * Feature: hand-simulation, Property 8: Optimal grouping maximizes Fan
 *
 * Validates: Requirements 5.6, 5.3, 5.4
 *
 * For any 14 tiles that form a valid winning hand, the Fan score returned
 * by calculateScore should be ≥ the Fan score of every other valid grouping
 * of those same tiles.
 */

// ── Tile constants ───────────────────────────────────────────────────────────

const NUMBERED_SUITS = ['w', 't', 's'] as const
const ALL_TILE_CODES: TileCode[] = [
  'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
  't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
  'f1', 'f2', 'f3', 'f4',
  'd1', 'd2', 'd3',
]

// ── Custom generators ────────────────────────────────────────────────────────

/** Arbitrary TileCode from the 34 possible values */
const arbTileCode: fc.Arbitrary<TileCode> = fc.constantFrom(...ALL_TILE_CODES)

/** Generate a pung (3 identical tiles) */
const arbPung: fc.Arbitrary<TileGroup> = arbTileCode.map(tile => ({
  type: 'pung' as const,
  tiles: [tile, tile, tile],
}))

/** Generate a chow (3 consecutive tiles in the same numbered suit) */
const arbChow: fc.Arbitrary<TileGroup> = fc.tuple(
  fc.constantFrom(...NUMBERED_SUITS),
  fc.integer({ min: 1, max: 7 }), // start value 1-7 so we can form start, start+1, start+2
).map(([suit, start]) => ({
  type: 'chow' as const,
  tiles: [
    `${suit}${start}` as TileCode,
    `${suit}${start + 1}` as TileCode,
    `${suit}${start + 2}` as TileCode,
  ],
}))

/** Generate a set (either chow or pung) */
const arbSet: fc.Arbitrary<TileGroup> = fc.oneof(arbChow, arbPung)

/** Generate a pair */
const arbPair: fc.Arbitrary<TileGroup> = arbTileCode.map(tile => ({
  type: 'pair' as const,
  tiles: [tile, tile],
}))

/**
 * Count tile occurrences in a flat array and check the 4-copy constraint.
 * Returns true if no tile appears more than 4 times.
 */
function respectsFourCopyLimit(tiles: TileCode[]): boolean {
  const counts = new Map<TileCode, number>()
  for (const tile of tiles) {
    const c = (counts.get(tile) ?? 0) + 1
    if (c > 4) return false
    counts.set(tile, c)
  }
  return true
}

/**
 * Generate a valid 14-tile hand by constructing 4 sets + 1 pair,
 * then filtering to respect the 4-copy-per-tile constraint.
 *
 * This constructs hands that go through the standard grouping path
 * (not Seven Pairs or Thirteen Orphans).
 */
const arbValidHand: fc.Arbitrary<TileCode[]> = fc
  .tuple(arbSet, arbSet, arbSet, arbSet, arbPair)
  .filter(([s1, s2, s3, s4, p]) => {
    const tiles: TileCode[] = [
      ...s1.tiles,
      ...s2.tiles,
      ...s3.tiles,
      ...s4.tiles,
      ...p.tiles,
    ]
    return respectsFourCopyLimit(tiles)
  })
  .map(([s1, s2, s3, s4, p]) => [
    ...s1.tiles,
    ...s2.tiles,
    ...s3.tiles,
    ...s4.tiles,
    ...p.tiles,
  ])

// ── Fixed options for isolating grouping optimization ────────────────────────

const FIXED_OPTIONS: CalculateScoreOptions = {
  roundWind: 'f1',
  seatWind: 'f1',
  selfDraw: false,
  bonusTileCount: 0,
}

// ── Property test ────────────────────────────────────────────────────────────

describe('Feature: hand-simulation, Property 8: Optimal grouping maximizes Fan', () => {
  it('returned Fan ≥ Fan of every other valid grouping', () => {
    fc.assert(
      fc.property(arbValidHand, (tiles) => {
        // Get the result from calculateScore (the function under test)
        const result = calculateScore(tiles, FIXED_OPTIONS)

        // The hand must be valid since we constructed it from valid sets + pair
        expect(result.isValid).toBe(true)

        // Get ALL valid groupings for these tiles
        const allGroupings = findAllGroupings(tiles)
        expect(allGroupings.length).toBeGreaterThan(0)

        // For each alternative grouping, compute its Fan and verify
        // the returned totalFan is >= that alternative's Fan
        for (const grouping of allGroupings) {
          const patterns = matchPatterns(grouping)
          const patternFan = patterns.reduce((sum, p) => sum + p.fan, 0)
          const windFan = calculateWindFan(grouping, FIXED_OPTIONS.roundWind, FIXED_OPTIONS.seatWind)
          const bonusFan = FIXED_OPTIONS.bonusTileCount
          const selfDrawFan = FIXED_OPTIONS.selfDraw ? 1 : 0

          const alternativeTotalFan = Math.min(8, patternFan + windFan + bonusFan + selfDrawFan)

          expect(result.totalFan).toBeGreaterThanOrEqual(alternativeTotalFan)
        }
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 9: Invalid hand detection ───────────────────────────────────────

/**
 * Feature: hand-simulation, Property 9: Invalid hand detection
 *
 * Validates: Requirements 5.7
 *
 * For any 14 tiles that cannot be partitioned into a valid winning structure
 * (4 sets + 1 pair, Seven Pairs, or Thirteen Orphans), the score result
 * should have isValid === false and handType === 'invalid'.
 */

/**
 * Generate a 14-tile hand respecting the 4-copy-per-tile limit,
 * then filter to keep only hands that are genuinely invalid:
 * - findAllGroupings returns empty (no 4 sets + 1 pair)
 * - isSevenPairs returns false
 * - isThirteenOrphans returns false
 */
const arbInvalidHand: fc.Arbitrary<TileCode[]> = fc
  .array(arbTileCode, { minLength: 14, maxLength: 14 })
  .filter((tiles) => {
    if (!respectsFourCopyLimit(tiles)) return false
    if (findAllGroupings(tiles).length > 0) return false
    if (isSevenPairs(tiles)) return false
    if (isThirteenOrphans(tiles)) return false
    return true
  })

describe('Feature: hand-simulation, Property 9: Invalid hand detection', () => {
  it('14-tile hands that cannot form valid structures yield isValid === false and handType === "invalid"', () => {
    fc.assert(
      fc.property(arbInvalidHand, (tiles) => {
        const result = calculateScore(tiles, FIXED_OPTIONS)

        expect(result.isValid).toBe(false)
        expect(result.handType).toBe('invalid')
        expect(result.matchedPatterns).toEqual([])
        expect(result.totalFan).toBe(0)
        expect(result.payoutPerPerson).toBe(0)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 10: Total Fan computation with cap ──────────────────────────────

/**
 * Feature: hand-simulation, Property 10: Total Fan computation with cap
 *
 * Validates: Requirements 6.3, 5.5
 *
 * For any valid hand with any combination of pattern Fan, bonus Fan, wind Fan,
 * and self-draw Fan, the totalFan should equal min(8, patternFanSum + bonusFan +
 * windFan + selfDrawFan) and should never exceed 8.
 */

import type { WindTile } from '../../../src/engine/types'

/** Arbitrary wind tile from the 4 possible values */
const arbWindTile: fc.Arbitrary<WindTile> = fc.constantFrom(
  'f1' as WindTile,
  'f2' as WindTile,
  'f3' as WindTile,
  'f4' as WindTile,
)

/** Arbitrary CalculateScoreOptions with random winds, selfDraw, and bonusTileCount */
const arbOptions: fc.Arbitrary<CalculateScoreOptions> = fc.record({
  roundWind: arbWindTile,
  seatWind: arbWindTile,
  selfDraw: fc.boolean(),
  bonusTileCount: fc.integer({ min: 0, max: 8 }),
})

describe('Feature: hand-simulation, Property 10: Total Fan computation with cap', () => {
  it('totalFan === min(8, patternFanSum + bonusFan + windFan + selfDrawFan) and totalFan <= 8', () => {
    fc.assert(
      fc.property(arbValidHand, arbOptions, (tiles, options) => {
        const result = calculateScore(tiles, options)

        // The hand must be valid since we constructed it from valid sets + pair
        expect(result.isValid).toBe(true)

        // Compute the expected pattern Fan sum from matched patterns
        const patternFanSum = result.matchedPatterns.reduce((sum, p) => sum + p.fan, 0)

        // Verify individual components match the options
        expect(result.bonusFan).toBe(options.bonusTileCount)
        expect(result.selfDrawFan).toBe(options.selfDraw ? 1 : 0)

        // Verify the total Fan formula: min(8, sum of all components)
        const expectedTotal = Math.min(
          8,
          patternFanSum + result.bonusFan + result.windFan + result.selfDrawFan,
        )
        expect(result.totalFan).toBe(expectedTotal)

        // Verify the cap is always respected
        expect(result.totalFan).toBeLessThanOrEqual(8)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 11: Payout formula ──────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 11: Payout formula
 *
 * Validates: Requirements 6.4
 *
 * For any totalFan in [0, 8], the payout per person should equal 2^totalFan.
 * This verifies the exponential payout formula used in Hong Kong Mahjong.
 */

describe('Feature: hand-simulation, Property 11: Payout formula', () => {
  it('payoutPerPerson === 2^totalFan for any totalFan in [0, 8]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 8 }),
        (totalFan) => {
          const payout = calculatePayout(totalFan)
          expect(payout).toBe(Math.pow(2, totalFan))
        },
      ),
      { numRuns: 100 },
    )
  })
})


// ── Unit tests for Fan calculator ────────────────────────────────────────────

describe('calculateScore — known hands', () => {
  const defaultOptions: CalculateScoreOptions = {
    roundWind: 'f1',
    seatWind: 'f2',
    selfDraw: false,
    bonusTileCount: 0,
  }

  describe('Common Hand (1 Fan)', () => {
    it('scores a basic all-chow hand with non-dragon pair as 1 Fan', () => {
      // 4 chows from mixed suits + non-dragon pair
      const tiles: TileCode[] = [
        'w1', 'w2', 'w3', // chow
        't4', 't5', 't6', // chow
        't7', 't8', 't9', // chow
        's2', 's3', 's4', // chow
        's8', 's8',        // pair (non-dragon)
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('standard')
      expect(result.totalFan).toBe(1)
      expect(result.matchedPatterns).toHaveLength(1)
      expect(result.matchedPatterns[0].id).toBe('common-hand')
      expect(result.matchedPatterns[0].fan).toBe(1)
      expect(result.payoutPerPerson).toBe(2) // 2^1
    })
  })

  describe('All Pungs (3 Fan)', () => {
    it('scores a hand with 4 pungs as 3 Fan', () => {
      // 4 pungs from different suits + pair, no special tiles
      const tiles: TileCode[] = [
        'w2', 'w2', 'w2', // pung
        't5', 't5', 't5', // pung
        's7', 's7', 's7', // pung
        's1', 's1', 's1', // pung
        'w9', 'w9',        // pair
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('standard')
      expect(result.totalFan).toBe(3)
      expect(result.matchedPatterns.some(p => p.id === 'all-pungs')).toBe(true)
      expect(result.payoutPerPerson).toBe(8) // 2^3
    })
  })

  describe('Mixed One Suit (3 Fan)', () => {
    it('scores a hand with one numbered suit plus honors as 3 Fan', () => {
      // Characters + wind pung (not round or seat wind)
      const tiles: TileCode[] = [
        'w1', 'w2', 'w3', // chow
        'w4', 'w5', 'w6', // chow
        'w7', 'w8', 'w9', // chow
        'f3', 'f3', 'f3', // pung of West wind (not round/seat)
        'w5', 'w5',        // pair
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('standard')
      expect(result.matchedPatterns.some(p => p.id === 'mixed-one-suit')).toBe(true)
      const mixedFan = result.matchedPatterns.find(p => p.id === 'mixed-one-suit')!.fan
      expect(mixedFan).toBe(3)
    })
  })

  describe('Full One Suit (7 Fan)', () => {
    it('scores a hand with all tiles from one suit as 7 Fan', () => {
      // All bamboo
      const tiles: TileCode[] = [
        's1', 's2', 's3', // chow
        's3', 's4', 's5', // chow
        's5', 's6', 's7', // chow
        's7', 's8', 's9', // chow
        's1', 's1',        // pair
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('standard')
      expect(result.matchedPatterns.some(p => p.id === 'full-one-suit')).toBe(true)
      expect(result.totalFan).toBe(7)
      expect(result.payoutPerPerson).toBe(128) // 2^7
    })
  })
})

describe('calculateScore — limit hands', () => {
  const defaultOptions: CalculateScoreOptions = {
    roundWind: 'f1',
    seatWind: 'f2',
    selfDraw: false,
    bonusTileCount: 0,
  }

  describe('Great Three Dragons (8 Fan limit)', () => {
    it('scores a hand with 3 dragon pungs as 8 Fan', () => {
      const tiles: TileCode[] = [
        'd1', 'd1', 'd1', // dragon pung
        'd2', 'd2', 'd2', // dragon pung
        'd3', 'd3', 'd3', // dragon pung
        'w2', 'w3', 'w4', // chow
        't8', 't8',        // pair
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('standard')
      expect(result.totalFan).toBe(8)
      expect(result.matchedPatterns.some(p => p.id === 'great-three-dragons')).toBe(true)
      expect(result.payoutPerPerson).toBe(256) // 2^8
    })
  })

  describe('Thirteen Orphans (8 Fan limit)', () => {
    it('scores a Thirteen Orphans hand as 8 Fan', () => {
      const tiles: TileCode[] = [
        'w1', 'w9', 't1', 't9', 's1', 's9',
        'f1', 'f2', 'f3', 'f4',
        'd1', 'd2', 'd3',
        'w1', // duplicate
      ]
      const result = calculateScore(tiles, defaultOptions)

      expect(result.isValid).toBe(true)
      expect(result.handType).toBe('thirteen-orphans')
      expect(result.totalFan).toBe(8)
      expect(result.matchedPatterns.some(p => p.id === 'thirteen-orphans')).toBe(true)
      expect(result.payoutPerPerson).toBe(256) // 2^8
    })
  })
})

describe('calculateScore — pattern stacking', () => {
  const defaultOptions: CalculateScoreOptions = {
    roundWind: 'f1',
    seatWind: 'f2',
    selfDraw: false,
    bonusTileCount: 0,
  }

  it('stacks All Pungs (3) + Dragon Pung (1) = 4 Fan', () => {
    const tiles: TileCode[] = [
      'w2', 'w2', 'w2', // pung
      't5', 't5', 't5', // pung
      's7', 's7', 's7', // pung
      'd1', 'd1', 'd1', // dragon pung
      'w9', 'w9',        // pair
    ]
    const result = calculateScore(tiles, defaultOptions)

    expect(result.isValid).toBe(true)
    expect(result.matchedPatterns.some(p => p.id === 'all-pungs')).toBe(true)
    expect(result.matchedPatterns.some(p => p.id === 'dragon-pung')).toBe(true)

    const allPungsFan = result.matchedPatterns.find(p => p.id === 'all-pungs')!.fan
    const dragonPungFan = result.matchedPatterns.find(p => p.id === 'dragon-pung')!.fan
    expect(allPungsFan).toBe(3)
    expect(dragonPungFan).toBe(1)
    expect(result.totalFan).toBe(4)
    expect(result.payoutPerPerson).toBe(16) // 2^4
  })
})

describe('calculateScore — Fan cap', () => {
  const defaultOptions: CalculateScoreOptions = {
    roundWind: 'f1',
    seatWind: 'f2',
    selfDraw: false,
    bonusTileCount: 0,
  }

  it('caps total Fan at 8 when pattern Fan exceeds 8', () => {
    // Full One Suit (7 Fan) + self-draw (1) + bonus tiles (2) = 10 raw, capped at 8
    const tiles: TileCode[] = [
      's1', 's2', 's3',
      's3', 's4', 's5',
      's5', 's6', 's7',
      's7', 's8', 's9',
      's1', 's1',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: true,
      bonusTileCount: 2,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.totalFan).toBe(8)
    expect(result.totalFan).toBeLessThanOrEqual(8)
    expect(result.payoutPerPerson).toBe(256) // 2^8
  })

  it('caps Great Three Dragons (8) + bonuses at 8', () => {
    const tiles: TileCode[] = [
      'd1', 'd1', 'd1',
      'd2', 'd2', 'd2',
      'd3', 'd3', 'd3',
      'w2', 'w3', 'w4',
      't8', 't8',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: true,
      bonusTileCount: 3,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.totalFan).toBe(8)
  })
})

describe('calculateScore — wind bonus', () => {
  it('adds +1 Fan for round wind pung', () => {
    // Hand with a pung of East (f1), round wind is East
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3',
      't4', 't5', 't6',
      's7', 's8', 's9',
      'f1', 'f1', 'f1', // East wind pung
      't2', 't2',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1', // East is round wind
      seatWind: 'f3',  // West is seat wind (no match)
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.windFan).toBe(1)
  })

  it('adds +1 Fan for seat wind pung', () => {
    // Hand with a pung of South (f2), seat wind is South
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3',
      't4', 't5', 't6',
      's7', 's8', 's9',
      'f2', 'f2', 'f2', // South wind pung
      't2', 't2',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f3',  // West is round wind (no match)
      seatWind: 'f2',   // South is seat wind
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.windFan).toBe(1)
  })

  it('adds +2 Fan when round wind and seat wind are the same and hand has that pung', () => {
    // Hand with a pung of East (f1), both round and seat wind are East
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3',
      't4', 't5', 't6',
      's7', 's8', 's9',
      'f1', 'f1', 'f1', // East wind pung
      't2', 't2',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1', // East
      seatWind: 'f1',  // East (same as round)
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.windFan).toBe(2)
  })
})

describe('calculateScore — self-draw bonus', () => {
  const baseTiles: TileCode[] = [
    'w1', 'w2', 'w3',
    't4', 't5', 't6',
    't7', 't8', 't9',
    's2', 's3', 's4',
    's8', 's8',
  ]

  it('adds +1 Fan when selfDraw is true', () => {
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: true,
      bonusTileCount: 0,
    }
    const result = calculateScore(baseTiles, options)

    expect(result.isValid).toBe(true)
    expect(result.selfDrawFan).toBe(1)
    // Common Hand (1) + self-draw (1) = 2
    expect(result.totalFan).toBe(2)
    expect(result.payoutPerPerson).toBe(4) // 2^2
  })

  it('adds 0 Fan when selfDraw is false', () => {
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(baseTiles, options)

    expect(result.isValid).toBe(true)
    expect(result.selfDrawFan).toBe(0)
    // Common Hand (1) only
    expect(result.totalFan).toBe(1)
  })
})

describe('calculateScore — 0 Fan hand', () => {
  it('scores a valid hand with no patterns and no bonuses as 0 Fan', () => {
    // A hand that forms valid sets but matches no scoring pattern:
    // All chows from mixed suits, but pair is a dragon → not Common Hand
    // Not all one suit, no pungs, no special patterns
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3', // chow (characters)
      't4', 't5', 't6', // chow (dots)
      's1', 's2', 's3', // chow (bamboo)
      'w7', 'w8', 'w9', // chow (characters)
      'd1', 'd1',        // dragon pair → disqualifies Common Hand
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(true)
    expect(result.handType).toBe('standard')
    expect(result.matchedPatterns).toHaveLength(0)
    expect(result.totalFan).toBe(0)
    expect(result.payoutPerPerson).toBe(1) // 2^0
  })
})

describe('calculateScore — invalid hand', () => {
  it('returns isValid false for 14 tiles that form no valid structure', () => {
    // 14 tiles that cannot form 4 sets + 1 pair, Seven Pairs, or Thirteen Orphans
    const tiles: TileCode[] = [
      'w1', 'w3', 'w5', 'w7', 'w9',
      't1', 't3', 't5', 't7', 't9',
      's1', 's3', 's5', 's7',
    ]
    const options: CalculateScoreOptions = {
      roundWind: 'f1',
      seatWind: 'f2',
      selfDraw: false,
      bonusTileCount: 0,
    }
    const result = calculateScore(tiles, options)

    expect(result.isValid).toBe(false)
    expect(result.handType).toBe('invalid')
    expect(result.matchedPatterns).toEqual([])
    expect(result.totalFan).toBe(0)
    expect(result.payoutPerPerson).toBe(0)
  })
})

describe('calculateWindFan', () => {
  it('returns 0 when no wind pungs match', () => {
    const grouping: HandGrouping = {
      sets: [
        { type: 'chow', tiles: ['w1', 'w2', 'w3'] },
        { type: 'chow', tiles: ['t4', 't5', 't6'] },
        { type: 'chow', tiles: ['s7', 's8', 's9'] },
        { type: 'pung', tiles: ['w5', 'w5', 'w5'] },
      ],
      pair: { type: 'pair', tiles: ['t1', 't1'] },
    }
    expect(calculateWindFan(grouping, 'f1', 'f2')).toBe(0)
  })

  it('returns 1 for round wind pung only', () => {
    const grouping: HandGrouping = {
      sets: [
        { type: 'chow', tiles: ['w1', 'w2', 'w3'] },
        { type: 'chow', tiles: ['t4', 't5', 't6'] },
        { type: 'chow', tiles: ['s7', 's8', 's9'] },
        { type: 'pung', tiles: ['f1', 'f1', 'f1'] },
      ],
      pair: { type: 'pair', tiles: ['t1', 't1'] },
    }
    expect(calculateWindFan(grouping, 'f1', 'f3')).toBe(1)
  })

  it('returns 2 when round wind equals seat wind and hand has that pung', () => {
    const grouping: HandGrouping = {
      sets: [
        { type: 'chow', tiles: ['w1', 'w2', 'w3'] },
        { type: 'chow', tiles: ['t4', 't5', 't6'] },
        { type: 'chow', tiles: ['s7', 's8', 's9'] },
        { type: 'pung', tiles: ['f1', 'f1', 'f1'] },
      ],
      pair: { type: 'pair', tiles: ['t1', 't1'] },
    }
    expect(calculateWindFan(grouping, 'f1', 'f1')).toBe(2)
  })
})

describe('calculatePayout', () => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 8],
    [4, 16],
    [5, 32],
    [6, 64],
    [7, 128],
    [8, 256],
  ])('calculatePayout(%i) === %i', (fan, expected) => {
    expect(calculatePayout(fan)).toBe(expected)
  })
})
