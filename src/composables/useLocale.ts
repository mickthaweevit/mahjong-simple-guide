// src/composables/useLocale.ts
import { useI18n } from 'vue-i18n'
import { STORAGE_KEY, type SupportedLocale } from '../i18n/index'
import type { Ref } from 'vue'

export function useLocale(): {
  currentLocale: Ref<string>
  toggleLocale: () => void
} {
  const { locale } = useI18n()

  function toggleLocale(): void {
    const newLocale: SupportedLocale = locale.value === 'th' ? 'en' : 'th'
    locale.value = newLocale
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // localStorage unavailable — locale still changes in-memory
    }
  }

  return { currentLocale: locale, toggleLocale }
}
