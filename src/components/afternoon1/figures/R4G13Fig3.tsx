import { SrvFormat } from './R4G13Srv'
import { COL } from './r4g13Records'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 SRV レコードのフォーマット — R4 午後Ⅰ 問3
 *
 * 原図は枠で囲んだ1行。375px では欄の切れ目で2行に折り返す（部品は R4G13Srv.tsx）。
 * 解説を開いたときは、PC が受け取る Target と、使い分けの比を決める Weight を赤で囲む（設問3(1)・(3)）。
 */
export default function R4G13Fig3({ highlight = false }: ExamFigureProps) {
  return <SrvFormat marked={[COL.target, COL.weight]} highlight={highlight} />
}
