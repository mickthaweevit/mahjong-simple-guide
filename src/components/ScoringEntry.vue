<!-- src/components/ScoringEntry.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import MahjongHand from './MahjongHand.vue'
import type { ScoringEntry } from '../types/scoring'
import { getExampleHand } from '../data/tiles'
import { computed } from 'vue'

const props = defineProps<{
  entry: ScoringEntry
}>()

const exampleHand = computed(() => getExampleHand(props.entry.id))
</script>

<template>
  <article
    class="scoring-entry"
    :class="{ 'max-limit': entry.isMaxLimit }"
  >
    <header>
      <h4>
        {{ entry.englishName }}
        <span class="chinese-name">({{ entry.chineseName }})</span>
      </h4>
      <span class="faan-badge" :class="{ 'faan-max': entry.isMaxLimit }">
        {{ entry.faan }} {{ $t('scoring.faanUnit') }}
      </span>
    </header>
    <p class="description">{{ $t(entry.descriptionKey) }}</p>
    <MahjongHand v-if="exampleHand" :hand="exampleHand" />
    <p v-if="entry.notesKey" class="notes">{{ $t(entry.notesKey) }}</p>
    <BeginnerExplanation :text-key="entry.beginnerExplanationKey" />
  </article>
</template>

<style scoped>
.scoring-entry {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.scoring-entry header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.scoring-entry h4 {
  margin: 0;
  font-size: 1.1rem;
}

.chinese-name {
  font-weight: normal;
  color: var(--color-secondary-text, #555);
}

.faan-badge {
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--color-faan-bg);
  white-space: nowrap;
  font-size: 0.9rem;
}

.faan-max {
  background: var(--color-accent);
  color: white;
}

.description {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.notes {
  margin: 0.5rem 0;
  font-style: italic;
  color: var(--color-secondary-text, #555);
}

.max-limit {
  border-left: 4px solid var(--color-accent);
  background-color: var(--color-highlight-bg);
}
</style>
