# Implementation Plan: Mahjong HK Rules Guide

## Overview

Build a single-page Vue 3 application that serves as an interactive reference for Hong Kong Mahjong scoring rules. The implementation follows an incremental approach: scaffold the project first, then build the static data layer and i18n, followed by core components from the inside out (leaf components first, then containers), and finally wire in search, navigation, and responsive layout. The app should be functional and browsable as early as possible.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - [x] 1.1 Initialize Vue 3 + Vite + TypeScript project with `create-vue`, install dependencies (`vue-i18n`, `vitest`)
    - Run `npm create vue@latest` (or equivalent) to scaffold the project with TypeScript enabled
    - Install `vue-i18n` and `vitest` as dependencies
    - Verify `npm run dev` and `npx vitest --run` work with the default scaffold
    - _Requirements: N/A (project setup)_

  - [x] 1.2 Configure Vite and Vitest
    - Update `vite.config.ts` with `@vitejs/plugin-vue` and Vitest `test` config (`globals: true`)
    - Remove default scaffold components and assets that won't be used
    - Set up the file structure: `src/components/`, `src/composables/`, `src/data/`, `src/types/`, `src/i18n/`, `src/assets/`, `tests/unit/`
    - _Requirements: N/A (project setup)_

- [x] 2. Create static data module and i18n setup
  - [x] 2.1 Create the scoring data module (`src/data/scoring.ts`) and type definitions (`src/types/scoring.ts`)
    - Define and export `scoringCategories` (4 categories with all `ScoringEntry` items: id, englishName, chineseName, faan, descriptionKey, beginnerExplanationKey, notesKey, isMaxLimit)
    - Define and export `pointTranslationTables` (3 variants: Simplified, Traditional, Canton with rows, minFaan, maxFaan)
    - Define and export `paymentRules` (win-by-discard, win-by-self-pick, dealer modifier, high-risk discarder with multiplier)
    - Define and export `penalties` (9 Pieces, 12 Pieces, Fifth Tile with descriptionKey, beginnerExplanationKey)
    - Define and export `workedExamples` (at least 1 per point table variant + 1 per payment rule, with steps array)
    - All text content stored as i18n keys (e.g., `'scoring.allInTriplets.description'`)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 5.2, 10.1, 12.1, 12.2, 12.3, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 2.2 Create i18n configuration and translation files
    - Create `src/i18n/index.ts` with `createI18n` setup, `legacy: false`, localStorage persistence via `getStoredLocale()`, fallback locale `'en'`
    - Create `src/i18n/th.json` with all Thai translations (nav labels, search text, scoring descriptions, beginner explanations, worked example steps, payment rules, penalties)
    - Create `src/i18n/en.json` with all English translations matching the same key structure
    - Mahjong terminology (faan, Pong, Kong, Chow, Chinese names) must appear literally in both locale files — not translated
    - Export `STORAGE_KEY`, `DEFAULT_LOCALE`, `SUPPORTED_LOCALES` for use by composables
    - _Requirements: 11.1, 11.2, 11.5, 11.6, 11.7, 11.8, 11.9_

  - [x] 2.3 Create app entry point (`src/main.ts`)
    - Import `createApp`, `App.vue`, `i18n` plugin, and `main.css`
    - Install `i18n` plugin and mount to `#app`
    - Update `index.html` with proper `<meta>` tags and `<div id="app">`
    - _Requirements: N/A (wiring)_

