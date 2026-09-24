/**
 * 表1 FW の通信を許可する追加設定（抜粋）— H25 午後Ⅰ 問1
 *
 * 空欄 オ〜ケ は原図どおり二重枠で示す。見出しに色は付けない
 * （色は図で「装置かホストか外部か」を表すために取ってある）。
 * 原図の「⋮」の行（途中の行を省略した印）も残す。
 *
 * 解説を開いたときは、空欄を埋める手掛かりになるマスを赤で強調する。
 * 宛先ポート 53（オ は DNS サーバ）、送信元 61.x.42.94（カ は B 社からの HTTPS）、
 * DMZ → 内部 LAN の宛先ポート 11000・23・13000（キ〜ケ は図2 の転送先ポートへつなぐ装置）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-2 py-1.5 text-center align-middle whitespace-nowrap text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 解答欄（原図では二重枠の空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[64px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 text-center font-mono text-slate-500">
      {label}
    </span>
  )
}

export default function H25G11Tab1({ highlight = false }: ExamFigureProps) {
  const mark = highlight ? MARK : ''
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 460 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>アクセス経路</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>送信元 IP アドレス</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>宛先 IP アドレス</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>宛先ポート番号</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>備考</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>外部 LAN → DMZ</td>
            <td className={TD}>任意</td>
            <td className={TD}>
              <Blank label="オ" />
            </td>
            <td className={`${TD} font-mono ${mark}`}>53</td>
            <td className={TD} />
          </tr>
          <tr>
            <td className={TD}>外部 LAN → DMZ</td>
            <td className={`${TD} font-mono ${mark}`}>61.x.42.94</td>
            <td className={`${TD} font-mono`}>202.y.63.11</td>
            <td className={TD}>
              <Blank label="カ" />
            </td>
            <td className={TD} />
          </tr>
          <tr>
            <td colSpan={5} className={`${TD} text-slate-400`}>
              ⋮
            </td>
          </tr>
          <tr>
            <td className={TD}>DMZ → 内部 LAN</td>
            <td className={TD}>
              <Blank label="キ" />
            </td>
            <td className={`${TD} font-mono`}>10.10.10.1</td>
            <td className={`${TD} font-mono ${mark}`}>11000</td>
            <td className={TD}>AP1 用</td>
          </tr>
          <tr>
            <td className={TD}>DMZ → 内部 LAN</td>
            <td className={TD}>
              <Blank label="ク" />
            </td>
            <td className={`${TD} font-mono`}>10.10.10.2</td>
            <td className={`${TD} font-mono ${mark}`}>23</td>
            <td className={TD}>AP2 用</td>
          </tr>
          <tr>
            <td className={TD}>DMZ → 内部 LAN</td>
            <td className={TD}>
              <Blank label="ケ" />
            </td>
            <td className={`${TD} font-mono`}>10.10.10.2</td>
            <td className={`${TD} font-mono ${mark}`}>13000</td>
            <td className={TD}>AP3 用</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
