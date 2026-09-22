/**
 * 表1 ゲームファイルの配信に利用する IP アドレスとポート番号 — R6 午後Ⅰ 問1
 *
 * 2段ヘッダ（LB／配信サーバをそれぞれ2列に割る）は SVG より HTML の表が読みやすいので、
 * 表だけは table で組む。モバイルでは横スクロールする。
 *
 * 設問1(2)イ「本文中の イ に入れる適切なセグメントを，表1中から選んで答えよ」が
 * 「所属セグメント」列を参照する。
 */

const ROWS = [
  { content: 'ゲームα', url: 'https://alpha.example.net/', segment: '172.21.1.0/24' },
  { content: 'ゲームβ', url: 'https://beta.example.net/', segment: '172.22.1.0/24' },
  { content: 'ゲームγ', url: 'https://gamma.example.net/', segment: '172.23.1.0/24' },
]

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle whitespace-nowrap'
const TD = 'border border-slate-300 px-1.5 py-1 text-center align-middle whitespace-nowrap'

export default function R6G11Tab1() {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto" style={{ minWidth: 430 }}>
        <thead>
          <tr>
            <th rowSpan={2} className={`${TH} bg-slate-100 text-slate-700`}>
              内容
            </th>
            <th rowSpan={2} className={`${TH} bg-slate-100 text-slate-700`}>
              URL
            </th>
            <th colSpan={2} className={`${TH} bg-blue-50 text-blue-800`}>
              LB
            </th>
            <th colSpan={2} className={`${TH} bg-amber-50 text-amber-800`}>
              配信サーバ
            </th>
          </tr>
          <tr>
            <th className={`${TH} bg-blue-50 text-blue-800`}>IP アドレス</th>
            <th className={`${TH} bg-blue-50 text-blue-800`}>ポート</th>
            <th className={`${TH} bg-amber-50 text-amber-800`}>所属セグメント</th>
            <th className={`${TH} bg-amber-50 text-amber-800`}>ポート</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.content}>
              <th scope="row" className={`${TH} bg-slate-50 text-slate-700 font-normal`}>
                {r.content}
              </th>
              <td className={`${TD} text-slate-700 font-mono`}>{r.url}</td>
              <td className={`${TD} text-slate-700 font-mono`}>203.x.11.21</td>
              <td className={`${TD} text-slate-700 font-mono`}>443</td>
              <td className={`${TD} text-slate-700 font-mono`}>{r.segment}</td>
              <td className={`${TD} text-slate-700 font-mono`}>80</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
