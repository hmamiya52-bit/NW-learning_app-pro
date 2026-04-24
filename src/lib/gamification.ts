import { BADGES, type BadgeDefinition } from '../data/badges'
import { getLevelFromXp } from '../data/levels'
import { getAllProgress } from './storage'
import { categories } from '../data/categories'
import { questions as allQuestions } from '../data/questions'

const STORAGE_KEY = 'nwsp:gamification'

export interface GamificationState {
  xp: number
  totalAnswered: number
  totalCorrect: number
  writtenCorrect: number
  currentStreak: number
  maxStreak: number
  /** 1問でも正解したことのある questionId の配列（踏破率用） */
  correctQuestionIds: string[]
  /** 記述モードで正解したことのある questionId（written-4 全問正解判定用） */
  writtenCorrectQuestionIds: string[]
  /** 直近20問の正誤（true/false）—最新が末尾 */
  recentResults: boolean[]
  /** 解放済みバッジ ID の配列 */
  unlockedBadgeIds: string[]
}

export interface AnswerEvent {
  questionId: string
  topicId: string
  isCorrect: boolean
  mode: 'multiple-choice' | 'written'
  isImportant: boolean
  difficulty: number
}

export interface AnswerGamificationResult {
  xpGained: number
  newBadges: BadgeDefinition[]
  didLevelUp: boolean
  newLevel: number
  newXp: number
}

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  writtenCorrect: 0,
  currentStreak: 0,
  maxStreak: 0,
  correctQuestionIds: [],
  writtenCorrectQuestionIds: [],
  recentResults: [],
  unlockedBadgeIds: [],
}

