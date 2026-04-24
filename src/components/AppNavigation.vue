<!-- src/components/AppNavigation.vue -->
<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  activeSection: { type: String, required: true }
})
const emit = defineEmits<{
  navigate: [sectionId: string]
}>()

const { currentLocale, toggleLocale } = useLocale()

const sections = [
  { id: 'game-setup', labelKey: 'nav.gameSetup', highlight: false },
  { id: 'tile-introduction', labelKey: 'nav.tileIntroduction', highlight: false },
  { id: 'game-rotation', labelKey: 'nav.gameRotation', highlight: false },
  { id: 'gameplay-flow', labelKey: 'nav.gameplayFlow', highlight: false },
  { id: 'winning-structure', labelKey: 'nav.winningStructure', highlight: false },
  { id: 'hand-scoring', labelKey: 'nav.handScoring', highlight: false },
  { id: 'flowers-seasons', labelKey: 'nav.flowersSeasons', highlight: false },
  { id: 'payout', labelKey: 'nav.payout', highlight: false },
  { id: 'bao-penalty', labelKey: 'nav.baoPenalty', highlight: false },
  { id: 'special-rules', labelKey: 'nav.specialRules', highlight: false },
  { id: 'hand-simulation', labelKey: 'nav.handSimulation', highlight: true }
]
</script>

<template>
  <nav class="app-nav" :aria-label="$t('nav.ariaLabel')">
    <ul class="nav-list">
      <li v-for="section in sections" :key="section.id" class="nav-item">
        <a
          href="#"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          :class="{ active: activeSection === section.id, 'nav-highlight': section.highlight }"
          class="nav-link"
          @click.prevent="emit('navigate', section.id)"
        >
          <span v-if="section.highlight" class="nav-icon" aria-hidden="true">🀄</span>
          {{ $t(section.labelKey) }}
        </a>
      </li>
    </ul>
    <button
      class="language-switcher"
      :aria-label="$t('nav.languageSwitcherLabel')"
      @click="toggleLocale"
    >
      {{ currentLocale === 'th' ? 'EN' : 'TH' }}
    </button>
  </nav>
</template>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  width: 240px;
  height: 100vh;
  padding: 1rem;
  border-right: 1px solid var(--color-border, #e0e0e0);
  background: var(--color-nav-bg, #fafafa);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: var(--color-text, #333);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-link:hover {
  background-color: var(--color-hover-bg, #eee);
}

.nav-link:focus-visible {
  outline: 2px solid var(--color-primary, #1a6fb5);
  outline-offset: 2px;
}

.nav-link.active {
  font-weight: bold;
  color: var(--color-primary, #1a6fb5);
  background-color: var(--color-active-bg, #e8f0fe);
}

.nav-highlight {
  font-weight: 600;
  border: 1px dashed var(--color-accent, #c0392b);
  background: var(--color-highlight-bg, #fef9f0);
}

.nav-highlight.active {
  border-style: solid;
  border-color: var(--color-accent, #c0392b);
  background: #fdecea;
  color: var(--color-accent, #c0392b);
}

.nav-icon {
  margin-right: 0.3rem;
  font-size: 0.9em;
}

.language-switcher {
  align-self: flex-end;
  margin-top: auto;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 0.375rem;
  background: var(--color-switcher-bg, #fff);
  color: var(--color-text, #333);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.language-switcher:hover {
  background-color: var(--color-hover-bg, #eee);
}

.language-switcher:focus-visible {
  outline: 2px solid var(--color-primary, #1a6fb5);
  outline-offset: 2px;
}

/* Mobile: horizontal scrollable bar */
@media (max-width: 767px) {
  .app-nav {
    position: sticky;
    top: 0;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: visible;
    border-right: none;
    border-bottom: 1px solid var(--color-border, #e0e0e0);
    padding: 0.5rem 1rem;
    gap: 0.5rem;
    z-index: 10;
  }

  .nav-list {
    flex-direction: row;
    flex: 0 0 auto;
    gap: 0.25rem;
    white-space: nowrap;
  }

  .nav-item {
    flex-shrink: 0;
  }

  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .language-switcher {
    margin-top: 0;
    flex-shrink: 0;
    margin-left: auto;
  }
}
</style>
