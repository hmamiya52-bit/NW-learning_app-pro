/**
 * 表1 FW 故障時の交換作業手順 — H26 午後Ⅰ 問2
 *
 * 空欄 a・b は原図どおり二重枠で示す。見出しに色は付けない
 * （色は図で「装置かホストか外部か」を表すために取ってある）。
 * 原図は作業内容の列が広い表。375px では作業順序と作業内容を折り返し、表を画面の幅に収めた。
 *
 * 解説を開いたときは、次のマスを赤で強調する。
 *   - FW1 の (5)（ARP テーブル初期化は FW1 の手順にしかない。空欄 a）
 *   - FW1 と FW2 の (3)（FW2 の (3) は FW1 の (3) と対になる。空欄 b）
 *   - FW1 の (1)（主系設定のままの代替機が今回の事故の原因）
 */

import type { ReactNode } from 'react'
import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 解答欄（原図では二重枠の空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[56px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 text-center font-mono text-slate-500">
      {label}
    </span>
  )
}

interface Step {
  step: string
  body: ReactNode
  /** 解説を開いたときに強調するか */
  mark?: boolean
}

const FW1_STEPS: Step[] = [
  { step: '(1) 設定確認', body: '代替機の主系設定が解除されていることを確認する。', mark: true },
  { step: '(2) 交換及び接続', body: '代替機の電源を切断し，交換及び接続を行う。' },
  { step: '(3) 電源投入', body: 'Standby 動作に入り，FW2 から設定情報が同期されたことを確認する。', mark: true },
  { step: '(4) 主系への切戻し', body: 'FW1 を Active 動作に切り戻し，主系設定を行う。' },
  {
    step: '(5) ARP テーブル初期化',
    body: (
      <>
        L3SW， <Blank label="a" /> について初期化する。
      </>
    ),
    mark: true,
  },
  { step: '(6) 通信確認', body: 'DMZ 及び社外との通信が可能であることを確認する。' },
]

const FW2_STEPS: Step[] = [
  { step: '(1) 設定確認', body: '代替機の主系設定が解除されていることを確認する。' },
  { step: '(2) 交換及び接続', body: '代替機の電源を切断し，交換及び接続を行う。' },
  {
    step: '(3) 電源投入',
    body: (
      <>
        Standby 動作に入り， <Blank label="b" /> を確認する。
      </>
    ),
    mark: true,
  },
  { step: '(4) 通信確認', body: 'DMZ 及び社外との通信が可能であることを確認する。' },
]

function Rows({ device, steps, highlight }: { device: string; steps: Step[]; highlight: boolean }) {
  return (
    <>
      {steps.map((s, i) => (
        <tr key={s.step}>
          {i === 0 && (
            <th scope="rowgroup" rowSpan={steps.length} className={`${TH} bg-slate-50 text-slate-700 font-normal whitespace-nowrap`}>
              {device}
            </th>
          )}
          <td className={TD}>{s.step}</td>
          <td className={`${TD} ${highlight && s.mark ? MARK : ''}`}>{s.body}</td>
        </tr>
      ))}
    </>
  )
}

export default function H26G12Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>故障機器</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>作業順序</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>作業内容</th>
          </tr>
        </thead>
        <tbody>
          <Rows device="FW1" steps={FW1_STEPS} highlight={highlight} />
          <Rows device="FW2" steps={FW2_STEPS} highlight={highlight} />
        </tbody>
      </table>
    </div>
  )
}
