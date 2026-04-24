<!-- src/components/SectionGameRotation.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
</script>

<template>
  <section id="game-rotation">
    <h2>{{ $t('sections.gameRotation.heading') }}</h2>

    <div class="concept">
      <h3>Round Structure</h3>
      <p>{{ $t('sections.gameRotation.roundStructure') }}</p>
      <BeginnerExplanation text-key="sections.gameRotation.roundStructureBeginner" />
    </div>

    <div class="concept">
      <h3>Dealer Rotation</h3>
      <p>{{ $t('sections.gameRotation.dealerRotation') }}</p>
      <BeginnerExplanation text-key="sections.gameRotation.dealerRotationBeginner" />
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