- [x] 3. Implement leaf-level display components
  - [x] 3.1 Create `BeginnerExplanation.vue`
    - Accept `textKey` prop (String, required)
    - Render "What this means" label via `$t('beginner.label')` and explanation text via `$t(textKey)`
    - Style as visually distinct box with left border accent
    - Use `<aside>` element for semantic HTML
    - _Requirements: 12.4, 12.6, 9.1_

  - [x] 3.2 Create `WorkedExample.vue`
    - Accept `example` prop (Object, required) with `titleKey`, `contextKey`, `steps` array
    - Render title, context, and numbered `<ol>` of steps with description and optional calculation display
    - Style as highlighted card distinct from formal rule text
    - _Requirements: 13.3, 13.5, 13.6_

  - [x] 3.3 Create `ScoringEntry.vue`
    - Accept `entry` prop (Object, required)
    - Display English name, Chinese name in parentheses, faan badge, description via `$t(entry.descriptionKey)`
    - Conditionally render notes via `v-if="entry.notesKey"`
    - Include `BeginnerExplanation` component with `entry.beginnerExplanationKey`
    - Visually distinguish entries with `isMaxLimit === true` (accent border + highlight background)
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 10.1, 12.1, 12.4, 12.5_

  - [x] 3.4 Create `PointTable.vue`
    - Accept `table` prop (Object, required) with `titleKey`, `minFaan`, `maxFaan`, `rows`
    - Render an HTML `<table>` with faan range and points columns
    - Display minimum faan requirement and maximum faan cap
    - Use semantic `<table>`, `<thead>`, `<tbody>` elements
    - _Requirements: 3.2, 3.3, 3.4, 9.1_

  - [x] 3.5 Create `PaymentRuleCard.vue`
    - Accept `rule` prop (Object, required) with `titleKey`, `descriptionKey`, `beginnerExplanationKey`, `multiplier`
    - Display rule title, description, multiplier badge (if present), and `BeginnerExplanation`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 12.2, 12.4_

  - [x] 3.6 Create `PenaltyCard.vue`
    - Accept `penalty` prop (Object, required) with `titleKey`, `descriptionKey`, `beginnerExplanationKey`
    - Display penalty title, description, and `BeginnerExplanation`
    - _Requirements: 5.1, 5.2, 5.3, 12.3, 12.4_

  - [x] 3.7 Create `FaanLimitNote.vue`
    - Display a note explaining that 13 faan is the absolute maximum in Hong Kong Mahjong scoring
    - Use `$t('faan.limit.note')` for the text content
    - _Requirements: 10.2_

- [x] 4. Implement section container components
  - [x] 4.1 Create `ScoringCategories.vue`
    - Accept `categories` prop (Array, required)
    - Render each category with its `titleKey` heading and `v-for` over `ScoringEntry` components
    - Use `<section>` with heading hierarchy for accessibility
    - _Requirements: 1.1, 1.2, 9.1_

  - [x] 4.2 Create `PointTranslationTables.vue`
    - Accept `tables` prop (Array, required) and `examples` prop (Array, required)
    - Render tabbed interface or stacked layout for three point table variants
    - Include related `WorkedExample` components filtered by `relatedRuleId`
    - _Requirements: 3.1, 3.2, 13.1_

  - [x] 4.3 Create `PaymentRules.vue`
    - Accept `rules` prop (Array, required) and `examples` prop (Array, required)
    - Render `PaymentRuleCard` for each rule via `v-for`
    - Include related `WorkedExample` components filtered by `relatedRuleId`
    - _Requirements: 4.1, 13.2_

  - [x] 4.4 Create `Penalties.vue`
    - Accept `penalties` prop (Array, required)
    - Render `PenaltyCard` for each penalty via `v-for`
    - _Requirements: 5.1_

- [x] 5. Checkpoint - Verify static rendering
  - Ensure all section components render correctly with static data and i18n translations.
  - Run `npm run build` to verify no build errors.
  - Ensure all tests pass, ask the user if questions arise.

