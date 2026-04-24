import type {
  ScoringEntry,
  ScoringCategory,
  PointTranslationTable,
  PaymentRule,
  BaoTrigger,
  WorkedExample
} from '../types/scoring'

/** Ordered list of scoring categories for display */
export const scoringCategoryOrder: ScoringCategory[] = [
  'basic',
  'suit-based',
  'pung-based',
  'dragon',
  'wind',
  'honor',
  'special'
]

/** i18n key for each category heading */
export const scoringCategoryKeys: Record<ScoringCategory, string> = {
  'basic': 'sections.handScoring.categoryBasic',
  'suit-based': 'sections.handScoring.categorySuitBased',
  'pung-based': 'sections.handScoring.categoryPungBased',
  'dragon': 'sections.handScoring.categoryDragon',
  'wind': 'sections.handScoring.categoryWind',
  'honor': 'sections.handScoring.categoryHonor',
  'special': 'sections.handScoring.categorySpecial'
}

/** Group scoring entries by category, preserving order */
export function groupedScoringEntries(): { category: ScoringCategory; titleKey: string; entries: ScoringEntry[] }[] {
  return scoringCategoryOrder
    .map(cat => ({
      category: cat,
      titleKey: scoringCategoryKeys[cat],
      entries: scoringEntries.filter(e => e.category === cat)
    }))
    .filter(g => g.entries.length > 0)
}

