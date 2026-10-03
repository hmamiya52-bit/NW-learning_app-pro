/**
 * 表1 ある店舗で想定されるポート接続リストの例 — R3 午後Ⅰ 問1
 *
 * 5列の表なので HTML で組む。見出しに色は付けない。
 * 375px（表の幅 273px）に5列を入れるため、文字を 10px、左右の余白を 2px に詰め、
 * 折り返してよい所だけを `|` で決める（H27-G1-1 表1 の Chunks と同じ。語の途中では割らない）。
 *
 * 解説を開いたときは、行1 の自機器名（RT01 の分は RT 管理コントローラから受け取る。設問3(2) c）と、
 * 行3・行5 の隣接機器名（L2SW-X を挟むと変わる所。設問3(4)）を赤で囲み、マスの下に変わり方を赤で出す。
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

/** 1つのマス。note を渡すと、解説を開いたときだけ赤で囲み、下に添え書きを出す */
function Cell({ text, center = false, note, highlight }: { text: string; center?: boolean; note?: string; highlight: boolean }) {
  const on = highlight && note !== undefined
  return (
    <td className={`${TD} ${center ? 'text-center' : ''} ${on ? MARK : ''}`}>
      <Chunks text={text} />
      {highlight && note !== undefined && (
        <div className="mt-0.5 font-bold text-red-700">
          <Chunks text={note} />
        </div>
      )}
    </td>
  )
}

/** 行番号・自機器名・自機器の IF 名・隣接機器名・隣接機器の IF 名（原図どおりの6行） */
const ROWS: [string, string, string, string, string][] = [
  ['1', 'RT01', 'BP', 'L2SW01', 'IF1'],
  ['2', 'L2SW01', 'IF1', 'RT01', 'BP'],
  ['3', 'L2SW01', 'IF2', '在庫管理|端末 011', 'IF1'],
  ['4', 'L2SW01', 'IF3', '在庫管理|端末 012', 'IF1'],
  ['5', '在庫管理|端末 011', 'IF1', 'L2SW01', 'IF2'],
  ['6', '在庫管理|端末 012', 'IF1', 'L2SW01', 'IF3'],
]

/** 解説を開いたときに添え書きを出すマス（行番号 → 列） */
const SELF_NOTE: Record<string, string> = { '1': 'RT 管理|コントローラ|経由' }
const PEER_NOTE: Record<string, string> = { '3': '→ L2SW-X', '5': '→ L2SW-X' }

export default function R3G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 480 }}>
        <thead>
          <tr>
            <th className={TH}>
              <Chunks text="行|番号" />
            </th>
            <th className={TH}>
              <Chunks text="自機器名" />
            </th>
            <th className={TH}>
              <Chunks text="自機器の |IF 名" />
            </th>
            <th className={TH}>
              <Chunks text="隣接|機器名" />
            </th>
            <th className={TH}>
              <Chunks text="隣接機器の |IF 名" />
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([no, self, selfIf, peer, peerIf]) => (
            <tr key={no}>
              <Cell text={no} center highlight={highlight} />
              <Cell text={self} note={SELF_NOTE[no]} highlight={highlight} />
              <Cell text={selfIf} highlight={highlight} />
              <Cell text={peer} note={PEER_NOTE[no]} highlight={highlight} />
              <Cell text={peerIf} highlight={highlight} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
