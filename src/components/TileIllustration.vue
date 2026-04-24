<!-- src/components/TileIllustration.vue -->
<!-- Inline tile illustration for explaining concepts (Chow vs Pung, Kong, Bao triggers, etc.) -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getTileImageUrl, getTileName } from '../data/tiles'
import type { TileGroup } from '../data/tiles'

defineProps<{
  groups: TileGroup[]
  caption?: string
}>()

const { locale } = useI18n()
</script>

<template>
  <figure class="tile-illustration">
    <div class="tile-groups">
      <div
        v-for="(group, gi) in groups"
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
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.tile-illustration {
  margin: 0.75rem 0;
  padding: 0.6rem 0.75rem;
  background: var(--color-example-bg);
  border: 1px solid var(--color-example-border);
  border-radius: 0.5rem;
}

.tile-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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

figcaption {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-secondary-text);
  font-style: italic;
}

@media (max-width: 480px) {
  .tile-img {
    height: 36px;
  }
}
</style>
