/**
 * 表1 関連するシステムの URL — H27 午後Ⅰ 問1
 *
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 375px では URL の列が入りきらないので、ホスト名の直後（「koukoku.」の後など）で
 * 折り返せるようにした。折り返すと、3つの URL で共通する後ろの部分が行頭にそろう。
 *
 * 解説を開いたときは、次の部分を赤で強調する。
 *   - 3つの URL に共通する a-sha.example.jp（Cookie の Domain 属性。設問3(1)）
 *   - 先頭の http://（SSL/TLS に変えても http で来られると Cookie が平文で流れる。設問3(2)）
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1.5 font-bold text-center align-middle'
const TD = 'border border-slate-300 px-1.5 py-1.5 align-middle text-slate-700'

/** 解説を開いたときに、その部分が説明の対象だと示す */
const MARK = 'rounded-sm bg-red-50 text-red-700 font-bold ring-1 ring-inset ring-red-400'

interface Row {
  system: string
  server: string
  host: string
  note: string
}

/** 「|」の所でだけ折り返す（「システ／ム」のように語の途中で割れないようにする） */
const ROWS: Row[] = [
  { system: 'SSO |システム', server: 'SSO |サーバ', host: 'sso', note: '新規' },
  { system: '営業|システム', server: '営業|サーバ', host: 'eigyou', note: '現状の|まま' },
  { system: '広告|システム', server: '広告|サーバ', host: 'koukoku', note: '現状の|まま' },
]

const DOMAIN = 'a-sha.example.jp'

/** 「|」で区切った塊をそれぞれ折り返さずに並べ、塊の間でだけ改行を許す */
function Chunks({ text }: { text: string }) {
  const parts = text.split('|')
  return (
    <>
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 折り返してよいのはホスト名の直後だけ（「a-sha」のハイフンで割れないよう、前後をそれぞれ nowrap にする） */
function Url({ host, highlight }: { host: string; highlight: boolean }) {
  return (
    <>
      <span className="whitespace-nowrap">
        <span className={highlight ? MARK : undefined}>http://</span>
        {host}.
      </span>
      <wbr />
      <span className={`whitespace-nowrap ${highlight ? MARK : ''}`}>{DOMAIN}</span>
    </>
  )
}

export default function H27G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`}>
              <Chunks text="システム|名称" />
            </th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>
              <Chunks text="サーバ|名称" />
            </th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>URL</th>
            <th className={`${TH} bg-slate-100 text-slate-700`}>備考</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.host}>
              <td className={TD}>
                <Chunks text={r.system} />
              </td>
              <td className={TD}>
                <Chunks text={r.server} />
              </td>
              <td className={TD}>
                <Url host={r.host} highlight={highlight} />
              </td>
              <td className={TD}>
                <Chunks text={r.note} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
