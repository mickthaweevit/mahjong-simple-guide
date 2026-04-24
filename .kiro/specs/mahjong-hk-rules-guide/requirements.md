# Requirements Document

## Introduction

This document defines the requirements for a Mahjong Hong Kong Rules Guide — an interactive web application that serves as a reference for Hong Kong Mahjong scoring rules. The V1 scope focuses on presenting scoring categories, faan values, point translation tables, and payment rules in a clear, browsable, and searchable format. The app is designed to be beginner-friendly, making complex Hong Kong Mahjong scoring, payment, and penalty rules accessible to players who have never played before. Each complex concept is accompanied by plain-language explanations and worked examples so that new players can understand the doubling/redoubling payment system and penalty consequences without prior knowledge. The app is a reference guide with basic interactivity, not a game simulator. Future iterations may add advanced features such as hand calculators or quiz modes.

## Glossary

- **App**: The Mahjong Hong Kong Rules Guide interactive web application
- **Faan**: (番) The unit of scoring points in Hong Kong Mahjong; a winning hand accumulates faan from various criteria
- **Meld**: A set of tiles forming a valid group (Chow, Pong, or Kong)
- **Chow**: A sequence of three consecutive tiles in the same suit
- **Pong**: A set of three identical tiles
- **Kong**: A set of four identical tiles
- **Pair**: Two identical tiles required to complete a winning hand
- **Scoring_Category**: A classification grouping for hands or conditions that award faan (e.g., By Type of Hand, By Presence of Certain Melds, By Winning Condition, By Bonus Tiles)
- **Scoring_Entry**: A single named hand pattern or condition within a Scoring_Category, including its English name, Chinese name, faan value, and description
- **Point_Translation_Table**: A table mapping faan totals to base point values under a specific scoring variant (Simplified, Traditional, or Canton)
- **Payment_Rule**: A rule describing how points are distributed among players after a win (e.g., discarder pays double, dealer modifier)
- **Penalty**: A rule describing point deductions for rule violations (e.g., 9 Pieces Penalty, 12 Pieces Penalty, Fifth Tile Penalty)
- **Search_Component**: The UI element that allows users to filter and find scoring entries by keyword
- **Navigation_Component**: The UI element that allows users to browse between sections of the guide
- **User**: A person using the App to look up Hong Kong Mahjong scoring rules
- **Locale**: A language setting that determines which translations are displayed in the App; supported values are Thai (TH) and English (EN)
- **Language_Switcher**: A toggle UI element in the Navigation_Component that allows the User to switch the active Locale between Thai and English
- **Mahjong_Terminology**: Domain-specific terms (e.g., faan, Pong, Kong, Chow) and Chinese/Cantonese names for Scoring_Entry items that remain untranslated regardless of the active Locale
- **Beginner_Explanation**: A plain-language description of a complex rule or concept, written for Users who have never played Mahjong before, avoiding jargon without context
- **Worked_Example**: A step-by-step walkthrough of a concrete scoring and payment scenario showing how faan are counted, converted to points, and distributed among players

## Requirements

### Requirement 1: Display Scoring Categories

**User Story:** As a User, I want to browse all Hong Kong Mahjong scoring categories, so that I can understand how faan are awarded for different hand types and conditions.

#### Acceptance Criteria

1. THE App SHALL display all four Scoring_Category groups: "By Type of Hand", "By Presence of Certain Melds", "By Winning Condition", and "By Bonus Tiles"
2. WHEN a User selects a Scoring_Category, THE App SHALL display all Scoring_Entry items belonging to that category
3. THE App SHALL display each Scoring_Entry with its English name, Chinese name (in parentheses), faan value, and a brief description of the pattern or condition

### Requirement 2: Display Scoring Entry Details

**User Story:** As a User, I want to view detailed information about each scoring entry, so that I can understand the specific rules and conditions for earning faan.

#### Acceptance Criteria

1. WHEN a User selects a Scoring_Entry, THE App SHALL display the full details including the English name, Chinese name, faan value, and a description of the hand pattern or winning condition
2. THE App SHALL display the faan value as a numeric integer for each Scoring_Entry
3. WHEN a Scoring_Entry has special notes or exceptions, THE App SHALL display those notes alongside the entry details

