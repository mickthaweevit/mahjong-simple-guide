/**
 * Mahjong tile definitions and Wikimedia Commons image URL mapping.
 *
 * Tile images by Cangjie6 (remake), Jerry Crimson Mann (original),
 * User:Dewclouds (vectorisation), licensed under CC BY-SA 4.0.
 * Source: https://commons.wikimedia.org/wiki/Category:SVG_Oblique_illustrations_of_Mahjong_tiles
 */

/** Tile code format: {suit}{number} e.g. "w1" = 1 Wan, "t5" = 5 Tong, "d2" = Green Dragon */
export type TileCode =
  | `w${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`   // Characters (萬)
  | `t${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`   // Dots (筒)
  | `s${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`   // Bamboo (索)
  | `f${1 | 2 | 3 | 4}`                          // Winds: East South West North
  | `d${1 | 2 | 3}`                              // Dragons: Red Green White

/**
 * Maps a tile code to its Wikimedia Commons SVG filename.
 * Naming convention: MJ{prefix}{number}-.svg
 */
function tileFilename(code: TileCode): string {
  const suit = code[0]
  const num = code.slice(1)
  const prefixMap: Record<string, string> = {
    w: 'w', t: 't', s: 's', f: 'f', d: 'd'
  }
  return `MJ${prefixMap[suit]}${num}-.svg`
}

/**
 * Returns a Wikimedia Commons thumbnail URL for a tile at the given pixel width.
 * Uses Special:Redirect which handles the hash-based path automatically.
 */
