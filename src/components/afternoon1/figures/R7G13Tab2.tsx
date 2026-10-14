/**
 * 表2 SWG サービスのセキュリティ機能（抜粋）— R7 午後Ⅰ 問3
 *
 * 2列の表なので HTML で組む。機能概要は長い文なので折り返し、機能名は 375px でだけ語の切れ目（「レピュテーション|機能」など）で
 * 折り返す（640px 以上では機能名の列を 12em 取り、原図どおり1行にする。`<wbr>` は white-space では止まらないので列の幅で決める）。
 * 下線⑤は原図どおり下線を引く（`underline underline-offset-2`。H28-G1-3 表2 と同じ）。見出しに色は付けない。
 *
 * 解説を開いたときは、ダイレクト通信機能の行（設問3(5)。業務用サーバのアドレスを直接接続リストに入れる話）と、
 * マルウェア駆除機能の下線⑤（設問2(2)。隔離環境での観察）を赤で示す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-2 py-1.5 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-2 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-2 ring-inset ring-red-500'

/** 折り返してよい所だけで折り返す語 */
function Chunks({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

export default function R7G13Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap sm:w-[12em]`}>機能名</th>
            <th className={TH}>機能概要</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              <Chunks parts={['ダイレクト', '通信機能']} />
            </td>
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              直接接続リストに登録した FQDN，IP アドレスを宛先とする通信は，SWG サービスを経由させずに直接通信させる機能
            </td>
          </tr>
          <tr>
            <td className={TD}>
              <Chunks parts={['サイト', 'ブロック機能']} />
            </td>
            <td className={TD}>拒否リストに登録した FQDN，IP アドレス又は URL を宛先とする通信をブロックする機能</td>
          </tr>
          <tr>
            <td className={TD}>
              <Chunks parts={['レピュテーション', '機能']} />
            </td>
            <td className={TD}>
              接続先のドメインや IP アドレスの安全性を数値化し，指定したしきい値以上の安全性をもつ Web サイトだけに接続を許可する機能
            </td>
          </tr>
          <tr>
            <td className={TD}>
              <Chunks parts={['マルウェア', '駆除機能']} />
            </td>
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              ダウンロード・アップロードファイルに対して，パターン検査及び
              <span className="underline underline-offset-2">⑤隔離環境上で動作を観察・分析してマルウェアを駆除する</span>
              機能
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
