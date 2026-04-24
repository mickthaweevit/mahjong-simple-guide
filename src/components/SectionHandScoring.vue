<!-- src/components/SectionHandScoring.vue -->
<script setup lang="ts">
import ScoringEntry from './ScoringEntry.vue'
import { groupedScoringEntries } from '../data/scoring'

const groups = groupedScoringEntries()
</script>

<template>
  <section id="hand-scoring">
    <h2>{{ $t('sections.handScoring.heading') }}</h2>

    <aside class="faan-limit-note" role="note">
      <p>{{ $t('sections.handScoring.faanLimitNote') }}</p>
    </aside>

    <div
      v-for="group in groups"
      :key="group.category"
      class="scoring-group"
    >
      <h3 class="group-heading">{{ $t(group.titleKey) }}</h3>
      <div class="scoring-entries">
        <ScoringEntry
          v-for="entry in group.entries"
          :key="entry.id"
          :entry="entry"
        />
      </div>
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

.faan-limit-note {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-highlight-bg);
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-accent);
  font-size: 0.95rem;
}

.scoring-group {
  margin-top: 1.5rem;
}

.group-heading {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-primary-text, #222);
}

.scoring-entries {
  margin-top: 0.5rem;
}
</style>
