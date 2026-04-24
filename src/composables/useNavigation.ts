// src/composables/useNavigation.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export const SECTIONS = ['game-setup', 'tile-introduction', 'game-rotation', 'gameplay-flow', 'winning-structure', 'hand-scoring', 'flowers-seasons', 'payout', 'bao-penalty', 'special-rules', 'hand-simulation'] as const

export function useNavigation(): {
  activeSection: Ref<string>
  scrollToSection: (id: string) => void
  SECTIONS: typeof SECTIONS
} {
  const activeSection = ref<string>(SECTIONS[0])
  let observer: IntersectionObserver | null = null

  function scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  onMounted(() => {
    if (!('IntersectionObserver' in window)) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer!.observe(el)
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { activeSection, scrollToSection, SECTIONS }
}
