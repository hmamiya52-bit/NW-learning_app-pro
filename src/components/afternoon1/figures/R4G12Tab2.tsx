/**
 * 表2 ネットワーク機器に設定している VRF と経路情報（抜粋）— R4 午後Ⅰ 問2
 *
 * 空欄 b〜d は原図どおり二重枠で示す。見出しに色は付けない。
 *
 * 解説を開いたときは、設問1(4)の答えになる行（本社 IPsec ルータ・65000:2 の
 * デフォルトルート）と、設問1(6)の答えになる宛先ネットワークを赤で強調する。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-1.5 py-1 align-middle whitespace-nowrap text-slate-700'

/** 解説を開いたときに、そのセルが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 解答欄（原図では二重枠の空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[56px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 font-mono text-slate-500">
      {label}
    </span>
  )
}

export default function R4G12Tab2({ highlight = false }: ExamFigureProps) {
  const m = highlight ? MARK : ''
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10.5px] mx-auto" style={{ minWidth: 520 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>拠点</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>機器名</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>VRF 識別子</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>宛先ネットワーク</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>
              ネクストホップとなる
              <br />
              装置又はインタフェース
            </th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>経路制御方式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={5} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              本社
            </th>
            <th rowSpan={2} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              FW
            </th>
            <td rowSpan={2} className={`${TD} text-center`}>−</td>
            <td className={`${TD} font-mono`}>0.0.0.0/0</td>
            <td className={TD}>ISP のルータ</td>
            <td className={TD}>静的経路制御</td>
          </tr>
          <tr>
            <td className={TD}>
              <span className="font-mono">172.17.1.0/24</span>（営業所の LAN）
            </td>
            <td className={TD}>本社の L3SW</td>
            <td className={TD}>動的経路制御</td>
          </tr>
          <tr>
            <th rowSpan={3} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              IPsec
              <br />
              ルータ
            </th>
            <td className={`${TD} text-center font-mono`}>65000:1</td>
            <td className={`${TD} font-mono`}>0.0.0.0/0</td>
            <td className={TD}>ISP のルータ</td>
            <td className={TD}>静的経路制御</td>
          </tr>
          <tr>
            <td rowSpan={2} className={`${TD} text-center font-mono ${m}`}>
              65000:2
            </td>
            <td className={`${TD} font-mono ${m}`}>0.0.0.0/0</td>
            <td className={`${TD} text-center`}>
              <Blank label="b" />
            </td>
            <td className={TD}>動的経路制御</td>
          </tr>
          <tr>
            <td className={`${TD} ${m}`}>
              <span className="font-mono">172.17.1.0/24</span>（営業所の LAN）
            </td>
            <td className={TD}>トンネル IF</td>
            <td className={`${TD} text-center`}>
              <Blank label="c" />
            </td>
          </tr>
          <tr>
            <th rowSpan={2} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              営業所
            </th>
            <th rowSpan={2} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              IPsec
              <br />
              ルータ
            </th>
            <td className={`${TD} text-center font-mono`}>65000:1</td>
            <td className={`${TD} font-mono`}>0.0.0.0/0</td>
            <td className={TD}>ISP のルータ</td>
            <td className={TD}>静的経路制御</td>
          </tr>
          <tr>
            <td className={`${TD} text-center font-mono`}>65000:2</td>
            <td className={`${TD} font-mono`}>0.0.0.0/0</td>
            <td className={TD}>トンネル IF</td>
            <td className={`${TD} text-center`}>
              <Blank label="d" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
