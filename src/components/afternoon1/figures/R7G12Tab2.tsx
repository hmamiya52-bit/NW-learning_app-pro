/**
 * 表2 現在のルータの NAPT 変換エントリー保持時間 — R7 午後Ⅰ 問2
 *
 * 2列の短い表なので HTML で組む。保持時間は原図どおり右にそろえる。見出しに色は付けない。表の下の注は examFigures の note に置く。
 *
 * 解説を開いたときは、UDP の行の保持時間（300 秒）を赤で強調する（設問3(3)。HTTP/3 の QUIC は UDP を使う）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

const ROWS: { proto: string; time: string; mark?: boolean }[] = [
  { proto: 'TCP（SYN）', time: '30 秒' },
  { proto: 'TCP（FIN 又は RST 片方向）', time: '60 秒' },
  { proto: 'TCP（FIN 又は RST 双方向）', time: '1 秒' },
  { proto: 'UDP', time: '300 秒', mark: true },
  { proto: 'DNS', time: '60 秒' },
  { proto: 'ICMP', time: '60 秒' },
]

export default function R7G12Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 420 }}>
        <thead>
          <tr>
            <th className={TH}>通信プロトコル</th>
            <th className={`${TH} whitespace-nowrap`}>保持時間</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.proto}>
              <td className={TD}>{r.proto}</td>
              <td className={`${TD} text-right tabular-nums whitespace-nowrap ${highlight && r.mark ? MARK : ''}`}>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
