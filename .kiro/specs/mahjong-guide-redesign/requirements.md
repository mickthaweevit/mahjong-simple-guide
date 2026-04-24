# Requirements Document

## Introduction

This document defines the requirements for a complete redesign of the Mahjong Hong Kong Rules Guide application. The existing Vue 3 SPA presents HK Mahjong scoring rules but suffers from poor readability when read sequentially from start to finish — the section flow, layout, and UI structure make it difficult for a reader to build understanding progressively. The redesign replaces the current UI with a new layout optimized for linear reading, updates all content to match the latest house rules document (simple-mahjong.md), and restructures sections into a logical learning progression: winning structure first, then scoring, then payout mechanics, then special rules and penalties. The existing tech stack (Vue 3, Vite, TypeScript, vue-i18n) is retained.

## Glossary

- **App**: The Mahjong Hong Kong Rules Guide single-page web application
- **Fan**: (番) The unit of scoring in Hong Kong Mahjong; a winning hand accumulates Fan from various criteria
- **Mok**: The minimum Fan threshold required to declare a win, agreed upon before the game session
- **Set**: A valid group of tiles — either a Chow (sequence of 3 consecutive tiles in one suit) or a Pung (triplet of 3 identical tiles)
- **Chow**: A sequence of three consecutive numbered tiles in the same suit
- **Pung**: A set of three identical tiles
- **Kong**: A set of four identical tiles; declared during play for a replacement draw and optional bonus payment
- **Pair**: Two identical tiles required to complete a winning hand (the "Eyes")
- **Standard_Hand**: A winning hand of 14 tiles consisting of 4 Sets + 1 Pair
- **Special_Hand**: A winning hand that does not follow the 4 Sets + 1 Pair structure (Seven Pairs or Thirteen Orphans)
- **Section**: A top-level content area of the guide corresponding to a major topic (e.g., Winning Structure, Scoring, Payout)
- **Guide_Page**: The single scrollable page containing all Sections in sequential order
- **Navigation_Component**: The UI element that allows the User to jump between Sections and tracks the currently visible Section
- **Language_Switcher**: A toggle UI element that switches the active Locale between Thai and English
- **User**: A person using the App to learn or reference Hong Kong Mahjong scoring rules
- **Locale**: A language setting; supported values are Thai (TH) and English (EN)
- **Mahjong_Terminology**: Domain-specific terms (Fan, Pung, Kong, Chow, Zi Mo, Bao, etc.) and Chinese names that remain untranslated regardless of Locale
- **Beginner_Explanation**: A plain-language description of a rule or concept written for Users who have never played Mahjong
- **Worked_Example**: A step-by-step walkthrough of a concrete scoring and payment scenario
- **Bao_Penalty**: Full liability rule where a discarder pays the entire table's losses for enabling a high-value hand that was visibly forming
- **Biting_Rule**: (Kud) A penalty where a winning player's Season tile number matches an opponent's Flower tile number, causing the opponent to pay an additional penalty
- **Shooter**: The player who discards the tile that completes another player's winning hand

## Requirements

### Requirement 1: Sequential Reading Layout

**User Story:** As a User, I want the guide to be structured for reading from start to finish, so that I can progressively build my understanding of HK Mahjong rules without jumping between disconnected sections.

#### Acceptance Criteria

1. THE App SHALL present all content on a single scrollable Guide_Page with Sections arranged in the following fixed order: (1) Introduction & Winning Structure, (2) Hand Scoring / Fan Counting, (3) Flowers & Seasons, (4) Payout & The Exponential Rule, (5) Bao Penalty / Full Liability, (6) Special Rules, (7) Game Rotation
2. THE App SHALL render each Section with a clear heading, visual separator, and consistent vertical spacing so that the boundary between Sections is unambiguous
3. THE App SHALL use a vertical single-column content layout for the main reading area on all viewport sizes, with a maximum content width of 720px centered on the page
4. THE App SHALL present content within each Section in a top-to-bottom reading order without requiring horizontal scrolling or tab switching to access subsections

