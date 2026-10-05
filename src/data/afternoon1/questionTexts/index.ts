import type { Afternoon1QuestionText, Afternoon1QuestionTextSet } from './types'
import { h25 } from './h25'
import { h26 } from './h26'
import { h27 } from './h27'
import { h28 } from './h28'
import { h29 } from './h29'
import { r1 } from './r1'
import { r3 } from './r3'
import { r4 } from './r4'
import { r5 } from './r5'
import { r6 } from './r6'

export type { Afternoon1QuestionText, Afternoon1QuestionTextSet } from './types'

/** 問題 id → 公式設問文の配列（年度ファイルを結合） */
export const afternoon1QuestionTexts: Afternoon1QuestionTextSet = {
  ...h25,
  ...h26,
  ...h27,
  ...h28,
  ...h29,
  ...r1,
  ...r3,
  ...r4,
  ...r5,
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
