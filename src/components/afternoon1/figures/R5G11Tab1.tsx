/**
 * 表1 静的経路設定 — R5 午後Ⅰ 問1
 *
 * 機器・宛先ネットワーク・ネクストホップの3列の表なので HTML で組む。見出しに色は付けない
 * （色は図で「装置かホストか外部か」を表すために取ってある）。空欄 ア〜ウ は原図どおり太枠の箱で示す。
 *
 * 設問4(1) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、箱の下に解答例を赤で出す
 * （H28-G1-1 表1 と同じ）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-1.5 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** 空欄ごとの解答例（解説を開いたときだけ出す） */
const ANSWER: Record<string, string> = {
  ア: '172.21.10.0/24',
  イ: '172.21.11.2',
  ウ: '172.21.11.1',
}

/** 空欄の箱と、解説を開いたときの解答例 */
function BlankCell({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
      <span className="inline-block min-w-[4em] border-2 border-slate-700 px-1 text-center leading-tight">{label}</span>
      {highlight && <span className="mt-0.5 block whitespace-nowrap font-bold text-red-700">{ANSWER[label]}</span>}
    </td>
  )
}

export default function R5G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 440 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>機器</th>
            <th className={`${TH} whitespace-nowrap`}>宛先ネットワーク</th>
            <th className={`${TH} whitespace-nowrap`}>ネクストホップ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} whitespace-nowrap`}>L3SW</td>
            <BlankCell label="ア" highlight={highlight} />
            <BlankCell label="イ" highlight={highlight} />
          </tr>
          <tr>
            <td className={`${TD} whitespace-nowrap`}>仮想ルータ</td>
            <td className={`${TD} whitespace-nowrap`}>0.0.0.0/0</td>
            <BlankCell label="ウ" highlight={highlight} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
