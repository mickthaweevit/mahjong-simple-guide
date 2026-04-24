import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { TileCode } from '../../../src/data/tiles'
import { useHandSimulator } from '../../../src/composables/useHandSimulator'

/**
 * Feature: hand-simulation, Property 1: Tile addition preserves hand invariants
 *
 * Validates: Requirements 1.2, 1.5
 *
 * For any hand with fewer than 14 tiles and for any TileCode that has fewer
 * than 4 copies in the hand, adding that tile should increase the hand length
 * by exactly 1, the added tile should appear in the hand, and no tile in the
 * resulting hand should have more than 4 copies.
 */

// ── Tile constants ───────────────────────────────────────────────────────────

const ALL_TILE_CODES: TileCode[] = [
  'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
  't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
  'f1', 'f2', 'f3', 'f4',
  'd1', 'd2', 'd3',
]

const MAX_COPIES_PER_TILE = 4

// ── Custom generators ────────────────────────────────────────────────────────

/** Arbitrary TileCode from the 34 possible values */
const arbTileCode: fc.Arbitrary<TileCode> = fc.constantFrom(...ALL_TILE_CODES)

/**
 * Generate a hand of 0–13 tiles respecting the 4-copy-per-tile limit.
 * Returns the list of tiles to pre-populate the hand with.
 */
const arbPartialHand: fc.Arbitrary<TileCode[]> = fc
  .integer({ min: 0, max: 13 })
  .chain((size) =>
    fc.array(arbTileCode, { minLength: size, maxLength: size }).filter((tiles) => {
      const counts = new Map<TileCode, number>()
      for (const tile of tiles) {
        const c = (counts.get(tile) ?? 0) + 1
        if (c > MAX_COPIES_PER_TILE) return false
        counts.set(tile, c)
      }
      return true
    }),
  )

/**
 * Count occurrences of each tile in an array.
 */
function countTiles(tiles: TileCode[]): Map<TileCode, number> {
  const counts = new Map<TileCode, number>()
  for (const tile of tiles) {
    counts.set(tile, (counts.get(tile) ?? 0) + 1)
  }
  return counts
}

// ── Property test ────────────────────────────────────────────────────────────

