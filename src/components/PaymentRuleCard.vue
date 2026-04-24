<!-- src/components/PaymentRuleCard.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
import type { PaymentRule } from '../types/scoring'

defineProps<{
  rule: PaymentRule
}>()
</script>

<template>
  <article class="payment-rule-card">
    <header>
      <h3>{{ $t(rule.titleKey) }}</h3>
      <span v-if="rule.multiplier" class="multiplier-badge">
        {{ rule.multiplier }}
      </span>
    </header>
    <p class="description">{{ $t(rule.descriptionKey) }}</p>
    <BeginnerExplanation :text-key="rule.beginnerExplanationKey" />
  </article>
</template>

<style scoped>
.payment-rule-card {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.payment-rule-card header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.payment-rule-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.multiplier-badge {
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--color-faan-bg);
  white-space: nowrap;
  font-size: 0.9rem;
}

.description {
  margin: 0.5rem 0;
  line-height: 1.5;
}
</style>
