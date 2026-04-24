import { createI18n } from 'vue-i18n'
import th from './th.json'
import en from './en.json'

export const STORAGE_KEY = 'mahjong-guide-locale'
export const DEFAULT_LOCALE = 'th'
export const SUPPORTED_LOCALES = ['th', 'en'] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

/**
 * Read stored locale from localStorage.
 * Falls back to 'th' if unavailable, missing, or invalid.
 */
function getStoredLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (SUPPORTED_LOCALES as readonly string[]).includes(stored ?? '') 
      ? (stored as SupportedLocale) 
      : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages: { th, en }
})
