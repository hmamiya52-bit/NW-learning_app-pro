/**
 * 表2 仮想 LB の動作モード — R5 午後Ⅰ 問1
 *
 * 動作モードと説明の2列の表なので HTML で組む。見出しに色は付けない
 * （色は図で「装置かホストか外部か」を表すために取ってある）。動作モードの列は語の途中で割らない。
 *
 * 解説を開いたときは、H さんが選ぶアプリケーションモードの行を赤で囲む
 * （HTTP/2 を HTTP/1.1 に変え、URL で振り分けるにはレイヤー7 で動く必要がある。設問4(2)）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-1.5 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

const ROWS = [
  { mode: 'アプリケーションモード', desc: 'レイヤー7 で動作して負荷分散処理を行う。', chosen: true },
  { mode: 'ネットワークモード', desc: 'レイヤー4 で動作して負荷分散処理を行う。', chosen: false },
]

export default function R5G11Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 440 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>動作モード</th>
            <th className={TH}>説明</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const on = highlight && r.chosen
            return (
              <tr key={r.mode}>
                <td className={`${TD} whitespace-nowrap ${on ? MARK : ''}`}>{r.mode}</td>
                <td className={`${TD} ${on ? MARK : ''}`}>{r.desc}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
