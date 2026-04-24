<!-- src/components/HandDisplay.vue -->
<!-- Displays the current hand tiles with click-to-remove functionality -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getTileImageUrl, getTileName } from '../data/tiles'
import type { TileCode } from '../data/tiles'

defineProps<{
  tiles: TileCode[]
}>()

const emit = defineEmits<{
  remove: [index: number]
}>()

const { t, locale } = useI18n()
</script>

<template>
  <div
    class="hand-display"
    role="group"
    :aria-label="t('sections.handSimulation.yourHand', 'Your Hand')"
  >
    <p v-if="tiles.length === 0" class="empty-message">
      {{ t('sections.handSimulation.emptyHand', 'Select tiles above to build your hand') }}
    </p>
    <div v-else class="hand-tiles">
      <button
        v-for="(tile, index) in tiles"
        :key="`${tile}-${index}`"
        type="button"
        class="hand-tile-btn"
        :aria-label="`${t('sections.handSimulation.removeTile', 'Remove')} ${getTileName(tile, locale)}`"
        @click="emit('remove', index)"
      >
        <img
          :src="getTileImageUrl(tile, 46)"
          :alt="getTileName(tile, locale)"
          class="tile-img"
          loading="lazy"
          width="38"
          height="46"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.hand-display {
  padding: 0.75rem;
  background: var(--color-example-bg, #f9f9f9);
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 0.5rem;
  min-height: 70px;
}

.empty-message {
  color: var(--color-secondary-text, #666);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}

.hand-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: flex-end;
}

.hand-tile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 1px solid var(--color-example-border, #ccc);
  border-radius: 4px;
  background: var(--color-example-bg, #fff);
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.1s ease;
}

.hand-tile-btn:hover {
  box-shadow: 0 0 0 2px var(--color-accent, #4a90d9);
  transform: translateY(-2px);
}

.hand-tile-btn:focus-visible {
  outline: 2px solid var(--color-accent, #4a90d9);
  outline-offset: 2px;
}

.hand-tile-btn:active {
  transform: translateY(0);
}

.tile-img {
  display: block;
  height: 46px;
  width: auto;
  border-radius: 2px;
}

/* Mobile (<768px): reduce padding */
@media (max-width: 767px) {
  .hand-display {
    padding: 0.5rem;
  }

  .hand-tiles {
    gap: 3px;
  }
}

/* Small mobile: smaller tiles matching TileIllustration breakpoint */
@media (max-width: 480px) {
  .tile-img {
    height: 36px;
  }

  .hand-display {
    min-height: 56px;
  }

  .empty-message {
    min-height: 36px;
    font-size: 0.85rem;
  }

  .hand-tile-btn {
    padding: 1px;
  }

  .hand-tiles {
    gap: 2px;
  }
}
</style>
