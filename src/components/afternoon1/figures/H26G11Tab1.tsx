/**
 * 表1 本部から支部1への動画データの送信経路（抜粋）— H26 午後Ⅰ 問1
 *
 * 空欄 a・b は原図どおり二重枠で示す。見出しに色は付けない
 * （色は図で「装置かホストか外部か」を表すために取ってある）。
 *
 * 解説を開いたときは、a・b を書くときの手本になる「通常時」の行を赤で強調する。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle whitespace-nowrap text-slate-700'

/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 解答欄（原図では二重枠の空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[96px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 text-center font-mono text-slate-500">
      {label}
    </span>
  )
}

export default function H26G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 420 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>事象</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>動画データの送信経路</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              通常時
            </th>
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              動画サーバ → L2SW → ルータ2 → ルータ4 → L2SW → PC
            </td>
          </tr>
          <tr>
            <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              ルータ2 本体の障害時
            </th>
            <td className={TD}>
              動画サーバ → L2SW → <Blank label="a" /> → L2SW → PC
            </td>
          </tr>
          <tr>
            <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              ルータ4 p10 の障害時
            </th>
            <td className={TD}>
              動画サーバ → L2SW → <Blank label="b" /> → L2SW → PC
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
