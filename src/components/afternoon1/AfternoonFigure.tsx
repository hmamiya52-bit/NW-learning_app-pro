import { MarkupText } from './MarkupText'
import { EXAM_FIGURES } from './figures'
import type { Afternoon1Figure } from '../../data/afternoon1/explanations'

/** 3列までの比較表（対比の整理用） */
function CompareTable({
  columns,
  rows,
  highlightCols = [],
}: {
  columns: string[]
  rows: { label: string; cells: string[] }[]
  highlightCols?: number[]
}) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full border-collapse text-[11.5px]">
        <thead>
          <tr>
            {columns.map((col, ci) => (
              <th
                key={ci}
                className={[
                  'border border-slate-200 px-2 py-1.5 font-bold text-left align-top leading-snug',
                  ci === 0
                    ? 'bg-slate-100 text-slate-600'
                    : highlightCols.includes(ci)
                      ? 'bg-teal-50 text-teal-800'
                      : 'bg-indigo-50 text-indigo-800',
                ].join(' ')}
              >
                <MarkupText text={col} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <th
                scope="row"
                className="border border-slate-200 px-2 py-1.5 font-bold text-left align-top bg-slate-50 text-slate-600 leading-snug"
              >
                <MarkupText text={r.label} />
              </th>
              {r.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={[
                    'border border-slate-200 px-2 py-1.5 align-top text-slate-700 leading-snug',
                    highlightCols.includes(ci + 1) ? 'bg-teal-50/60' : '',
                  ].join(' ')}
                >
                  <MarkupText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 図表1つを描画（比較表 or 試験図の再現）。
 * hideCaption は、呼び出し側の折り畳み見出しが既に図題を出している場合に使う。
 */
export function Afternoon1FigureView({
  figure,
  hideCaption = false,
}: {
  figure: Afternoon1Figure
  hideCaption?: boolean
}) {
  const ExamFigure = figure.kind === 'exam' ? EXAM_FIGURES[figure.figureId] : undefined

  return (
    <figure className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      {!hideCaption && (
        <figcaption className="text-[12px] font-black text-indigo-800 mb-2">
          {figure.title}
        </figcaption>
      )}

      {figure.kind === 'compare' ? (
        <CompareTable
          columns={figure.columns}
          rows={figure.rows}
          highlightCols={figure.highlightCols}
        />
      ) : ExamFigure ? (
        <ExamFigure />
      ) : (
        <p className="rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-[11px] text-slate-400">
          この図は準備中です。問題文 PDF をご確認ください。
        </p>
      )}

      {figure.note && (
        <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
          <MarkupText text={figure.note} />
        </p>
      )}
    </figure>
  )
}

export default Afternoon1FigureView