export function getTileImageUrl(code: TileCode, width: number = 40): string {
  const filename = tileFilename(code)
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${filename}&width=${width}`
}

/** Human-readable tile names for alt text / accessibility */
const TILE_NAMES: Record<string, Record<string, string>> = {
  en: {
    w1: '1 Character', w2: '2 Character', w3: '3 Character',
    w4: '4 Character', w5: '5 Character', w6: '6 Character',
    w7: '7 Character', w8: '8 Character', w9: '9 Character',
    t1: '1 Dot', t2: '2 Dot', t3: '3 Dot',
    t4: '4 Dot', t5: '5 Dot', t6: '6 Dot',
    t7: '7 Dot', t8: '8 Dot', t9: '9 Dot',
    s1: '1 Bamboo', s2: '2 Bamboo', s3: '3 Bamboo',
    s4: '4 Bamboo', s5: '5 Bamboo', s6: '6 Bamboo',
    s7: '7 Bamboo', s8: '8 Bamboo', s9: '9 Bamboo',
    f1: 'East Wind', f2: 'South Wind', f3: 'West Wind', f4: 'North Wind',
    d1: 'Red Dragon', d2: 'Green Dragon', d3: 'White Dragon'
  },
  th: {
    w1: 'อักษร 1', w2: 'อักษร 2', w3: 'อักษร 3',
    w4: 'อักษร 4', w5: 'อักษร 5', w6: 'อักษร 6',
    w7: 'อักษร 7', w8: 'อักษร 8', w9: 'อักษร 9',
    t1: 'จุด 1', t2: 'จุด 2', t3: 'จุด 3',
    t4: 'จุด 4', t5: 'จุด 5', t6: 'จุด 6',
    t7: 'จุด 7', t8: 'จุด 8', t9: 'จุด 9',
    s1: 'ไผ่ 1', s2: 'ไผ่ 2', s3: 'ไผ่ 3',
    s4: 'ไผ่ 4', s5: 'ไผ่ 5', s6: 'ไผ่ 6',
    s7: 'ไผ่ 7', s8: 'ไผ่ 8', s9: 'ไผ่ 9',
    f1: 'ลมตะวันออก', f2: 'ลมใต้', f3: 'ลมตะวันตก', f4: 'ลมเหนือ',
    d1: 'มังกรแดง', d2: 'มังกรเขียว', d3: 'มังกรขาว'
  }
}

export function getTileName(code: TileCode, locale: string): string {
  const lang = locale in TILE_NAMES ? locale : 'en'
  return TILE_NAMES[lang][code] ?? code
}

/** A group of tiles (set or pair) within an example hand */
export interface TileGroup {
  tiles: TileCode[]
  label?: string
}

/** An example hand showing tiles for a scoring pattern */
export interface ExampleHandData {
  scoringId: string
  descriptionKey: string
  groups: TileGroup[]
}

/**
 * Example hands for each scoring entry.
 * Each hand shows a realistic 14-tile winning hand that matches the scoring pattern.
 */
export const exampleHands: ExampleHandData[] = [
  {
    scoringId: 'common-hand',
    descriptionKey: 'exampleHand.commonHand',
    groups: [
      { tiles: ['w1', 'w2', 'w3'], label: 'Chow' },
      { tiles: ['t4', 't5', 't6'], label: 'Chow' },
      { tiles: ['t7', 't8', 't9'], label: 'Chow' },
      { tiles: ['s2', 's3', 's4'], label: 'Chow' },
      { tiles: ['s8', 's8'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'all-pungs',
    descriptionKey: 'exampleHand.allPungs',
    groups: [
      { tiles: ['w2', 'w2', 'w2'], label: 'Pung' },
      { tiles: ['t5', 't5', 't5'], label: 'Pung' },
      { tiles: ['s7', 's7', 's7'], label: 'Pung' },
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['d1', 'd1'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'mixed-one-suit',
    descriptionKey: 'exampleHand.mixedOneSuit',
    groups: [
      { tiles: ['w1', 'w2', 'w3'], label: 'Chow' },
      { tiles: ['w4', 'w5', 'w6'], label: 'Chow' },
      { tiles: ['w7', 'w8', 'w9'], label: 'Chow' },
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['w5', 'w5'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'full-one-suit',
    descriptionKey: 'exampleHand.fullOneSuit',
    groups: [
      { tiles: ['s1', 's2', 's3'], label: 'Chow' },
      { tiles: ['s3', 's4', 's5'], label: 'Chow' },
      { tiles: ['s5', 's6', 's7'], label: 'Chow' },
      { tiles: ['s7', 's8', 's9'], label: 'Chow' },
      { tiles: ['s1', 's1'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'dragon-pung',
    descriptionKey: 'exampleHand.dragonPung',
    groups: [
      { tiles: ['w2', 'w3', 'w4'], label: 'Chow' },
      { tiles: ['t6', 't7', 't8'], label: 'Chow' },
      { tiles: ['s1', 's2', 's3'], label: 'Chow' },
      { tiles: ['d1', 'd1', 'd1'], label: 'Pung' },
      { tiles: ['w9', 'w9'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'small-three-dragons',
    descriptionKey: 'exampleHand.smallThreeDragons',
    groups: [
      { tiles: ['d1', 'd1', 'd1'], label: 'Pung' },
      { tiles: ['d2', 'd2', 'd2'], label: 'Pung' },
      { tiles: ['w3', 'w4', 'w5'], label: 'Chow' },
      { tiles: ['t1', 't2', 't3'], label: 'Chow' },
      { tiles: ['d3', 'd3'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'great-three-dragons',
    descriptionKey: 'exampleHand.greatThreeDragons',
    groups: [
      { tiles: ['d1', 'd1', 'd1'], label: 'Pung' },
      { tiles: ['d2', 'd2', 'd2'], label: 'Pung' },
      { tiles: ['d3', 'd3', 'd3'], label: 'Pung' },
      { tiles: ['w2', 'w3', 'w4'], label: 'Chow' },
      { tiles: ['t8', 't8'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'great-four-winds',
    descriptionKey: 'exampleHand.greatFourWinds',
    groups: [
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['f2', 'f2', 'f2'], label: 'Pung' },
      { tiles: ['f3', 'f3', 'f3'], label: 'Pung' },
      { tiles: ['f4', 'f4', 'f4'], label: 'Pung' },
      { tiles: ['t5', 't5'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'all-green',
    descriptionKey: 'exampleHand.allGreen',
    groups: [
      { tiles: ['s2', 's3', 's4'], label: 'Chow' },
      { tiles: ['s2', 's3', 's4'], label: 'Chow' },
      { tiles: ['s6', 's6', 's6'], label: 'Pung' },
      { tiles: ['d2', 'd2', 'd2'], label: 'Pung' },
      { tiles: ['s8', 's8'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'seven-pairs',
    descriptionKey: 'exampleHand.sevenPairs',
    groups: [
      { tiles: ['w1', 'w1'], label: 'Pair' },
      { tiles: ['w5', 'w5'], label: 'Pair' },
      { tiles: ['t3', 't3'], label: 'Pair' },
      { tiles: ['t9', 't9'], label: 'Pair' },
      { tiles: ['s4', 's4'], label: 'Pair' },
      { tiles: ['f1', 'f1'], label: 'Pair' },
      { tiles: ['d2', 'd2'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'thirteen-orphans',
    descriptionKey: 'exampleHand.thirteenOrphans',
    groups: [
      { tiles: ['w1', 'w9', 't1', 't9', 's1', 's9', 'f1', 'f2', 'f3', 'f4', 'd1', 'd2', 'd3', 'w1'] }
    ]
  },
  {
    scoringId: 'small-four-winds',
    descriptionKey: 'exampleHand.smallFourWinds',
    groups: [
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['f2', 'f2', 'f2'], label: 'Pung' },
      { tiles: ['f3', 'f3', 'f3'], label: 'Pung' },
      { tiles: ['w2', 'w3', 'w4'], label: 'Chow' },
      { tiles: ['f4', 'f4'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'all-honors',
    descriptionKey: 'exampleHand.allHonors',
    groups: [
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['f2', 'f2', 'f2'], label: 'Pung' },
      { tiles: ['d1', 'd1', 'd1'], label: 'Pung' },
      { tiles: ['d2', 'd2', 'd2'], label: 'Pung' },
      { tiles: ['f4', 'f4'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'mixed-terminals',
    descriptionKey: 'exampleHand.mixedTerminals',
    groups: [
      { tiles: ['w1', 'w1', 'w1'], label: 'Pung' },
      { tiles: ['t9', 't9', 't9'], label: 'Pung' },
      { tiles: ['s1', 's1', 's1'], label: 'Pung' },
      { tiles: ['f1', 'f1', 'f1'], label: 'Pung' },
      { tiles: ['w9', 'w9'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'all-terminals',
    descriptionKey: 'exampleHand.allTerminals',
    groups: [
      { tiles: ['w1', 'w1', 'w1'], label: 'Pung' },
      { tiles: ['w9', 'w9', 'w9'], label: 'Pung' },
      { tiles: ['t1', 't1', 't1'], label: 'Pung' },
      { tiles: ['s9', 's9', 's9'], label: 'Pung' },
      { tiles: ['t9', 't9'], label: 'Pair' }
    ]
  },
  {
    scoringId: 'nine-gates',
    descriptionKey: 'exampleHand.nineGates',
    groups: [
      { tiles: ['w1', 'w1', 'w1', 'w2', 'w3', 'w4', 'w5', 'w5', 'w6', 'w7', 'w8', 'w9', 'w9', 'w9'] }
    ]
  }
]

/** Look up the example hand for a given scoring entry ID */
export function getExampleHand(scoringId: string): ExampleHandData | undefined {
  return exampleHands.find(h => h.scoringId === scoringId)
}
