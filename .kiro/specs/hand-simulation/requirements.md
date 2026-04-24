# Requirements Document

## Introduction

The Hand Simulation feature allows users to construct a Mahjong hand by selecting tiles, configuring game context (round wind, seat wind, self-draw), and adding bonus tiles (flowers/seasons). The Simulator then calculates the total Fan score based on Hong Kong Mahjong rules and displays a breakdown of which scoring patterns were matched. This serves as an interactive learning and reference tool within the existing Mahjong Hong Kong rules guide app.

## Glossary

- **Simulator**: The Hand Simulation Vue component and its associated scoring logic
- **Hand**: A collection of up to 14 standard tiles (excluding bonus tiles) arranged into sets and a pair
- **Tile_Picker**: The UI sub-component that presents all available Mahjong tiles for selection
- **Fan_Calculator**: The logic module that evaluates a completed hand and returns the total Fan count with a breakdown of matched scoring patterns
- **Bonus_Tile_Selector**: The UI sub-component for adding Flower and Season tiles to the hand
- **Wind_Selector**: The UI sub-component with radio buttons for selecting round wind and seat wind
- **Score_Display**: The UI sub-component that shows the Fan total, matched patterns, and payout calculation
- **TileCode**: The existing tile identifier format defined in `src/data/tiles.ts` (e.g., "w1", "t5", "d2")
- **Set**: A group of 3 tiles — either a Chow (3 consecutive tiles in the same suit) or a Pung (3 identical tiles)
- **Pair**: Two identical tiles, also called the Eyes
- **Kong**: All 4 copies of the same tile, counted as a set with a replacement draw
- **Fan**: The scoring unit in Hong Kong Mahjong; payout is calculated as 2^n where n is the total Fan
- **Self_Draw**: Winning by drawing the completing tile from the wall (adds +1 Fan bonus)
- **Round_Wind**: The prevailing wind for the current round (East, South, West, or North)
- **Seat_Wind**: The wind assigned to the player's seat position (East, South, West, or North)

## Requirements

### Requirement 1: Tile Selection and Hand Building

**User Story:** As a user, I want to select tiles from a visual tile picker and add them to my hand, so that I can construct any Mahjong hand I want to evaluate.

#### Acceptance Criteria

1. THE Tile_Picker SHALL display all 34 unique standard Mahjong tiles organized by suit: Characters (w1–w9), Dots (t1–t9), Bamboo (s1–s9), Winds (f1–f4), and Dragons (d1–d3)
2. WHEN a user selects a tile from the Tile_Picker, THE Simulator SHALL add one copy of that tile to the Hand
3. WHILE the Hand contains fewer than 14 standard tiles, THE Tile_Picker SHALL allow the user to select additional tiles
4. WHEN the Hand contains 14 standard tiles, THE Tile_Picker SHALL prevent the user from adding more standard tiles
5. THE Simulator SHALL enforce a maximum of 4 copies of any single tile in the Hand (matching the physical tile count in a real Mahjong set)
6. WHEN a tile already has 4 copies in the Hand, THE Tile_Picker SHALL visually indicate that tile is unavailable
7. WHEN a user activates the remove action on a tile in the Hand, THE Simulator SHALL remove one copy of that tile from the Hand
8. THE Simulator SHALL display each tile in the Hand using the existing `getTileImageUrl` function and Wikimedia Commons tile images

### Requirement 2: Bonus Tile Management

**User Story:** As a user, I want to add Flower and Season tiles to my hand separately from the standard tiles, so that their Fan bonus is included in the score calculation.

#### Acceptance Criteria

1. THE Bonus_Tile_Selector SHALL present 8 bonus tile options: Flower #1 through #4 and Season #1 through #4
2. WHEN a user toggles a bonus tile on, THE Simulator SHALL add that bonus tile to the hand context
3. WHEN a user toggles a bonus tile off, THE Simulator SHALL remove that bonus tile from the hand context
4. THE Simulator SHALL allow selecting between 0 and 8 bonus tiles independently of the 14 standard tile limit
5. THE Score_Display SHALL include +1 Fan for each selected bonus tile in the total Fan calculation

### Requirement 3: Win Condition Configuration

**User Story:** As a user, I want to specify whether the win is by self-draw, so that the +1 Fan self-draw bonus is correctly applied to the score.

#### Acceptance Criteria

1. THE Simulator SHALL display a "Self-Draw Win?" checkbox that defaults to unchecked
2. WHEN the "Self-Draw Win?" checkbox is checked, THE Fan_Calculator SHALL add +1 Fan to the total score
3. WHEN the "Self-Draw Win?" checkbox is unchecked, THE Fan_Calculator SHALL apply no self-draw bonus

### Requirement 4: Wind Context Configuration

**User Story:** As a user, I want to select the round wind and my seat wind, so that wind-related Fan bonuses are correctly calculated.

#### Acceptance Criteria

