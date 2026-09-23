import { useState } from 'react'
import { MarkupText } from './MarkupText'
import { EXAM_FIGURES } from './figures'
import { MARK, TONE } from './figures/tokens'
import type { ToneName } from './figures/tokens'
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
                  ci !== 0 && highlightCols.includes(ci)
                    ? 'bg-teal-50 text-teal-800'
                    : 'bg-slate-100 text-slate-600',
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

function Swatch({ tone, label }: { tone: ToneName; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block w-3 h-3 rounded-sm border flex-shrink-0"
        style={{ backgroundColor: TONE[tone].fill, borderColor: TONE[tone].stroke }}
      />
      {label}
    </span>
  )
}

/**
 * 図の色が何を表しているかの凡例。図表のまとまりの先頭に1回だけ置く。
 *
 * 図の色は役割でしか変えていない（tokens.ts の TONE）。
 * ここに書いてある以外の意味は持たないので、色の違いを深読みしなくてよい、と伝えるためのもの。
 */
export function Afternoon1FigureColorKey() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-500 leading-relaxed">
      <Swatch tone="device" label="ネットワーク装置" />
      <Swatch tone="host" label="サーバ・PC" />
      <Swatch tone="outside" label="他社の網・装置" />
      <span className="inline-flex items-center gap-1">
        <span
          className="inline-block w-4 h-[3px] rounded-full flex-shrink-0"
          style={{ backgroundColor: MARK }}
        />
        解説を開いたときの強調
      </span>
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
  allowPoints = true,
}: {
  figure: Afternoon1Figure
  hideCaption?: boolean
  /**
   * 解説を開けるようにするか。
   * 解説は設問の答えに触れるので、解答欄では答え合わせに入るまで false にする。
   */
  allowPoints?: boolean
}) {
  const [openPoints, setOpenPoints] = useState(false)

  const ExamFigure = figure.kind === 'exam' ? EXAM_FIGURES[figure.figureId] : undefined
  const points = figure.kind === 'exam' ? figure.points : undefined
  const hasPoints = allowPoints && !!points && points.length > 0
  // 解説を開いているあいだだけ、図の中の該当箇所を赤で強調する
  const highlight = hasPoints && openPoints

  return (
    <figure className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      {(!hideCaption || hasPoints) && (
        <div className="flex items-start justify-between gap-2 mb-2">
          {hideCaption ? (
            <span />
          ) : (
            <figcaption className="text-[12px] font-black text-indigo-800 leading-snug">
              {figure.title}
            </figcaption>
          )}
          {hasPoints && (
            <button
              type="button"
              onClick={() => setOpenPoints((v) => !v)}
              aria-expanded={openPoints}
              className="flex-shrink-0 text-[11px] font-bold text-teal-700 border border-teal-200 bg-white rounded px-2 py-0.5 hover:bg-teal-50 transition-colors"
            >
              {openPoints ? '解説を閉じる' : '解説'}
            </button>
          )}
        </div>
      )}

      {figure.kind === 'compare' ? (
        <CompareTable
          columns={figure.columns}
          rows={figure.rows}
          highlightCols={figure.highlightCols}
        />
      ) : ExamFigure ? (
        <ExamFigure highlight={highlight} />
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

      {hasPoints && openPoints && (
        <ul className="mt-2 rounded border border-teal-200 bg-teal-50/60 px-2.5 py-2 space-y-1.5">
          {points.map((p, i) => (
            <li key={i} className="flex gap-1.5 text-[11.5px] leading-relaxed text-slate-700">
              <span className="flex-shrink-0 text-teal-500 font-black">・</span>
              <span>
                <MarkupText text={p} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  )
}

export default Afternoon1FigureView
