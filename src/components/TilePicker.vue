<!-- src/components/TilePicker.vue -->
<!-- Visual tile picker displaying all 34 unique Mahjong tiles organized by suit -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getTileImageUrl, getTileName } from '../data/tiles'
import type { TileCode } from '../data/tiles'

defineProps<{
  availableCounts: Record<TileCode, number>
  disabled: boolean
}>()

const emit = defineEmits<{
  select: [tile: TileCode]
}>()

const { locale } = useI18n()

/** All 34 unique tiles organized by suit */
const tileRows: { label: string; tiles: TileCode[] }[] = [
  {
    label: 'Characters',
    tiles: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9']
  },
  {
    label: 'Dots',
    tiles: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9']
  },
  {
    label: 'Bamboo',
    tiles: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9']
  },
  {
    label: 'Winds',
    tiles: ['f1', 'f2', 'f3', 'f4']
  },
  {
    label: 'Dragons',
    tiles: ['d1', 'd2', 'd3']
  }
]

function isTileDisabled(tile: TileCode, availableCounts: Record<TileCode, number>, disabled: boolean): boolean {
  return disabled || (availableCounts[tile] ?? 0) === 0
}

function handleSelect(tile: TileCode, availableCounts: Record<TileCode, number>, disabled: boolean): void {
  if (!isTileDisabled(tile, availableCounts, disabled)) {
    emit('select', tile)
  }
}
</script>

<template>
  <div class="tile-picker" role="group" :aria-label="$t('sections.handSimulation.tilePicker', 'Tile Picker')">
    <div
      v-for="row in tileRows"
      :key="row.label"
      class="tile-row"
    >
      <div class="tiles">
        <button
          v-for="tile in row.tiles"
          :key="tile"
          type="button"
          class="tile-btn"
          :class="{ unavailable: isTileDisabled(tile, availableCounts, disabled) }"
          :disabled="isTileDisabled(tile, availableCounts, disabled)"
          :aria-label="getTileName(tile, locale)"
          @click="handleSelect(tile, availableCounts, disabled)"
        >
          <img
            :src="getTileImageUrl(tile, 46)"
            :alt="getTileName(tile, locale)"
            class="tile-img"
            loading="lazy"
            width="38"
            height="46"
          />
          <span class="count-badge" aria-hidden="true">{{ availableCounts[tile] ?? 0 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-picker {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
}

.tile-row {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tile-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  cursor: pointer;
  transition: opacity 0.15s ease, box-shadow 0.15s ease;
}

.tile-btn:hover:not(:disabled) {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
}

.tile-btn:focus-visible {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

.tile-btn.unavailable {
  opacity: 0.35;
  cursor: not-allowed;
}

.tile-img {
  display: block;
  height: 46px;
  width: auto;
  border-radius: 2px;
}

.count-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background: var(--color-secondary-text, #666);
  border-radius: 8px;
}

.tile-btn.unavailable .count-badge {
  background: #999;
}

/* Mobile (<768px): tighter gaps */
@media (max-width: 767px) {
  .tile-picker {
    gap: 0.3rem;
  }

  .tiles {
    gap: 3px;
  }
}

/* Small mobile: smaller tiles matching TileIllustration breakpoint */
@media (max-width: 480px) {
  .tile-img {
    height: 36px;
  }

  .count-badge {
    min-width: 14px;
    height: 14px;
    font-size: 0.6rem;
    line-height: 14px;
  }

  .tile-btn {
    padding: 1px;
  }

  .tiles {
    gap: 2px;
  }
}
</style>