- [-] 6. Implement composables and interactive features
  - [x] 6.1 Create `useSearch` composable (`src/composables/useSearch.ts`)
    - Implement `flattenEntries(categories)` — flattens all categories into a single array with `categoryId` annotation
    - Implement `filterScoringEntries(entries, searchTerm, translateFn)` — case-insensitive substring match on `englishName`, `chineseName`, and translated description
    - Implement `useSearch(searchTerm, categories, t)` — returns `filteredEntries`, `hasResults`, `isSearching` as computed refs
    - Empty/whitespace-only search returns all entries (identity behavior)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 6.2 Write property test: Search results contain the search term
    - **Property 1: Search results contain the search term**
    - Install `fast-check` as a dev dependency
    - For any non-empty search term and any set of ScoringEntry items, every entry returned by `filterScoringEntries` SHALL contain the search term (case-insensitive) in at least one of: englishName, chineseName, or the translated description
    - **Validates: Requirements 6.2**

  - [ ]* 6.3 Write property test: Empty search is identity
    - **Property 2: Empty search is identity**
    - For any set of ScoringEntry items, calling `filterScoringEntries` with an empty string (or whitespace-only string) SHALL return all entries unchanged
    - **Validates: Requirements 6.5**

  - [ ]* 6.4 Write property test: Search results include category context
    - **Property 3: Search results include category context**
    - For any non-empty search result returned by `filterScoringEntries` after flattening via `flattenEntries`, each result SHALL include a `categoryId` field that matches the ID of the ScoringCategory the entry belongs to
    - **Validates: Requirements 6.3**

  - [ ]* 6.5 Write unit tests for search filtering
    - Test filter by English name (case-insensitive)
    - Test filter by Chinese name
    - Test filter by translated description
    - Test no match returns empty array
    - Test empty/whitespace search returns all entries
    - Test `flattenEntries` preserves `categoryId` and total count
    - Place tests in `tests/unit/search.test.ts`
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 6.6 Create `useNavigation` composable (`src/composables/useNavigation.ts`)
    - Implement `scrollToSection(sectionId)` using `document.getElementById` + `scrollIntoView({ behavior: 'smooth' })`
    - Track `activeSection` ref via `IntersectionObserver` with `rootMargin: '-20% 0px -60% 0px'`
    - Guard against missing `IntersectionObserver` support
    - Clean up observer on `onUnmounted`
    - Export `SECTIONS` array for navigation items
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.7 Create `useLocale` composable (`src/composables/useLocale.ts`)
    - Implement `toggleLocale()` — switches between `'th'` and `'en'`, persists to localStorage
    - Wrap `localStorage.setItem` in try-catch for environments where it's unavailable
    - Return `currentLocale` ref and `toggleLocale` function
    - _Requirements: 11.3, 11.7, 11.8, 11.9_

- [x] 7. Implement navigation and search UI components
  - [x] 7.1 Create `AppNavigation.vue`
    - Accept `activeSection` prop (String, required), emit `navigate` event
    - Render section links with `aria-current` for active section
    - Include language switcher button using `useLocale` composable
    - Display opposite locale label (show "EN" when Thai is active, "TH" when English is active)
    - Add `aria-label` for navigation landmark
    - Style as sticky sidebar on desktop (≥768px), horizontal scrollable bar on mobile (<768px)
    - _Requirements: 7.1, 7.2, 7.3, 9.2, 9.4, 11.3, 11.4_

  - [x] 7.2 Create `AppSearch.vue`
    - Use `defineModel` for two-way binding with parent
    - Render `<input type="search">` with `$t('search.placeholder')` and `$t('search.ariaLabel')`
    - _Requirements: 6.1, 9.4_

- [x] 8. Wire everything together in App.vue
  - [x] 8.1 Implement `App.vue` root component
    - Import all data from `src/data/scoring.ts`
    - Use `useSearch` and `useNavigation` composables
    - Render `AppNavigation` with `activeSection` prop and `@navigate` handler
    - Render `AppSearch` with `v-model` bound to `searchTerm`
    - Conditionally render search results (filtered `ScoringEntry` list) or full section layout based on `isSearching`
    - Show "no results" message when `isSearching && !hasResults`
    - Render `ScoringCategories`, `FaanLimitNote`, `PointTranslationTables`, `PaymentRules`, `Penalties` when not searching
    - Pass section `id` attributes for navigation scroll targets
    - _Requirements: 1.1, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2_

- [x] 9. Implement global styles and responsive layout
  - [x] 9.1 Create `src/assets/main.css` with global styles
    - Define CSS custom properties for colors (primary, border, accent, faan-bg, beginner-bg, example-bg, calc-bg, highlight-bg)
    - Add CSS reset and base typography
    - Ensure minimum 4.5:1 contrast ratio for all text
    - Style `.app-layout` as flex container (sidebar + content)
    - Add responsive breakpoint at 768px: single-column on mobile, sidebar layout on desktop
    - Ensure readable layout from 320px to 1920px viewport widths
    - Set `max-width: 960px` on content area
    - _Requirements: 8.1, 8.2, 8.3, 9.3_

- [x] 10. Final checkpoint - Verify complete application
  - Run `npx vitest --run` to ensure all tests pass.
  - Run `npm run build` to verify production build succeeds.
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The app is functional after task 5 (static rendering) — search and navigation add interactivity on top
- All text content uses i18n keys so both Thai and English work from the start
