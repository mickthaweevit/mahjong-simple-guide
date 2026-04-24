# Implementation Plan: Mahjong Guide Redesign

## Overview

Restructure the Mahjong HK Rules Guide from a 4-category layout to a 7-section learning-progression layout. Implementation proceeds bottom-up: types first, then data, then i18n, then components, then wiring in App.vue, and finally legacy cleanup. Each step builds on the previous one so the app compiles incrementally.

## Tasks

- [x] 1. Update type definitions
  - [x] 1.1 Update `src/types/scoring.ts` — remove `ScoringCategory` and `Penalty` interfaces, add `BaoTrigger` interface, add optional `stackable` field to `ScoringEntry`
    - Remove the `ScoringCategory` interface (entries will be a flat array)
    - Remove the `Penalty` interface (penalty content moves to i18n)
    - Add `BaoTrigger` interface with `id`, `titleKey`, `descriptionKey` fields
    - Add `stackable?: boolean` to `ScoringEntry`
    - Keep `PointTranslationRow`, `PointTranslationTable`, `PaymentRule`, `WorkedExampleStep`, `WorkedExample` unchanged
    - _Requirements: 3.1, 3.5, 6.2, 13.5_

- [x] 2. Rewrite data module
  - [x] 2.1 Rewrite `src/data/scoring.ts` — replace `scoringCategories` with flat `scoringEntries` array, remove `penalties`, add `baoTriggers`, add new worked examples
    - Export `scoringEntries: ScoringEntry[]` as a flat array with all hand types in display order (Common Hand, All Pungs, Mixed One Suit, Full One Suit, Dragon Pung with `stackable: true`, Small Three Dragons, Great Three Dragons, All Green)
    - Remove the `noFlowers` entry (house rules: no bonus for zero flowers)
    - Remove the `penalties` export entirely
    - Add `baoTriggers: BaoTrigger[]` export with 4 trigger conditions (Full One Suit, Great Three Dragons, Great Four Winds, All Pungs)
    - Add a Biting penalty worked example (`example-biting`) with steps showing Season/Flower number match and extra payment
    - Add a Bao penalty worked example (`example-bao`) with steps showing full liability calculation
    - Update the Win by Discard worked example to match house rules (Shooter pays double, other two pay standard)
    - Remove the `dealerModifier` from `paymentRules` (becomes a note in i18n)
    - Keep `pointTranslationTables` and remaining `paymentRules` (Self-Draw, Win by Discard)
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.5, 5.3, 5.4, 6.1, 6.2, 6.4, 12.1, 13.1–13.7_

- [x] 3. Checkpoint — Verify types and data compile
  - Run `npm run type-check` to ensure type definitions and data module compile without errors. Ask the user if questions arise.

- [x] 4. Update i18n keys
  - [x] 4.1 Update `src/i18n/en.json` — add `sections.*` namespace with all 7 section headings and new content keys, update `nav.*` keys for 7 sections, add Biting/Bao example keys, remove unused penalty/category keys
    - Add `sections.winningStructure.*` keys: section heading, Mok explanation, Standard Hand description + beginner, Seven Pairs description + beginner, Thirteen Orphans description + beginner
    - Add `sections.handScoring.*` keys: section heading, Faan Limit note (absorb FaanLimitNote content)
    - Add `sections.flowersSeasons.*` keys: section heading, flower scoring explanation + beginner, Biting rule explanation + beginner, no-flower-bonus note
    - Add `sections.payout.*` keys: section heading, formula explanation, dealer modifier note + beginner
    - Add `sections.baoPenalty.*` keys: section heading, Bao concept explanation + beginner, trigger descriptions
    - Add `sections.specialRules.*` keys: section heading, Kong description + beginner, Sacred Discard description + beginner
    - Add `sections.gameRotation.*` keys: section heading, round structure + beginner, dealer rotation + beginner
    - Update `nav.*` keys: replace 4 section labels with 7 new labels (winningStructure, handScoring, flowersSeasons, payout, baoPenalty, specialRules, gameRotation)
    - Add worked example keys for Biting and Bao examples
    - Remove unused keys: `scoring.byHandType.title`, `scoring.byHonorTiles.title`, `scoring.byBonusTiles.title`, `scoring.noFlowers.*`, `penalty.*` namespace, `example.dealerModifier.*`
    - _Requirements: 1.1, 2.2–2.5, 3.4, 4.1–4.4, 5.1–5.7, 6.1–6.4, 7.1–7.3, 10.4–10.5, 11.1–11.4, 13.1–13.7_

  - [x] 4.2 Update `src/i18n/th.json` — mirror all key changes from `en.json` with Thai translations
    - Add all `sections.*` keys with Thai translations
    - Update `nav.*` keys with Thai labels
    - Add Biting and Bao worked example keys in Thai
    - Remove the same unused keys as in `en.json`
    - _Requirements: 10.1, 10.4–10.5_

