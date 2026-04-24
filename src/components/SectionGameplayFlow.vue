<!-- src/components/SectionGameplayFlow.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
</script>

<template>
  <section id="gameplay-flow">
    <h2>{{ $t('sections.gameplayFlow.heading') }}</h2>

    <div class="concept">
      <h3>{{ $t('sections.gameplayFlow.turnBasicsTitle') }}</h3>
      <p>{{ $t('sections.gameplayFlow.turnBasics') }}</p>
      <BeginnerExplanation text-key="sections.gameplayFlow.turnBasicsBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.gameplayFlow.claimingTitle') }}</h3>
      <p>{{ $t('sections.gameplayFlow.claiming') }}</p>
      <BeginnerExplanation text-key="sections.gameplayFlow.claimingBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.gameplayFlow.claimPriorityTitle') }}</h3>
      <p>{{ $t('sections.gameplayFlow.claimPriority') }}</p>
      <BeginnerExplanation text-key="sections.gameplayFlow.claimPriorityBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.gameplayFlow.drawTitle') }}</h3>
      <p>{{ $t('sections.gameplayFlow.draw') }}</p>
      <BeginnerExplanation text-key="sections.gameplayFlow.drawBeginner" />
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
