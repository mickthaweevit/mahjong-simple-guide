<!-- src/components/SectionGameSetup.vue -->
<script setup lang="ts">
import BeginnerExplanation from './BeginnerExplanation.vue'
</script>

<template>
  <section id="game-setup">
    <h2>{{ $t('sections.gameSetup.heading') }}</h2>

    <div class="concept">
      <h3>{{ $t('sections.gameSetup.choosingSeatsTitle') }}</h3>
      <p>{{ $t('sections.gameSetup.choosingSeats') }}</p>
      <BeginnerExplanation text-key="sections.gameSetup.choosingSeatsBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.gameSetup.buildingWallTitle') }}</h3>
      <p>{{ $t('sections.gameSetup.buildingWall') }}</p>
      <BeginnerExplanation text-key="sections.gameSetup.buildingWallBeginner" />
    </div>

    <div class="concept">
      <h3>{{ $t('sections.gameSetup.dealingTitle') }}</h3>
      <p>{{ $t('sections.gameSetup.dealing') }}</p>
      <BeginnerExplanation text-key="sections.gameSetup.dealingBeginner" />
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