- [x] 5. Checkpoint — Verify i18n and build
  - Run `npm run build` to ensure the app compiles with updated types, data, and i18n. Ask the user if questions arise.

- [x] 6. Create section components
  - [x] 6.1 Create `src/components/SectionWinningStructure.vue` — render Mok concept, Standard Hand (4 Sets + 1 Pair), and Special Hands (Seven Pairs, Thirteen Orphans) with BeginnerExplanation blocks for each concept
    - Use `sections.winningStructure.*` i18n keys
    - Import and use `BeginnerExplanation` component for each hand structure
    - Use semantic HTML: `<section>` with `id="winning-structure"`, `<h2>` heading
    - _Requirements: 1.1, 1.4, 2.1–2.5, 11.1–11.4, 14.1_

  - [x] 6.2 Create `src/components/SectionHandScoring.vue` — render all scoring entries using `ScoringEntry` component, include Faan Limit note as inline aside
    - Import `scoringEntries` from data module
    - Render each entry with `ScoringEntry` component
    - Include Faan Limit note at the top (absorbing `FaanLimitNote.vue` content)
    - Use `<section>` with `id="hand-scoring"`, `<h2>` heading
    - _Requirements: 1.1, 3.1–3.5, 11.1, 13.1, 14.1_

  - [x] 6.3 Create `src/components/SectionFlowersSeasons.vue` — render Flower/Season scoring, Biting rule with BeginnerExplanation, no-flower-bonus note, and Biting worked example
    - Use `sections.flowersSeasons.*` i18n keys
    - Import and use `BeginnerExplanation` for the Biting rule
    - Import and use `WorkedExample` for the Biting penalty calculation
    - Import the Biting worked example from data module
    - Use `<section>` with `id="flowers-seasons"`, `<h2>` heading
    - _Requirements: 1.1, 4.1–4.5, 11.1–11.4, 12.1, 13.6, 14.1_

  - [x] 6.4 Create `src/components/SectionPayout.vue` — render payout formula, Fan-to-price table (PointTable), Self-Draw and Win by Discard rules (PaymentRuleCard), dealer modifier note, and worked examples
    - Import `pointTranslationTables`, `paymentRules`, `workedExamples` from data module
    - Reuse `PointTable`, `PaymentRuleCard`, `WorkedExample` components
    - Include dealer modifier as an i18n-driven note with BeginnerExplanation
    - Use `<section>` with `id="payout"`, `<h2>` heading
    - _Requirements: 1.1, 5.1–5.7, 11.1, 12.1–12.4, 13.2–13.3, 14.1_

  - [x] 6.5 Create `src/components/SectionBaoPenalty.vue` — render Bao concept, list 4 trigger conditions, include BeginnerExplanation and Bao worked example
    - Import `baoTriggers` from data module
    - Import and use `BeginnerExplanation` and `WorkedExample` components
    - Import the Bao worked example from data module
    - Use `<section>` with `id="bao-penalty"`, `<h2>` heading
    - _Requirements: 1.1, 6.1–6.4, 11.1–11.4, 12.1–12.2, 13.5, 14.1_

  - [x] 6.6 Create `src/components/SectionSpecialRules.vue` — render Mok (minimum Fan), Kong, and Sacred Discard rules with descriptions and BeginnerExplanation blocks
    - Use `sections.specialRules.*` i18n keys
    - Import and use `BeginnerExplanation` for each rule
    - Use `<section>` with `id="special-rules"`, `<h2>` heading
    - _Requirements: 1.1, 11.1–11.4, 14.1_

  - [x] 6.7 Create `src/components/SectionGameRotation.vue` — render 4-round structure and dealer rotation rules with BeginnerExplanation
    - Use `sections.gameRotation.*` i18n keys
    - Import and use `BeginnerExplanation` component
    - Use `<section>` with `id="game-rotation"`, `<h2>` heading
    - _Requirements: 1.1, 7.1–7.3, 11.1–11.4, 14.1_