### Requirement 2: Winning Structure & Special Hands Section

**User Story:** As a User, I want to understand what constitutes a winning hand before learning about scoring, so that I have the foundational knowledge needed to follow the rest of the guide.

#### Acceptance Criteria

1. THE App SHALL display the Winning Structure Section as the first content Section of the guide
2. THE App SHALL explain the Mok concept: the minimum Fan required to win is determined by group consensus before each game session
3. THE App SHALL describe the Standard_Hand structure: 14 tiles consisting of 4 Sets + 1 Pair, where Sets can be Chows or Pungs
4. THE App SHALL describe the two allowed Special_Hand types: Seven Pairs (7 different pairs) and Thirteen Orphans (one of each Terminal and Honor tile plus one extra to form a pair)
5. THE App SHALL display a Beginner_Explanation for each hand structure that describes the concept in plain language

### Requirement 3: Hand Scoring / Fan Counting Section

**User Story:** As a User, I want to see all hand types and their Fan values in one place, so that I can understand how hands are scored.

#### Acceptance Criteria

1. THE App SHALL display the following scoring entries with their Fan values: Common Hand (1 Fan), All Pungs (3 Fan), Mixed One Suit (3 Fan), Full One Suit (7 Fan), Dragon Pung (+1 Fan per set), Small Three Dragons (5 Fan), Great Three Dragons (8 Fan Limit)
2. THE App SHALL display each scoring entry with its English name, Chinese name, Fan value, and a description of the hand pattern
3. THE App SHALL visually distinguish entries that score the Limit (8 Fan) from regular entries
4. THE App SHALL display a Beginner_Explanation alongside each scoring entry that describes the hand pattern in plain language
5. WHEN a scoring entry has stackable bonuses (e.g., Dragon Pung), THE App SHALL note that the bonus can be applied multiple times

### Requirement 4: Flowers, Seasons & Biting Section

**User Story:** As a User, I want to understand how Flower and Season tiles affect scoring and the Biting penalty, so that I can account for bonus tiles during play.

#### Acceptance Criteria

1. THE App SHALL explain that every Flower or Season tile adds +1 Fan each
2. THE App SHALL explain the Biting_Rule: when a winner has a Season tile whose number matches an opponent's Flower tile, that opponent pays an additional 1 Fan penalty to the winner
3. THE App SHALL state that there is no bonus for winning with zero Flowers in this ruleset
4. THE App SHALL display a Beginner_Explanation for the Biting_Rule that describes the penalty in plain language
5. THE App SHALL display a Worked_Example showing a Biting penalty calculation

### Requirement 5: Payout & The Exponential Rule Section

**User Story:** As a User, I want to understand how Fan are converted to payment amounts and who pays whom, so that I can correctly settle payments after a win.

#### Acceptance Criteria

1. THE App SHALL display the payout formula: Price = 1 × 2^n where n is the total Fan count
2. THE App SHALL display a payout table mapping Fan values 1 through 8 to their corresponding prices (2, 4, 8, 16, 32, 64, 128, 256)
3. THE App SHALL explain the Self-Draw (Zi Mo) rule: adds +1 Fan to the total, and all 3 other players pay the calculated price
4. THE App SHALL explain the Win by Discard rule: the Shooter pays double the calculated price, and the other two players pay the standard calculated price
5. THE App SHALL display a Beginner_Explanation alongside each payment rule
6. THE App SHALL display at least one Worked_Example for Self-Draw payment showing Fan counting, formula application, and per-player amounts
7. THE App SHALL display at least one Worked_Example for Win by Discard payment showing the Shooter's double payment and other players' standard payment

### Requirement 6: Bao Penalty / Full Liability Section

**User Story:** As a User, I want to understand the Bao penalty so that I know when a discarder becomes liable for the entire table's losses.

#### Acceptance Criteria

