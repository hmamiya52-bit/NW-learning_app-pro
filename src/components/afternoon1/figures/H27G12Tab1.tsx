/**
 * 表1 通信区間ごとの FW の転送データ量 — H27 午後Ⅰ 問2
 *
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 注 1) は原図どおり表の下に置く。
 *
 * 解説を開いたときは、各区間の通信が図3 のどの LB を通るかを、転送データ量の横に赤の札で示す。
 * どの区間も FW の上下の LB を2台通るので、表2 の あ・い はこの札を LB ごとに足せば求まる（設問3(2)）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに付ける札 */
const TAG = 'ml-1.5 inline-block rounded-sm bg-red-50 px-1 text-[10px] font-bold text-red-700 ring-1 ring-inset ring-red-400'

const ROWS: { section: string; amount: string; via: string }[] = [
  { section: 'インターネット ⇔ 社内 NW', amount: '89', via: 'LB3・LB4' },
  { section: 'インターネット ⇔ DMZ', amount: '10', via: 'LB3・LB5' },
  { section: '社内 NW ⇔ DMZ', amount: '1', via: 'LB4・LB5' },
]

export default function H27G12Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 420 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>通信区間</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>
              転送データ量<sup className="ml-0.5 font-normal">1)</sup>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.section}>
              <td className={TD}>{r.section}</td>
              <td className={`${TD} text-center whitespace-nowrap`}>
                {r.amount}
                {highlight && <span className={TAG}>{r.via}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 420 }}>
        注 1) FW 全体の転送データ量を 100 としたときの値
      </p>
    </div>
  )
}
