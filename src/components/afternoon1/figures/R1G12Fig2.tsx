/**
 * 図2 A 社 DNS サーバのゾーンファイル（抜粋）— R1 午後Ⅰ 問2
 *
 * ゾーンファイルなので、等幅の文字で桁をそろえて読ませたい。SVG ではなく HTML で組む
 * （H28-G1-1 図2 の SPF レコード、R6-G1-3 図4 の PAC ファイルと同じ扱い）。
 * 名前・IN・タイプ・RDATA の4つの桁を grid でそろえる。$ORIGIN と $TTL の値は2桁目から書く。
 * 375px でも1行に収まる（一番長い RDATA は waf-asha.tsha.net.）。注記は examFigures の note に置く。
 *
 * 解説を開いたときは、shop の CNAME の行（設問1。設問3(2) で書き換える行）と、$TTL の行を赤で示す。
 */

import type { ExamFigureProps } from './tokens'

/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-1 ring-inset ring-red-400 rounded-sm'

type Row = { cells: string[]; mark?: boolean; span?: 'value' | 'all' }

const ROWS: Row[] = [
  { cells: ['$ORIGIN', 'asha.com.'], span: 'value' },
  { cells: ['$TTL', '3600'], span: 'value', mark: true },
  { cells: ['（省略）'], span: 'all' },
  { cells: ['', 'IN', 'NS', 'ns'] },
  { cells: ['ns', 'IN', 'A', '199.α.β.1'] },
  { cells: ['shop', 'IN', 'CNAME', 'waf-asha.tsha.net.'], mark: true },
  { cells: ['（省略）'], span: 'all' },
]

export default function R1G12Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="mx-auto rounded-sm border border-slate-400 bg-white px-3 py-2" style={{ maxWidth: 400 }}>
      <div
        className="grid font-mono text-[11px] leading-relaxed text-slate-700"
        style={{ gridTemplateColumns: 'auto auto auto 1fr', columnGap: '1.2em' }}
      >
        {ROWS.map((r, i) => {
          const mark = highlight && r.mark ? MARK : ''
          if (r.span === 'all') {
            return (
              <div key={i} className="col-span-4 font-sans">
                {r.cells[0]}
              </div>
            )
          }
          if (r.span === 'value') {
            return (
              <div key={i} className={`col-span-4 grid ${mark}`} style={{ gridTemplateColumns: 'subgrid' }}>
                <span>{r.cells[0]}</span>
                <span className="col-span-3">{r.cells[1]}</span>
              </div>
            )
          }
          return (
            <div key={i} className={`col-span-4 grid ${mark}`} style={{ gridTemplateColumns: 'subgrid' }}>
              {r.cells.map((c, j) => (
                <span key={j} className="whitespace-nowrap">
                  {c}
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