1. THE App SHALL explain the Bao_Penalty concept: if a discard enables a high-value hand that was already visibly forming, the discarder pays the sum of what all three losing players would have owed
2. THE App SHALL list all four Bao trigger conditions: (a) Full One Suit — player has 3 sets of the same suit exposed, (b) Great Three Dragons — player has 2 Dragon sets exposed, (c) Great Four Winds — player has 3 Wind sets exposed, (d) All Pungs — player has 3 Pung sets exposed
3. THE App SHALL display a Beginner_Explanation for the Bao_Penalty that describes the liability concept in plain language
4. THE App SHALL display a Worked_Example showing a Bao penalty scenario with the liable player's total payment calculation

### Requirement 7: Game Rotation Section

**User Story:** As a User, I want to understand how the game progresses through rounds and how the dealer position rotates, so that I know the structure of a full game.

#### Acceptance Criteria

1. THE App SHALL explain that one full game consists of 4 Rounds (East, South, West, North)
2. THE App SHALL explain the dealer rotation rule: the dealer stays if the dealer wins or the game is a draw; the dealer position rotates to the left if the dealer loses
3. THE App SHALL display a Beginner_Explanation for the game rotation rules

### Requirement 8: Section Navigation

**User Story:** As a User, I want to jump to any section of the guide without scrolling through the entire page, so that I can quickly reference a specific topic.

#### Acceptance Criteria

1. THE App SHALL provide a Navigation_Component that lists all Sections of the guide
2. WHEN a User selects a Section from the Navigation_Component, THE App SHALL smooth-scroll to the selected Section
3. WHILE the User scrolls through the Guide_Page, THE App SHALL visually indicate the currently visible Section in the Navigation_Component
4. WHILE the viewport width is 768px or above, THE App SHALL display the Navigation_Component as a sticky sidebar alongside the content area
5. WHILE the viewport width is below 768px, THE App SHALL display the Navigation_Component as a sticky horizontal bar at the top of the viewport

### Requirement 9: Responsive Layout

**User Story:** As a User, I want the guide to be readable on both mobile and desktop devices, so that I can reference it during a game on my phone or study it on my computer.

#### Acceptance Criteria

1. THE App SHALL render a readable layout on viewport widths from 320px to 1920px
2. WHILE the viewport width is below 768px, THE App SHALL use a single-column layout with the Navigation_Component above the content
3. WHILE the viewport width is 768px or above, THE App SHALL display the Navigation_Component sidebar alongside the single-column content area
4. THE App SHALL ensure all tables reflow or scroll horizontally within their container on narrow viewports without breaking the page layout

### Requirement 10: Internationalization and Language Switching

**User Story:** As a User, I want to switch the guide between Thai and English, so that I can read the content in my preferred language.

#### Acceptance Criteria

1. THE App SHALL support two Locale options: Thai (TH) and English (EN)
2. THE App SHALL use Thai (TH) as the default Locale when no language preference has been stored
3. WHEN a User activates the Language_Switcher, THE App SHALL toggle the active Locale between Thai and English
4. WHEN the active Locale changes, THE App SHALL translate all UI labels, section headings, descriptions, and explanatory text to the selected Locale
5. WHEN the active Locale changes, THE App SHALL retain all Mahjong_Terminology in their original form without translation
6. WHEN a User selects a Locale, THE App SHALL persist the language preference to localStorage
7. WHEN the App loads, THE App SHALL read the stored language preference from localStorage and apply the corresponding Locale
8. IF localStorage is unavailable or contains no stored language preference, THEN THE App SHALL fall back to Thai (TH) as the default Locale

### Requirement 11: Beginner-Friendly Explanations

**User Story:** As a beginner User, I want every rule and concept to include a plain-language explanation, so that I can understand HK Mahjong without prior knowledge.

#### Acceptance Criteria