### Requirement 3: Display Point Translation Tables

**User Story:** As a User, I want to view point translation tables for different scoring variants, so that I can convert faan totals into base points.

#### Acceptance Criteria

1. THE App SHALL display Point_Translation_Table data for three variants: Simplified (Old Hong Kong), Traditional, and Canton
2. WHEN a User selects a scoring variant, THE App SHALL display the corresponding Point_Translation_Table with faan-to-points mappings
3. THE App SHALL indicate the minimum faan requirement for each scoring variant (3 for Simplified, 0 for Traditional, 3 for Canton)
4. THE App SHALL display the maximum faan cap for each scoring variant where applicable

### Requirement 4: Display Payment Rules

**User Story:** As a User, I want to understand how points are distributed after a win, so that I can correctly settle payments during a game.

#### Acceptance Criteria

1. THE App SHALL display all Payment_Rule entries including win-by-discard, win-by-self-pick, dealer modifier, and high-risk discarder rules
2. THE App SHALL describe each Payment_Rule with a clear explanation of who pays, how much, and under what conditions
3. WHEN a Payment_Rule involves a multiplier (e.g., double), THE App SHALL state the multiplier explicitly
4. THE App SHALL display a beginner-friendly plain-language explanation alongside each Payment_Rule that describes the rule in simplified terms for Users who have never played Mahjong before

### Requirement 5: Display Penalties

**User Story:** As a User, I want to know about penalties for rule violations, so that I can avoid them and understand their consequences during play.

#### Acceptance Criteria

1. THE App SHALL display all Penalty entries: 9 Pieces Penalty, 12 Pieces Penalty, and Fifth Tile Penalty
2. THE App SHALL describe each Penalty with a clear explanation of the violation and its consequence
3. THE App SHALL display a beginner-friendly plain-language explanation alongside each Penalty that describes the violation and consequence in simplified terms for Users who have never played Mahjong before

### Requirement 6: Search Scoring Entries

**User Story:** As a User, I want to search for scoring entries by keyword, so that I can quickly find a specific hand or condition without browsing all categories.

#### Acceptance Criteria

1. THE App SHALL provide a Search_Component that accepts text input from the User
2. WHEN a User enters a search term, THE App SHALL filter Scoring_Entry items whose English name, Chinese name, or description contains the search term
3. WHEN the search term matches one or more Scoring_Entry items, THE App SHALL display the matching entries with their faan values and Scoring_Category
4. WHEN the search term matches zero Scoring_Entry items, THE App SHALL display a message indicating no results were found
5. WHEN the User clears the search term, THE App SHALL restore the full list of Scoring_Entry items

### Requirement 7: Section Navigation

**User Story:** As a User, I want to navigate between sections of the guide easily, so that I can move between scoring categories, point tables, payment rules, and penalties without excessive scrolling.

#### Acceptance Criteria

1. THE App SHALL provide a Navigation_Component that lists all major sections: Scoring Categories, Point Translation Tables, Payment Rules, and Penalties
2. WHEN a User selects a section from the Navigation_Component, THE App SHALL scroll to or display the selected section
3. THE App SHALL visually indicate the currently active section in the Navigation_Component

### Requirement 8: Responsive Layout

**User Story:** As a User, I want the guide to be usable on both desktop and mobile devices, so that I can reference it during a game on my phone or study it on my computer.

#### Acceptance Criteria

1. THE App SHALL render a readable layout on viewport widths from 320px to 1920px
2. WHILE the viewport width is below 768px, THE App SHALL adapt the layout to a single-column format suitable for mobile devices
3. WHILE the viewport width is 768px or above, THE App SHALL display the Navigation_Component alongside the content area

### Requirement 9: Accessibility

**User Story:** As a User, I want the guide to be accessible, so that users with disabilities can navigate and read the scoring rules.

#### Acceptance Criteria

