import { SrvTable } from './R4G13Srv'
import { COL, FIG4_ROWS } from './r4g13Records'
import type { ExamFigureProps } from './tokens'

/**
 * 図4 ケルベロス認証向けの SRV レコードの内容 — R4 午後Ⅰ 問3
 *
 * 8列の表。640px 未満では欄を縦に並べた表に切り替える（部品は R4G13Srv.tsx）。
 * 解説を開いたときは、TTL（キャッシュに残る時間。設問3(2)）と Weight（DS1 と DS2 の比。設問3(3)）のマスを赤で囲む。
 */
export default function R4G13Fig4({ highlight = false }: ExamFigureProps) {
  return <SrvTable rows={FIG4_ROWS} marked={[COL.ttl, COL.weight]} highlight={highlight} />
}