- [x] 7. Update navigation and composables
  - [x] 7.1 Update `src/composables/useNavigation.ts` — change `SECTIONS` array from 4 old IDs to 7 new section IDs
    - Replace `['scoring', 'point-tables', 'payment-rules', 'penalties']` with `['winning-structure', 'hand-scoring', 'flowers-seasons', 'payout', 'bao-penalty', 'special-rules', 'game-rotation']`
    - IntersectionObserver logic and `scrollToSection` remain unchanged
    - _Requirements: 8.1–8.3_

  - [x] 7.2 Update `src/components/AppNavigation.vue` — update sections array from 4 items to 7 items with new IDs and `nav.*` label keys
    - Replace the 4-item `sections` array with 7 items matching new section IDs and updated `nav.*` i18n keys
    - Keep Language Switcher, mobile horizontal bar, and desktop sticky sidebar behavior unchanged
    - _Requirements: 8.1–8.5, 9.2–9.3, 14.4_

  - [x] 7.3 Update `src/composables/useSearch.ts` — update to work with flat `scoringEntries` array instead of `ScoringCategory[]`
    - Remove `FlatScoringEntry` interface (no longer needed since entries are already flat)
    - Remove `flattenEntries` function (no longer needed)
    - Update `filterScoringEntries` to accept `ScoringEntry[]` directly
    - Update `useSearch` composable to accept `ScoringEntry[]` instead of `ScoringCategory[]`
    - _Requirements: 15.1–15.5_

- [x] 8. Rewrite App.vue and update CSS
  - [x] 8.1 Rewrite `src/App.vue` — replace 4-section layout with 7 section components, update imports, update search to use flat `scoringEntries`, change max-width to 720px
    - Import all 7 new section components
    - Import `scoringEntries` instead of `scoringCategories`
    - Pass `scoringEntries` to `useSearch` instead of `scoringCategories`
    - Render 7 section components in fixed order in the non-search template
    - Remove imports of `ScoringCategories`, `PointTranslationTables`, `Penalties`, `FaanLimitNote`
    - Update `.content-area` max-width from `960px` to `720px` in scoped styles
    - _Requirements: 1.1–1.4, 8.1, 9.1–9.3, 15.1–15.5_

  - [x] 8.2 Update `src/assets/main.css` — change `.content-area` max-width from 960px to 720px, add section separator styles
    - Update `.content-area` max-width to `720px`
    - Add section separator styles (bottom border or margin between sections)
    - Add standardized section heading styles
    - Keep all existing color variables and contrast ratios
    - _Requirements: 1.2–1.3, 9.1, 14.3_

- [x] 9. Checkpoint — Verify full build with new layout
  - Run `npm run build` to ensure the complete 7-section layout compiles. Ask the user if questions arise.

- [x] 10. Update search tests
  - [x] 10.1 Update `tests/unit/search.test.ts` — rewrite tests to validate search against flat `ScoringEntry[]` array instead of `ScoringCategory[]`
    - Test `filterScoringEntries` with flat entry array
    - Test filtering by English name, Chinese name, and description
    - Test empty search term returns all entries
    - Test no-match returns empty array
    - _Requirements: 15.1–15.5_

- [x] 11. Legacy cleanup
  - [x] 11.1 Delete unused component files: `src/components/ScoringCategories.vue`, `src/components/PointTranslationTables.vue`, `src/components/Penalties.vue`, `src/components/PenaltyCard.vue`, `src/components/FaanLimitNote.vue`
    - Verify none of these are imported anywhere in the new code before deleting
    - _Requirements: 16.2_

  - [x] 11.2 Remove unused i18n keys from `en.json` and `th.json` — remove any remaining old keys not referenced by new components or data
    - Audit both JSON files for orphaned keys
    - _Requirements: 16.3_

  - [x] 11.3 Remove unused type exports from `src/types/scoring.ts` — verify `ScoringCategory` and `Penalty` are fully removed and no stale imports reference them
    - _Requirements: 16.4_

- [x] 12. Final checkpoint — Verify clean build and tests
  - Run `npm run build` and `npm run test` to ensure zero errors after all changes and deletions. Ask the user if questions arise.
  - _Requirements: 16.5_

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The project uses Vue 3 + Vite + TypeScript + vue-i18n — all code examples use TypeScript
- Components reused without changes: `BeginnerExplanation.vue`, `WorkedExample.vue`, `ScoringEntry.vue`, `PaymentRuleCard.vue`, `PointTable.vue`
- The search overlay mode is preserved — when searching, section components are hidden and filtered results are shown
