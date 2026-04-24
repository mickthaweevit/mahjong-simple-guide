# Implementation Plan: Hand Simulation

## Overview

Build an interactive Mahjong hand builder and Fan calculator as a new section in the existing Vue 3 + TypeScript app. The implementation follows a bottom-up approach: pure TypeScript engine first (independently testable), then the Vue composable layer, then UI components, and finally integration into the app shell. Property-based tests use fast-check with vitest.

## Tasks

- [x] 1. Set up engine layer foundation and types
  - [x] 1.1 Create `src/engine/types.ts` with all engine interfaces
    - Define `WindTile`, `TileGroup`, `HandGrouping`, `MatchedPattern`, and `ScoreResult` types
    - Import `TileCode` from `src/data/tiles`
    - Define `TileFrequencyMap` type alias and `toFrequencyMap` utility function
    - _Requirements: 5.1, 5.3, 5.6_

  - [x] 1.2 Install fast-check as a dev dependency
    - Run `npm install --save-dev fast-check` (pinned version)
    - _Requirements: Testing infrastructure_

  - [x] 1.3 Create `src/engine/handGrouper.ts` — tile grouping algorithm
    - Implement `toFrequencyMap(tiles): TileFrequencyMap`
    - Implement `findAllGroupings(tiles: TileCode[]): HandGrouping[]` using recursive set extraction
    - Implement `isSevenPairs(tiles: TileCode[]): boolean` check
    - Implement `isThirteenOrphans(tiles: TileCode[]): boolean` check
    - Handle special hands (Seven Pairs, Thirteen Orphans) before standard grouping
    - _Requirements: 5.6, 5.7_

  - [x] 1.4 Write unit tests for `handGrouper`
    - Test known hands with exactly one valid grouping
    - Test hands with multiple valid groupings
    - Test Seven Pairs detection
    - Test Thirteen Orphans detection
    - Test 14 tiles that form no valid hand
    - Place in `tests/unit/engine/handGrouper.test.ts`
    - _Requirements: 5.6, 5.7_

- [x] 2. Implement pattern matchers
  - [x] 2.1 Create `src/engine/patternMatchers.ts` with all pattern detection functions
    - Implement `isCommonHand(grouping): boolean`
    - Implement `isAllPungs(grouping): boolean`
    - Implement `isMixedOneSuit(tiles): boolean`
    - Implement `isFullOneSuit(tiles): boolean`
    - Implement `countDragonPungs(grouping): number`
    - Implement `isSmallThreeDragons(grouping): boolean`
    - Implement `isGreatThreeDragons(grouping): boolean`
    - Implement `isGreatFourWinds(grouping): boolean`
    - Implement `isAllGreen(tiles): boolean`
    - Reference `scoringEntries` IDs from `src/data/scoring.ts` for matched pattern metadata
    - _Requirements: 5.3_

  - [x] 2.2 Write unit tests for pattern matchers
    - Test each matcher with a known matching hand and a known non-matching hand
    - Test Dragon Pung counting with 0, 1, 2, and 3 dragon pungs
    - Test Mixed One Suit vs Full One Suit distinction
    - Test All Green with valid and invalid tile combinations
    - Place in `tests/unit/engine/patternMatchers.test.ts`
    - _Requirements: 5.3_

- [-] 3. Implement Fan calculator
  - [x] 3.1 Create `src/engine/fanCalculator.ts` — orchestrator
    - Implement `calculateWindFan(grouping, roundWind, seatWind): number`
    - Implement `calculatePayout(totalFan): number` returning `2^totalFan`
    - Implement `calculateScore(tiles, options): ScoreResult` that:
      - Calls `findAllGroupings` to get all valid partitions
      - Runs pattern matchers on each grouping
      - Computes wind bonus, self-draw bonus, bonus tile count
      - Selects the grouping with the highest total Fan
      - Caps total Fan at 8
      - Returns complete `ScoreResult` with `isValid`, `handType`, `matchedPatterns`, `totalFan`, `payoutPerPerson`
    - Handle invalid hands (no valid grouping) by returning `isValid: false`
    - Handle incomplete hands (< 14 tiles) — caller passes null
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.3, 6.4_

  - [x] 3.2 Write property test: Optimal grouping maximizes Fan
    - **Property 8: Optimal grouping maximizes Fan**
    - Generate valid 14-tile hands, verify returned Fan ≥ Fan of every other valid grouping
    - **Validates: Requirements 5.6, 5.3, 5.4**

  - [x] 3.3 Write property test: Invalid hand detection
    - **Property 9: Invalid hand detection**
    - Generate 14-tile hands that cannot form valid structures, verify `isValid === false` and `handType === 'invalid'`
    - **Validates: Requirements 5.7**

  - [x] 3.4 Write property test: Total Fan computation with cap
    - **Property 10: Total Fan computation with cap**
    - For any valid hand, verify `totalFan === min(8, patternFanSum + bonusFan + windFan + selfDrawFan)` and `totalFan <= 8`
    - **Validates: Requirements 6.3, 5.5**

  - [x] 3.5 Write property test: Payout formula
    - **Property 11: Payout formula**
    - For any `totalFan` in [0, 8], verify `payoutPerPerson === 2^totalFan`
    - **Validates: Requirements 6.4**

  - [x] 3.6 Write unit tests for Fan calculator
    - Test known hands: Common Hand (1 Fan), All Pungs (3 Fan), Mixed One Suit (3 Fan), Full One Suit (7 Fan)
    - Test limit hands: Great Three Dragons (8 Fan), Thirteen Orphans (8 Fan)
    - Test pattern stacking: All Pungs + Dragon Pung
    - Test Fan cap: hand exceeding 8 Fan capped at 8
    - Test wind bonus: round wind pung, seat wind pung, same wind double bonus
    - Test self-draw bonus: +1 when enabled, 0 when disabled
    - Test 0 Fan hand (valid structure, no patterns, no bonuses)
    - Place in `tests/unit/engine/fanCalculator.test.ts`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 4.4, 4.5, 4.6, 3.2, 3.3_

