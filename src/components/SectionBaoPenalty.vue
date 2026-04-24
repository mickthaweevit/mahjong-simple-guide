<!-- src/components/SectionBaoPenalty.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import WorkedExample from './WorkedExample.vue'
import TileIllustration from './TileIllustration.vue'
import { baoTriggers, workedExamples } from '../data/scoring'
import type { TileGroup } from '../data/tiles'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const baoExample = workedExamples.find((e) => e.id === 'example-bao')!

// Visual illustrations for each Bao trigger scenario
const baoIllustrations: Record<string, { groups: TileGroup[]; captionKey: string }> = {
  'bao-full-one-suit': {
    groups: [
      { tiles: ['s1', 's2', 's3'], label: 'Chow' },
      { tiles: ['s4', 's5', 's6'], label: 'Chow' },
      { tiles: ['s7', 's7', 's7'], label: 'Pung' }
    ],
    captionKey: 'tileCaption.baoFullOneSuit'
  },
  'bao-great-three-dragons': {
    groups: [
      { tiles: ['d1', 'd1', 'd1'], label: 'Pung' },
      { tiles: ['d2', 'd2', 'd2'], label: 'Pung' }
    ],
    captionKey: 'tileCaption.baoGreatDragons'
  },
  'bao-great-four-winds': {
    groups: [
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['f2', 'f2', 'f2'], label: 'Pung' },
      { tiles: ['f3', 'f3', 'f3'], label: 'Pung' }
    ],
    captionKey: 'tileCaption.baoGreatWinds'
  },
  'bao-all-pungs': {
    groups: [
      { tiles: ['w3', 'w3', 'w3'], label: 'Pung' },
      { tiles: ['t6', 't6', 't6'], label: 'Pung' },
      { tiles: ['s9', 's9', 's9'], label: 'Pung' }
    ],
    captionKey: 'tileCaption.baoAllPungs'
  }
}
</script>

<template>
  <section id="bao-penalty">
    <h2>{{ $t('sections.baoPenalty.heading') }}</h2>

    <div class="concept">
      <p>{{ $t('sections.baoPenalty.explanation') }}</p>
      <BeginnerExplanation text-key="sections.baoPenalty.explanationBeginner" />
    </div>

    <ul class="trigger-list">
      <li v-for="trigger in baoTriggers" :key="trigger.id" class="trigger-item">
        <strong>{{ $t(trigger.titleKey) }}</strong>
        <p>{{ $t(trigger.descriptionKey) }}</p>
        <TileIllustration
          v-if="baoIllustrations[trigger.id]"
          :groups="baoIllustrations[trigger.id].groups"
          :caption="t(baoIllustrations[trigger.id].captionKey)"
        />
      </li>
    </ul>

    <WorkedExample :example="baoExample" />
  </section>
</template>

<style scoped>
section {
  padding: 1.5rem 0;
}

h2 {
  margin-bottom: 1.5rem;
}

.concept {
  margin-bottom: 1.5rem;
}

.trigger-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.trigger-item {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-highlight-bg);
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-accent);
}

.trigger-item:last-child {
  margin-bottom: 0;
}

.trigger-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.trigger-item p {
  margin: 0;
  font-size: 0.95rem;
}
</style>
