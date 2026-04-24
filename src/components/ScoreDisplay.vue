<!-- src/components/ScoreDisplay.vue -->
<!-- Displays Fan breakdown, matched patterns, and per-player payout calculation -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScoreResult } from '../engine/types'
import type { WindTile } from '../engine/types'

const props = defineProps<{
  result: ScoreResult | null
  selfDraw: boolean
  seatWind: WindTile
  discardedFrom: WindTile | null
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

const payoutPerPerson = computed(() => {
  if (!props.result || !props.result.isValid) return 0
  return props.result.payoutPerPerson
})

const isCapped = computed(() => {
  if (!props.result || !props.result.isValid) return false
  const rawTotal =
    props.result.matchedPatterns.reduce((sum, p) => sum + p.fan, 0) +
    props.result.bonusFan +
    props.result.windFan +
    props.result.selfDrawFan
  return rawTotal > 8
})

/** Opponents: the three winds that are not the user's seat wind */
const opponents = computed(() => {
  return winds.filter(w => w !== props.seatWind)
})

/** Per-player payout breakdown */
const playerPayouts = computed(() => {
  if (!props.result || !props.result.isValid) return []

  const base = payoutPerPerson.value

  if (props.selfDraw) {
    // Self-draw: all 3 opponents pay base amount each
    return opponents.value.map(w => ({
      wind: w,
      amount: base,
      isShooter: false,
    }))
  }

  // Discard win
  const shooter = props.discardedFrom
  return opponents.value.map(w => ({
    wind: w,
    amount: w === shooter ? base * 2 : base,
    isShooter: w === shooter,
  }))
})

const totalReceived = computed(() => {
  return playerPayouts.value.reduce((sum, p) => sum + p.amount, 0)
})
</script>

<template>
  <div class="score-display">
    <h3 class="score-heading">{{ t('sections.handSimulation.scoreHeading') }}</h3>

    <!-- Hand incomplete -->
    <p v-if="!result" class="status-message incomplete">
      {{ t('sections.handSimulation.handIncomplete') }}
    </p>

    <!-- Invalid hand -->
    <p v-else-if="!result.isValid" class="status-message invalid">
      {{ t('sections.handSimulation.handInvalid') }}
    </p>

    <!-- Valid hand: show breakdown -->
    <div v-else class="score-breakdown">
      <!-- Matched patterns -->
      <div class="section-group">
        <h4 class="section-label">{{ t('sections.handSimulation.matchedPatterns') }}</h4>
        <ul v-if="result.matchedPatterns.length > 0" class="pattern-list">
          <li
            v-for="pattern in result.matchedPatterns"
            :key="pattern.id"
            class="pattern-item"
          >
            <span class="pattern-name">
              {{ pattern.englishName }}
              <span class="chinese-name">({{ pattern.chineseName }})</span>
            </span>
            <span class="fan-value">+{{ pattern.fan }} {{ t('sections.handSimulation.fanUnit') }}</span>
          </li>
        </ul>
        <p v-else class="no-patterns">{{ t('sections.handSimulation.noPatterns') }}</p>
      </div>

      <!-- Bonus line items -->
      <div class="section-group">
        <ul class="bonus-list">
          <li v-if="result.bonusFan > 0" class="bonus-item">
            <span class="bonus-label">{{ t('sections.handSimulation.bonusFanLabel') }}</span>
            <span class="fan-value">+{{ result.bonusFan }} {{ t('sections.handSimulation.fanUnit') }}</span>
          </li>
          <li v-if="result.windFan > 0" class="bonus-item">
            <span class="bonus-label">{{ t('sections.handSimulation.windFanLabel') }}</span>
            <span class="fan-value">+{{ result.windFan }} {{ t('sections.handSimulation.fanUnit') }}</span>
          </li>
          <li v-if="result.selfDrawFan > 0" class="bonus-item">
            <span class="bonus-label">{{ t('sections.handSimulation.selfDrawFanLabel') }}</span>
            <span class="fan-value">+{{ result.selfDrawFan }} {{ t('sections.handSimulation.fanUnit') }}</span>
          </li>
        </ul>
      </div>

      <!-- Total Fan -->
      <div class="total-row">
        <span class="total-label">
          {{ t('sections.handSimulation.totalFanLabel') }}
          <span v-if="isCapped" class="capped-note">{{ t('sections.handSimulation.fanCapped') }}</span>
        </span>
        <span class="total-value">{{ result.totalFan }} {{ t('sections.handSimulation.fanUnit') }}</span>
      </div>

      <!-- Per-player payout breakdown -->
      <div class="payout-section">
        <h4 class="section-label">{{ t('sections.handSimulation.payoutBreakdown', 'Payout Breakdown') }}</h4>

        <div class="payout-method-tag" :class="selfDraw ? 'method-self-draw' : 'method-discard'">
          {{ selfDraw
            ? ('🤲 ' + t('sections.handSimulation.selfDrawOption', 'Self-Draw'))
            : ('🎯 ' + t('sections.handSimulation.discardWinOption', 'Win by Discard'))
          }}
        </div>

        <!-- No shooter selected warning -->
        <p v-if="!selfDraw && !discardedFrom" class="shooter-warning">
          {{ t('sections.handSimulation.selectShooterWarning', 'Select who discarded the winning tile on the table above') }}
        </p>

        <ul class="player-payout-list">
          <li
            v-for="p in playerPayouts"
            :key="p.wind"
            class="player-payout-item"
            :class="{ 'is-shooter-row': p.isShooter }"
          >
            <span class="player-wind">
              {{ windEmoji[p.wind] }} {{ windLabel(p.wind) }}
              <span v-if="p.isShooter" class="shooter-tag">{{ t('sections.handSimulation.shooterTag', 'Shooter') }}</span>
            </span>
            <span class="player-amount">
              {{ t('sections.handSimulation.paysYou', 'pays') }}
              <strong>{{ p.amount }}</strong>
              <span v-if="p.isShooter" class="double-note">(×2)</span>
            </span>
          </li>
        </ul>

        <div class="total-received-row">
          <span class="total-received-label">{{ t('sections.handSimulation.totalReceived', 'Total Received') }}</span>
          <span class="total-received-value">{{ totalReceived }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-display {
  padding: 1rem;
  border: 1px solid var(--color-border, #ccc);
  border-radius: 0.5rem;
  background: var(--color-example-bg, #f9f9f9);
}

.score-heading {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.status-message {
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  text-align: center;
}

.status-message.incomplete {
  color: var(--color-secondary-text, #666);
  font-style: italic;
}

.status-message.invalid {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary-text, #666);
}

.pattern-list,
.bonus-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pattern-item,
.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid var(--color-example-border, #eee);
  font-size: 0.9rem;
}

.pattern-item:last-child,
.bonus-item:last-child {
  border-bottom: none;
}

.pattern-name {
  flex: 1;
}

.chinese-name {
  color: var(--color-secondary-text, #555);
  font-size: 0.85rem;
}

.fan-value {
  font-weight: 600;
  white-space: nowrap;
  margin-left: 0.75rem;
  color: var(--color-accent, #4a90d9);
}

.no-patterns {
  margin: 0;
  padding: 0.35rem 0.5rem;
  font-size: 0.9rem;
  color: var(--color-secondary-text, #666);
  font-style: italic;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-highlight-bg, #f0f4ff);
  border-radius: 0.25rem;
  border-left: 4px solid var(--color-accent, #4a90d9);
}

.total-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.capped-note {
  font-weight: normal;
  font-size: 0.8rem;
  color: var(--color-secondary-text, #666);
  margin-left: 0.25rem;
}

.total-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-accent, #4a90d9);
}

/* Payout section */
.payout-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-example-bg, #fff);
  border: 1px solid var(--color-example-border, #eee);
  border-radius: 0.5rem;
}

.payout-method-tag {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.method-self-draw {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.method-discard {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffcc80;
}

.shooter-warning {
  margin: 0;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  color: #e65100;
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 4px;
  font-style: italic;
}

.player-payout-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.player-payout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid var(--color-example-border, #eee);
  font-size: 0.88rem;
}

.player-payout-item:last-child {
  border-bottom: none;
}

.player-payout-item.is-shooter-row {
  background: #fff5f5;
  border-radius: 4px;
}

.player-wind {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.shooter-tag {
  font-size: 0.65rem;
  font-weight: 600;
  color: #fff;
  background: #e53935;
  padding: 0.1rem 0.35rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.player-amount {
  font-size: 0.88rem;
}

.player-amount strong {
  font-size: 1rem;
  color: var(--color-accent, #c0392b);
}

.double-note {
  font-size: 0.75rem;
  color: #e53935;
  font-weight: 600;
  margin-left: 0.2rem;
}

.total-received-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-highlight-bg, #f0f4ff);
  border-radius: 0.25rem;
  border-left: 4px solid #2e7d32;
  margin-top: 0.25rem;
}

.total-received-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.total-received-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2e7d32;
}

/* Mobile (<768px): tighter layout */
@media (max-width: 767px) {
  .score-display {
    padding: 0.75rem;
  }

  .total-row {
    padding: 0.4rem;
  }

  .payout-section {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .score-display {
    padding: 0.6rem;
  }

  .pattern-item,
  .bonus-item {
    font-size: 0.85rem;
    padding: 0.3rem 0.35rem;
  }

  .total-row {
    padding: 0.35rem;
  }

  .player-payout-item {
    font-size: 0.82rem;
    padding: 0.3rem 0.4rem;
  }
}
</style>
