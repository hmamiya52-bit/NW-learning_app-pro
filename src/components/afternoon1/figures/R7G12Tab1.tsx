/**
 * 表1 ルータの NAT 変換テーブルの状態（抜粋）— R7 午後Ⅰ 問2
 *
 * 5列の表なので HTML で組む。見出しの (ⅰ)〜(ⅴ) と英語の列名、値の右寄せ、「⋮」の行は原図どおり。
 * 375px に収めるため、見出しは記号の後ろでも折り返せるようにし（`<wbr>`）、値は折り返さない。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。表の下の注は examFigures の note に置く。
 *
 * 解説を開いたときは、ルータ自身が割り当てる (ⅲ) registered IP address と (ⅳ) assigned port number の列を赤で強調する（設問2(3)）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-0.5 py-1 align-middle text-right text-slate-700 tabular-nums whitespace-nowrap'
const DOTS = 'border border-slate-300 px-0.5 py-0.5 align-middle text-center text-slate-500'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 見出し（記号と列名） */
const HEAD: [string, string][] = [
  ['(ⅰ)', 'local IP address'],
  ['(ⅱ)', 'local port number'],
  ['(ⅲ)', 'registered IP address'],
  ['(ⅳ)', 'assigned port number'],
  ['(ⅴ)', 'IP protocol'],
]
/** ルータ自身が割り当てる列（(ⅲ)・(ⅳ)） */
const ASSIGNED = [2, 3]

const ROWS: (string[] | null)[] = [
  ['192.168.10.13', '56124', 'a.b.c.d', '5001', 'udp'],
  ['192.168.10.22', '63219', 'a.b.c.d', '5002', 'tcp'],
  ['192.168.20.29', '58320', 'a.b.c.d', '5003', 'udp'],
  null,
  ['192.168.30.15', '50073', 'a.b.c.e', '5001', 'tcp'],
  null,
]

export default function R7G12Tab1({ highlight = false }: ExamFigureProps) {
  const mark = (i: number) => (highlight && ASSIGNED.includes(i) ? MARK : '')
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[9.5px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            {HEAD.map(([no, name], i) => (
              <th key={no} className={`${TH} ${mark(i)}`}>
                {no}
                <wbr />
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, k) =>
            r ? (
              <tr key={k}>
                {r.map((v, i) => (
                  <td key={i} className={`${TD} ${mark(i)}`}>
                    {v}
                  </td>
                ))}
              </tr>
            ) : (
              <tr key={k}>
                {HEAD.map(([no], i) => (
                  <td key={no} className={`${DOTS} ${mark(i)}`}>
                    ⋮
                  </td>
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}
