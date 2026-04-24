import { describe, it, expect } from 'vitest'
import {
  isCommonHand,
  isAllPungs,
  isMixedOneSuit,
  isFullOneSuit,
  countDragonPungs,
  isSmallThreeDragons,
  isGreatThreeDragons,
  isGreatFourWinds,
  isAllGreen,
  matchPatterns,
} from '../../../src/engine/patternMatchers'
import type { TileCode } from '../../../src/data/tiles'
import type { HandGrouping, TileGroup } from '../../../src/engine/types'

/**
 * Validates: Requirements 5.3
 *
 * 5.3 — THE Fan_Calculator SHALL detect and score the following patterns with their
 *        correct Fan values.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function chow(tiles: [TileCode, TileCode, TileCode]): TileGroup {
  return { type: 'chow', tiles }
}

function pung(tile: TileCode): TileGroup {
  return { type: 'pung', tiles: [tile, tile, tile] }
}

function kong(tile: TileCode): TileGroup {
  return { type: 'kong', tiles: [tile, tile, tile, tile] }
}

function pair(tile: TileCode): TileGroup {
  return { type: 'pair', tiles: [tile, tile] }
}

function grouping(sets: TileGroup[], p: TileGroup): HandGrouping {
  return { sets, pair: p }
}

function allTiles(g: HandGrouping): TileCode[] {
  const tiles: TileCode[] = []
  for (const s of g.sets) tiles.push(...s.tiles)
  tiles.push(...g.pair.tiles)
  return tiles
}

// ── isCommonHand ─────────────────────────────────────────────────────────────

describe('isCommonHand', () => {
  it('returns true for 4 chows + non-dragon pair', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['t7', 't8', 't9']),
        chow(['s2', 's3', 's4']),
      ],
      pair('s8'),
    )
    expect(isCommonHand(g)).toBe(true)
  })

  it('returns false when a set is a pung', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['t7', 't8', 't9']),
        pung('s2'),
      ],
      pair('s8'),
    )
    expect(isCommonHand(g)).toBe(false)
  })

  it('returns false when pair is a dragon', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['t7', 't8', 't9']),
        chow(['s2', 's3', 's4']),
      ],
      pair('d1'),
    )
    expect(isCommonHand(g)).toBe(false)
  })
})

// ── isAllPungs ───────────────────────────────────────────────────────────────

describe('isAllPungs', () => {
  it('returns true for 4 pungs + pair', () => {
    const g = grouping(
      [pung('w2'), pung('t5'), pung('s7'), pung('f1')],
      pair('d1'),
    )
    expect(isAllPungs(g)).toBe(true)
  })

  it('returns true when a set is a kong (kong counts as pung)', () => {
    const g = grouping(
      [kong('w2'), pung('t5'), pung('s7'), pung('f1')],
      pair('d1'),
    )
    expect(isAllPungs(g)).toBe(true)
  })

  it('returns false when a set is a chow', () => {
    const g = grouping(
      [chow(['w1', 'w2', 'w3']), pung('t5'), pung('s7'), pung('f1')],
      pair('d1'),
    )
    expect(isAllPungs(g)).toBe(false)
  })
})

// ── isMixedOneSuit ───────────────────────────────────────────────────────────

describe('isMixedOneSuit', () => {
  it('returns true for one numbered suit + honors', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['w4', 'w5', 'w6']),
        chow(['w7', 'w8', 'w9']),
        pung('f1'),
      ],
      pair('w5'),
    )
    expect(isMixedOneSuit(allTiles(g))).toBe(true)
  })

  it('returns false for multiple numbered suits', () => {
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3',
      't4', 't5', 't6',
      'w7', 'w8', 'w9',
      'f1', 'f1', 'f1',
      'w5', 'w5',
    ]
    expect(isMixedOneSuit(tiles)).toBe(false)
  })

  it('returns false for all honors (no numbered suit)', () => {
    const tiles: TileCode[] = [
      'f1', 'f1', 'f1',
      'f2', 'f2', 'f2',
      'f3', 'f3', 'f3',
      'd1', 'd1', 'd1',
      'd2', 'd2',
    ]
    expect(isMixedOneSuit(tiles)).toBe(false)
  })

  it('returns false for one suit with no honors (that is Full One Suit)', () => {
    const tiles: TileCode[] = [
      's1', 's2', 's3',
      's3', 's4', 's5',
      's5', 's6', 's7',
      's7', 's8', 's9',
      's1', 's1',
    ]
    expect(isMixedOneSuit(tiles)).toBe(false)
  })
})

// ── isFullOneSuit ────────────────────────────────────────────────────────────

describe('isFullOneSuit', () => {
  it('returns true when all tiles are from one numbered suit', () => {
    const tiles: TileCode[] = [
      's1', 's2', 's3',
      's3', 's4', 's5',
      's5', 's6', 's7',
      's7', 's8', 's9',
      's1', 's1',
    ]
    expect(isFullOneSuit(tiles)).toBe(true)
  })

  it('returns false when tiles include honors', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['w4', 'w5', 'w6']),
        chow(['w7', 'w8', 'w9']),
        pung('f1'),
      ],
      pair('w5'),
    )
    expect(isFullOneSuit(allTiles(g))).toBe(false)
  })

  it('returns false when tiles span multiple numbered suits', () => {
    const tiles: TileCode[] = [
      'w1', 'w2', 'w3',
      't4', 't5', 't6',
      't7', 't8', 't9',
      's2', 's3', 's4',
      's8', 's8',
    ]
    expect(isFullOneSuit(tiles)).toBe(false)
  })

  it('returns false for empty tile array', () => {
    expect(isFullOneSuit([])).toBe(false)
  })
})

// ── countDragonPungs ─────────────────────────────────────────────────────────

describe('countDragonPungs', () => {
  it('returns 0 when no dragon pungs exist', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['t7', 't8', 't9']),
        chow(['s2', 's3', 's4']),
      ],
      pair('s8'),
    )
    expect(countDragonPungs(g)).toBe(0)
  })

  it('returns 1 for one dragon pung', () => {
    const g = grouping(
      [
        chow(['w2', 'w3', 'w4']),
        chow(['t6', 't7', 't8']),
        chow(['s1', 's2', 's3']),
        pung('d1'),
      ],
      pair('w9'),
    )
    expect(countDragonPungs(g)).toBe(1)
  })

  it('returns 2 for two dragon pungs', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        chow(['w3', 'w4', 'w5']),
        chow(['t1', 't2', 't3']),
      ],
      pair('s5'),
    )
    expect(countDragonPungs(g)).toBe(2)
  })

  it('returns 3 for three dragon pungs', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        pung('d3'),
        chow(['w2', 'w3', 'w4']),
      ],
      pair('t8'),
    )
    expect(countDragonPungs(g)).toBe(3)
  })

  it('counts kong of a dragon as a dragon pung', () => {
    const g = grouping(
      [
        kong('d1'),
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['s7', 's8', 's9']),
      ],
      pair('w5'),
    )
    expect(countDragonPungs(g)).toBe(1)
  })
})

// ── isSmallThreeDragons ──────────────────────────────────────────────────────

describe('isSmallThreeDragons', () => {
  it('returns true for 2 dragon pungs + dragon pair', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        chow(['w3', 'w4', 'w5']),
        chow(['t1', 't2', 't3']),
      ],
      pair('d3'),
    )
    expect(isSmallThreeDragons(g)).toBe(true)
  })

  it('returns false for 3 dragon pungs (that is Great Three Dragons)', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        pung('d3'),
        chow(['w2', 'w3', 'w4']),
      ],
      pair('t8'),
    )
    expect(isSmallThreeDragons(g)).toBe(false)
  })

  it('returns false for 1 dragon pung + dragon pair', () => {
    const g = grouping(
      [
        pung('d1'),
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['s7', 's8', 's9']),
      ],
      pair('d2'),
    )
    expect(isSmallThreeDragons(g)).toBe(false)
  })
})

// ── isGreatThreeDragons ──────────────────────────────────────────────────────

describe('isGreatThreeDragons', () => {
  it('returns true for 3 dragon pungs', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        pung('d3'),
        chow(['w2', 'w3', 'w4']),
      ],
      pair('t8'),
    )
    expect(isGreatThreeDragons(g)).toBe(true)
  })

  it('returns false for 2 dragon pungs', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        chow(['w3', 'w4', 'w5']),
        chow(['t1', 't2', 't3']),
      ],
      pair('d3'),
    )
    expect(isGreatThreeDragons(g)).toBe(false)
  })
})

// ── isGreatFourWinds ─────────────────────────────────────────────────────────

describe('isGreatFourWinds', () => {
  it('returns true for 4 wind pungs', () => {
    const g = grouping(
      [pung('f1'), pung('f2'), pung('f3'), pung('f4')],
      pair('t5'),
    )
    expect(isGreatFourWinds(g)).toBe(true)
  })

  it('returns false for 3 wind pungs', () => {
    const g = grouping(
      [pung('f1'), pung('f2'), pung('f3'), pung('d1')],
      pair('t5'),
    )
    expect(isGreatFourWinds(g)).toBe(false)
  })
})

// ── isAllGreen ───────────────────────────────────────────────────────────────

describe('isAllGreen', () => {
  it('returns true when all tiles are green (s2, s3, s4, s6, s8, d2)', () => {
    const tiles: TileCode[] = [
      's2', 's3', 's4',
      's2', 's3', 's4',
      's6', 's6', 's6',
      'd2', 'd2', 'd2',
      's8', 's8',
    ]
    expect(isAllGreen(tiles)).toBe(true)
  })

  it('returns false when a non-green tile is included (s1)', () => {
    const tiles: TileCode[] = [
      's1', 's2', 's3',
      's2', 's3', 's4',
      's6', 's6', 's6',
      'd2', 'd2', 'd2',
      's8', 's8',
    ]
    expect(isAllGreen(tiles)).toBe(false)
  })

  it('returns false when s5 is included', () => {
    const tiles: TileCode[] = [
      's2', 's3', 's4',
      's2', 's3', 's4',
      's5', 's6', 's6',
      'd2', 'd2', 'd2',
      's8', 's8',
    ]
    expect(isAllGreen(tiles)).toBe(false)
  })

  it('returns false for empty tile array', () => {
    expect(isAllGreen([])).toBe(false)
  })
})

// ── matchPatterns (orchestrator) ─────────────────────────────────────────────

describe('matchPatterns', () => {
  it('returns common-hand for a simple chow hand', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['t4', 't5', 't6']),
        chow(['t7', 't8', 't9']),
        chow(['s2', 's3', 's4']),
      ],
      pair('s8'),
    )
    const result = matchPatterns(g)
    expect(result).toEqual([{ id: 'common-hand', fan: 1 }])
  })

  it('returns limit hand (8 fan) for Great Three Dragons and stops stacking', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        pung('d3'),
        chow(['w2', 'w3', 'w4']),
      ],
      pair('t8'),
    )
    const result = matchPatterns(g)
    expect(result).toEqual([{ id: 'great-three-dragons', fan: 8 }])
  })

  it('returns limit hand (8 fan) for Great Four Winds', () => {
    const g = grouping(
      [pung('f1'), pung('f2'), pung('f3'), pung('f4')],
      pair('t5'),
    )
    const result = matchPatterns(g)
    expect(result).toEqual([{ id: 'great-four-winds', fan: 8 }])
  })

  it('returns limit hand (8 fan) for All Green', () => {
    const g = grouping(
      [
        chow(['s2', 's3', 's4']),
        chow(['s2', 's3', 's4']),
        pung('s6'),
        pung('d2'),
      ],
      pair('s8'),
    )
    const result = matchPatterns(g)
    expect(result).toEqual([{ id: 'all-green', fan: 8 }])
  })

  it('returns stacked patterns: all-pungs + dragon-pung', () => {
    const g = grouping(
      [pung('w2'), pung('t5'), pung('s7'), pung('d1')],
      pair('f1'),
    )
    const result = matchPatterns(g)
    const ids = result.map(r => r.id)
    expect(ids).toContain('all-pungs')
    expect(ids).toContain('dragon-pung')
    const totalFan = result.reduce((sum, r) => sum + r.fan, 0)
    expect(totalFan).toBe(4) // 3 (all-pungs) + 1 (dragon-pung)
  })

  it('does not count dragon pungs separately when Small Three Dragons matches', () => {
    const g = grouping(
      [
        pung('d1'),
        pung('d2'),
        chow(['w3', 'w4', 'w5']),
        chow(['t1', 't2', 't3']),
      ],
      pair('d3'),
    )
    const result = matchPatterns(g)
    const ids = result.map(r => r.id)
    expect(ids).toContain('small-three-dragons')
    expect(ids).not.toContain('dragon-pung')
  })

  it('does not return common-hand when other patterns match', () => {
    // All Pungs hand — should not also get common-hand
    const g = grouping(
      [pung('w2'), pung('t5'), pung('s7'), pung('f1')],
      pair('s1'),
    )
    const result = matchPatterns(g)
    const ids = result.map(r => r.id)
    expect(ids).toContain('all-pungs')
    expect(ids).not.toContain('common-hand')
  })

  it('returns full-one-suit (7 fan) for an all-bamboo hand', () => {
    const g = grouping(
      [
        chow(['s1', 's2', 's3']),
        chow(['s3', 's4', 's5']),
        chow(['s5', 's6', 's7']),
        chow(['s7', 's8', 's9']),
      ],
      pair('s1'),
    )
    const result = matchPatterns(g)
    expect(result).toEqual([{ id: 'full-one-suit', fan: 7 }])
  })

  it('returns mixed-one-suit (3 fan) for one suit + honors', () => {
    const g = grouping(
      [
        chow(['w1', 'w2', 'w3']),
        chow(['w4', 'w5', 'w6']),
        chow(['w7', 'w8', 'w9']),
        pung('f1'),
      ],
      pair('w5'),
    )
    const result = matchPatterns(g)
    const ids = result.map(r => r.id)
    expect(ids).toContain('mixed-one-suit')
    expect(ids).not.toContain('full-one-suit')
  })
})
