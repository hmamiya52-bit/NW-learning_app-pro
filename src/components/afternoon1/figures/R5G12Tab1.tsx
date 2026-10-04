/**
 * 表1 ユニキャスト通信の許可ルール — R5 午後Ⅰ 問2
 *
 * 5列の表なので HTML で組む。見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 空欄 Ⅰ（2か所）と Ⅱ は原図どおり太枠の箱で示す。原図の注記は examFigures の note に置く。
 * 375px（表の幅 273px）に横スクロールなしで入れるため、R4-G1-3 表1 と同じく文字を 10px、左右の余白を 2px に詰め、
 * 折り返してよい所だけを `|` で決める（語の途中では割らない）。
 *
 * 設問3(3) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、箱の下に解答例を赤で出す
 * （Ⅰ は2か所に出るので、2か所とも出す）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** 空欄ごとの解答例（解説を開いたときだけ出す） */
const ANSWER: Record<string, string> = {
  Ⅰ: 'カメラ管理|サーバ',
  Ⅱ: '443',
}

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
  return <span className="inline-block min-w-[2.4em] border-2 border-slate-700 px-1 text-center leading-tight">{label}</span>
}

/** 空欄の箱と、解説を開いたときの解答例 */
function BlankWithAnswer({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <>
      <Blank label={label} />
      {highlight && (
        <span className="mt-0.5 block font-bold text-red-700">
          <Chunks text={ANSWER[label]} />
        </span>
      )}
    </>
  )
}

/** 空欄だけのマス（送信元・宛先） */
function BlankCell({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
      <BlankWithAnswer label={label} highlight={highlight} />
    </td>
  )
}

/** 字句だけのマス */
function Cell({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <td className={`${TD} ${center ? 'text-center' : ''}`}>
      <Chunks text={text} />
    </td>
  )
}

export default function R5G12Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 520 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={`${TH} whitespace-nowrap`}>通信経路</th>
            <th className={`${TH} whitespace-nowrap`}>送信元</th>
            <th className={`${TH} whitespace-nowrap`}>宛先</th>
            <th className={TH}>
              <Chunks text="プロトコル/|宛先ポート|番号" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Cell text="1" center />
            <Cell text="サーバ室→|河川・沿岸" />
            <BlankCell label="Ⅰ" highlight={highlight} />
            <Cell text="IP カメラ" center />
            <Cell text="（省略）" />
          </tr>
          <tr>
            <Cell text="2" center />
            <Cell text="執務エリア |1，2→|サーバ室" />
            <Cell text="PC" center />
            <BlankCell label="Ⅰ" highlight={highlight} />
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              <span className="whitespace-nowrap">TCP /</span>
              <wbr /> <BlankWithAnswer label="Ⅱ" highlight={highlight} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
