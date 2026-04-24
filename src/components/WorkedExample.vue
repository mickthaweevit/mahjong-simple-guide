<!-- src/components/WorkedExample.vue -->
<script setup lang="ts">
import type { WorkedExample } from '../types/scoring'

defineProps<{
  example: WorkedExample
}>()
</script>

<template>
  <div class="worked-example">
    <h4>{{ $t(example.titleKey) }}</h4>
    <p class="context">{{ $t(example.contextKey) }}</p>
    <ol class="steps">
      <li v-for="step in example.steps" :key="step.stepNumber">
        <span class="step-desc">{{ $t(step.descriptionKey) }}</span>
        <code v-if="step.calculationKey" class="step-calc">
          {{ $t(step.calculationKey) }}
        </code>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.worked-example {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-example-bg);
  border: 1px solid var(--color-example-border);
  border-radius: 0.5rem;
}

.worked-example h4 {
  margin: 0 0 0.5rem;
}

.context {
  margin: 0 0 0.75rem;
  font-style: italic;
}

.steps {
  margin: 0;
  padding-left: 1.5rem;
}

.steps li {
  margin-bottom: 0.5rem;
}

.steps li:last-child {
  margin-bottom: 0;
}

.step-desc {
  display: inline;
}

.step-calc {
  display: block;
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-calc-bg);
  border-radius: 0.25rem;
  font-family: monospace;
}
</style>
