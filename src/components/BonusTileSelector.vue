<!-- src/components/BonusTileSelector.vue -->
<!-- Toggle buttons for 8 bonus tiles: Flower #1–#4 and Season #1–#4 -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  selected: Set<string>
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()

const { t } = useI18n()

/**
 * Wikimedia Commons SVG filenames for bonus tiles.
 * Flowers: MJh1-.svg to MJh4-.svg, Seasons: MJh5-.svg to MJh8-.svg
 * By Cangjie6, licensed under CC BY-SA 4.0.
 */
const bonusTiles: { id: string; group: 'flower' | 'season'; number: number; filename: string }[] = [
  { id: 'flower-1', group: 'flower', number: 1, filename: 'MJh1-.svg' },
  { id: 'flower-2', group: 'flower', number: 2, filename: 'MJh2-.svg' },
  { id: 'flower-3', group: 'flower', number: 3, filename: 'MJh3-.svg' },
  { id: 'flower-4', group: 'flower', number: 4, filename: 'MJh4-.svg' },
  { id: 'season-1', group: 'season', number: 1, filename: 'MJh5-.svg' },
  { id: 'season-2', group: 'season', number: 2, filename: 'MJh6-.svg' },
  { id: 'season-3', group: 'season', number: 3, filename: 'MJh7-.svg' },
  { id: 'season-4', group: 'season', number: 4, filename: 'MJh8-.svg' },
]

function getLabel(group: 'flower' | 'season', number: number): string {
  const groupLabel = group === 'flower'
    ? t('sections.handSimulation.flower', 'Flower')
    : t('sections.handSimulation.season', 'Season')
  return `${groupLabel} #${number}`
}

function getTileImageUrl(filename: string, width: number = 46): string {
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${filename}&width=${width}`
}
</script>

<template>
  <div
    class="bonus-tile-selector"
    role="group"
    :aria-label="t('sections.handSimulation.bonusTiles', 'Bonus Tiles')"
  >
    <span class="group-label">{{ t('sections.handSimulation.bonusTiles', 'Bonus Tiles') }}</span>
    <div class="bonus-buttons">
      <button
        v-for="tile in bonusTiles"
        :key="tile.id"
        type="button"
        class="bonus-btn"
        :class="{ selected: selected.has(tile.id) }"
        :aria-pressed="selected.has(tile.id)"
        :aria-label="getLabel(tile.group, tile.number)"
        :title="getLabel(tile.group, tile.number)"
        @click="emit('toggle', tile.id)"
      >
        <img
          :src="getTileImageUrl(tile.filename)"
          :alt="getLabel(tile.group, tile.number)"
          class="bonus-tile-img"
          loading="lazy"
          width="38"
          height="46"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bonus-tile-selector {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.group-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary-text, #666);
}

.bonus-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bonus-btn {
  padding: 2px;
  border: 2px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  line-height: 0;
}

.bonus-btn:hover {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.bonus-btn:focus-visible {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

.bonus-btn.selected {
  border-color: var(--color-accent, #4a90d9);
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.bonus-btn:not(.selected) {
  opacity: 0.55;
}

.bonus-btn:not(.selected):hover {
  opacity: 0.85;
}

.bonus-tile-img {
  display: block;
  height: 46px;
  width: auto;
  border-radius: 2px;
}

/* Mobile (<768px): tighter gaps */
@media (max-width: 767px) {
  .bonus-buttons {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .bonus-tile-img {
    height: 36px;
    width: auto;
  }
}
</style>
