<!-- src/components/SectionTileIntroduction.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import TileIllustration from './TileIllustration.vue'
import type { TileGroup } from '../data/tiles'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// One example tile from each suit
const suitsExample: TileGroup[] = [
  { tiles: ['w1', 'w2', 'w3'], label: 'Characters (萬)' },
  { tiles: ['t1', 't2', 't3'], label: 'Dots (筒)' },
  { tiles: ['s1', 's2', 's3'], label: 'Bamboo (索)' }
]

// Wind tiles
const windsExample: TileGroup[] = [
  { tiles: ['f1', 'f2', 'f3', 'f4'], label: 'Winds' }
]

// Dragon tiles
const dragonsExample: TileGroup[] = [
  { tiles: ['d1', 'd2', 'd3'], label: 'Dragons' }
]
</script>

<template>
  <section id="tile-introduction">
    <h2>{{ $t('sections.tileIntroduction.heading') }}</h2>

    <div class="concept">
      <p>{{ $t('sections.tileIntroduction.overview') }}</p>
      <BeginnerExplanation text-key="sections.tileIntroduction.overviewBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.tileIntroduction.suitsTitle') }}</h3>
      <p>{{ $t('sections.tileIntroduction.suits') }}</p>
      <TileIllustration :groups="suitsExample" :caption="t('tileCaption.suitsExample')" />
      <BeginnerExplanation text-key="sections.tileIntroduction.suitsBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.tileIntroduction.honorsTitle') }}</h3>
      <p>{{ $t('sections.tileIntroduction.honors') }}</p>
      <TileIllustration :groups="windsExample" :caption="t('tileCaption.windsExample')" />
      <TileIllustration :groups="dragonsExample" :caption="t('tileCaption.dragonsExample')" />
      <BeginnerExplanation text-key="sections.tileIntroduction.honorsBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.tileIntroduction.bonusTitle') }}</h3>
      <p>{{ $t('sections.tileIntroduction.bonus') }}</p>
      <BeginnerExplanation text-key="sections.tileIntroduction.bonusBeginner" />
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
  margin-bottom: 0.5rem;
}

.concept {
  margin-bottom: 1.5rem;
}

.concept:last-child {
  margin-bottom: 0;
}
</style>
