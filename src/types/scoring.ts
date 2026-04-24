export type ScoringCategory =
  | 'basic'
  | 'suit-based'
  | 'pung-based'
  | 'dragon'
  | 'wind'
  | 'honor'
  | 'special'

export interface ScoringEntry {
  id: string
  englishName: string
  chineseName: string
  faan: number
  category: ScoringCategory
  descriptionKey: string
  beginnerExplanationKey: string
  notesKey: string | null
  isMaxLimit: boolean
  stackable?: boolean
}

export interface PointTranslationRow {
  faanRange: string
  points: number
}

export interface PointTranslationTable {
  id: string
  titleKey: string
  minFaan: number
  maxFaan: number | null
  rows: PointTranslationRow[]
}

export interface PaymentRule {
  id: string
  titleKey: string
  descriptionKey: string
  beginnerExplanationKey: string
  multiplier: string | null
}

export interface BaoTrigger {
  id: string
  titleKey: string
  descriptionKey: string
}

export interface WorkedExampleStep {
  stepNumber: number
  descriptionKey: string
  calculationKey: string | null
}

export interface WorkedExample {
  id: string
  titleKey: string
  contextKey: string
  steps: WorkedExampleStep[]
  relatedRuleId: string
}
