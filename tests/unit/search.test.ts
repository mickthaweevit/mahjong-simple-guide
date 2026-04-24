import { describe, it, expect } from 'vitest'
import { filterScoringEntries } from '../../src/composables/useSearch'
import type { ScoringEntry } from '../../src/types/scoring'

/**
 * Validates: Requirements 15.1–15.5
 *
 * 15.1 — search input accepts text
 * 15.2 — filters by English name, Chinese name, or description
 * 15.3 — matching entries displayed with Fan values
 * 15.4 — no results message when zero matches
 * 15.5 — clearing search restores full content
 */

const mockEntries: ScoringEntry[] = [
  {
    id: 'common-hand',
    englishName: 'Common Hand (Ping Hu)',
    chineseName: '平糊',
    faan: 1,
    descriptionKey: 'scoring.commonHand.description',
    beginnerExplanationKey: 'scoring.commonHand.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'all-pungs',
    englishName: 'All Pungs',
    chineseName: '對對糊',
    faan: 3,
    descriptionKey: 'scoring.allPungs.description',
    beginnerExplanationKey: 'scoring.allPungs.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'dragon-pung',
    englishName: 'Dragon Pung',
    chineseName: '箭刻',
    faan: 1,
    descriptionKey: 'scoring.dragonPung.description',
    beginnerExplanationKey: 'scoring.dragonPung.beginner',
    notesKey: null,
    isMaxLimit: false,
    stackable: true
  },
  {
    id: 'full-one-suit',
    englishName: 'Full One Suit',
    chineseName: '清一色',
    faan: 7,
    descriptionKey: 'scoring.fullOneSuit.description',
    beginnerExplanationKey: 'scoring.fullOneSuit.beginner',
    notesKey: null,
    isMaxLimit: false
  }
]

/** Simple translate function that returns a readable description per key */
function mockTranslate(key: string): string {
  const translations: Record<string, string> = {
    'scoring.commonHand.description': 'A basic winning hand with no special pattern',
    'scoring.allPungs.description': 'Hand consisting entirely of Pung sets and a pair',
    'scoring.dragonPung.description': 'A Pung of any Dragon tile',
    'scoring.fullOneSuit.description': 'All tiles from a single suit with no honor tiles'
  }
  return translations[key] ?? key
}

describe('filterScoringEntries', () => {
  it('returns all entries when search term is empty', () => {
    const result = filterScoringEntries(mockEntries, '', mockTranslate)
    expect(result).toEqual(mockEntries)
    expect(result).toHaveLength(4)
  })

  it('returns all entries when search term is whitespace only', () => {
    const result = filterScoringEntries(mockEntries, '   ', mockTranslate)
    expect(result).toEqual(mockEntries)
    expect(result).toHaveLength(4)
  })

  it('filters by English name (case-insensitive)', () => {
    const result = filterScoringEntries(mockEntries, 'common', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('common-hand')
  })

  it('filters by English name with different casing', () => {
    const result = filterScoringEntries(mockEntries, 'DRAGON', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('dragon-pung')
  })

  it('filters by Chinese name', () => {
    const result = filterScoringEntries(mockEntries, '平糊', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('common-hand')
  })

  it('filters by translated description', () => {
    const result = filterScoringEntries(mockEntries, 'single suit', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('full-one-suit')
  })

  it('returns empty array when no entries match', () => {
    const result = filterScoringEntries(mockEntries, 'zzzznotfound', mockTranslate)
    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  })

  it('returns multiple matches for partial term', () => {
    const result = filterScoringEntries(mockEntries, 'pung', mockTranslate)
    expect(result).toHaveLength(2)
    const ids = result.map(e => e.id)
    expect(ids).toContain('all-pungs')
    expect(ids).toContain('dragon-pung')
  })

  it('matches partial English name', () => {
    const result = filterScoringEntries(mockEntries, 'full', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('full-one-suit')
  })

  it('works with an empty entries array', () => {
    const result = filterScoringEntries([], 'pung', mockTranslate)
    expect(result).toHaveLength(0)
  })

  it('matches via description when name does not match', () => {
    const result = filterScoringEntries(mockEntries, 'basic winning', mockTranslate)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('common-hand')
  })
})
