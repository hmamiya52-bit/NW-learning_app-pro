export interface LevelDefinition {
  level: number
  title: string
  xpRequired: number
}

/**
 * v0.9.9 でランク名称を全面刷新（10段階）。
 * 問題数増に対応して Lv6 (熟練者) 以降の必要 XP を以前より増量している。
 * 最終Lv10 (ネットワークスペシャリスト) は全勲章コンプリートが必須。
 */
export const LEVELS: LevelDefinition[] = [
  { level: 1,  title: '未経験者',                    xpRequired: 0 },
  { level: 2,  title: '駆け出し',                    xpRequired: 200 },
  { level: 3,  title: '見習い',                      xpRequired: 600 },
  { level: 4,  title: '一人前',                      xpRequired: 1400 },
  { level: 5,  title: '中堅',                        xpRequired: 2700 },
  // ↓ 熟練者以降は問題数増に合わせて必要XPを引き上げ
  { level: 6,  title: '熟練者',                      xpRequired: 6000 },
  { level: 7,  title: '達人',                        xpRequired: 11000 },
  { level: 8,  title: '名人',                        xpRequired: 18000 },
  { level: 9,  title: 'ネットワークエキスパート',    xpRequired: 28000 },
  // Lv10 は XP しきい値だけでなく勲章コンプも必須（getLevelFromXp の第2引数で判定）
  { level: 10, title: 'ネットワークスペシャリスト', xpRequired: 40000 },
]

export const MAX_LEVEL_REQUIRES_ALL_BADGES = true

/**
 * XP から現在レベルを返す。
 * @param xp 現在の総獲得XP
 * @param allBadgesUnlocked 全勲章コンプ済みか（false の場合 Lv9 までで打ち止め）
 */
export function getLevelFromXp(
  xp: number,
  allBadgesUnlocked: boolean = false,
): LevelDefinition {
  let result = LEVELS[0]
  for (const lv of LEVELS) {
    // Lv10 は勲章コンプ必須
    if (lv.level === 10 && !allBadgesUnlocked) break
    if (xp >= lv.xpRequired) result = lv
    else break
  }
  return result
}

/** 次のレベルまで必要な XP を返す（最大レベルなら null） */
export function getNextLevel(currentLevel: number): LevelDefinition | null {
  return LEVELS.find((lv) => lv.level === currentLevel + 1) ?? null
}
