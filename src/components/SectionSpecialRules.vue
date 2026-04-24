<!-- src/components/SectionSpecialRules.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import TileIllustration from './TileIllustration.vue'
import type { TileGroup } from '../data/tiles'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Kong: 4 identical tiles
const kongExample: TileGroup[] = [
  { tiles: ['t8', 't8', 't8', 't8'], label: 'Kong' }
]
</script>

<template>
  <section id="special-rules">
    <h2>{{ $t('sections.specialRules.heading') }}</h2>

    <div class="concept">
      <h3>Kong</h3>
      <p>{{ $t('sections.specialRules.kongDescription') }}</p>
      <TileIllustration :groups="kongExample" :caption="t('tileCaption.kongExample')" />
      <BeginnerExplanation text-key="sections.specialRules.kongBeginner" />
    </div>

    <div class="concept">
      <h3>Sacred Discard</h3>
      <p>{{ $t('sections.specialRules.sacredDiscardDescription') }}</p>
      <BeginnerExplanation text-key="sections.specialRules.sacredDiscardBeginner" />
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
