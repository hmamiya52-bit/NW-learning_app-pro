/**
 * 表1 OSPF ルータの各インタフェースにおける OSPF コスト設定 — R7 午後Ⅰ 問1
 *
 * 4行の短い表なので HTML で組む。見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * コストの値は原図どおり右にそろえる。
 *
 * 解説を開いたときは、広域イーサ網（100）と IPsec VPN（1000）の行のコストを赤で強調する
 * （ふだんの道と迂回の道を決める差。設問2(2) で R10 のコストをどこまで上げるかの手掛かり）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

const ROWS: { no: string; kind: string; cost: string; mark?: boolean }[] = [
  { no: '1', kind: '広域イーサ網接続インタフェース', cost: '100', mark: true },
  { no: '2', kind: 'IPsec VPN 接続インタフェース', cost: '1000', mark: true },
  { no: '3', kind: 'ループバックインタフェース', cost: '1' },
  { no: '4', kind: 'その他のインタフェース', cost: '10' },
]

export default function R7G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 480 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={TH}>OSPF ルータのインタフェース種別</th>
            <th className={TH}>OSPF コスト設定</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.no}>
              <td className={`${TD} text-center`}>{r.no}</td>
              <td className={TD}>{r.kind}</td>
              <td className={`${TD} text-right tabular-nums ${highlight && r.mark ? MARK : ''}`}>{r.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