1. THE App SHALL use semantic HTML elements for headings, lists, tables, and navigation
2. THE App SHALL ensure all interactive elements are reachable and operable via keyboard navigation
3. THE App SHALL maintain a minimum color contrast ratio of 4.5:1 for all text content against its background
4. THE App SHALL provide appropriate ARIA labels for the Search_Component and Navigation_Component

### Requirement 10: Faan Limit Display

**User Story:** As a User, I want to see which hands reach the 13-faan maximum limit, so that I can identify the highest-value hands at a glance.

#### Acceptance Criteria

1. THE App SHALL visually distinguish Scoring_Entry items that have a faan value of 13 (the absolute limit)
2. THE App SHALL display a note explaining that 13 faan is the absolute maximum in Hong Kong Mahjong scoring


### Requirement 11: Internationalization and Language Switching

**User Story:** As a User, I want to switch the guide between Thai and English, so that I can read the content in my preferred language.

#### Acceptance Criteria

1. THE App SHALL support two Locale options: Thai (TH) and English (EN)
2. THE App SHALL use Thai (TH) as the default Locale when no language preference has been stored
3. WHEN a User activates the Language_Switcher, THE App SHALL toggle the active Locale between Thai and English
4. THE App SHALL display the Language_Switcher in the top-right corner of the Navigation_Component
5. WHEN the active Locale changes, THE App SHALL translate all UI labels, section headings, descriptions, and general text to the selected Locale
6. WHEN the active Locale changes, THE App SHALL retain all Mahjong_Terminology (faan, Pong, Kong, Chow, and Chinese/Cantonese names for Scoring_Entry items) in their original form without translation
7. WHEN a User selects a Locale, THE App SHALL persist the language preference to localStorage
8. WHEN the App loads, THE App SHALL read the stored language preference from localStorage and apply the corresponding Locale
9. IF localStorage is unavailable or contains no stored language preference, THEN THE App SHALL fall back to Thai (TH) as the default Locale


### Requirement 12: Beginner-Friendly Explanations

**User Story:** As a beginner User, I want scoring entries, payment rules, and penalties to include plain-language explanations, so that I can understand complex Hong Kong Mahjong concepts without prior knowledge of the game.

#### Acceptance Criteria

1. THE App SHALL display a Beginner_Explanation alongside each Scoring_Entry that describes the hand pattern or condition in simplified terms accessible to a first-time player
2. THE App SHALL display a Beginner_Explanation alongside each Payment_Rule that describes who pays whom and why in simplified terms accessible to a first-time player
3. THE App SHALL display a Beginner_Explanation alongside each Penalty that describes the violation and its consequence in simplified terms accessible to a first-time player
4. THE App SHALL present each Beginner_Explanation as a visually distinct "What this means" section adjacent to the formal rule text
5. WHEN a Scoring_Entry, Payment_Rule, or Penalty uses Mahjong_Terminology in its formal description, THE App SHALL define or contextualize that term within the corresponding Beginner_Explanation
6. THE App SHALL write all Beginner_Explanation text using short sentences and everyday language, avoiding jargon-heavy descriptions without accompanying context

### Requirement 13: Worked Payment Examples

**User Story:** As a beginner User, I want step-by-step worked examples for payment calculations, so that I can understand how faan are converted to points and how payments are distributed among players.

#### Acceptance Criteria

1. THE App SHALL display at least one Worked_Example for each Point_Translation_Table variant (Simplified, Traditional, and Canton)
2. THE App SHALL display at least one Worked_Example for each Payment_Rule (win-by-discard, win-by-self-pick, dealer modifier, and high-risk discarder)
3. WHEN displaying a Worked_Example, THE App SHALL present the scenario as a numbered step-by-step walkthrough showing the winning hand, faan count, point conversion, and payment distribution
4. THE App SHALL include concrete player names or seat positions (e.g., East, South, West, North) in each Worked_Example to clarify who pays and who receives
5. WHEN a Worked_Example involves the doubling or redoubling payment system, THE App SHALL show the intermediate calculation at each step so the User can follow the multiplication logic
6. THE App SHALL present Worked_Example sections in a visually distinct format (e.g., highlighted box or card) to differentiate them from formal rule text
