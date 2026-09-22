/**
 * 表1 本社のルータ2に届く支店Vの経路情報 — R6 午後Ⅰ 問2
 *
 * 設問2(1)で a・b を埋めさせる表。空欄は原図どおり枠で示す。
 */

const TH = 'border border-slate-300 px-2 py-1 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-2 py-1 text-center align-middle whitespace-nowrap'

/** 解答欄（原図では二重枠の空欄） */
function Blank({ label }: { label: string }) {
  return (
    <span className="inline-block min-w-[72px] rounded border-2 border-slate-400 bg-white px-2 py-0.5 font-mono text-slate-500">
      {label}
    </span>
  )
}

export default function R6G12Tab1() {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 320 }}>
        <thead>
          <tr>
            <th className={`${TH} bg-slate-100 text-slate-700`} />
            <th className={`${TH} bg-blue-50 text-blue-800`}>Prefix</th>
            <th className={`${TH} bg-blue-50 text-blue-800`}>AS PATH</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              as-override 設定無し
            </th>
            <td className={TD}>
              <Blank label="a" />
            </td>
            <td className={`${TD} text-slate-700 font-mono`}>{'64500　65500'}</td>
          </tr>
          <tr>
            <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
              as-override 設定有り
            </th>
            <td className={TD}>
              <Blank label="a" />
            </td>
            <td className={TD}>
              <Blank label="b" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
