<!-- src/components/PointTable.vue -->
<script setup lang="ts">
import type { PointTranslationTable } from '../types/scoring'

defineProps<{
  table: PointTranslationTable
}>()
</script>

<template>
  <div class="point-table">
    <h3>{{ $t(table.titleKey) }}</h3>
    <div class="table-meta">
      <span class="meta-item">
        <strong>{{ $t('pointTable.minFaan') }}:</strong> {{ table.minFaan }}
      </span>
      <span v-if="table.maxFaan !== null" class="meta-item">
        <strong>{{ $t('pointTable.maxFaan') }}:</strong> {{ table.maxFaan }}
      </span>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">{{ $t('pointTable.faanRange') }}</th>
          <th scope="col">{{ $t('pointTable.points') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row.faanRange">
          <td>{{ row.faanRange }}</td>
          <td>{{ row.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.point-table {
  margin-bottom: 1.5rem;
}

.point-table h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.table-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-secondary-text, #555);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border: 1px solid var(--color-border, #ddd);
}

th {
  background: var(--color-faan-bg, #f0f0f0);
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background: var(--color-highlight-bg, #fafafa);
}
</style>
