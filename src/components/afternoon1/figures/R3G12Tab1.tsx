/**
 * 表1 D 社の現行のネットワークにおける各セグメントの IP アドレス — R3 午後Ⅰ 問2
 *
 * 原図は「セグメント・IP アドレス」の組を左右に2つ並べ、あいだを二重線で区切る4列の表。HTML で組み、
 * 二重線も残す。375px（表の幅 273px）に入れるため、文字を 10px にし、見出しは `|` の所でだけ折り返す。
 *
 * 解説を開いたときは、支社のセグメント a〜g のアドレスのマスを赤で囲む（どれも 172.16.0.0/16 に入る。設問1 e）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-1 py-1 align-middle text-slate-700 leading-snug whitespace-nowrap'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'
/** 原図の、左右の組を分ける二重線 */
const DOUBLE = { borderRightStyle: 'double', borderRightWidth: 3 } as const

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

/** セグメント・IP アドレス（左の組・右の組） */
const ROWS: [string, string, string, string][] = [
  ['a', '172.16.0.0/23', 'h', '172.17.0.0/25'],
  ['b', '172.16.2.0/23', 'i', '172.17.2.0/23'],
  ['c', '172.16.4.0/23', 'j', '172.17.4.0/23'],
  ['d', '172.16.6.0/23', 'k', '172.17.6.0/23'],
  ['e', '172.16.8.0/23', 'l', '172.17.8.0/23'],
  ['f', '172.16.10.0/23', 'm', 't.u.v.4/30'],
  ['g', '172.16.12.64/26', 'n', '192.168.1.0/24'],
]

export default function R3G12Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 420 }}>
        <thead>
          <tr>
            <th className={TH}>
              <Chunks text="セグ|メント" />
            </th>
            <th className={TH} style={DOUBLE}>
              <Chunks text="IP |アドレス" />
            </th>
            <th className={TH}>
              <Chunks text="セグ|メント" />
            </th>
            <th className={TH}>
              <Chunks text="IP |アドレス" />
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([s1, a1, s2, a2]) => (
            <tr key={s1}>
              <td className={`${TD} text-center`}>{s1}</td>
              <td className={`${TD} ${highlight ? MARK : ''}`} style={DOUBLE}>
                {a1}
              </td>
              <td className={`${TD} text-center`}>{s2}</td>
              <td className={TD}>{a2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