- [x] 4. Checkpoint — Verify engine layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement useHandSimulator composable
  - [x] 5.1 Create `src/composables/useHandSimulator.ts`
    - Manage reactive state: `handTiles` (TileCode[]), `bonusTiles` (Set<string>), `roundWind` (WindTile), `seatWind` (WindTile), `selfDraw` (boolean)
    - Compute `availableCounts: Record<TileCode, number>` — 4 minus count of each tile in hand
    - Compute `isHandFull: boolean` — true when handTiles.length === 14
    - Compute `scoreResult: ScoreResult | null` — null when < 14 tiles, otherwise call `calculateScore`
    - Implement `addTile(tile)` — reject if hand full or tile at 4 copies
    - Implement `removeTile(index)` — splice tile at index
    - Implement `toggleBonus(id)` — add/remove from bonusTiles set
    - Implement `clearHand()` — reset all state to defaults (empty hand, empty bonuses, selfDraw false, winds to 'f1')
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.7, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Write property test: Tile addition preserves hand invariants
    - **Property 1: Tile addition preserves hand invariants**
    - For any hand < 14 tiles and any TileCode with < 4 copies, adding increases length by 1, tile appears in hand, no tile exceeds 4 copies
    - **Validates: Requirements 1.2, 1.5**

  - [x] 5.3 Write property test: Hand fullness reflects tile count
    - **Property 2: Hand fullness reflects tile count**
    - For any hand of size 0–13, `isHandFull` is false; at 14 tiles, `isHandFull` is true and additions are rejected
    - **Validates: Requirements 1.3, 1.4**

  - [x] 5.4 Write property test: Tile removal decreases hand size
    - **Property 3: Tile removal decreases hand size**
    - For any non-empty hand and valid index, removing decreases length by 1 with correct remaining tiles
    - **Validates: Requirements 1.7**

  - [x] 5.5 Write property test: Bonus tile toggle round-trip
    - **Property 4: Bonus tile toggle round-trip**
    - Toggling a bonus tile on then off returns to original state
    - **Validates: Requirements 2.2, 2.3**

  - [x] 5.6 Write property test: Bonus Fan equals bonus tile count
    - **Property 5: Bonus Fan equals bonus tile count**
    - For any set of selected bonus tiles (0–8), `bonusFan` equals the count
    - **Validates: Requirements 2.5**

  - [x] 5.7 Write property test: Self-draw Fan is conditional
    - **Property 6: Self-draw Fan is conditional**
    - For any valid 14-tile hand, selfDraw true → selfDrawFan is 1, false → 0
    - **Validates: Requirements 3.2, 3.3**

  - [x] 5.8 Write property test: Wind pung bonus
    - **Property 7: Wind pung bonus**
    - For any wind tile and grouping with a pung of that wind, round wind → +1, seat wind → +1, same wind both → +2
    - **Validates: Requirements 4.4, 4.5, 4.6**

  - [x] 5.9 Write property test: Clear resets all state to defaults
    - **Property 12: Clear resets all state to defaults**
    - For any simulator state, `clearHand` results in empty hand, empty bonuses, selfDraw false, winds 'f1'
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

  - [x] 5.10 Write unit tests for useHandSimulator
    - Test initial state defaults (empty hand, no bonuses, selfDraw false, winds East)
    - Test addTile rejects when hand is full (14 tiles)
    - Test addTile rejects when tile has 4 copies
    - Test removeTile at various indices
    - Test availableCounts computation
    - Place in `tests/unit/composables/useHandSimulator.test.ts`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.7, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Checkpoint — Verify composable layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Build UI components
  - [x] 7.1 Create `src/components/TilePicker.vue`
    - Display all 34 unique tiles organized by suit rows: Characters, Dots, Bamboo, Winds, Dragons
    - Each tile is a `<button>` showing the tile image via `getTileImageUrl` and a small remaining-count badge
    - Disable tile button when `availableCounts[tile] === 0` or `disabled` prop is true
    - Visually indicate unavailable tiles (opacity/greyed out) per Requirement 1.6
    - Emit `select` event with the TileCode when clicked
    - Use `getTileName` for accessible `alt` text on tile images
    - Responsive tile sizing: 46px desktop, 36px mobile (matching TileIllustration)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 10.3_

  - [x] 7.2 Create `src/components/HandDisplay.vue`
    - Show tiles currently in the hand as clickable images
    - Each tile click emits `remove` with the tile index
    - Use `getTileImageUrl` and `getTileName` for images and alt text
    - Show placeholder message when hand is empty
    - Responsive tile sizing matching TilePicker
    - _Requirements: 1.7, 1.8, 10.3_

  - [x] 7.3 Create `src/components/BonusTileSelector.vue`
    - Display 8 toggle buttons: Flower #1–#4 and Season #1–#4
    - Each button shows selected/unselected state
    - Emit `toggle` with the bonus tile ID on click
    - Use i18n for labels
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 7.4 Create `src/components/WindSelector.vue`
    - Two radio button groups: Round Wind and Seat Wind
    - Options: East, South, West, North (mapped to f1–f4)
    - Use `v-model` pattern with `update:roundWind` and `update:seatWind` emits
    - Default both to East (f1)
    - Use i18n for wind labels
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 7.5 Create `src/components/ScoreDisplay.vue`
    - Show "hand incomplete" message when `result` is null
    - Show "invalid hand" message when `result.isValid` is false
    - When valid: list each matched pattern with its Fan value
    - Show bonus Fan (flowers/seasons), wind Fan, self-draw Fan as separate line items
    - Show total Fan (capped at 8) and payout per person (2^n)
    - Show payout breakdown: self-draw (all 3 pay) vs discard (shooter pays double, other 2 pay standard)
    - Use i18n for all labels and pattern names
    - _Requirements: 5.1, 5.2, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 7.6 Create `src/components/HandSimulator.vue` — container component
    - Use `useHandSimulator` composable for all state and actions
    - Compose TilePicker, HandDisplay, BonusTileSelector, WindSelector, ScoreDisplay
    - Add self-draw checkbox with i18n label
    - Add "Clear Hand" button with i18n label
    - Wrap in `<section id="hand-simulation">` with heading
    - Follow existing section styling patterns (consistent with SectionHandScoring, SectionPayout, etc.)
    - _Requirements: 1.1, 3.1, 7.1, 8.3_