export const scoringEntries: ScoringEntry[] = [
  // ── Basic ──
  {
    id: 'common-hand',
    englishName: 'Common Hand (Ping Hu)',
    chineseName: '平糊',
    faan: 1,
    category: 'basic',
    descriptionKey: 'scoring.commonHand.description',
    beginnerExplanationKey: 'scoring.commonHand.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'dragon-pung',
    englishName: 'Dragon Pung',
    chineseName: '箭刻',
    faan: 1,
    category: 'basic',
    descriptionKey: 'scoring.dragonPung.description',
    beginnerExplanationKey: 'scoring.dragonPung.beginner',
    notesKey: 'scoring.dragonPung.notes',
    isMaxLimit: false,
    stackable: true
  },
  // ── Suit-Based ──
  {
    id: 'mixed-one-suit',
    englishName: 'Mixed One Suit',
    chineseName: '混一色',
    faan: 3,
    category: 'suit-based',
    descriptionKey: 'scoring.mixedOneSuit.description',
    beginnerExplanationKey: 'scoring.mixedOneSuit.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'full-one-suit',
    englishName: 'Full One Suit',
    chineseName: '清一色',
    faan: 7,
    category: 'suit-based',
    descriptionKey: 'scoring.fullOneSuit.description',
    beginnerExplanationKey: 'scoring.fullOneSuit.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'nine-gates',
    englishName: 'Nine Gates',
    chineseName: '九蓮寶燈',
    faan: 8,
    category: 'suit-based',
    descriptionKey: 'scoring.nineGates.description',
    beginnerExplanationKey: 'scoring.nineGates.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  // ── Pung-Based ──
  {
    id: 'all-pungs',
    englishName: 'All Pungs',
    chineseName: '對對糊',
    faan: 3,
    category: 'pung-based',
    descriptionKey: 'scoring.allPungs.description',
    beginnerExplanationKey: 'scoring.allPungs.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'mixed-terminals',
    englishName: 'Mixed Terminals',
    chineseName: '混么九',
    faan: 5,
    category: 'pung-based',
    descriptionKey: 'scoring.mixedTerminals.description',
    beginnerExplanationKey: 'scoring.mixedTerminals.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'all-terminals',
    englishName: 'All Terminals',
    chineseName: '清么九',
    faan: 8,
    category: 'pung-based',
    descriptionKey: 'scoring.allTerminals.description',
    beginnerExplanationKey: 'scoring.allTerminals.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  // ── Dragon Hands ──
  {
    id: 'small-three-dragons',
    englishName: 'Small Three Dragons',
    chineseName: '小三元',
    faan: 5,
    category: 'dragon',
    descriptionKey: 'scoring.smallThreeDragons.description',
    beginnerExplanationKey: 'scoring.smallThreeDragons.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'great-three-dragons',
    englishName: 'Great Three Dragons',
    chineseName: '大三元',
    faan: 8,
    category: 'dragon',
    descriptionKey: 'scoring.greatThreeDragons.description',
    beginnerExplanationKey: 'scoring.greatThreeDragons.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  // ── Wind Hands ──
  {
    id: 'small-four-winds',
    englishName: 'Small Four Winds',
    chineseName: '小四喜',
    faan: 6,
    category: 'wind',
    descriptionKey: 'scoring.smallFourWinds.description',
    beginnerExplanationKey: 'scoring.smallFourWinds.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'great-four-winds',
    englishName: 'Great Four Winds',
    chineseName: '大四喜',
    faan: 8,
    category: 'wind',
    descriptionKey: 'scoring.greatFourWinds.description',
    beginnerExplanationKey: 'scoring.greatFourWinds.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  // ── Honor Hands ──
  {
    id: 'all-honors',
    englishName: 'All Honors',
    chineseName: '字一色',
    faan: 8,
    category: 'honor',
    descriptionKey: 'scoring.allHonors.description',
    beginnerExplanationKey: 'scoring.allHonors.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  // ── Special Hands ──
  {
    id: 'seven-pairs',
    englishName: 'Seven Pairs',
    chineseName: '七對子',
    faan: 4,
    category: 'special',
    descriptionKey: 'scoring.sevenPairs.description',
    beginnerExplanationKey: 'scoring.sevenPairs.beginner',
    notesKey: null,
    isMaxLimit: false
  },
  {
    id: 'thirteen-orphans',
    englishName: 'Thirteen Orphans',
    chineseName: '十三么',
    faan: 8,
    category: 'special',
    descriptionKey: 'scoring.thirteenOrphans.description',
    beginnerExplanationKey: 'scoring.thirteenOrphans.beginner',
    notesKey: null,
    isMaxLimit: true
  },
  {
    id: 'all-green',
    englishName: 'All Green (Ryuuiisou)',
    chineseName: '緑一色',
    faan: 8,
    category: 'special',
    descriptionKey: 'scoring.allGreen.description',
    beginnerExplanationKey: 'scoring.allGreen.beginner',
    notesKey: null,
    isMaxLimit: true
  }
]


export const baoTriggers: BaoTrigger[] = [
  {
    id: 'bao-full-one-suit',
    titleKey: 'sections.baoPenalty.trigger.fullOneSuit.title',
    descriptionKey: 'sections.baoPenalty.trigger.fullOneSuit.description'
  },
  {
    id: 'bao-great-three-dragons',
    titleKey: 'sections.baoPenalty.trigger.greatThreeDragons.title',
    descriptionKey: 'sections.baoPenalty.trigger.greatThreeDragons.description'
  },
  {
    id: 'bao-great-four-winds',
    titleKey: 'sections.baoPenalty.trigger.greatFourWinds.title',
    descriptionKey: 'sections.baoPenalty.trigger.greatFourWinds.description'
  },
  {
    id: 'bao-all-pungs',
    titleKey: 'sections.baoPenalty.trigger.allPungs.title',
    descriptionKey: 'sections.baoPenalty.trigger.allPungs.description'
  }
]

export const pointTranslationTables: PointTranslationTable[] = [
  {
    id: 'exponential',
    titleKey: 'pointTable.exponential.title',
    minFaan: 1,
    maxFaan: 8,
    rows: [
      { faanRange: '1', points: 2 },
      { faanRange: '2', points: 4 },
      { faanRange: '3', points: 8 },
      { faanRange: '4', points: 16 },
      { faanRange: '5', points: 32 },
      { faanRange: '6', points: 64 },
      { faanRange: '7', points: 128 },
      { faanRange: '8 (Limit)', points: 256 }
    ]
  }
]

export const paymentRules: PaymentRule[] = [
  {
    id: 'self-draw',
    titleKey: 'payment.selfDraw.title',
    descriptionKey: 'payment.selfDraw.description',
    beginnerExplanationKey: 'payment.selfDraw.beginner',
    multiplier: '+1 Fan'
  },
  {
    id: 'win-by-discard',
    titleKey: 'payment.winByDiscard.title',
    descriptionKey: 'payment.winByDiscard.description',
    beginnerExplanationKey: 'payment.winByDiscard.beginner',
    multiplier: null
  }
]

export const workedExamples: WorkedExample[] = [
  {
    id: 'example-exponential-basic',
    titleKey: 'example.exponential.basic.title',
    contextKey: 'example.exponential.basic.context',
    steps: [
      {
        stepNumber: 1,
        descriptionKey: 'example.exponential.basic.step1.desc',
        calculationKey: 'example.exponential.basic.step1.calc'
      },
      {
        stepNumber: 2,
        descriptionKey: 'example.exponential.basic.step2.desc',
        calculationKey: 'example.exponential.basic.step2.calc'
      },
      {
        stepNumber: 3,
        descriptionKey: 'example.exponential.basic.step3.desc',
        calculationKey: 'example.exponential.basic.step3.calc'
      }
    ],
    relatedRuleId: 'exponential'
  },
  {
    id: 'example-self-draw',
    titleKey: 'example.selfDraw.title',
    contextKey: 'example.selfDraw.context',
    steps: [
      {
        stepNumber: 1,
        descriptionKey: 'example.selfDraw.step1.desc',
        calculationKey: 'example.selfDraw.step1.calc'
      },
      {
        stepNumber: 2,
        descriptionKey: 'example.selfDraw.step2.desc',
        calculationKey: 'example.selfDraw.step2.calc'
      },
      {
        stepNumber: 3,
        descriptionKey: 'example.selfDraw.step3.desc',
        calculationKey: 'example.selfDraw.step3.calc'
      }
    ],
    relatedRuleId: 'self-draw'
  },
  {
    id: 'example-win-by-discard',
    titleKey: 'example.winByDiscard.title',
    contextKey: 'example.winByDiscard.context',
    steps: [
      {
        stepNumber: 1,
        descriptionKey: 'example.winByDiscard.step1.desc',
        calculationKey: 'example.winByDiscard.step1.calc'
      },
      {
        stepNumber: 2,
        descriptionKey: 'example.winByDiscard.step2.desc',
        calculationKey: 'example.winByDiscard.step2.calc'
      },
      {
        stepNumber: 3,
        descriptionKey: 'example.winByDiscard.step3.desc',
        calculationKey: 'example.winByDiscard.step3.calc'
      },
      {
        stepNumber: 4,
        descriptionKey: 'example.winByDiscard.step4.desc',
        calculationKey: 'example.winByDiscard.step4.calc'
      }
    ],
    relatedRuleId: 'win-by-discard'
  },
  {
    id: 'example-biting',
    titleKey: 'example.biting.title',
    contextKey: 'example.biting.context',
    steps: [
      {
        stepNumber: 1,
        descriptionKey: 'example.biting.step1.desc',
        calculationKey: 'example.biting.step1.calc'
      },
      {
        stepNumber: 2,
        descriptionKey: 'example.biting.step2.desc',
        calculationKey: 'example.biting.step2.calc'
      },
      {
        stepNumber: 3,
        descriptionKey: 'example.biting.step3.desc',
        calculationKey: 'example.biting.step3.calc'
      }
    ],
    relatedRuleId: 'biting'
  },
  {
    id: 'example-bao',
    titleKey: 'example.bao.title',
    contextKey: 'example.bao.context',
    steps: [
      {
        stepNumber: 1,
        descriptionKey: 'example.bao.step1.desc',
        calculationKey: 'example.bao.step1.calc'
      },
      {
        stepNumber: 2,
        descriptionKey: 'example.bao.step2.desc',
        calculationKey: 'example.bao.step2.calc'
      },
      {
        stepNumber: 3,
        descriptionKey: 'example.bao.step3.desc',
        calculationKey: 'example.bao.step3.calc'
      },
      {
        stepNumber: 4,
        descriptionKey: 'example.bao.step4.desc',
        calculationKey: 'example.bao.step4.calc'
      }
    ],
    relatedRuleId: 'bao-penalty'
  }
]