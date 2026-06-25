import type { RecordTableFigure as RecordTableFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'

// 規則／対応表。スマホは「1行＝1カード」に縦積み（横スクロール禁止）、PCは表。
// rowHeader: 先頭列をカードの見出しにする。emphasizeKey: その列の値を強調（差分を目立たせる）。
export default function RecordTableFigure({ figure }: { figure: RecordTableFigureData }) {
  const { columns, rows, highlightRow, rowHeader, emphasizeKey } = figure
  const headCol = rowHeader ? columns[0] : null
  const bodyCols = rowHeader ? columns.slice(1) : columns

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* スマホ: 1行=1カード */}
      <div className="space-y-2 sm:hidden">
        {rows.map((row, i) => {
          const hl = i === highlightRow
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-lg border ${hl ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}
            >
              {headCol && (
                <div className={`px-3 py-1.5 text-sm font-black ${hl ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-700'}`}>
                  {row[headCol.key] ?? ''}
                </div>
              )}
              <dl className="divide-y divide-slate-100">
                {bodyCols.map((c) => {
                  const emph = c.key === emphasizeKey
                  return (
                    <div key={c.key} className="flex gap-2 px-3 py-1.5">
                      <dt className="w-[5.5rem] flex-shrink-0 text-[11px] font-bold text-slate-400">{c.label}</dt>
                      <dd
                        className={`min-w-0 flex-1 break-words text-xs font-bold ${
                          emph ? 'text-amber-700' : hl ? 'text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        {row[c.key] ?? ''}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          )
        })}
      </div>

      {/* PC: 表 */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 sm:block">
        <table className="w-full table-fixed text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="break-words px-3 py-2 font-black">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hl = i === highlightRow
              return (
                <tr key={i} className={`border-t border-slate-100 ${hl ? 'bg-blue-50' : ''}`}>
                  {columns.map((c) => {
                    const emph = c.key === emphasizeKey
                    const isHead = rowHeader && c.key === columns[0].key
                    return (
                      <td
                        key={c.key}
                        className={`break-words px-3 py-2 font-bold ${
                          emph ? 'text-amber-700' : isHead ? 'font-black text-slate-800' : hl ? 'text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        {row[c.key] ?? ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </FigureFrame>
  )
}
