<!-- src/components/TablePositionSelector.vue -->
<!-- Visual mahjong table for selecting which opponent discarded the winning tile -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WindTile } from '../engine/types'

const props = defineProps<{
  roundWind: WindTile
  seatWind: WindTile
  showShooterSelect: boolean
  discardedFrom: WindTile | null
}>()

const emit = defineEmits<{
  'update:roundWind': [wind: WindTile]
  'update:seatWind': [wind: WindTile]
  'update:discardedFrom': [wind: WindTile | null]
}>()

const { t } = useI18n()

const winds: WindTile[] = ['f1', 'f2', 'f3', 'f4']

const windLabels: Record<WindTile, string> = {
  f1: 'East',
  f2: 'South',
  f3: 'West',
  f4: 'North',
}

const windEmoji: Record<WindTile, string> = {
  f1: '🀀',
  f2: '🀁',
  f3: '🀂',
  f4: '🀃',
}

function windLabel(w: WindTile): string {
  const key = `sections.handSimulation.wind${windLabels[w]}`
  return t(key)
}

/**
 * Compute the three opponent winds based on the user's seat wind.
 * Mahjong seating is counterclockwise: E → S → W → N.
 * The user sits at the bottom. Opponents are placed:
 *   - right: next player (counterclockwise)
 *   - across: player opposite
 *   - left: previous player
 */
const opponents = computed(() => {
  const idx = winds.indexOf(props.seatWind)
  const right = winds[(idx + 1) % 4]
  const across = winds[(idx + 2) % 4]
  const left = winds[(idx + 3) % 4]
  return { right, across, left }
})

function selectShooter(w: WindTile) {
  if (!props.showShooterSelect) return
  emit('update:discardedFrom', w)
}
</script>

