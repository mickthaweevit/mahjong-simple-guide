<!-- src/components/MahjongHand.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getTileImageUrl, getTileName } from '../data/tiles'
import type { ExampleHandData } from '../data/tiles'

const props = defineProps<{
  hand: ExampleHandData
}>()

const { t, locale } = useI18n()
</script>

<template>
  <div class="mahjong-hand" role="img" :aria-label="t(hand.descriptionKey)">
    <p class="hand-label">{{ t('exampleHand.label') }}</p>
    <div class="hand-tiles">
      <div
        v-for="(group, gi) in hand.groups"
        :key="gi"
        class="tile-group"
      >
        <div class="tiles">
          <img
            v-for="(tile, ti) in group.tiles"
            :key="`${gi}-${ti}`"
            :src="getTileImageUrl(tile, 46)"
            :alt="getTileName(tile, locale)"
            class="tile-img"
            loading="lazy"
            width="38"
            height="46"
          />
        </div>
        <span v-if="group.label" class="group-label">{{ group.label }}</span>
      </div>
    </div>
    <p class="hand-attribution">
      <a
        href="https://commons.wikimedia.org/wiki/Category:SVG_Oblique_illustrations_of_Mahjong_tiles"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('exampleHand.attribution') }}
      </a>
    </p>
  </div>
</template>

<style scoped>
.mahjong-hand {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--color-example-bg);
  border: 1px solid var(--color-example-border);
  border-radius: 0.5rem;
}

.hand-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-secondary-text);
}

.hand-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-end;
}

.tile-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.tiles {
  display: flex;
  gap: 1px;
}

.tile-img {
  display: block;
  height: 46px;
  width: auto;
  border-radius: 2px;
}

.group-label {
  font-size: 0.7rem;
  color: var(--color-secondary-text);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.hand-attribution {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: var(--color-secondary-text);
}

.hand-attribution a {
  color: var(--color-secondary-text);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .tile-img {
    height: 36px;
  }

  .hand-tiles {
    gap: 0.35rem;
  }
}
</style>
