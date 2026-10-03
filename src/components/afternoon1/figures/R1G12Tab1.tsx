/**
 * 表1 メッセージの設定（抜粋）— R1 午後Ⅰ 問2
 *
 * LB の死活監視（レイヤ7 方式）で使う HTTP リクエストと、成功時の HTTP レスポンスの設定。3列の表なので HTML で組む。
 * 「HTTP リクエスト」は原図どおり4行にまたがる。空欄 イ・ウ は原図どおり太枠の箱で示す。
 *
 * 375px（表の幅 273px）では、何もしないと「ステータスコ／ード」「宛先 IP ア／ドレス」のように語の途中で割れる。
 * 折り返してよい所だけを `|` で決め、塊は whitespace-nowrap にする（H27-G1-1 表1 の Chunks と同じ）。
 *
 * 設問2(1) イ・ウ はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、
 * 箱の下に解答例（80・200）を赤で出す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-1 py-1.5 align-middle text-slate-700'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** `|` の所でだけ折り返す */
function Chunks({ text }: { text: string }) {
  const parts = text.split('|')
  return (
    <>
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[3.2em] border-2 border-slate-700 px-1.5 text-center leading-tight">{label}</span>
}

/** 空欄のマス。解説を開いたときだけ、箱の下に解答例を出す */
function BlankCell({ label, answer, highlight }: { label: string; answer: string; highlight: boolean }) {
  return (
    <td className={`${TD} ${highlight ? MARK : ''}`}>
      <Blank label={label} />
      {highlight && <div className="mt-0.5 font-bold text-red-700">{answer}</div>}
    </td>
  )
}

export default function R1G12Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 440 }}>
        <thead>
          <tr>
            <th className={TH}>メッセージ</th>
            <th className={TH}>項目</th>
            <th className={TH}>設定値</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD} rowSpan={4}>
              <Chunks text="HTTP|リクエスト" />
            </td>
            <td className={TD}>
              <Chunks text="宛先|IP アドレス" />
            </td>
            <td className={TD}>
              <Chunks text="Web サーバの|IP アドレス" />
            </td>
          </tr>
          <tr>
            <td className={TD}>
              <Chunks text="ポート番号" />
            </td>
            <BlankCell label="イ" answer="80" highlight={highlight} />
          </tr>
          <tr>
            <td className={TD}>メソッド</td>
            <td className={TD}>GET</td>
          </tr>
          <tr>
            <td className={TD}>パス名</td>
            <td className={TD}>/index.php</td>
          </tr>
          <tr>
            <td className={TD}>
              <Chunks text="成功時の|HTTP|レスポンス" />
            </td>
            <td className={TD}>
              <Chunks text="ステータスコード" />
            </td>
            <BlankCell label="ウ" answer="200" highlight={highlight} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