1. THE Wind_Selector SHALL display a radio button group for Round Wind with options: East, South, West, North
2. THE Wind_Selector SHALL display a radio button group for Seat Wind with options: East, South, West, North
3. THE Wind_Selector SHALL default Round Wind to East and Seat Wind to East
4. WHEN the Hand contains a Pung of the tile matching the selected Round Wind, THE Fan_Calculator SHALL add +1 Fan for the prevailing wind bonus
5. WHEN the Hand contains a Pung of the tile matching the selected Seat Wind, THE Fan_Calculator SHALL add +1 Fan for the seat wind bonus
6. WHEN the Round Wind and Seat Wind are the same value AND the Hand contains a Pung of that wind tile, THE Fan_Calculator SHALL add +2 Fan total (one for round wind, one for seat wind)

### Requirement 5: Fan Calculation Engine

**User Story:** As a user, I want the simulator to automatically calculate the total Fan for my constructed hand, so that I can learn how different tile combinations score.

#### Acceptance Criteria

1. WHEN the Hand contains exactly 14 standard tiles, THE Fan_Calculator SHALL evaluate the hand and display the total Fan count
2. WHILE the Hand contains fewer than 14 standard tiles, THE Fan_Calculator SHALL display a message indicating the hand is incomplete
3. THE Fan_Calculator SHALL detect and score the following patterns with their correct Fan values: Common Hand (1), All Pungs (3), Mixed One Suit (3), Full One Suit (7), Dragon Pung (+1 each), Small Three Dragons (5), Great Three Dragons (8 limit), Great Four Winds (8 limit), All Green (8 limit), Seven Pairs (4), Thirteen Orphans (8 limit)
4. THE Fan_Calculator SHALL correctly stack compatible scoring patterns (e.g., All Pungs + Dragon Pung)
5. WHEN the total Fan exceeds 8, THE Fan_Calculator SHALL cap the displayed Fan at 8 (the Limit)
6. THE Fan_Calculator SHALL identify the optimal grouping of tiles into sets and pair that yields the highest Fan score
7. IF the 14 tiles cannot form a valid winning hand structure (4 sets + 1 pair, Seven Pairs, or Thirteen Orphans), THEN THE Fan_Calculator SHALL display a message indicating the hand is not a valid winning hand

### Requirement 6: Score Breakdown and Payout Display

**User Story:** As a user, I want to see a detailed breakdown of which scoring patterns matched and the resulting payout, so that I can understand how the final score was derived.

#### Acceptance Criteria

1. THE Score_Display SHALL list each matched scoring pattern with its individual Fan value
2. THE Score_Display SHALL show bonus Fan from flowers, seasons, self-draw, and wind bonuses as separate line items
3. THE Score_Display SHALL show the total Fan as the sum of all individual Fan values (capped at 8)
4. THE Score_Display SHALL calculate and display the payout per person using the formula 2^n where n is the total Fan
5. WHEN the self-draw checkbox is checked, THE Score_Display SHALL show that all 3 opponents pay the calculated price
6. WHEN the self-draw checkbox is unchecked, THE Score_Display SHALL show that the Shooter pays double and the other two opponents pay the standard price

### Requirement 7: Hand Reset

**User Story:** As a user, I want to clear my current hand and start over, so that I can quickly try different hand combinations.

#### Acceptance Criteria

1. THE Simulator SHALL provide a "Clear Hand" action
2. WHEN the user activates the "Clear Hand" action, THE Simulator SHALL remove all standard tiles from the Hand
3. WHEN the user activates the "Clear Hand" action, THE Simulator SHALL remove all selected bonus tiles
4. WHEN the user activates the "Clear Hand" action, THE Simulator SHALL reset the self-draw checkbox to unchecked
5. WHEN the user activates the "Clear Hand" action, THE Simulator SHALL reset Round Wind to East and Seat Wind to East

### Requirement 8: Navigation Integration

**User Story:** As a user, I want to access the Hand Simulation from the app navigation, so that I can easily find and use the feature.

#### Acceptance Criteria

1. THE App_Navigation SHALL include a "Hand Simulation" entry in the navigation menu
2. WHEN the user selects the "Hand Simulation" navigation entry, THE App SHALL scroll to or display the Hand Simulation section
3. THE Simulator section SHALL use the existing section styling patterns consistent with other sections in the app

### Requirement 9: Internationalization Support

**User Story:** As a user, I want the Hand Simulation interface to be available in both English and Thai, so that the feature is consistent with the rest of the app.

#### Acceptance Criteria

1. THE Simulator SHALL use the existing vue-i18n infrastructure for all user-facing text
2. THE Simulator SHALL provide English translations for all labels, messages, and scoring pattern names
3. THE Simulator SHALL provide Thai translations for all labels, messages, and scoring pattern names
4. WHEN the user switches the app language, THE Simulator SHALL update all displayed text to the selected language
5. THE Simulator SHALL use the existing `getTileName` function for locale-aware tile alt text

### Requirement 10: Responsive Layout

**User Story:** As a user, I want the Hand Simulation to work well on both desktop and mobile screens, so that I can use the feature on any device.

#### Acceptance Criteria

1. WHILE the viewport width is 768px or wider, THE Simulator SHALL display the tile picker and hand area in a layout that uses the available horizontal space
2. WHILE the viewport width is less than 768px, THE Simulator SHALL stack the tile picker and hand area vertically
3. THE tile images in the Simulator SHALL use the same responsive sizing as the existing `TileIllustration` component (46px on desktop, 36px on mobile)
