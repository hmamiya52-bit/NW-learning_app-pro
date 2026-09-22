import type { Afternoon1QuestionText, Afternoon1QuestionTextSet } from './types'
import { r6 } from './r6'

export type { Afternoon1QuestionText, Afternoon1QuestionTextSet } from './types'

/** 問題 id → 公式設問文の配列（年度ファイルを結合） */
export const afternoon1QuestionTexts: Afternoon1QuestionTextSet = {
  ...r6,
}

/** 指定した問題の公式設問文を rowKey 引きできる形で返す（未転記なら空） */
export function getAfternoon1QuestionTexts(
  problemId: string,
): Record<string, Afternoon1QuestionText> {
  const map: Record<string, Afternoon1QuestionText> = {}
  for (const q of afternoon1QuestionTexts[problemId] ?? []) map[q.rowKey] = q
  return map
}
