/**
 * 図3 ルータのシステムログ（抜粋）— R7 午後Ⅰ 問2
 *
 * ログは等幅で読ませたいので SVG ではなく HTML で組む（R6-G1-3 図4 と同じ）。原図は1件のログを枠の幅で2行に折り返して
 * いるが、折り返しは枠の幅によるものなので、1件を1つのまとまりにして画面の幅で折り返す（横スクロールを出さない）。
 * 最後の「⋮」は原図どおり。枠の下の注は examFigures の note に置く。
 *
 * 解説を開いたときは、3件のログ（NAT 変換テーブルが満杯で、E サービス宛てのパケットを捨てた記録）を赤で示す（設問2(1)(4)）。
 */

import type { ExamFigureProps } from './tokens'

/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-1 ring-inset ring-red-400 rounded-sm'

const LOGS = [
  '2025-04-26T08:00:56.52+09:00 IP NAT translation table full (max entries), dropping packet from 192.168.10.102 to f.g.h.i',
  '2025-04-26T08:01:00.66+09:00 IP NAT translation table full (max entries), dropping packet from 192.168.30.29 to f.g.h.i',
  '2025-04-26T08:01:05.23+09:00 IP NAT translation table full (max entries), dropping packet from 192.168.20.19 to f.g.h.i',
]

export default function R7G12Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <div className="rounded border border-slate-300 bg-white px-2 py-2">
      <div className="font-mono text-[9.5px] leading-[1.5] text-slate-700 space-y-1">
        {LOGS.map((l) => (
          <div key={l} className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${highlight ? MARK : ''}`}>
            {l}
          </div>
        ))}
        <div className="text-center">⋮</div>
      </div>
    </div>
  )
}
