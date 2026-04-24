import { describe, it, expect } from 'vitest'
import en from '../../../src/i18n/en.json'
import th from '../../../src/i18n/th.json'

/**
 * Validates: Requirements 9.2, 9.3
 *
 * 9.2 — English translations for all hand simulation labels, messages, and pattern names
 * 9.3 — Thai translations for all hand simulation labels, messages, and pattern names
 */

/** Recursively collect all leaf key paths from a nested object */
function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

/** Extract keys under a given prefix from a flat key list */
function keysUnderPrefix(keys: string[], prefix: string): string[] {
  return keys.filter((k) => k.startsWith(prefix))
}

describe('i18n key coverage for hand simulation', () => {
  const enKeys = collectKeys(en as Record<string, unknown>)
  const thKeys = collectKeys(th as Record<string, unknown>)

  const handSimulationPrefixes = [
    'nav.handSimulation',
    'sections.handSimulation.',
  ]

  const enHandSimKeys = enKeys.filter((k) =>
    handSimulationPrefixes.some((p) => k === p || k.startsWith(p))
  )

  const thHandSimKeys = thKeys.filter((k) =>
    handSimulationPrefixes.some((p) => k === p || k.startsWith(p))
  )

  it('should have hand simulation keys in en.json', () => {
    expect(enHandSimKeys.length).toBeGreaterThan(0)
  })

  it('should have hand simulation keys in th.json', () => {
    expect(thHandSimKeys.length).toBeGreaterThan(0)
  })

  it('every en.json hand simulation key should exist in th.json', () => {
    const thKeySet = new Set(thKeys)
    const missingInTh = enHandSimKeys.filter((k) => !thKeySet.has(k))
    expect(missingInTh).toEqual([])
  })

  it('every th.json hand simulation key should exist in en.json', () => {
    const enKeySet = new Set(enKeys)
    const missingInEn = thHandSimKeys.filter((k) => !enKeySet.has(k))
    expect(missingInEn).toEqual([])
  })

  it('en.json and th.json should have the same hand simulation keys', () => {
    const enSorted = [...enHandSimKeys].sort()
    const thSorted = [...thHandSimKeys].sort()
    expect(enSorted).toEqual(thSorted)
  })

  it('all hand simulation translation values in en.json should be non-empty strings', () => {
    const enKeySet = new Set(enKeys)
    const emptyKeys = enHandSimKeys.filter((k) => {
      if (!enKeySet.has(k)) return false
      const value = getNestedValue(en as Record<string, unknown>, k)
      return typeof value !== 'string' || value.trim() === ''
    })
    expect(emptyKeys).toEqual([])
  })

  it('all hand simulation translation values in th.json should be non-empty strings', () => {
    const thKeySet = new Set(thKeys)
    const emptyKeys = thHandSimKeys.filter((k) => {
      if (!thKeySet.has(k)) return false
      const value = getNestedValue(th as Record<string, unknown>, k)
      return typeof value !== 'string' || value.trim() === ''
    })
    expect(emptyKeys).toEqual([])
  })
})

/** Get a nested value from an object using a dot-separated key path */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }
  return current
}
