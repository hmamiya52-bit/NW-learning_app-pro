import { SrvTable } from './R4G13Srv'
import { COL, FIG5_ROWS } from './r4g13Records'
import type { ExamFigureProps } from './tokens'

/**
 * 図5 変更後の SRV レコードの内容 — R4 午後Ⅰ 問3
 *
 * 図4 と同じ見出しの1行の表。640px 未満では欄を縦に並べた表に切り替える（部品は R4G13Srv.tsx）。
 * 解説を開いたときは、1つの名前にまとめた Target（DS）のマスを赤で囲む（比は A レコードで作る。設問3(3)）。
 */
export default function R4G13Fig5({ highlight = false }: ExamFigureProps) {
  return <SrvTable rows={FIG5_ROWS} marked={[COL.target]} highlight={highlight} />
}
