/**
 * 表2 ルーティングループを防ぐ OSPF 経路 — R3 午後Ⅰ 問2
 *
 * 3列1行の表なので HTML で組む。空欄 f・g は原図どおり太枠の箱で示す。
 * 設問3(4) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、箱の下に解答例を赤で出す
 * （H28G11Tab1・R1G13Tab1 の BlankCell と同じ）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-1 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** `|` の所でだけ折り返す */
function Chunks({ text }: { text: string }) {
  const parts = text.split('|')
  return (
    <>
      {parts.map((p, i) => (
        <span key={`${i}-${p}`}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[4em] border-2 border-slate-700 px-1 text-center leading-tight">{label}</span>
}

/** 空欄のマス。解説を開いたときだけ、箱の下に解答例を出す */
function BlankCell({ label, answer, highlight }: { label: string; answer: string; highlight: boolean }) {
  return (
    <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
      <Blank label={label} />
      {highlight && <div className="mt-0.5 font-bold text-red-700 whitespace-nowrap">{answer}</div>}
    </td>
  )
}

export default function R3G12Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 420 }}>
        <thead>
          <tr>
            <th className={TH}>
              <Chunks text="設定機器" />
            </th>
            <th className={TH}>
              <Chunks text="宛先|ネットワーク|アドレス" />
            </th>
            <th className={TH}>
              <Chunks text="ネクスト|ホップ" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BlankCell label="f" answer="ルータ" highlight={highlight} />
            <BlankCell label="g" answer="172.16.0.0/16" highlight={highlight} />
            <td className={TD}>Null0</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
