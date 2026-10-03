/**
 * 表1 DMZ 上の機器と MSV 及び DNS との間で許可されている通信 — H28 午後Ⅰ 問3
 *
 * 4列の表なので HTML で組む。見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 空欄 b・c は原図どおり太枠の箱で示し、注記は表の下に置く。
 *
 * 設問1(1)(2) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、
 * 箱の下に解答例（SMTP・DNS1）を赤で出す。設問1(3) が聞く項番4 の送信元と宛先にも赤を付ける。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-1.5 py-1.5 align-middle text-slate-700'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'
const MARK_TEXT = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[3.2em] border-2 border-slate-700 px-1.5 text-center leading-tight">{label}</span>
}

/** 空欄のマス。解説を開いたときだけ、箱の下に解答例を出す */
function BlankCell({ label, answer, highlight }: { label: string; answer: string; highlight: boolean }) {
  return (
    <td className={`${TD} ${highlight ? MARK : ''}`}>
      <Blank label={label} />
      {highlight && <div className="mt-0.5 font-bold text-red-700">{answer}</div>}
    </td>
  )
}

export default function H28G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 420 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={TH}>送信元</th>
            <th className={TH}>宛先</th>
            <th className={TH}>プロトコル</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} text-center`}>1</td>
            <td className={`${TD} whitespace-nowrap`}>MGW1，2</td>
            <td className={TD}>MSV1</td>
            <BlankCell label="b" answer="SMTP" highlight={highlight} />
          </tr>
          <tr>
            <td className={`${TD} text-center`}>2</td>
            <td className={`${TD} whitespace-nowrap`}>MSV1〜3</td>
            <td className={`${TD} whitespace-nowrap`}>MGW1，2</td>
            <BlankCell label="b" answer="SMTP" highlight={highlight} />
          </tr>
          <tr>
            <td className={`${TD} text-center`}>3</td>
            <td className={TD}>DNS3</td>
            <BlankCell label="c" answer="DNS1" highlight={highlight} />
            <td className={`${TD} whitespace-nowrap`}>DNS プロトコル</td>
          </tr>
          <tr>
            <td className={`${TD} text-center`}>4</td>
            <td className={`${TD} ${highlight ? MARK_TEXT : ''}`}>DNS1</td>
            <td className={`${TD} ${highlight ? MARK_TEXT : ''}`}>DNS3</td>
            <td className={`${TD} whitespace-nowrap`}>DNS プロトコル</td>
          </tr>
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 420 }}>
        注記 FW では，ステートフルインスペクションを使用している。
      </p>
    </div>
  )
}
