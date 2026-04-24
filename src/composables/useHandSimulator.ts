import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { TileCode } from '../data/tiles'
import type { WindTile, ScoreResult } from '../engine/types'
import { calculateScore } from '../engine/fanCalculator'

/** All 34 unique standard tile codes */
const ALL_TILES: TileCode[] = [
  'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
  't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
  'f1', 'f2', 'f3', 'f4',
  'd1', 'd2', 'd3',
]

const MAX_HAND_SIZE = 14
const MAX_COPIES_PER_TILE = 4

export interface UseHandSimulatorReturn {
  // State
  handTiles: Ref<TileCode[]>
  bonusTiles: Ref<Set<string>>
  roundWind: Ref<WindTile>
  seatWind: Ref<WindTile>
  selfDraw: Ref<boolean>
  discardedFrom: Ref<WindTile | null>

  // Computed
  availableCounts: ComputedRef<Record<TileCode, number>>
  isHandFull: ComputedRef<boolean>
  scoreResult: ComputedRef<ScoreResult | null>

  // Actions
  addTile: (tile: TileCode) => void
  removeTile: (index: number) => void
  toggleBonus: (id: string) => void
  clearHand: () => void
}

export function useHandSimulator(): UseHandSimulatorReturn {
  // Reactive state
  const handTiles = ref<TileCode[]>([])
  const bonusTiles = ref<Set<string>>(new Set())
  const roundWind = ref<WindTile>('f1')
  const seatWind = ref<WindTile>('f1')
  const selfDraw = ref(false)
  const discardedFrom = ref<WindTile | null>(null)

  // Computed: remaining copies available for each tile (4 minus count in hand)
  const availableCounts = computed<Record<TileCode, number>>(() => {
    const counts = {} as Record<TileCode, number>
    for (const tile of ALL_TILES) {
      counts[tile] = MAX_COPIES_PER_TILE
    }
    for (const tile of handTiles.value) {
      counts[tile] -= 1
    }
    return counts
  })

  // Computed: whether the hand has reached 14 tiles
  const isHandFull = computed(() => handTiles.value.length >= MAX_HAND_SIZE)

  // Computed: score result — null when hand is incomplete, otherwise calculated
  const scoreResult = computed<ScoreResult | null>(() => {
    if (handTiles.value.length < MAX_HAND_SIZE) {
      return null
    }
    return calculateScore(handTiles.value, {
      roundWind: roundWind.value,
      seatWind: seatWind.value,
      selfDraw: selfDraw.value,
      bonusTileCount: bonusTiles.value.size,
    })
  })

  // Actions

  /** Add a tile to the hand. Rejects if hand is full or tile already has 4 copies. */
  function addTile(tile: TileCode): void {
    if (isHandFull.value) return
    if (availableCounts.value[tile] <= 0) return
    handTiles.value = [...handTiles.value, tile]
  }

  /** Remove the tile at the given index from the hand. */
  function removeTile(index: number): void {
    if (index < 0 || index >= handTiles.value.length) return
    const next = [...handTiles.value]
    next.splice(index, 1)
    handTiles.value = next
  }

  /** Toggle a bonus tile on or off. */
  function toggleBonus(id: string): void {
    const next = new Set(bonusTiles.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    bonusTiles.value = next
  }

  /** Reset all state to defaults. */
  function clearHand(): void {
    handTiles.value = []
    bonusTiles.value = new Set()
    selfDraw.value = false
    discardedFrom.value = null
    roundWind.value = 'f1'
    seatWind.value = 'f1'
  }

  return {
    handTiles,
    bonusTiles,
    roundWind,
    seatWind,
    selfDraw,
    discardedFrom,
    availableCounts,
    isHandFull,
    scoreResult,
    addTile,
    removeTile,
    toggleBonus,
    clearHand,
  }
}
