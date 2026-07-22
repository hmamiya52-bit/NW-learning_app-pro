// 午後問題の配点アクセスと整合性検証
//
// scoringMap[id] は officialAnswers の answers[] と「配列の並び順」で対応している
// （AnswerInputTable の rowIndex がそのまま両者の添字になる）。
// 解答行を追加・並べ替えたのに配点側を直し忘れると、以降の行の配点が黙ってずれる。
// それを検知するため、開発時に行数と満点の一致を検証する。

import { scoringMap, type RowScore } from '../data/scoringMap'
import { officialAnswers } from '../data/officialAnswers'

const MAX_SCORE: Record<'G1' | 'G2', number> = { G1: 50, G2: 100 }

export interface ScoringIssue {
  problemId: string
  detail: string
}

/** 指定問題の行別配点を返す（未定義なら空配列） */
export function getRowScores(problemId: string): RowScore[] {
  return scoringMap[problemId] ?? []
}

/**
 * scoringMap と officialAnswers の整合性を検証する。
 * - 配点行数が解答行数と一致するか（並び順のズレ検知）
 * - 正解点の合計が満点（午後Ⅰ:50 / 午後Ⅱ:100）と一致するか
 */
export function validateScoringMap(): ScoringIssue[] {
  const issues: ScoringIssue[] = []
  const knownIds = new Set<string>()

  for (const set of officialAnswers) {
    knownIds.add(set.id)
    const rows = scoringMap[set.id]

    if (!rows) {
      issues.push({ problemId: set.id, detail: '配点が定義されていません' })
      continue
    }
    if (rows.length !== set.answers.length) {
      issues.push({
        problemId: set.id,
        detail: `配点行数 ${rows.length} が解答行数 ${set.answers.length} と一致しません（配点がずれます）`,
      })
    }
    const total = rows.reduce((sum, r) => sum + r.correct, 0)
    const expected = MAX_SCORE[set.section]
    if (total !== expected) {
      issues.push({
        problemId: set.id,
        detail: `正解点の合計 ${total} が満点 ${expected} と一致しません`,
      })
    }
  }

  for (const id of Object.keys(scoringMap)) {
    if (!knownIds.has(id)) {
      issues.push({ problemId: id, detail: '対応する公式解答データがありません' })
    }
  }

  return issues
}

/** 検証結果を開発コンソールに出力する */
export function reportScoringIssues(issues: ScoringIssue[]): void {
  if (issues.length === 0) {
    console.info(`[scoring] 配点整合性チェック OK（${officialAnswers.length} 問）`)
    return
  }
  console.error(`[scoring] 配点整合性エラー ${issues.length} 件`)
  for (const issue of issues) {
    console.error(`  ${issue.problemId}: ${issue.detail}`)
  }
}
