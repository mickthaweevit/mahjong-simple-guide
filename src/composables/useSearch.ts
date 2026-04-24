import { computed, type Ref, type ComputedRef } from 'vue'
import type { ScoringEntry } from '../types/scoring'

/**
 * Filter scoring entries by search term.
 * Matches against englishName, chineseName, and the translated description.
 */
export function filterScoringEntries(
  entries: ScoringEntry[],
  searchTerm: string,
  translateFn: (key: string) => string
): ScoringEntry[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return entries

  return entries.filter(entry => {
    const name = entry.englishName.toLowerCase()
    const chinese = entry.chineseName.toLowerCase()
    const desc = translateFn(entry.descriptionKey).toLowerCase()
    return name.includes(term) || chinese.includes(term) || desc.includes(term)
  })
}

/**
 * Composable for reactive search over scoring entries.
 */
export function useSearch(
  searchTerm: Ref<string>,
  entries: ScoringEntry[],
  t: (key: string) => string
): {
  filteredEntries: ComputedRef<ScoringEntry[]>
  hasResults: ComputedRef<boolean>
  isSearching: ComputedRef<boolean>
} {
  const isSearching = computed(() => searchTerm.value.trim().length > 0)

  const filteredEntries = computed(() =>
    filterScoringEntries(entries, searchTerm.value, t)
  )

  const hasResults = computed(() => filteredEntries.value.length > 0)

  return { filteredEntries, hasResults, isSearching }
}
