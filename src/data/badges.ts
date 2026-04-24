/**
 * バッジ（勲章）定義 - 全30枚
 * アイコン: lucide-react の名前で管理
 * グラデーション: Tailwind bg-gradient-to-br クラス
 * ティア: 'bronze' | 'silver' | 'gold' | 'legendary'
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'legendary'
export type BadgeCategory =
  | 'study'       // 学習継続
  | 'streak'      // 連続正答
  | 'written'     // 記述モード
  | 'coverage'    // 踏破率
  | 'mastery'     // 習熟
  | 'category'    // カテゴリ制覇
  | 'complete'    // コンプリート

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  category: BadgeCategory
  /** lucide-react のコンポーネント名 */
  iconName: string
  /** Tailwind gradient classes (bg-gradient-to-br from-X to-Y) */
  gradient: string
  /** シャドウ色クラス (shadow-{color}) */
  shadowColor: string
  tier: BadgeTier
  /** 解放時 XP ボーナス */
  xpBonus: number
  /** 解放条件の説明 */
  condition: string
  /** 解放条件の数値（比較用） */
  conditionValue: number
}

export const BADGES: BadgeDefinition[] = [
  // ── 🌱 学習継続 (5枚) ────────────────────────────────────────
  {
    id: 'study-1',
    name: 'ファーストステップ',
    description: '初めて問題を解いた',
    category: 'study',
    iconName: 'Sprout',
    gradient: 'from-green-400 to-emerald-600',
    shadowColor: 'shadow-emerald-500/50',
    tier: 'bronze',
    xpBonus: 50,
    condition: '問題を1問解く',
    conditionValue: 1,
  },
  {
    id: 'study-2',
    name: 'コツコツ学習',
    description: '合計50問以上解いた',
    category: 'study',
    iconName: 'BookOpen',
    gradient: 'from-green-400 to-emerald-600',
    shadowColor: 'shadow-emerald-500/50',
    tier: 'bronze',
    xpBonus: 100,
    condition: '合計50問解く',
    conditionValue: 50,
  },
  {
    id: 'study-3',
    name: '学習の習慣',
    description: '合計200問以上解いた',
    category: 'study',
    iconName: 'BookMarked',
    gradient: 'from-green-400 to-emerald-600',
    shadowColor: 'shadow-emerald-500/50',
    tier: 'silver',
    xpBonus: 300,
    condition: '合計200問解く',
    conditionValue: 200,
  },
  {
    id: 'study-4',
    name: '勉強家',
    description: '合計500問以上解いた',
    category: 'study',
    iconName: 'Library',
    gradient: 'from-green-500 to-emerald-700',
    shadowColor: 'shadow-emerald-600/50',
    tier: 'gold',
    xpBonus: 500,
    condition: '合計500問解く',
    conditionValue: 500,
  },
  {
    id: 'study-5',
    name: '不屈の探求者',
    description: '合計1000問以上解いた',
    category: 'study',
    iconName: 'GraduationCap',
    gradient: 'from-emerald-400 to-green-700',
    shadowColor: 'shadow-green-600/50',
    tier: 'gold',
    xpBonus: 700,
    condition: '合計1000問解く',
    conditionValue: 1000,
  },

  // ── ⚡ 連続正答 (6枚) ────────────────────────────────────────
  {
    id: 'streak-1',
    name: '好スタート',
    description: '3問連続正解',
    category: 'streak',
    iconName: 'Zap',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-500/50',
    tier: 'bronze',
    xpBonus: 80,
    condition: '3問連続正解',
    conditionValue: 3,
  },
  {
    id: 'streak-2',
    name: '快進撃',
    description: '5問連続正解',
    category: 'streak',
    iconName: 'Flame',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-500/50',
    tier: 'bronze',
    xpBonus: 150,
    condition: '5問連続正解',
    conditionValue: 5,
  },
  {
    id: 'streak-3',
    name: '絶好調',
    description: '10問連続正解',
    category: 'streak',
    iconName: 'TrendingUp',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-500/50',
    tier: 'silver',
    xpBonus: 300,
    condition: '10問連続正解',
    conditionValue: 10,
  },
  {
    id: 'streak-4',
    name: '無敵モード',
    description: '20問連続正解',
    category: 'streak',
    iconName: 'Bolt',
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-orange-600/50',
    tier: 'silver',
    xpBonus: 500,
    condition: '20問連続正解',
    conditionValue: 20,
  },
  {
    id: 'streak-5',
    name: 'フルコンボ',
    description: '30問連続正解',
    category: 'streak',
    iconName: 'Sparkles',
    gradient: 'from-yellow-400 to-orange-600',
    shadowColor: 'shadow-orange-600/60',
    tier: 'gold',
    xpBonus: 800,
    condition: '30問連続正解',
    conditionValue: 30,
  },
  {
    id: 'streak-6',
    name: '伝説のストリーク',
    description: '50問連続正解',
    category: 'streak',
    iconName: 'Crown',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/60',
    tier: 'legendary',
    xpBonus: 3000,
    condition: '50問連続正解',
    conditionValue: 50,
  },

  // ── ✍️ 記述モード (4枚) ────────────────────────────────────────
  {
    id: 'written-1',
    name: 'ペンを握る',
    description: '記述モードで初めて正解',
    category: 'written',
    iconName: 'PenLine',
    gradient: 'from-sky-400 to-blue-600',
    shadowColor: 'shadow-blue-500/50',
    tier: 'bronze',
    xpBonus: 100,
    condition: '記述モードで1問正解',
    conditionValue: 1,
  },
  {
    id: 'written-2',
    name: '記述の達人',
    description: '記述モードで20問正解',
    category: 'written',
    iconName: 'FileEdit',
    gradient: 'from-sky-400 to-blue-600',
    shadowColor: 'shadow-blue-500/50',
    tier: 'silver',
    xpBonus: 300,
    condition: '記述モードで20問正解',
    conditionValue: 20,
  },
  {
    id: 'written-3',
    name: '記述マスター',
    description: '記述モードで100問正解',
    category: 'written',
    iconName: 'BookText',
    gradient: 'from-sky-500 to-blue-700',
    shadowColor: 'shadow-blue-600/50',
    tier: 'gold',
    xpBonus: 600,
    condition: '記述モードで100問正解',
    conditionValue: 100,
  },
  {
    id: 'written-4',
    name: '完全記述制覇',
    description: '記述モードで全問正解（1周）',
    category: 'written',
    iconName: 'Trophy',
    gradient: 'from-blue-400 to-indigo-600',
    shadowColor: 'shadow-indigo-500/60',
    tier: 'legendary',
    xpBonus: 800,
    condition: '記述モードで全問正解（1周）',
    conditionValue: 0,
  },

  // ── 📊 踏破率 (6枚) ────────────────────────────────────────
  {
    id: 'coverage-1',
    name: '探索開始',
    description: '全問題の10%を正解',
    category: 'coverage',
    iconName: 'Map',
    gradient: 'from-cyan-400 to-teal-600',
    shadowColor: 'shadow-teal-500/50',
    tier: 'bronze',
    xpBonus: 150,
    condition: '全問題の10%正解',
    conditionValue: 10,
  },
  {
    id: 'coverage-2',
    name: '着実な前進',
    description: '全問題の25%を正解',
    category: 'coverage',
    iconName: 'Compass',
    gradient: 'from-cyan-400 to-teal-600',
    shadowColor: 'shadow-teal-500/50',
    tier: 'bronze',
    xpBonus: 250,
    condition: '全問題の25%正解',
    conditionValue: 25,
  },
  {
    id: 'coverage-3',
    name: '折り返し地点',
    description: '全問題の50%を正解',
    category: 'coverage',
    iconName: 'Target',
    gradient: 'from-cyan-500 to-teal-600',
    shadowColor: 'shadow-teal-500/50',
    tier: 'silver',
    xpBonus: 500,
    condition: '全問題の50%正解',
    conditionValue: 50,
  },
  {
    id: 'coverage-4',
    name: '終盤戦',
    description: '全問題の75%を正解',
    category: 'coverage',
    iconName: 'Flag',
    gradient: 'from-cyan-500 to-teal-700',
    shadowColor: 'shadow-teal-600/50',
    tier: 'silver',
    xpBonus: 700,
    condition: '全問題の75%正解',
    conditionValue: 75,
  },
  {
    id: 'coverage-5',
    name: '全問制覇',
    description: '全問題の90%を正解',
    category: 'coverage',
    iconName: 'CheckCircle',
    gradient: 'from-teal-400 to-cyan-700',
    shadowColor: 'shadow-cyan-600/60',
    tier: 'gold',
    xpBonus: 1000,
    condition: '全問題の90%正解',
    conditionValue: 90,
  },
  {
    id: 'coverage-6',
    name: '完全踏破',
    description: '全問題を正解',
    category: 'coverage',
    iconName: 'Medal',
    gradient: 'from-teal-300 to-cyan-600',
    shadowColor: 'shadow-cyan-500/70',
    tier: 'legendary',
    xpBonus: 1750,
    condition: '全問題を正解',
    conditionValue: 100,
  },

  // ── 🏆 習熟 (4枚) ────────────────────────────────────────
  {
    id: 'mastery-1',
    name: '正答率50%',
    description: '直近20問の正答率が50%以上',
    category: 'mastery',
    iconName: 'BarChart2',
    gradient: 'from-violet-400 to-purple-600',
    shadowColor: 'shadow-purple-500/50',
    tier: 'bronze',
    xpBonus: 200,
    condition: '直近20問の正答率50%以上',
    conditionValue: 50,
  },
  {
    id: 'mastery-2',
    name: '正答率70%',
    description: '直近20問の正答率が70%以上',
    category: 'mastery',
    iconName: 'TrendingUp',
    gradient: 'from-violet-400 to-purple-600',
    shadowColor: 'shadow-purple-500/50',
    tier: 'silver',
    xpBonus: 400,
    condition: '直近20問の正答率70%以上',
    conditionValue: 70,
  },
  {
    id: 'mastery-3',
    name: '正答率90%',
    description: '直近20問の正答率が90%以上',
    category: 'mastery',
    iconName: 'Star',
    gradient: 'from-violet-500 to-purple-700',
    shadowColor: 'shadow-purple-600/60',
    tier: 'gold',
    xpBonus: 900,
    condition: '直近20問の正答率90%以上',
    conditionValue: 90,
  },
  {
    id: 'mastery-4',
    name: 'パーフェクト',
    description: '直近20問をすべて正解',
    category: 'mastery',
    iconName: 'Gem',
    gradient: 'from-fuchsia-400 to-purple-700',
    shadowColor: 'shadow-purple-600/70',
    tier: 'legendary',
    xpBonus: 1000,
    condition: '直近20問をすべて正解',
    conditionValue: 100,
  },

  // ── 📂 カテゴリ制覇 (4枚) ────────────────────────────────────────
  {
    id: 'category-1',
    name: 'カテゴリ初制覇',
    description: '任意のカテゴリで正答率80%以上',
    category: 'category',
    iconName: 'FolderCheck',
    gradient: 'from-rose-400 to-pink-600',
    shadowColor: 'shadow-pink-500/50',
    tier: 'bronze',
    xpBonus: 300,
    condition: '1カテゴリ制覇（正答率80%以上）',
    conditionValue: 1,
  },
  {
    id: 'category-2',
    name: 'マルチドメイン',
    description: '3カテゴリで正答率80%以上',
    category: 'category',
    iconName: 'Folders',
    gradient: 'from-rose-400 to-pink-600',
    shadowColor: 'shadow-pink-500/50',
    tier: 'silver',
    xpBonus: 600,
    condition: '3カテゴリ制覇',
    conditionValue: 3,
  },
  {
    id: 'category-3',
    name: '全領域制圧',
    description: '7カテゴリで正答率80%以上',
    category: 'category',
    iconName: 'LayoutGrid',
    gradient: 'from-rose-500 to-pink-700',
    shadowColor: 'shadow-pink-600/60',
    tier: 'gold',
    xpBonus: 1500,
    condition: '7カテゴリ制覇',
    conditionValue: 7,
  },
  {
    id: 'category-4',
    name: 'ネットワーク神',
    description: '全カテゴリで正答率80%以上',
    category: 'category',
    iconName: 'Network',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
    shadowColor: 'shadow-pink-600/70',
    tier: 'legendary',
    xpBonus: 2100,
    condition: '全カテゴリ制覇',
    conditionValue: 999,
  },

  // ── 🏅 コンプリート (1枚) ────────────────────────────────────────
  {
    id: 'complete-1',
    name: 'ネットワークスペシャリスト',
    description: '全30枚の勲章を獲得',
    category: 'complete',
    iconName: 'Award',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-400/80',
    tier: 'legendary',
    xpBonus: 5000,
    condition: '全30枚の勲章を獲得',
    conditionValue: 30,
  },
]

/** カテゴリ名（日本語） */
export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  study: '学習継続',
  streak: '連続正答',
  written: '記述モード',
  coverage: '踏破率',
  mastery: '習熟',
  category: 'カテゴリ制覇',
  complete: 'コンプリート',
}

/** カテゴリ順序 */
export const BADGE_CATEGORY_ORDER: BadgeCategory[] = [
  'study', 'streak', 'written', 'coverage', 'mastery', 'category', 'complete'
]
