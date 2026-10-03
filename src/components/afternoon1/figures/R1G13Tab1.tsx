/**
 * 表1 各 ARP パケットのデータ部 — R1 午後Ⅰ 問3
 *
 * 4列の表なので HTML で組む。見出しに色は付けない。空欄 a〜d は原図どおり太枠の箱で示す。
 * 375px（表の幅 273px）に4列を入れるため、文字を 10px、左右の余白を 2px に詰め、
 * 折り返してよい所だけを `|` で決める（H27-G1-1 表1 の Chunks と同じ。語の途中では割らない）。
 *
 * 設問2(3) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、
 * 箱の下に解答例（記号と、その字句）を赤で出す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1.5 align-middle text-slate-700 leading-snug'
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
  return <span className="inline-block min-w-[2.6em] border-2 border-slate-700 px-1 text-center leading-tight">{label}</span>
}

/** 空欄のマス。解説を開いたときだけ、箱の下に解答例（記号と字句）を出す */
function BlankCell({ label, symbol, text, highlight }: { label: string; symbol: string; text: string; highlight: boolean }) {
  return (
    <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
      <Blank label={label} />
      {highlight && (
        <div className="mt-0.5 font-bold text-red-700">
          <Chunks text={`${symbol}|（${text}）`} />
        </div>
      )}
    </td>
  )
}

function Cell({ text }: { text: string }) {
  return (
    <td className={TD}>
      <Chunks text={text} />
    </td>
  )
}

export default function R1G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 480 }}>
        <thead>
          <tr>
            <th className={TH}>
              <Chunks text="フィールド名" />
            </th>
            <th className={TH}>
              <Chunks text="排除対象 |PC が|送信した |ARP 要求" />
            </th>
            <th className={TH}>
              <Chunks text="通信制限|装置が|送信する |ARP 応答" />
            </th>
            <th className={TH}>
              <Chunks text="通信制限|装置が|送信する |ARP 要求" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Cell text="送信元|ハードウェア|アドレス" />
            <Cell text="排除対象 |PC の |MAC |アドレス" />
            <BlankCell label="a" symbol="エ" text="通信制限|装置の |MAC |アドレス" highlight={highlight} />
            <BlankCell label="c" symbol="エ" text="通信制限|装置の |MAC |アドレス" highlight={highlight} />
          </tr>
          <tr>
            <Cell text="送信元|プロトコル|アドレス" />
            <Cell text="排除対象 |PC の |IP |アドレス" />
            <BlankCell label="b" symbol="ア" text="アドレス|解決対象の |IP |アドレス" highlight={highlight} />
            <BlankCell label="d" symbol="オ" text="排除対象 |PC の |IP |アドレス" highlight={highlight} />
          </tr>
          <tr>
            <Cell text="送信先|ハードウェア|アドレス" />
            <Cell text="00-00-00-|00-00-00" />
            <Cell text="排除対象 |PC の |MAC |アドレス" />
            <Cell text="00-00-00-|00-00-00" />
          </tr>
          <tr>
            <Cell text="送信先|プロトコル|アドレス" />
            <Cell text="アドレス|解決対象の |IP |アドレス" />
            <Cell text="排除対象 |PC の |IP |アドレス" />
            <Cell text="アドレス|解決対象の |IP |アドレス" />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
