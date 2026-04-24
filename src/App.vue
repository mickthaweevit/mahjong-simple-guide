<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { scoringEntries } from './data/scoring'
import { useSearch } from './composables/useSearch'
import { useNavigation } from './composables/useNavigation'
import AppNavigation from './components/AppNavigation.vue'
import AppSearch from './components/AppSearch.vue'
import ScoringEntry from './components/ScoringEntry.vue'
import SectionGameSetup from './components/SectionGameSetup.vue'
import SectionTileIntroduction from './components/SectionTileIntroduction.vue'
import SectionGameRotation from './components/SectionGameRotation.vue'
import SectionGameplayFlow from './components/SectionGameplayFlow.vue'
import SectionWinningStructure from './components/SectionWinningStructure.vue'
import SectionHandScoring from './components/SectionHandScoring.vue'
import SectionFlowersSeasons from './components/SectionFlowersSeasons.vue'
import SectionPayout from './components/SectionPayout.vue'
import SectionBaoPenalty from './components/SectionBaoPenalty.vue'
import SectionSpecialRules from './components/SectionSpecialRules.vue'
import HandSimulator from './components/HandSimulator.vue'

const { t } = useI18n()

const searchTerm = ref('')
const { filteredEntries, hasResults, isSearching } = useSearch(searchTerm, scoringEntries, t)
const { activeSection, scrollToSection } = useNavigation()
</script>

<template>
  <div class="app-layout">
    <AppNavigation
      :active-section="activeSection"
      @navigate="scrollToSection"
    />
    <main class="content-area">
      <AppSearch v-model="searchTerm" />

      <!-- Search results mode -->
      <template v-if="isSearching">
        <section v-if="hasResults" class="search-results">
          <ScoringEntry
            v-for="entry in filteredEntries"
            :key="entry.id"
            :entry="entry"
          />
        </section>
        <section v-else class="no-results">
          <p>{{ $t('search.noResults') }}</p>
        </section>
      </template>

      <!-- Full section layout — sections in learning progression order -->
      <template v-else>
        <SectionGameSetup />
        <SectionTileIntroduction />
        <SectionGameRotation />
        <SectionGameplayFlow />
        <SectionWinningStructure />
        <SectionHandScoring />
        <SectionFlowersSeasons />
        <SectionPayout />
        <SectionBaoPenalty />
        <SectionSpecialRules />
        <HandSimulator />
      </template>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  padding: 1rem;
  max-width: 860px;
  margin: 0 auto;
}

.search-results {
  margin-top: 1rem;
}

.no-results {
  margin-top: 2rem;
  text-align: center;
  color: var(--color-secondary-text, #555);
  font-size: 1.1rem;
}

@media (max-width: 767px) {
  .app-layout {
    flex-direction: column;
  }
}
</style>