<template>
  <div class="table-position-selector">
    <!-- Shooter hint -->
    <p v-if="showShooterSelect" class="shooter-hint">
      {{ t('sections.handSimulation.shooterHint', 'Click an opponent on the table to mark who discarded the winning tile') }}
    </p>

    <!-- The Table -->
    <div class="table-wrapper" role="group" :aria-label="t('sections.handSimulation.tableAriaLabel', 'Mahjong table — select who discarded the winning tile')">
      <div class="mahjong-table">
        <!-- Center area -->
        <div class="table-center">
          <span class="table-emoji" aria-hidden="true">🀄</span>
          <span class="table-round-label">{{ windLabel(roundWind) }} {{ t('sections.handSimulation.roundLabel', 'Round') }}</span>
        </div>

        <!-- Across (top) opponent -->
        <div
          class="seat seat-top"
          :class="{
            'is-shooter': showShooterSelect && discardedFrom === opponents.across,
            'clickable': showShooterSelect,
          }"
          :role="showShooterSelect ? 'button' : undefined"
          :tabindex="showShooterSelect ? 0 : -1"
          :aria-pressed="showShooterSelect ? (discardedFrom === opponents.across) : undefined"
          :aria-label="t('sections.handSimulation.opponentSeat', { wind: windLabel(opponents.across) })"
          @click="selectShooter(opponents.across)"
          @keydown.enter.prevent="selectShooter(opponents.across)"
          @keydown.space.prevent="selectShooter(opponents.across)"
        >
          <span class="seat-emoji" aria-hidden="true">{{ windEmoji[opponents.across] }}</span>
          <span class="seat-wind-name">{{ windLabel(opponents.across) }}</span>
          <span v-if="showShooterSelect && discardedFrom === opponents.across" class="shooter-badge">{{ t('sections.handSimulation.shooter', '🎯 Shooter') }}</span>
        </div>

        <!-- Left opponent -->
        <div
          class="seat seat-left"
          :class="{
            'is-shooter': showShooterSelect && discardedFrom === opponents.left,
            'clickable': showShooterSelect,
          }"
          :role="showShooterSelect ? 'button' : undefined"
          :tabindex="showShooterSelect ? 0 : -1"
          :aria-pressed="showShooterSelect ? (discardedFrom === opponents.left) : undefined"
          :aria-label="t('sections.handSimulation.opponentSeat', { wind: windLabel(opponents.left) })"
          @click="selectShooter(opponents.left)"
          @keydown.enter.prevent="selectShooter(opponents.left)"
          @keydown.space.prevent="selectShooter(opponents.left)"
        >
          <span class="seat-emoji" aria-hidden="true">{{ windEmoji[opponents.left] }}</span>
          <span class="seat-wind-name">{{ windLabel(opponents.left) }}</span>
          <span v-if="showShooterSelect && discardedFrom === opponents.left" class="shooter-badge">{{ t('sections.handSimulation.shooter', '🎯 Shooter') }}</span>
        </div>

        <!-- Right opponent -->
        <div
          class="seat seat-right"
          :class="{
            'is-shooter': showShooterSelect && discardedFrom === opponents.right,
            'clickable': showShooterSelect,
          }"
          :role="showShooterSelect ? 'button' : undefined"
          :tabindex="showShooterSelect ? 0 : -1"
          :aria-pressed="showShooterSelect ? (discardedFrom === opponents.right) : undefined"
          :aria-label="t('sections.handSimulation.opponentSeat', { wind: windLabel(opponents.right) })"
          @click="selectShooter(opponents.right)"
          @keydown.enter.prevent="selectShooter(opponents.right)"
          @keydown.space.prevent="selectShooter(opponents.right)"
        >
          <span class="seat-emoji" aria-hidden="true">{{ windEmoji[opponents.right] }}</span>
          <span class="seat-wind-name">{{ windLabel(opponents.right) }}</span>
          <span v-if="showShooterSelect && discardedFrom === opponents.right" class="shooter-badge">{{ t('sections.handSimulation.shooter', '🎯 Shooter') }}</span>
        </div>

        <!-- User seat (bottom) -->
        <div class="seat seat-bottom seat-user">
          <span class="seat-emoji" aria-hidden="true">👤</span>
          <span class="seat-wind-name">{{ windLabel(seatWind) }}</span>
          <span class="you-label">{{ t('sections.handSimulation.youLabel', 'YOU') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-position-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.shooter-hint {
  font-size: 0.78rem;
  color: var(--color-secondary-text, #666);
  font-style: italic;
  margin: 0;
  text-align: center;
}

/* The Table */
.table-wrapper {
  display: flex;
  justify-content: center;
}

.mahjong-table {
  position: relative;
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, #2d6a30 0%, #1e4d20 100%);
  border-radius: 16px;
  border: 3px solid #8b6914;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.table-emoji {
  font-size: 1.5rem;
}

.table-round-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  white-space: nowrap;
}

/* Seats */
.seat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid transparent;
  transition: background 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  min-width: 70px;
}

.seat-emoji {
  font-size: 1.2rem;
}

.seat-wind-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

/* Positions */
.seat-top {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.seat-bottom {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.seat-left {
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.seat-right {
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

/* User seat */
.seat-user {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
}

.you-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Clickable opponents */
.seat.clickable {
  cursor: pointer;
}

.seat.clickable:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateX(-50%) scale(1.05);
}

.seat-left.clickable:hover {
  transform: translateY(-50%) scale(1.05);
}

.seat-right.clickable:hover {
  transform: translateY(-50%) scale(1.05);
}

.seat.clickable:focus-visible {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

/* Shooter highlight */
.seat.is-shooter {
  background: rgba(255, 60, 60, 0.35);
  border-color: #ff4444;
  box-shadow: 0 0 8px rgba(255, 68, 68, 0.4);
}

.seat-top.is-shooter:hover,
.seat-top.is-shooter {
  transform: translateX(-50%);
}

.seat-left.is-shooter:hover,
.seat-left.is-shooter {
  transform: translateY(-50%);
}

.seat-right.is-shooter:hover,
.seat-right.is-shooter {
  transform: translateY(-50%);
}

.shooter-badge {
  font-size: 0.6rem;
  font-weight: 600;
  color: #ff6b6b;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 480px) {
  .mahjong-table {
    width: 250px;
    height: 250px;
  }

  .seat {
    padding: 0.25rem 0.4rem;
    min-width: 60px;
  }

  .seat-emoji {
    font-size: 1rem;
  }

  .seat-wind-name {
    font-size: 0.65rem;
  }
}
</style>