1. THE App SHALL display a Beginner_Explanation alongside each scoring entry, payment rule, penalty, and structural concept (Standard_Hand, Special_Hand, game rotation)
2. THE App SHALL present each Beginner_Explanation as a visually distinct block adjacent to the formal rule text
3. THE App SHALL write all Beginner_Explanation text using short sentences and everyday language, avoiding jargon without accompanying context
4. WHEN a formal rule uses Mahjong_Terminology, THE App SHALL define or contextualize that term within the corresponding Beginner_Explanation

### Requirement 12: Worked Payment Examples

**User Story:** As a beginner User, I want step-by-step worked examples for payment calculations, so that I can understand how Fan convert to payments and who pays whom.

#### Acceptance Criteria

1. THE App SHALL display at least one Worked_Example for each payment scenario: Self-Draw, Win by Discard, and Bao Penalty
2. WHEN displaying a Worked_Example, THE App SHALL present the scenario as a numbered step-by-step walkthrough showing the winning hand, Fan count, formula application, and payment distribution
3. THE App SHALL include concrete seat positions (East, South, West, North) in each Worked_Example to clarify who pays and who receives
4. THE App SHALL present Worked_Example sections in a visually distinct format (e.g., highlighted card or box) to differentiate them from formal rule text

### Requirement 13: Content Alignment with House Rules

**User Story:** As a User, I want the guide content to accurately reflect the house rules document, so that the information I reference during play is correct.

#### Acceptance Criteria

1. THE App SHALL set the Fan Limit to 8 Fan (not 13) as specified in the house rules
2. THE App SHALL use the payout formula Price = 1 × 2^n as specified in the house rules
3. THE App SHALL describe the Win by Discard rule as: the Shooter pays double, other two players pay standard price — matching the house rules
4. THE App SHALL include Seven Pairs and Thirteen Orphans as allowed Special_Hand types
5. THE App SHALL list all four Bao trigger conditions as specified in the house rules (Full One Suit, Great Three Dragons, Great Four Winds, All Pungs with exposed sets)
6. THE App SHALL state that there is no "No Flower Bonus" in this ruleset
7. THE App SHALL describe the Biting_Rule penalty as specified in the house rules

### Requirement 14: Accessibility

**User Story:** As a User, I want the guide to be accessible, so that users with disabilities can navigate and read the scoring rules.

#### Acceptance Criteria

1. THE App SHALL use semantic HTML elements for headings, lists, tables, and navigation
2. THE App SHALL ensure all interactive elements are reachable and operable via keyboard navigation
3. THE App SHALL maintain a minimum color contrast ratio of 4.5:1 for all text content against its background
4. THE App SHALL provide appropriate ARIA labels for the Navigation_Component and Language_Switcher

### Requirement 15: Search Scoring Entries

**User Story:** As a User, I want to search for scoring entries by keyword, so that I can quickly find a specific hand or rule without scrolling through the entire guide.

#### Acceptance Criteria

1. THE App SHALL provide a search input that accepts text from the User
2. WHEN a User enters a search term, THE App SHALL filter scoring entries whose English name, Chinese name, or description contains the search term
3. WHEN the search term matches one or more entries, THE App SHALL display the matching entries with their Fan values
4. WHEN the search term matches zero entries, THE App SHALL display a message indicating no results were found
5. WHEN the User clears the search term, THE App SHALL restore the full guide content


### Requirement 16: Legacy Code Cleanup

**User Story:** As a developer, I want unused files and components from the old design to be removed after the redesign is complete, so that the codebase stays clean and free of dead code.

#### Acceptance Criteria

1. AFTER the redesign is fully implemented, THE developer SHALL audit all existing source files (components, composables, data modules, type definitions, i18n keys, CSS, and tests) against the new design
2. THE developer SHALL delete any source files that are no longer imported or referenced by the new design
3. THE developer SHALL remove any unused i18n keys from `th.json` and `en.json` that are not referenced by the new components or data modules
4. THE developer SHALL remove any unused TypeScript interfaces or type exports from `src/types/` that are not referenced by the new data module or components
5. THE developer SHALL verify that `npm run build` succeeds with zero errors after all deletions
