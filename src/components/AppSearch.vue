<!-- src/components/AppSearch.vue -->
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="search-wrapper">
    <input
      v-model="model"
      type="search"
      :placeholder="$t('search.placeholder')"
      :aria-label="$t('search.ariaLabel')"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}
</style>
