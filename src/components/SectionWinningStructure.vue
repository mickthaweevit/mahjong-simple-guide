<!-- src/components/SectionWinningStructure.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import TileIllustration from './TileIllustration.vue'
import type { TileGroup } from '../data/tiles'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Chow example: 3 consecutive tiles in the same suit
const chowExample: TileGroup[] = [
  { tiles: ['t4', 't5', 't6'], label: 'Chow' }
]

// Pung example: 3 identical tiles
const pungExample: TileGroup[] = [
  { tiles: ['s7', 's7', 's7'], label: 'Pung' }
]

// Pair example: 2 identical tiles
const pairExample: TileGroup[] = [
  { tiles: ['d1', 'd1'], label: 'Pair' }
]

// Standard hand: 4 sets + 1 pair = 14 tiles
const standardHandExample: TileGroup[] = [
  { tiles: ['w1', 'w2', 'w3'], label: 'Chow' },
  { tiles: ['t4', 't5', 't6'], label: 'Chow' },
  { tiles: ['s7', 's7', 's7'], label: 'Pung' },
  { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
  { tiles: ['d2', 'd2'], label: 'Pair' }
]

// Seven Pairs: 7 different pairs
const sevenPairsExample: TileGroup[] = [
  { tiles: ['w1', 'w1'] },
  { tiles: ['w5', 'w5'] },
  { tiles: ['t3', 't3'] },
  { tiles: ['t9', 't9'] },
  { tiles: ['s4', 's4'] },
  { tiles: ['f1', 'f1'] },
  { tiles: ['d2', 'd2'] }
]

// Thirteen Orphans: one of each terminal + honor + one duplicate
const thirteenOrphansExample: TileGroup[] = [
  { tiles: ['w1', 'w9', 't1', 't9', 's1', 's9', 'f1', 'f2', 'f3', 'f4', 'd1', 'd2', 'd3', 'w1'] }
]
</script>

<template>
  <section id="winning-structure">
    <h2>{{ $t('sections.winningStructure.heading') }}</h2>

    <div class="concept">
      <h3>{{ $t('nav.winningStructure') }} — Mok</h3>
      <p>{{ $t('sections.winningStructure.mokExplanation') }}</p>
      <BeginnerExplanation text-key="sections.winningStructure.mokBeginner" />
    </div>

    <div class="concept">
      <h3>Standard Hand (4 Sets + 1 Pair)</h3>
      <p>{{ $t('sections.winningStructure.standardHand') }}</p>

      <div class="set-examples">
        <TileIllustration :groups="chowExample" :caption="t('tileCaption.chowExample')" />
        <TileIllustration :groups="pungExample" :caption="t('tileCaption.pungExample')" />
        <TileIllustration :groups="pairExample" :caption="t('tileCaption.pairExample')" />
      </div>

      <TileIllustration :groups="standardHandExample" :caption="t('tileCaption.standardHandExample')" />

      <BeginnerExplanation text-key="sections.winningStructure.standardHandBeginner" />
    </div>

    <div class="special-hands">
      <h3>Special Hands</h3>

      <article class="concept">
        <h4>Seven Pairs</h4>
        <p>{{ $t('sections.winningStructure.sevenPairs') }}</p>
        <TileIllustration :groups="sevenPairsExample" :caption="t('tileCaption.sevenPairsExample')" />
        <BeginnerExplanation text-key="sections.winningStructure.sevenPairsBeginner" />
      </article>

      <article class="concept">
        <h4>Thirteen Orphans</h4>
        <p>{{ $t('sections.winningStructure.thirteenOrphans') }}</p>
        <TileIllustration :groups="thirteenOrphansExample" :caption="t('tileCaption.thirteenOrphansExample')" />
        <BeginnerExplanation text-key="sections.winningStructure.thirteenOrphansBeginner" />
      </article>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 1.5rem 0;
}

h2 {
  margin-bottom: 1.5rem;
}

h3 {
  margin-bottom: 0.75rem;
}

h4 {
  margin-bottom: 0.5rem;
}

.concept {
  margin-bottom: 1.5rem;
}

.special-hands {
  margin-top: 1.5rem;
}

.set-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.set-examples > * {
  flex: 1;
  min-width: 140px;
}
</style>
