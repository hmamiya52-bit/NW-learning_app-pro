/**
 * 表3 VPN-PC の通信制限のためのアクセスリスト — H29 午後Ⅰ 問1
 *
 * 4列の表なので HTML で組む。見出しに色は付けない。原図の注記1・2（参照の順・該当しないものは禁止）は
 * 記号を含まないので、examFigures の note に置く。
 *
 * 設問4(3) はこの表をどのインタフェースに置くかを問う。解説を開いたときは、送信元（顧客ごとのアドレスプール）と
 * 宛先（その顧客の顧客システム構築ネットワーク）のマスを赤で囲み、1行ずつ組になっていることを示す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug whitespace-nowrap'
const TD = 'border border-slate-300 px-1 py-1.5 align-middle text-slate-700 leading-snug whitespace-nowrap'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

const ROWS: { no: string; src: string; dst: string }[] = [
  { no: '1', src: '10.100.1.0/24', dst: '172.16.100.0/24' },
  { no: '2', src: '10.100.2.0/24', dst: '172.16.101.0/24' },
  { no: '3', src: '10.100.3.0/24', dst: '172.16.102.0/24' },
]

export default function H29G11Tab3({ highlight = false }: ExamFigureProps) {
  const m = highlight ? MARK : ''
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
          {ROWS.map((r) => (
            <tr key={r.no}>
              <td className={`${TD} text-center`}>{r.no}</td>
              <td className={TD}>許可</td>
              <td className={`${TD} ${m}`}>{r.src}</td>
              <td className={`${TD} ${m}`}>{r.dst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
