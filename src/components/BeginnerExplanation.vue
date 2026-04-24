<!-- src/components/BeginnerExplanation.vue -->
<script setup lang="ts">
defineProps<{
  textKey: string
}>()
</script>

<template>
  <aside class="beginner-explanation">
    <strong>{{ $t('beginner.label') }}</strong>
    <p>{{ $t(textKey) }}</p>
  </aside>
</template>

<style scoped>
.beginner-explanation {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-beginner-bg);
  border-radius: 0.5rem;
  border-left: 3px solid var(--color-beginner-border);
  font-size: 0.95rem;
}
</style>
