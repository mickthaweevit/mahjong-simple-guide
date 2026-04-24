<!-- src/components/SectionPayout.vue -->
<script setup lang="ts">
import PointTable from './PointTable.vue'
import PaymentRuleCard from './PaymentRuleCard.vue'
import WorkedExample from './WorkedExample.vue'
import BeginnerExplanation from './BeginnerExplanation.vue'
import { pointTranslationTables, paymentRules, workedExamples } from '../data/scoring'

const payoutRelatedRuleIds = new Set(['exponential', 'self-draw', 'win-by-discard'])
const payoutExamples = workedExamples.filter((e) => payoutRelatedRuleIds.has(e.relatedRuleId))
</script>

<template>
  <section id="payout">
    <h2>{{ $t('sections.payout.heading') }}</h2>

    <p class="formula-explanation">{{ $t('sections.payout.formulaExplanation') }}</p>

    <PointTable
      v-for="table in pointTranslationTables"
      :key="table.id"
      :table="table"
    />

    <PaymentRuleCard
      v-for="rule in paymentRules"
      :key="rule.id"
      :rule="rule"
    />

    <aside class="dealer-modifier-note" role="note">
      <p>{{ $t('sections.payout.dealerModifierNote') }}</p>
      <BeginnerExplanation text-key="sections.payout.dealerModifierBeginner" />
    </aside>

    <WorkedExample
      v-for="example in payoutExamples"
      :key="example.id"
      :example="example"
    />
  </section>
</template>

<style scoped>
section {
  padding: 1.5rem 0;
}

h2 {
  margin-bottom: 1.5rem;
}

.formula-explanation {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.dealer-modifier-note {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-highlight-bg);
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-accent);
  font-size: 0.95rem;
}
</style>
