/**
 * 表1 IDS で検出可能な通信（接続箇所別）— H27 午後Ⅰ 問3
 *
 * 2段ヘッダ（IDS の接続箇所を SW1〜SW3 に割る）なので HTML の表で組む。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 最後の行は原図どおり、太枠の「（設問のため，省略）」で1行ぶんを隠す。
 * 凡例（○：検出可 ×：検出不可）も原図どおり表の下に置く。
 *
 * 設問2(1) は、この省略された行を埋めて表を完成させる設問。解説を開いたときは、
 * 省略の行の代わりに解答例の行（インターネット ⇔ 内部 LAN と、SW1〜SW3 の ○×）を
 * 赤の破線で描き込む（§5.6 の「図で答える設問」と同じ扱い）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 py-1.5 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 py-1.5 align-middle text-slate-700'
/** 解答例の描き込み（解説を開いたときだけ） */
const ANS = 'border-2 border-dashed border-red-500 py-1.5 align-middle bg-red-50 text-red-700 font-bold'
/**
 * SW1〜SW3 の列は ○× しか入らないので細くし、通信の範囲の列に幅を回す。
 * 375px で「インターネット ⇔ 内部 LAN」（解答例の行は太字）が1行に収まる。
 */
const RANGE = 'px-2'
const SW = 'w-[13%] px-1'

/** SW1・SW2・SW3 の ○× */
type Marks = [string, string, string]

const ROWS: { range: string; marks: Marks }[] = [
  { range: 'インターネット ⇔ DMZ', marks: ['○', '○', '×'] },
  { range: 'DMZ ⇔ DMZ', marks: ['×', '○', '×'] },
  { range: 'DMZ ⇔ 内部 LAN', marks: ['×', '○', '○'] },
  { range: '内部 LAN ⇔ 内部 LAN', marks: ['×', '×', '○'] },
]

/** 設問2(1) の解答例 */
const ANSWER: { range: string; marks: Marks } = { range: 'インターネット ⇔ 内部 LAN', marks: ['○', '×', '○'] }

export default function H27G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 380 }}>
        <thead>
          <tr>
            <th rowSpan={2} className={`${TH} ${RANGE}`}>
              通信の範囲
            </th>
            <th colSpan={3} className={`${TH} ${RANGE}`}>
              IDS の接続箇所
            </th>
          </tr>
          <tr>
            <th className={`${TH} ${SW}`}>SW1</th>
            <th className={`${TH} ${SW}`}>SW2</th>
            <th className={`${TH} ${SW}`}>SW3</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.range}>
              <td className={`${TD} ${RANGE}`}>{r.range}</td>
              {r.marks.map((m, i) => (
                <td key={i} className={`${TD} ${SW} text-center`}>
                  {m}
                </td>
              ))}
            </tr>
          ))}
          {highlight ? (
            <tr>
              <td className={`${ANS} ${RANGE}`}>{ANSWER.range}</td>
              {ANSWER.marks.map((m, i) => (
                <td key={i} className={`${ANS} ${SW} text-center`}>
                  {m}
                </td>
              ))}
            </tr>
          ) : (
            <tr>
              <td colSpan={4} className="border border-slate-300 p-1">
                <div className="border-[3px] border-slate-700 py-1 text-center text-slate-700">（設問のため，省略）</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 380 }}>
        <span className="mr-4">○：検出可</span>
        <span>×：検出不可</span>
      </p>
    </div>
  )
}
