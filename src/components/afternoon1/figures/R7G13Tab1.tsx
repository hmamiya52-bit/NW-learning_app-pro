/**
 * 表1 FW の許可ルール（抜粋）— R7 午後Ⅰ 問3
 *
 * 4列の表なので HTML で組む。空欄 a〜d は原図どおり太枠の箱で示す。表の下の注記は examFigures の note に置く。
 * 375px（表の幅 273px）に入れるため、マスの語は切れ目（「サーバ|セグメント」「TCP/80，|TCP/443」など）でだけ折り返す
 * （`Chunks`。H27G11Tab1 と同じ作り）。1024px では原図どおり1行に戻る。見出しに色は付けない。
 *
 * 解説を開いたときは、空欄 a〜d のマスを赤で囲んで箱の下に解答例（syslog サーバ・認証サーバ・10080・443）を出し（設問1(4)(5)）、
 * フォワードプロキシの機能停止で消す項番2・項番7 の番号のマスを赤で示す（設問3(1)）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-1 py-1 align-middle text-slate-700 leading-snug'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'
const MARK_NO = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 折り返してよい所だけで折り返す語（塊は折り返さない） */
function Chunks({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[2.4em] border-2 border-slate-700 px-1.5 text-center leading-tight">{label}</span>
}

type Blanked = { blank: string; answer: string[]; prefix?: string }
type Cell = string[] | Blanked

const isBlank = (c: Cell): c is Blanked => !Array.isArray(c)

const ROWS: { no: string; src: string[]; dst: Cell; proto: Cell; removed?: boolean }[] = [
  { no: '1', src: ['DMZ'], dst: { blank: 'a', answer: ['syslog ', 'サーバ'] }, proto: ['UDP/514'] },
  { no: '2', src: ['プロキシ', 'サーバ'], dst: ['インター', 'ネット'], proto: ['TCP/80，', 'TCP/443'], removed: true },
  { no: '3', src: ['プロキシ', 'サーバ'], dst: { blank: 'b', answer: ['認証', 'サーバ'] }, proto: ['UDP/1812'] },
  { no: '4', src: ['NTP ', 'サーバ'], dst: ['公開 ', 'NTP ', 'サーバ'], proto: ['UDP/123'] },
  { no: '5', src: ['サーバ', 'セグメント'], dst: ['NTP ', 'サーバ'], proto: ['UDP/123'] },
  { no: '6', src: ['内部', 'セグメント'], dst: ['NTP ', 'サーバ'], proto: ['UDP/123'] },
  { no: '7', src: ['内部', 'セグメント'], dst: ['プロキシ', 'サーバ'], proto: { prefix: 'TCP/', blank: 'c', answer: ['10080'] }, removed: true },
  { no: '8', src: ['内部', 'セグメント'], dst: ['K 社 ', 'SaaS'], proto: { prefix: 'TCP/', blank: 'd', answer: ['443'] } },
]

function BodyCell({ cell, highlight }: { cell: Cell; highlight: boolean }) {
  if (!isBlank(cell)) {
    return (
      <td className={TD}>
        <Chunks parts={cell} />
      </td>
    )
  }
  return (
    <td className={`${TD} ${highlight ? MARK : ''}`}>
      <span className="whitespace-nowrap">
        {cell.prefix}
        <Blank label={cell.blank} />
      </span>
      {highlight && (
        <div className="mt-0.5 font-bold text-red-700">
          <Chunks parts={cell.answer} />
        </div>
      )}
    </td>
  )
}

export default function R7G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 460 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={`${TH} whitespace-nowrap`}>送信元</th>
            <th className={`${TH} whitespace-nowrap`}>宛先</th>
            <th className={TH}>
              <Chunks parts={['プロトコル/', '宛先', 'ポート番号']} />
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.no}>
              <td className={`${TD} text-center ${highlight && r.removed ? MARK_NO : ''}`}>{r.no}</td>
              <td className={TD}>
                <Chunks parts={r.src} />
              </td>
              <BodyCell cell={r.dst} highlight={highlight} />
              <BodyCell cell={r.proto} highlight={highlight} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
