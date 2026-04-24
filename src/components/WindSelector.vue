<!-- src/components/WindSelector.vue -->
<!-- Two radio button groups for Round Wind and Seat Wind selection -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WindTile } from '../engine/types'

defineProps<{
  roundWind: WindTile
  seatWind: WindTile
}>()

const emit = defineEmits<{
  'update:roundWind': [wind: WindTile]
  'update:seatWind': [wind: WindTile]
}>()

const { t } = useI18n()

const windOptions: { value: WindTile; labelKey: string }[] = [
  { value: 'f1', labelKey: 'sections.handSimulation.windEast' },
  { value: 'f2', labelKey: 'sections.handSimulation.windSouth' },
  { value: 'f3', labelKey: 'sections.handSimulation.windWest' },
  { value: 'f4', labelKey: 'sections.handSimulation.windNorth' },
]
</script>

<template>
  <div class="wind-selector">
    <fieldset class="wind-group">
      <legend class="wind-legend">{{ t('sections.handSimulation.roundWind', 'Round Wind') }}</legend>
      <div class="wind-options">
        <label
          v-for="option in windOptions"
          :key="`round-${option.value}`"
          class="wind-option"
          :class="{ selected: roundWind === option.value }"
        >
          <input
            type="radio"
            name="round-wind"
            :value="option.value"
            :checked="roundWind === option.value"
            class="wind-radio"
            @change="emit('update:roundWind', option.value)"
          />
          <span class="wind-label">{{ t(option.labelKey) }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="wind-group">
      <legend class="wind-legend">{{ t('sections.handSimulation.seatWind', 'Seat Wind') }}</legend>
      <div class="wind-options">
        <label
          v-for="option in windOptions"
          :key="`seat-${option.value}`"
          class="wind-option"
          :class="{ selected: seatWind === option.value }"
        >
          <input
            type="radio"
            name="seat-wind"
            :value="option.value"
            :checked="seatWind === option.value"
            class="wind-radio"
            @change="emit('update:seatWind', option.value)"
          />
          <span class="wind-label">{{ t(option.labelKey) }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.wind-selector {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.wind-group {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.wind-legend {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary-text, #666);
  padding: 0;
  margin-bottom: 0.2rem;
}

.wind-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wind-option {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.wind-option:hover {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.wind-option:has(.wind-radio:focus-visible) {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

.wind-option.selected {
  background: var(--color-accent, #4a90d9);
  border-color: var(--color-accent, #4a90d9);
  color: #fff;
}

.wind-radio {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.wind-label {
  user-select: none;
}

/* Mobile (<768px): stack wind groups vertically */
@media (max-width: 767px) {
  .wind-selector {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .wind-option {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
