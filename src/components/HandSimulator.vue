<!-- src/components/HandSimulator.vue -->
<!-- Container component for the Hand Simulation feature -->
<!--
  Input flow:
  1. Tile picker → build hand
  2. Hand display
  3. Bonus tiles
  4. Round wind + Seat wind
  5. Win method (self-draw / discard)
  6. Table with shooter selection (only when discard win)
  7. Score display
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHandSimulator } from '../composables/useHandSimulator'
import TilePicker from './TilePicker.vue'
import HandDisplay from './HandDisplay.vue'
import BonusTileSelector from './BonusTileSelector.vue'
import WindSelector from './WindSelector.vue'
import TablePositionSelector from './TablePositionSelector.vue'
import ScoreDisplay from './ScoreDisplay.vue'

const { t } = useI18n()

const {
  handTiles,
  bonusTiles,
  roundWind,
  seatWind,
  selfDraw,
  discardedFrom,
  availableCounts,
  isHandFull,
  scoreResult,
  addTile,
  removeTile,
  toggleBonus,
  clearHand,
} = useHandSimulator()

function setWinMethod(method: 'self-draw' | 'discard') {
  if (method === 'self-draw') {
    selfDraw.value = true
    discardedFrom.value = null
  } else {
    selfDraw.value = false
  }
}
</script>

<template>
  <section id="hand-simulation" class="hand-simulation">
    <h2>
      <span class="section-icon" aria-hidden="true">🀄</span>
      {{ t('sections.handSimulation.heading', 'Hand Simulation') }}
    </h2>

    <!-- 1. Tile picker -->
    <TilePicker
      :available-counts="availableCounts"
      :disabled="isHandFull"
      @select="addTile"
    />

    <br>

    <!-- 2. Hand display + clear -->
    <HandDisplay
      :tiles="handTiles"
      @remove="removeTile"
    />

    <button v-if="handTiles.length > 0" type="button" class="clear-btn" @click="clearHand">
      {{ t('sections.handSimulation.clearHand', 'Clear Hand') }}
    </button>

    <div class="hand-options">
      <!-- 3. Bonus tiles -->
      <BonusTileSelector
        :selected="bonusTiles"
        @toggle="toggleBonus"
      />

      <!-- 4. Round wind + Seat wind -->
      <WindSelector
        :round-wind="roundWind"
        :seat-wind="seatWind"
        @update:round-wind="roundWind = $event"
        @update:seat-wind="seatWind = $event"
      />

      <!-- 5. Win method toggle -->
      <div class="win-method">
        <span class="win-method-label">{{ t('sections.handSimulation.winMethod', 'Win Method') }}:</span>
        <div class="win-method-options">
          <label class="win-method-option" :class="{ selected: selfDraw }">
            <input
              type="radio"
              name="win-method"
              value="self-draw"
              :checked="selfDraw"
              class="visually-hidden"
              @change="setWinMethod('self-draw')"
            />
            <span>🤲 {{ t('sections.handSimulation.selfDrawOption', 'Self-Draw') }}</span>
          </label>
          <label class="win-method-option" :class="{ selected: !selfDraw }">
            <input
              type="radio"
              name="win-method"
              value="discard"
              :checked="!selfDraw"
              class="visually-hidden"
              @change="setWinMethod('discard')"
            />
            <span>🎯 {{ t('sections.handSimulation.discardWinOption', 'Win by Discard') }}</span>
          </label>
        </div>
      </div>

      <!-- 6. Table with shooter selection (only when discard win) -->
      <TablePositionSelector
        v-if="!selfDraw"
        :round-wind="roundWind"
        :seat-wind="seatWind"
        :show-shooter-select="true"
        :discarded-from="discardedFrom"
        @update:round-wind="roundWind = $event"
        @update:seat-wind="seatWind = $event"
        @update:discarded-from="discardedFrom = $event"
      />

    </div>

    <!-- 7. Score display -->
    <ScoreDisplay
      :result="scoreResult"
      :self-draw="selfDraw"
      :seat-wind="seatWind"
      :discarded-from="discardedFrom"
    />
  </section>
</template>

<style scoped>
.hand-simulation {
  justify-items: center;
  background: linear-gradient(135deg, #f0f7f0 0%, #e8f4fd 100%);
  border: 2px solid var(--color-accent, #c0392b);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.hand-simulation h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.3em;
}

section {
  padding: 1.5rem 0;
}

h2 {
  margin-bottom: 1.5rem;
}

.hand-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

/* Win method */
.win-method {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.win-method-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary-text, #666);
}

.win-method-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.win-method-option {
  display: flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
}

.win-method-option:hover {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.win-method-option:has(input:focus-visible) {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

.win-method-option.selected {
  background: var(--color-accent, #c0392b);
  border-color: var(--color-accent, #c0392b);
  color: #fff;
}

.clear-btn {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  display: block;
  margin: 0.5rem auto 0;
}

.clear-btn:hover {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.clear-btn:focus-visible {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

/* Mobile (<768px): stack vertically, tighter spacing */
@media (max-width: 767px) {
  section {
    padding: 1rem 0;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .hand-options {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .clear-btn {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }

  .win-method-option {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