- [x] 8. Integrate into app shell
  - [x] 8.1 Add i18n keys for hand simulation
    - Add `sections.handSimulation` keys to `src/i18n/en.json` (heading, labels, messages, pattern names, wind names, bonus tile names, incomplete/invalid messages, payout labels)
    - Add corresponding Thai translations to `src/i18n/th.json`
    - Add `nav.handSimulation` key to both locale files
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 8.2 Add HandSimulator section to `src/App.vue`
    - Import and render `HandSimulator.vue` as a new section alongside existing sections
    - Place it after the existing sections (or in a logical position in the learning progression)
    - _Requirements: 8.3_

  - [x] 8.3 Add navigation entry in `src/components/AppNavigation.vue`
    - Add `{ id: 'hand-simulation', labelKey: 'nav.handSimulation' }` to the sections array
    - Update `src/composables/useNavigation.ts` SECTIONS array to include `'hand-simulation'`
    - _Requirements: 8.1, 8.2_

- [x] 9. Responsive styling
  - [x] 9.1 Add responsive layout styles to HandSimulator and sub-components
    - Desktop (≥768px): tile picker and hand area use available horizontal space
    - Mobile (<768px): stack tile picker and hand area vertically
    - Tile images: 46px desktop, 36px mobile (matching existing TileIllustration breakpoint at 480px)
    - Ensure consistent styling with existing section components (padding, borders, headings)
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 10. Checkpoint — Verify full integration
  - Ensure all tests pass, ask the user if questions arise.
  - Verify the build succeeds with `vue-tsc -b && vite build`

- [x] 11. Write i18n key coverage test
  - Verify all translation keys used by hand simulation components exist in both `en.json` and `th.json`
  - Place in `tests/unit/i18n/handSimulation.test.ts`
  - _Requirements: 9.2, 9.3_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate the 12 universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The engine layer (tasks 1–3) has zero Vue dependencies and can be tested in isolation
- fast-check is used for all property-based tests as specified in the design
