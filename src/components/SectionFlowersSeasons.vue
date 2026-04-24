<!-- src/components/SectionFlowersSeasons.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import WorkedExample from './WorkedExample.vue'
import { workedExamples } from '../data/scoring'

const bitingExample = workedExamples.find((e) => e.id === 'example-biting')!
</script>

<template>
  <section id="flowers-seasons">
    <h2>{{ $t('sections.flowersSeasons.heading') }}</h2>

    <div class="concept">
      <p>{{ $t('sections.flowersSeasons.flowerScoring') }}</p>
      <BeginnerExplanation text-key="sections.flowersSeasons.flowerScoringBeginner" />
    </div>

    <div class="concept">
      <p>{{ $t('sections.flowersSeasons.bitingRule') }}</p>
      <BeginnerExplanation text-key="sections.flowersSeasons.bitingRuleBeginner" />
    </div>

    <aside class="no-flower-note" role="note">
      <p>{{ $t('sections.flowersSeasons.noFlowerBonusNote') }}</p>
    </aside>

    <WorkedExample :example="bitingExample" />
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

.no-flower-note {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-highlight-bg);
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-accent);
  font-size: 0.95rem;
}
</style>
