/**
 * 表2 各拠点の IP アドレスと AS 番号一覧 — R6 午後Ⅰ 問2
 *
 * 設問2(2)で c〜f を埋めさせる表。
 * AS 番号の列は、原図どおりデータセンターと DMZ が1つのセル（rowspan）になっている。
 *
 * 見出しに色は付けない（色は「装置かホストか外部か」を表すために取ってある）。
 * 解説を開いたときだけ、1つにまとまっている c のセルを赤で強調する。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-2 py-1 align-middle whitespace-nowrap'

function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[60px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 font-mono text-slate-500">
      {label}
    </span>
  )
}

const ROWS = [
  { nw: '本社', ip: '10.2.0.0/16', as: 'd' },
  { nw: '支店V', ip: '10.3.0.0/16', as: 'e' },
  { nw: '支店W', ip: '10.4.0.0/16', as: 'f' },
]

/** 解説を開いたときに、その行・列が説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

export default function R6G12Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 330 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>ネットワーク</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>IP アドレス</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>AS 番号</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} text-slate-700`}>データセンター</td>
            <td className={`${TD} text-slate-700 font-mono`}>10.1.0.0/16</td>
            <td rowSpan={2} className={`${TD} text-center ${highlight ? MARK : ''}`}>
              <Blank label="c" />
            </td>
          </tr>
          <tr>
            <td className={`${TD} text-slate-700`}>DMZ</td>
            <td className={`${TD} text-slate-700 font-mono`}>x.y.z.0/28</td>
          </tr>
          {ROWS.map((r) => (
            <tr key={r.nw}>
              <td className={`${TD} text-slate-700`}>{r.nw}</td>
              <td className={`${TD} text-slate-700 font-mono`}>{r.ip}</td>
              <td className={`${TD} text-center`}>
                <Blank label={r.as} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