export function loadGamification(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) } as GamificationState
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function saveGamification(state: GamificationState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** XP 計算（正解時のみ） */
function calcXp(event: AnswerEvent, newStreak: number): number {
  let xp = event.mode === 'written' ? 20 : 10

  // 難易度ボーナス
  if (event.difficulty === 2) xp += 2
  if (event.difficulty === 3) xp += 5

  // 重要問題ボーナス
  if (event.isImportant) xp += 5

  // 連続正解ボーナス（今回の正解後のストリーク）
  if (newStreak >= 50) xp += 300
  else if (newStreak >= 30) xp += 150
  else if (newStreak >= 20) xp += 80
  else if (newStreak >= 10) xp += 40
  else if (newStreak >= 5) xp += 20
  else if (newStreak >= 3) xp += 10

  return xp
}

/** バッジ解放チェック */
function checkBadges(
  state: GamificationState,
  alreadyUnlocked: Set<string>
): BadgeDefinition[] {
  const newBadges: BadgeDefinition[] = []
  const totalQuestions = allQuestions.length
  const coveragePct = totalQuestions > 0
    ? (state.correctQuestionIds.length / totalQuestions) * 100
    : 0
  const recentLen = state.recentResults.length
  const recentCorrect = state.recentResults.filter(Boolean).length
  const recentAccPct = recentLen >= 20 ? (recentCorrect / 20) * 100 : -1

  // カテゴリ制覇: 正答率80%以上のカテゴリ数
  const allProgress = getAllProgress()
  const progressMap = new Map(allProgress.map((p) => [p.topicId, p]))
  let masterCategoryCount = 0
  const totalCategories = categories.length
  for (const cat of categories) {
    const p = progressMap.get(cat.id)
    if (p && p.totalAttempts >= 5 && p.correctCount / p.totalAttempts >= 0.8) {
      masterCategoryCount++
    }
  }

  for (const badge of BADGES) {
    if (alreadyUnlocked.has(badge.id)) continue

    let unlocked = false
    switch (badge.id) {
      // 学習継続
      case 'study-1': unlocked = state.totalAnswered >= 1; break
      case 'study-2': unlocked = state.totalAnswered >= 50; break
      case 'study-3': unlocked = state.totalAnswered >= 200; break
      case 'study-4': unlocked = state.totalAnswered >= 500; break
      case 'study-5': unlocked = state.totalAnswered >= 1000; break
      // 連続正答
      case 'streak-1': unlocked = state.maxStreak >= 3; break
      case 'streak-2': unlocked = state.maxStreak >= 5; break
      case 'streak-3': unlocked = state.maxStreak >= 10; break
      case 'streak-4': unlocked = state.maxStreak >= 20; break
      case 'streak-5': unlocked = state.maxStreak >= 30; break
      case 'streak-6': unlocked = state.maxStreak >= 50; break
      // 記述モード
      case 'written-1': unlocked = state.writtenCorrect >= 1; break
      case 'written-2': unlocked = state.writtenCorrect >= 20; break
      case 'written-3': unlocked = state.writtenCorrect >= 100; break
      case 'written-4': unlocked = state.writtenCorrectQuestionIds.length >= totalQuestions && totalQuestions > 0; break
      // 踏破率
      case 'coverage-1': unlocked = coveragePct >= 10; break
      case 'coverage-2': unlocked = coveragePct >= 25; break
      case 'coverage-3': unlocked = coveragePct >= 50; break
      case 'coverage-4': unlocked = coveragePct >= 75; break
      case 'coverage-5': unlocked = coveragePct >= 90; break
      case 'coverage-6': unlocked = coveragePct >= 100; break
      // 習熟
      case 'mastery-1': unlocked = recentAccPct >= 50; break
      case 'mastery-2': unlocked = recentAccPct >= 70; break
      case 'mastery-3': unlocked = recentAccPct >= 90; break
      case 'mastery-4': unlocked = recentAccPct >= 100; break
      // カテゴリ制覇
      case 'category-1': unlocked = masterCategoryCount >= 1; break
      case 'category-2': unlocked = masterCategoryCount >= 3; break
      case 'category-3': unlocked = masterCategoryCount >= 7; break
      case 'category-4': unlocked = masterCategoryCount >= totalCategories; break
      // コンプリート（自分以外の全29バッジ）
      case 'complete-1': unlocked = state.unlockedBadgeIds.length >= BADGES.length - 1; break
    }

    if (unlocked) newBadges.push(badge)
  }

  return newBadges
}

/** 解答を記録して XP/バッジを更新する */
export function recordGamificationAnswer(event: AnswerEvent): AnswerGamificationResult {
  const state = loadGamification()
  const prevLevel = getLevelFromXp(state.xp).level
  const alreadyUnlocked = new Set(state.unlockedBadgeIds)

  // ストリーク更新
  const newStreak = event.isCorrect ? state.currentStreak + 1 : 0
  const newMaxStreak = Math.max(state.maxStreak, newStreak)

  // XP 計算
  const xpGained = event.isCorrect ? calcXp(event, newStreak) : 0

  // 直近20問更新
  const recentResults = [...state.recentResults, event.isCorrect].slice(-20)

  // 踏破率用 Set
  const correctSet = new Set(state.correctQuestionIds)
  if (event.isCorrect) correctSet.add(event.questionId)

  // 記述全問正解用 Set
  const writtenCorrectSet = new Set(state.writtenCorrectQuestionIds)
  if (event.isCorrect && event.mode === 'written') writtenCorrectSet.add(event.questionId)

  const newState: GamificationState = {
    ...state,
    xp: state.xp + xpGained,
    totalAnswered: state.totalAnswered + 1,
    totalCorrect: state.totalCorrect + (event.isCorrect ? 1 : 0),
    writtenCorrect: state.writtenCorrect + (event.isCorrect && event.mode === 'written' ? 1 : 0),
    currentStreak: newStreak,
    maxStreak: newMaxStreak,
    recentResults,
    correctQuestionIds: Array.from(correctSet),
    writtenCorrectQuestionIds: Array.from(writtenCorrectSet),
    unlockedBadgeIds: state.unlockedBadgeIds, // 後で更新
  }

  // バッジ判定（新 state で）
  const newBadges = checkBadges(newState, alreadyUnlocked)
  if (newBadges.length > 0) {
    newState.unlockedBadgeIds = [
      ...newState.unlockedBadgeIds,
      ...newBadges.map((b) => b.id),
    ]
    // complete-1 を再チェック
    const completeSet = new Set(newState.unlockedBadgeIds)
    if (!completeSet.has('complete-1')) {
      const completeBadge = BADGES.find((b) => b.id === 'complete-1')!
      if (newState.unlockedBadgeIds.length >= BADGES.length - 1) {
        newState.unlockedBadgeIds.push('complete-1')
        newBadges.push(completeBadge)
      }
    }
    // バッジボーナス XP
    const bonusXp = newBadges.reduce((sum, b) => sum + b.xpBonus, 0)
    newState.xp += bonusXp
  }

  saveGamification(newState)

  const newLevel = getLevelFromXp(newState.xp).level
  return {
    xpGained,
    newBadges,
    didLevelUp: newLevel > prevLevel,
    newLevel,
    newXp: newState.xp,
  }
}

/** リセット（設定画面用） */
export function resetGamification(): void {
  localStorage.removeItem(STORAGE_KEY)
}
