/**
 * 表2 各 LB の転送データ量 — H27 午後Ⅰ 問2
 *
 * 空欄 あ・い は原図どおり枠で示す。見出しに色は付けない。注 1) は原図どおり表の下に置く。
 *
 * 解説を開いたときは、次のマスを赤で強調する。
 *   - LB5 の 11（DMZ に出入りする2区間 10＋1 の合計。あ・い を求めるときの数え方の手本）
 *   - LB4 の「不足」（社内の LB は FW と Proxy の両方を振り分けるので、量が倍になる。設問3(2) い）
 */

import type { ReactNode } from 'react'
import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-center text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 解答欄（原図では枠で囲んだ空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[48px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 text-center text-slate-500">
      {label}
    </span>
  )
}

const ROWS: { lb: string; amount: ReactNode; perf: string; markAmount?: boolean; markPerf?: boolean }[] = [
  { lb: 'LB3', amount: <Blank label="あ" />, perf: '充足' },
  { lb: 'LB4', amount: <Blank label="い" />, perf: '不足', markPerf: true },
  { lb: 'LB5', amount: '11', perf: '充足', markAmount: true },
]

export default function H27G12Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 480 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>LB</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>
              転送データ量<sup className="ml-0.5 font-normal">1)</sup>
            </th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>転送データ量に対する現行 LB の性能</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.lb}>
              <td className={TD}>{r.lb}</td>
              <td className={`${TD} ${highlight && r.markAmount ? MARK : ''}`}>{r.amount}</td>
              <td className={`${TD} ${highlight && r.markPerf ? MARK : ''}`}>{r.perf}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 480 }}>
        注 1) FW 全体の転送データ量を 100 としたときの値
      </p>
    </div>
  )
}
