/**
 * R4 午後Ⅰ 問3 の図3〜図5（SRV レコード）で共通の部品
 *
 * 図4・図5 は8列の表で、ドメイン名が長い（_kerberos._tcp.naibulan.y-sha.jp.）。375px（表の幅 273px）では、
 * ドットの後ろで折り返しても8列が横に入らない。そこで、640px 未満では**欄を縦に並べた表**（1列目が欄の名前、
 * 2列目から各レコードの値）に切り替え、それ以上の幅では原図どおり横に並べる。どちらも同じ値を持つ。
 * 図3 のフォーマットは、枠の中に欄の名前を並べ、幅が足りなければ欄の切れ目で折り返す。
 *
 * 解説を開いたときは、指定した欄のマスを赤で囲む。
 */

import { SRV_FIELDS } from './r4g13Records'

const BORDER = 'border border-slate-300'
const TH = `${BORDER} px-1 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug`
const TD = `${BORDER} px-1 py-1.5 align-middle text-slate-700 leading-snug`
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 font-bold text-red-700 ring-2 ring-inset ring-red-500'

/** `|` の所でだけ折り返す */
function Chunks({ text }: { text: string }) {
  const parts = text.split('|')
  return (
    <>
      {parts.map((p, i) => (
        <span key={`${i}-${p}`}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 値のマスの寄せ（ドメイン名は左、ほかは中央） */
const align = (col: number) => (col === 0 || col === 7 ? 'text-left' : 'text-center')

/** 図3 SRV レコードのフォーマット（枠の中に欄の名前を1行に並べる） */
export function SrvFormat({ marked, highlight }: { marked: number[]; highlight: boolean }) {
  return (
    <div className="mx-auto w-fit max-w-full border-2 border-slate-700 bg-white px-2 py-1.5 text-[11px] text-slate-700">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {SRV_FIELDS.map((f, i) => (
          <span key={f} className={`whitespace-nowrap px-0.5 ${highlight && marked.includes(i) ? `rounded-sm ${MARK}` : ''}`}>
            {f.replace(/\|/g, '')}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 図4・図5 SRV レコードの表 */
export function SrvTable({ rows, marked, highlight }: { rows: string[][]; marked: number[]; highlight: boolean }) {
  const on = (col: number) => highlight && marked.includes(col)
  return (
    <div className="overflow-x-auto">
      {/* 640px 以上: 原図どおり、レコードを横に並べる */}
      <table className="hidden sm:table border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 640 }}>
        <thead>
          <tr>
            {SRV_FIELDS.map((f) => (
              <th key={f} className={TH}>
                <Chunks text={f} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((v, ci) => (
                <td key={ci} className={`${TD} ${align(ci)} ${on(ci) ? MARK : ''}`}>
                  <Chunks text={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* 640px 未満: 欄を縦に並べ、2列目から各レコードの値 */}
      <table className="sm:hidden border-collapse text-[10px] mx-auto w-full">
        <tbody>
          {SRV_FIELDS.map((f, ci) => (
            <tr key={f}>
              <th scope="row" className={`${TH} text-left`}>
                <Chunks text={f} />
              </th>
              {rows.map((r, ri) => (
                <td key={ri} className={`${TD} ${align(ci)} ${on(ci) ? MARK : ''}`}>
                  <Chunks text={r[ci]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
