/**
 * 表2 VLAN 間通信制限のためのアクセスリスト — H29 午後Ⅰ 問1
 *
 * 4列の表なので HTML で組む。見出しに色は付けない。原図の注記1〜3（Any の意味・参照の順・該当しないものは禁止）は
 * 記号を含まないので、examFigures の note に置く。
 *
 * 設問4(1)(2) はこの表をどのインタフェースに置くかと、何が止まるかを問う。解説を開いたときは、項番1 の
 * 禁止のルール（宛先が内部 LAN 全体）のマスを赤で囲む。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug whitespace-nowrap'
const TD = 'border border-slate-300 px-1 py-1.5 align-middle text-slate-700 leading-snug whitespace-nowrap'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

const ROWS: { no: string; act: string; src: string; dst: string; mark?: boolean }[] = [
  { no: '1', act: '禁止', src: 'Any', dst: '172.16.0.0/16', mark: true },
  { no: '2', act: '許可', src: 'Any', dst: 'Any' },
]

export default function H29G11Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 260 }}>
        <thead>
          <tr>
            <th className={TH}>項番</th>
            <th className={TH}>動作</th>
            <th className={TH}>送信元 IP アドレス</th>
            <th className={TH}>宛先 IP アドレス</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const m = highlight && r.mark ? MARK : ''
            return (
              <tr key={r.no}>
                <td className={`${TD} text-center`}>{r.no}</td>
                <td className={`${TD} ${m}`}>{r.act}</td>
                <td className={TD}>{r.src}</td>
                <td className={`${TD} ${m}`}>{r.dst}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
