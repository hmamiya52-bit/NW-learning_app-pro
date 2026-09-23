/**
 * 表1 ネットワーク機器の VRF とインタフェース情報（抜粋）— R4 午後Ⅰ 問2
 *
 * 7列・rowspan 多用の表なので SVG ではなく HTML で組み、モバイルでは横スクロールさせる。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 *
 * 解説を開いたときは、設問1(1)の答えになる本社 FW のグローバルアドレスと、
 * 設問1(5)の理由になる営業所 IPsec ルータの動的アドレスを赤で強調する。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-1.5 py-1 align-middle whitespace-nowrap text-slate-700'

/** 解説を開いたときに、そのセルが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 原図の注記番号（右肩の小さい数字） */
function Note({ n }: { n: number }) {
  return <sup className="text-[8px] text-slate-500">注{n})</sup>
}

export default function R4G12Tab1({ highlight = false }: ExamFigureProps) {
  const mark = highlight ? MARK : 'text-slate-700'
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="border-collapse text-[10.5px] mx-auto" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th className={`${TH} bg-slate-100 text-slate-700`}>拠点</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>機器名</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>VRF 識別子</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>インタフェース</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>IP アドレス</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>サブネットマスク</th>
              <th className={`${TH} bg-slate-100 text-slate-700`}>接続先</th>
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
              <td className={TD}>
                INT-IF
                <Note n={1} />
              </td>
              <td className={`${TD} font-mono ${highlight ? MARK : ''}`}>
                a.b.c.d
                <Note n={3} />
              </td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={TD}>ISP のルータ</td>
            </tr>
            <tr>
              <td className={TD}>
                LAN-IF
                <Note n={2} />
              </td>
              <td className={`${TD} font-mono`}>172.16.0.1</td>
              <td className={`${TD} font-mono`}>255.255.255.0</td>
              <td className={TD}>L3SW</td>
            </tr>
            <tr>
              <th rowSpan={3} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
                IPsec
                <br />
                ルータ
              </th>
              <td className={`${TD} text-center font-mono`}>65000:1</td>
              <td className={TD}>
                INT-IF
                <Note n={1} />
              </td>
              <td className={`${TD} font-mono`}>
                s.t.u.v
                <Note n={3} />
              </td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={TD}>ISP のルータ</td>
            </tr>
            <tr>
              <td rowSpan={2} className={`${TD} text-center font-mono`}>
                65000:2
              </td>
              <td className={TD}>
                LAN-IF
                <Note n={2} />
              </td>
              <td className={`${TD} font-mono`}>172.17.0.1</td>
              <td className={`${TD} font-mono`}>255.255.255.0</td>
              <td className={TD}>L3SW</td>
            </tr>
            <tr>
              <td className={TD}>トンネル IF</td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={TD}>営業所の IPsec ルータ</td>
            </tr>
            <tr>
              <th rowSpan={3} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
                営業所
              </th>
              <th rowSpan={3} scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
                IPsec
                <br />
                ルータ
              </th>
              <td className={`${TD} text-center font-mono`}>65000:1</td>
              <td className={TD}>
                INT-IF
                <Note n={1} />
              </td>
              <td className={`${TD} font-mono ${mark}`}>
                w.x.y.z
                <Note n={4} />
              </td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={TD}>ISP のルータ</td>
            </tr>
            <tr>
              <td rowSpan={2} className={`${TD} text-center font-mono`}>
                65000:2
              </td>
              <td className={TD}>
                LAN-IF
                <Note n={2} />
              </td>
              <td className={`${TD} font-mono`}>172.17.1.1</td>
              <td className={`${TD} font-mono`}>255.255.255.0</td>
              <td className={TD}>L2SW</td>
            </tr>
            <tr>
              <td className={TD}>トンネル IF</td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={`${TD} text-center`}>（省略）</td>
              <td className={TD}>本社の IPsec ルータ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ul className="text-[10px] leading-relaxed text-slate-500 space-y-0.5">
        <li>注1) INT-IF は，インターネットに接続するインタフェースである。</li>
        <li>注2) LAN-IF は，本社又は営業所の LAN に接続するインタフェースである。</li>
        <li>注3) a.b.c.d 及び s.t.u.v は，固定のグローバル IP アドレスである。</li>
        <li className={highlight ? 'text-red-700 font-bold' : undefined}>
          注4) w.x.y.z は，ISP から割り当てられた動的なグローバル IP アドレスである。
        </li>
      </ul>
    </div>
  )
}
