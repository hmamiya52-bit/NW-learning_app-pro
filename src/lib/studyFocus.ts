// 分野別の弱点分析
//
// 「午後Ⅰでよく出るのに、自分の正答率が低い分野」を優先度として算出する。
// 午後Ⅰの出題数は内蔵過去問（afternoonProblems）のキーワードから集計するため、
// 過去問データを追加すれば頻出度も自動で更新される。

import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { afternoonProblems } from '../data/afternoonProblems'
import { categoryFocus } from '../data/studyFocus'
import { getAllProgress } from './storage'
import type { UserProgress } from '../types'

export interface CategoryAnalysis {
  categoryId: string
  name: string
  /** 午後Ⅰでの出題数 */
  g1Count: number
  /** 午後Ⅰ＋午後Ⅱの出題数 */
  totalCount: number
  /** アプリ内の問題数 */
  questionCount: number
  attempts: number
  correct: number
  /** 正答率(%)。未挑戦なら null */
  rate: number | null
  /** 優先度スコア（大きいほど先に復習すべき） */
  priority: number
  textbookChapterId?: string
}

/** キーワードのいずれかを含む午後問題を数える */
function countProblems(keywords: string[], section?: 'G1'): number {
  if (keywords.length === 0) return 0
  return afternoonProblems.filter(
    (p) =>
      (section === undefined || p.section === section) &&
      p.keywords.some((k) => keywords.includes(k)),
  ).length
}

export function buildCategoryAnalysis(
  progress: UserProgress[] = getAllProgress(),
): CategoryAnalysis[] {
  const rows = categories.map((cat): CategoryAnalysis => {
    const focus = categoryFocus.find((f) => f.categoryId === cat.id)
    const keywords = focus?.afternoonKeywords ?? []
    const g1Count = countProblems(keywords, 'G1')
    const totalCount = countProblems(keywords)

    const catProgress = progress.filter((p) => p.topicId === cat.id)
    const attempts = catProgress.reduce((s, p) => s + p.totalAttempts, 0)
    const correct = catProgress.reduce((s, p) => s + p.correctCount, 0)
    const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : null

    // 未挑戦は「弱点の可能性が最大」として扱う
    const weakness = rate === null ? 1 : 1 - rate / 100
    const priority = g1Count * weakness

    return {
      categoryId: cat.id,
      name: cat.name,
      g1Count,
      totalCount,
      questionCount: questions.filter((q) => q.topicId === cat.id).length,
      attempts,
      correct,
      rate,
      priority,
      textbookChapterId: focus?.textbookChapterId,
    }
  })

  // 優先度降順。同点なら午後Ⅰ出題数が多い方を先に
  return rows.sort((a, b) => b.priority - a.priority || b.g1Count - a.g1Count)
}

/** その分野を優先すべき理由を短く説明する */
export function priorityReason(row: CategoryAnalysis): string {
  if (row.g1Count === 0) return '午後Ⅰでの出題実績なし'
  if (row.rate === null) return `午後Ⅰで${row.g1Count}問出題。まだ未挑戦`
  if (row.rate < 60) return `午後Ⅰで${row.g1Count}問出題。正答率が低い`
  if (row.rate < 80) return `午後Ⅰで${row.g1Count}問出題。あと一歩`
  return `午後Ⅰで${row.g1Count}問出題。よくできている`
}
