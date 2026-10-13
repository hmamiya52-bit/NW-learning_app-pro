/**
 * 表2 B さんが作成した R10 の更改手順 — R7 午後Ⅰ 問1
 *
 * 作業内容の列が広い2列の表なので HTML で組み、作業内容を折り返す（H26-G1-2 表1 と同じ）。見出しに色は付けない。
 * 下線⑤〜⑦ は原図どおり下線で示す（丸数字から句点の手前まで）。原図の表の下の注記は examFigures の note に置く。
 *
 * 解説を開いたときは、次の行を赤で強調する。
 *   - 1-3（電源を切る前に、全ての物理インタフェースを閉塞して切り離す。設問2(3)）
 *   - 2-2 と 2-6（ケーブルを抜く前に印を付けないと、つなぎ直すときに間違える。設問2(4)）
 *   - 3-2（新 R10 から ping を打つ相手。設問2(5)）
 */

import type { ReactNode } from 'react'
import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const NO = 'border border-slate-300 px-1.5 py-1 align-middle text-center text-slate-700 whitespace-nowrap'
const TD = 'border border-slate-300 px-1.5 py-1 align-middle text-slate-700'

/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 原図の下線 */
function U({ children }: { children: ReactNode }) {
  return <span className="underline underline-offset-2">{children}</span>
}

const STEPS: { no: string; body: ReactNode; mark?: boolean }[] = [
  {
    no: '1-1',
    body: (
      <>
        R10 の<U>⑤ OSPF のコストを変更することで，通信が R10 を迂回するようにする</U>。
      </>
    ),
  },
  { no: '1-2', body: '通信が R10 を迂回して正常に行えることを確認する。' },
  {
    no: '1-3',
    body: (
      <>
        R10 の<U>⑥全ての物理インタフェースを閉塞することで，R10 を A 社 NW から切り離す</U>。
      </>
    ),
    mark: true,
  },
  { no: '2-1', body: 'R10 の設定内容を保存し，手元にコピーを取得して R10 の電源をオフにする。' },
  { no: '2-2', body: 'R10 の全てのイーサネットケーブルを抜去する。', mark: true },
  { no: '2-3', body: 'R10 の電源ケーブルを抜去し，R10 を事前に設定内容が保存されている新 R10 と交換する。' },
  { no: '2-4', body: '新 R10 の電源ケーブルを接続し，新 R10 の電源をオンにする。' },
  { no: '2-5', body: '新 R10 の起動後，項番 2-1 で取得した設定内容と比較し，想定外の差分がないことを確認する。' },
  { no: '2-6', body: '新 R10 に全てのイーサネットケーブルを接続する。', mark: true },
  { no: '3-1', body: '新 R10 の全ての物理インタフェースの閉塞を解除する。' },
  {
    no: '3-2',
    body: (
      <>
        <U>⑦新 R10 から ping コマンドを実行し，結果が正常でパケットロスがないことを確認する</U>。
      </>
    ),
    mark: true,
  },
  { no: '3-3', body: '新 R10 の OSPF のコストを変更することで，通信の迂回を解除する。' },
  { no: '3-4', body: '通信が新 R10 を経由して正常に行えることを確認する。' },
]

export default function R7G11Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] leading-relaxed mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={TH}>作業内容</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((s) => (
            <tr key={s.no}>
              <td className={NO}>{s.no}</td>
              <td className={`${TD} ${highlight && s.mark ? MARK : ''}`}>{s.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