describe('Feature: hand-simulation, Property 1: Tile addition preserves hand invariants', () => {
  it('adding a tile increases length by 1, tile appears in hand, no tile exceeds 4 copies', () => {
    fc.assert(
      fc.property(arbPartialHand, arbTileCode, (initialTiles, tileToAdd) => {
        // Pre-condition: the tile to add must have fewer than 4 copies in the hand
        const initialCounts = countTiles(initialTiles)
        const currentCopies = initialCounts.get(tileToAdd) ?? 0
        fc.pre(currentCopies < MAX_COPIES_PER_TILE)

        // Set up the composable with the initial hand
        const sim = useHandSimulator()
        for (const tile of initialTiles) {
          sim.addTile(tile)
        }

        const lengthBefore = sim.handTiles.value.length
        expect(lengthBefore).toBe(initialTiles.length)

        // Act: add the tile
        sim.addTile(tileToAdd)

        // Assert 1: hand length increased by exactly 1
        expect(sim.handTiles.value.length).toBe(lengthBefore + 1)

        // Assert 2: the added tile appears in the hand
        expect(sim.handTiles.value).toContain(tileToAdd)

        // Assert 3: no tile exceeds 4 copies
        const resultCounts = countTiles(sim.handTiles.value)
        for (const [, count] of resultCounts) {
          expect(count).toBeLessThanOrEqual(MAX_COPIES_PER_TILE)
        }
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 2 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 2: Hand fullness reflects tile count
 *
 * Validates: Requirements 1.3, 1.4
 *
 * For any hand of size 0–13, `isHandFull` should be false.
 * For any hand of exactly 14 tiles, `isHandFull` should be true and further
 * tile additions should be rejected (hand length remains 14).
 */

/**
 * Generate a hand of exactly 14 tiles respecting the 4-copy-per-tile limit.
 * Builds the hand tile-by-tile, picking from tiles that still have room.
 */
const arbFullHand: fc.Arbitrary<TileCode[]> = fc
  .array(arbTileCode, { minLength: 14, maxLength: 14 })
  .filter((tiles) => {
    const counts = new Map<TileCode, number>()
    for (const tile of tiles) {
      const c = (counts.get(tile) ?? 0) + 1
      if (c > MAX_COPIES_PER_TILE) return false
      counts.set(tile, c)
    }
    return true
  })

describe('Feature: hand-simulation, Property 2: Hand fullness reflects tile count', () => {
  it('for any hand of size 0–13, isHandFull is false', () => {
    fc.assert(
      fc.property(arbPartialHand, (initialTiles) => {
        const sim = useHandSimulator()
        for (const tile of initialTiles) {
          sim.addTile(tile)
        }

        // A hand with 0–13 tiles should not be full
        expect(sim.isHandFull.value).toBe(false)
      }),
      { numRuns: 100 },
    )
  })

  it('at 14 tiles, isHandFull is true and additions are rejected', () => {
    fc.assert(
      fc.property(arbFullHand, arbTileCode, (fullTiles, extraTile) => {
        const sim = useHandSimulator()
        for (const tile of fullTiles) {
          sim.addTile(tile)
        }

        // Hand should be full at 14 tiles
        expect(sim.handTiles.value.length).toBe(14)
        expect(sim.isHandFull.value).toBe(true)

        // Attempting to add another tile should be rejected
        sim.addTile(extraTile)
        expect(sim.handTiles.value.length).toBe(14)
        expect(sim.isHandFull.value).toBe(true)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 3 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 3: Tile removal decreases hand size
 *
 * Validates: Requirements 1.7
 *
 * For any non-empty hand and for any valid index within that hand, removing
 * the tile at that index should decrease the hand length by exactly 1 and
 * the remaining tiles should be the original tiles minus the one at the
 * removed index (order preserved).
 */

describe('Feature: hand-simulation, Property 3: Tile removal decreases hand size', () => {
  it('removing a tile at a valid index decreases length by 1 with correct remaining tiles', () => {
    fc.assert(
      fc.property(
        arbPartialHand.filter((tiles) => tiles.length >= 1),
        fc.nat(),
        (initialTiles, rawIndex) => {
          // Derive a valid index within the hand
          const index = rawIndex % initialTiles.length

          // Set up the composable with the initial hand
          const sim = useHandSimulator()
          for (const tile of initialTiles) {
            sim.addTile(tile)
          }

          const lengthBefore = sim.handTiles.value.length
          expect(lengthBefore).toBe(initialTiles.length)

          // Act: remove the tile at the given index
          sim.removeTile(index)

          // Assert 1: hand length decreased by exactly 1
          expect(sim.handTiles.value.length).toBe(lengthBefore - 1)

          // Assert 2: remaining tiles are the original tiles minus the one at the removed index
          const expected = [...initialTiles]
          expected.splice(index, 1)
          expect(sim.handTiles.value).toEqual(expected)
        },
      ),
      { numRuns: 100 },
    )
  })
})


// ── Property 4 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 4: Bonus tile toggle round-trip
 *
 * Validates: Requirements 2.2, 2.3
 *
 * For any bonus tile ID, toggling it on when it is not selected should add it
 * to the set, and toggling it again should remove it. After two toggles, the
 * bonus tile set should be identical to the original state.
 */

/** The 8 valid bonus tile IDs */
const ALL_BONUS_TILE_IDS = [
  'flower-1', 'flower-2', 'flower-3', 'flower-4',
  'season-1', 'season-2', 'season-3', 'season-4',
] as const

/** Arbitrary bonus tile ID from the 8 valid values */
const arbBonusTileId: fc.Arbitrary<string> = fc.constantFrom(...ALL_BONUS_TILE_IDS)

/** Arbitrary subset of the 8 bonus tile IDs as a Set<string> */
const arbBonusTileSet: fc.Arbitrary<Set<string>> = fc
  .subarray([...ALL_BONUS_TILE_IDS], { minLength: 0, maxLength: ALL_BONUS_TILE_IDS.length })
  .map((arr) => new Set(arr))

describe('Feature: hand-simulation, Property 4: Bonus tile toggle round-trip', () => {
  it('toggling a bonus tile on then off returns to the original state', () => {
    fc.assert(
      fc.property(arbBonusTileSet, arbBonusTileId, (initialSet, tileToToggle) => {
        // Set up the composable and pre-populate the bonus tiles
        const sim = useHandSimulator()
        for (const id of initialSet) {
          sim.toggleBonus(id)
        }

        // Record the original state
        const originalBonusTiles = new Set(sim.bonusTiles.value)

        // First toggle: should change the set
        sim.toggleBonus(tileToToggle)

        if (originalBonusTiles.has(tileToToggle)) {
          // Was selected → should now be removed
          expect(sim.bonusTiles.value.has(tileToToggle)).toBe(false)
          expect(sim.bonusTiles.value.size).toBe(originalBonusTiles.size - 1)
        } else {
          // Was not selected → should now be added
          expect(sim.bonusTiles.value.has(tileToToggle)).toBe(true)
          expect(sim.bonusTiles.value.size).toBe(originalBonusTiles.size + 1)
        }

        // Second toggle: should return to original state
        sim.toggleBonus(tileToToggle)

        expect(sim.bonusTiles.value.size).toBe(originalBonusTiles.size)
        expect(sim.bonusTiles.value).toEqual(originalBonusTiles)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 5 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 5: Bonus Fan equals bonus tile count
 *
 * Validates: Requirements 2.5
 *
 * For any set of selected bonus tiles (0–8), the `bonusFan` in the score
 * result should equal the number of selected bonus tiles.
 */

describe('Feature: hand-simulation, Property 5: Bonus Fan equals bonus tile count', () => {
  /**
   * A known valid 14-tile hand (Common Hand: mixed suits with chows and a pair).
   * This ensures scoreResult is always non-null so we can inspect bonusFan.
   */
  const VALID_HAND: TileCode[] = [
    'w1', 'w2', 'w3', // chow
    'w4', 'w5', 'w6', // chow
    't1', 't2', 't3', // chow
    's4', 's5', 's6', // chow
    'd1', 'd1',        // pair
  ]

  it('bonusFan equals the number of selected bonus tiles for any subset of 0–8 bonus tiles', () => {
    fc.assert(
      fc.property(arbBonusTileSet, (bonusSet) => {
        // Set up the composable and build a valid 14-tile hand
        const sim = useHandSimulator()
        for (const tile of VALID_HAND) {
          sim.addTile(tile)
        }

        // Toggle on the selected bonus tiles
        for (const id of bonusSet) {
          sim.toggleBonus(id)
        }

        // The hand is full, so scoreResult should be non-null
        expect(sim.scoreResult.value).not.toBeNull()

        // bonusFan should equal the number of selected bonus tiles
        expect(sim.scoreResult.value!.bonusFan).toBe(bonusSet.size)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 6 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 6: Self-draw Fan is conditional
 *
 * Validates: Requirements 3.2, 3.3
 *
 * For any valid 14-tile hand, when selfDraw is true the selfDrawFan should
 * be 1, and when selfDraw is false the selfDrawFan should be 0.
 */

describe('Feature: hand-simulation, Property 6: Self-draw Fan is conditional', () => {
  /**
   * Reuse the same known valid 14-tile hand (Common Hand) from Property 5.
   */
  const VALID_HAND: TileCode[] = [
    'w1', 'w2', 'w3', // chow
    'w4', 'w5', 'w6', // chow
    't1', 't2', 't3', // chow
    's4', 's5', 's6', // chow
    'd1', 'd1',        // pair
  ]

  it('selfDraw true → selfDrawFan is 1, selfDraw false → selfDrawFan is 0', () => {
    fc.assert(
      fc.property(fc.boolean(), (selfDrawValue) => {
        // Set up the composable and build a valid 14-tile hand
        const sim = useHandSimulator()
        for (const tile of VALID_HAND) {
          sim.addTile(tile)
        }

        // Set the selfDraw flag to the generated value
        sim.selfDraw.value = selfDrawValue

        // The hand is full, so scoreResult should be non-null
        expect(sim.scoreResult.value).not.toBeNull()

        // selfDrawFan should be 1 when selfDraw is true, 0 when false
        if (selfDrawValue) {
          expect(sim.scoreResult.value!.selfDrawFan).toBe(1)
        } else {
          expect(sim.scoreResult.value!.selfDrawFan).toBe(0)
        }
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 7 ───────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 7: Wind pung bonus
 *
 * Validates: Requirements 4.4, 4.5, 4.6
 *
 * For any wind tile (f1–f4) and for any valid hand grouping containing a pung
 * of that wind tile, setting that wind as the round wind should contribute +1
 * to windFan, and setting it as the seat wind should contribute +1 to windFan.
 * When the same wind is both round and seat wind, windFan should be +2.
 */

import type { WindTile } from '../../../src/engine/types'

/** Arbitrary wind tile from the 4 possible values */
const arbWindTile: fc.Arbitrary<WindTile> = fc.constantFrom<WindTile>('f1', 'f2', 'f3', 'f4')

/**
 * Build a valid 14-tile hand that contains a pung of the given wind tile.
 * Structure: wind pung + 3 chows from different suits + a non-wind pair.
 * This guarantees a valid standard hand with exactly one wind pung.
 */
function buildHandWithWindPung(wind: WindTile): TileCode[] {
  return [
    wind, wind, wind,     // pung of the target wind
    'w1', 'w2', 'w3',    // chow (characters)
    't4', 't5', 't6',    // chow (dots)
    's7', 's8', 's9',    // chow (bamboo)
    'd1', 'd1',           // pair (red dragon — not a wind)
  ]
}

/**
 * Pick a wind tile that is different from the given one.
 * Used to set round/seat wind to a non-matching value so we can
 * isolate the bonus from a single role.
 */
function differentWind(wind: WindTile): WindTile {
  const allWinds: WindTile[] = ['f1', 'f2', 'f3', 'f4']
  return allWinds.find(w => w !== wind)!
}

describe('Feature: hand-simulation, Property 7: Wind pung bonus', () => {
  it('round wind pung → windFan includes +1 for round wind', () => {
    fc.assert(
      fc.property(arbWindTile, (wind) => {
        const sim = useHandSimulator()
        const hand = buildHandWithWindPung(wind)
        for (const tile of hand) {
          sim.addTile(tile)
        }

        // Set round wind to match the pung, seat wind to something else
        sim.roundWind.value = wind
        sim.seatWind.value = differentWind(wind)

        expect(sim.scoreResult.value).not.toBeNull()
        // windFan should be at least 1 (round wind bonus)
        expect(sim.scoreResult.value!.windFan).toBe(1)
      }),
      { numRuns: 100 },
    )
  })

  it('seat wind pung → windFan includes +1 for seat wind', () => {
    fc.assert(
      fc.property(arbWindTile, (wind) => {
        const sim = useHandSimulator()
        const hand = buildHandWithWindPung(wind)
        for (const tile of hand) {
          sim.addTile(tile)
        }

        // Set seat wind to match the pung, round wind to something else
        sim.roundWind.value = differentWind(wind)
        sim.seatWind.value = wind

        expect(sim.scoreResult.value).not.toBeNull()
        // windFan should be at least 1 (seat wind bonus)
        expect(sim.scoreResult.value!.windFan).toBe(1)
      }),
      { numRuns: 100 },
    )
  })

  it('same wind is both round and seat → windFan is +2', () => {
    fc.assert(
      fc.property(arbWindTile, (wind) => {
        const sim = useHandSimulator()
        const hand = buildHandWithWindPung(wind)
        for (const tile of hand) {
          sim.addTile(tile)
        }

        // Set both round and seat wind to match the pung
        sim.roundWind.value = wind
        sim.seatWind.value = wind

        expect(sim.scoreResult.value).not.toBeNull()
        // windFan should be 2 (one for round, one for seat)
        expect(sim.scoreResult.value!.windFan).toBe(2)
      }),
      { numRuns: 100 },
    )
  })

  it('no matching wind pung → windFan is 0', () => {
    fc.assert(
      fc.property(arbWindTile, (wind) => {
        const sim = useHandSimulator()
        const hand = buildHandWithWindPung(wind)
        for (const tile of hand) {
          sim.addTile(tile)
        }

        // Set both winds to a different wind than the pung
        const other = differentWind(wind)
        sim.roundWind.value = other
        sim.seatWind.value = other

        expect(sim.scoreResult.value).not.toBeNull()
        // windFan should be 0 (no matching wind pung)
        expect(sim.scoreResult.value!.windFan).toBe(0)
      }),
      { numRuns: 100 },
    )
  })
})


// ── Property 12 ──────────────────────────────────────────────────────────────

/**
 * Feature: hand-simulation, Property 12: Clear resets all state to defaults
 *
 * Validates: Requirements 7.2, 7.3, 7.4, 7.5
 *
 * For any simulator state (any combination of hand tiles, bonus tiles,
 * self-draw flag, and wind settings), invoking `clearHand` should result in:
 * handTiles is empty, bonusTiles is empty, selfDraw is false, roundWind is
 * 'f1', and seatWind is 'f1'.
 */

describe('Feature: hand-simulation, Property 12: Clear resets all state to defaults', () => {
  it('clearHand resets all state regardless of prior configuration', () => {
    fc.assert(
      fc.property(
        arbPartialHand,
        arbBonusTileSet,
        fc.boolean(),
        arbWindTile,
        arbWindTile,
        (tiles, bonusSet, selfDrawValue, roundWindValue, seatWindValue) => {
          // Set up the composable with arbitrary state
          const sim = useHandSimulator()

          // Populate hand tiles
          for (const tile of tiles) {
            sim.addTile(tile)
          }

          // Populate bonus tiles
          for (const id of bonusSet) {
            sim.toggleBonus(id)
          }

          // Set self-draw, round wind, and seat wind
          sim.selfDraw.value = selfDrawValue
          sim.roundWind.value = roundWindValue
          sim.seatWind.value = seatWindValue

          // Verify the state was actually set (pre-condition sanity check)
          // (tiles may be fewer if duplicates exceeded 4 copies, but that's
          // handled by the generator filter)

          // Act: clear the hand
          sim.clearHand()

          // Assert: all state is reset to defaults
          expect(sim.handTiles.value).toEqual([])
          expect(sim.bonusTiles.value).toEqual(new Set())
          expect(sim.selfDraw.value).toBe(false)
          expect(sim.roundWind.value).toBe('f1')
          expect(sim.seatWind.value).toBe('f1')

          // Also verify derived state is consistent with defaults
          expect(sim.isHandFull.value).toBe(false)
          expect(sim.scoreResult.value).toBeNull()
        },
      ),
      { numRuns: 100 },
    )
  })
})


// ── Unit Tests ───────────────────────────────────────────────────────────────

/**
 * Unit tests for useHandSimulator composable.
 *
 * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.7, 7.2, 7.3, 7.4, 7.5
 */

describe('useHandSimulator unit tests', () => {
  describe('initial state defaults', () => {
    it('starts with empty hand, no bonuses, selfDraw false, winds East, isHandFull false, scoreResult null', () => {
      const sim = useHandSimulator()

      expect(sim.handTiles.value).toEqual([])
      expect(sim.bonusTiles.value).toEqual(new Set())
      expect(sim.selfDraw.value).toBe(false)
      expect(sim.roundWind.value).toBe('f1')
      expect(sim.seatWind.value).toBe('f1')
      expect(sim.isHandFull.value).toBe(false)
      expect(sim.scoreResult.value).toBeNull()
    })
  })

  describe('addTile rejects when hand is full', () => {
    it('does not add a 15th tile when hand already has 14 tiles', () => {
      const sim = useHandSimulator()

      // Fill hand with 14 tiles: w1,w2,w3,w4,w5,w6,t1,t2,t3,s4,s5,s6,d1,d1
      const fullHand: TileCode[] = [
        'w1', 'w2', 'w3', 'w4', 'w5', 'w6',
        't1', 't2', 't3',
        's4', 's5', 's6',
        'd1', 'd1',
      ]
      for (const tile of fullHand) {
        sim.addTile(tile)
      }

      expect(sim.handTiles.value.length).toBe(14)
      expect(sim.isHandFull.value).toBe(true)

      // Try adding another tile — should be rejected
      sim.addTile('w7')
      expect(sim.handTiles.value.length).toBe(14)
      expect(sim.isHandFull.value).toBe(true)
    })
  })

  describe('addTile rejects when tile has 4 copies', () => {
    it('does not add a 5th copy of the same tile', () => {
      const sim = useHandSimulator()

      // Add 4 copies of w1
      sim.addTile('w1')
      sim.addTile('w1')
      sim.addTile('w1')
      sim.addTile('w1')
      expect(sim.handTiles.value.length).toBe(4)
      expect(sim.handTiles.value.filter(t => t === 'w1').length).toBe(4)

      // Try adding a 5th copy — should be rejected
      sim.addTile('w1')
      expect(sim.handTiles.value.length).toBe(4)
      expect(sim.handTiles.value.filter(t => t === 'w1').length).toBe(4)
    })
  })

  describe('removeTile at various indices', () => {
    it('removes the first tile', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w2')
      sim.addTile('w3')

      sim.removeTile(0)
      expect(sim.handTiles.value).toEqual(['w2', 'w3'])
    })

    it('removes a middle tile', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w2')
      sim.addTile('w3')

      sim.removeTile(1)
      expect(sim.handTiles.value).toEqual(['w1', 'w3'])
    })

    it('removes the last tile', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w2')
      sim.addTile('w3')

      sim.removeTile(2)
      expect(sim.handTiles.value).toEqual(['w1', 'w2'])
    })
  })

  describe('removeTile with invalid index', () => {
    it('does nothing for a negative index', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w2')

      sim.removeTile(-1)
      expect(sim.handTiles.value).toEqual(['w1', 'w2'])
    })

    it('does nothing for an out-of-bounds index', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w2')

      sim.removeTile(5)
      expect(sim.handTiles.value).toEqual(['w1', 'w2'])
    })
  })

  describe('availableCounts computation', () => {
    it('starts with 4 available for every tile', () => {
      const sim = useHandSimulator()

      for (const tile of ALL_TILE_CODES) {
        expect(sim.availableCounts.value[tile]).toBe(4)
      }
    })

    it('decreases count for added tiles', () => {
      const sim = useHandSimulator()
      sim.addTile('w1')
      sim.addTile('w1')
      sim.addTile('t3')

      expect(sim.availableCounts.value['w1']).toBe(2)
      expect(sim.availableCounts.value['t3']).toBe(3)
      // Unrelated tiles remain at 4
      expect(sim.availableCounts.value['s9']).toBe(4)
    })

    it('increases count when a tile is removed', () => {
      const sim = useHandSimulator()
      sim.addTile('d2')
      sim.addTile('d2')
      sim.addTile('d2')
      expect(sim.availableCounts.value['d2']).toBe(1)

      sim.removeTile(0) // remove one d2
      expect(sim.availableCounts.value['d2']).toBe(2)
    })
  })
})
