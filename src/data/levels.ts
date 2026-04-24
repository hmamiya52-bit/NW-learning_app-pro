export interface LevelDefinition {
  level: number
  title: string
  xpRequired: number
}

export const LEVELS: LevelDefinition[] = [
  { level: 1, title: '未経験者',                     xpRequired: 0 },
  { level: 2, title: '研修生',                       xpRequired: 200 },
  { level: 3, title: '初級PG',                       xpRequired: 600 },
  { level: 4, title: '初級SE',                       xpRequired: 1400 },
  { level: 5, title: '中級SE',                       xpRequired: 2700 },
  { level: 6, title: 'サブリーダー',                 xpRequired: 4700 },
  { level: 7, title: 'リーダー',                     xpRequired: 8000 },
  { level: 8, title: 'NWスペシャリスト合格相当',     xpRequired: 13000 },
  { level: 9, title: 'ネットワークスペシャリスト',   xpRequired: 20000 },
]

/** XP から現在レベルを返す（Lv9 は全30バッジ必須だが XP 判定のみで返す） */
export function getLevelFromXp(xp: number): LevelDefinition {
  let result = LEVELS[0]
  for (const lv of LEVELS) {
    if (xp >= lv.xpRequired) result = lv
    else break
  }
  return result
}

/** 次のレベルまで必要な XP を返す（最大レベルなら null） */
export function getNextLevel(currentLevel: number): LevelDefinition | null {
  return LEVELS.find((lv) => lv.level === currentLevel + 1) ?? null
}
