import type { TimelineFigure as TimelineFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import { TONE } from './figureTokens'

// 手順の俯瞰。縦に並べ、左にバッジ、バッジ間を線でつなぐ（全体を一目で）。
export default function TimelineFigure({ figure }: { figure: TimelineFigureData }) {
  const items = figure.items
  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <ol className="space-y-0">
        {items.map((it, i) => {
          const tone = TONE[it.tone ?? 'blue']
          const last = i === items.length - 1
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 min-w-[2.75rem] items-center justify-center rounded-md border px-1.5 text-[11px] font-black ${tone.border} ${tone.fill} ${tone.text}`}
                >
                  {it.badge}
                </span>
                {!last && <span className="my-1 w-px flex-1 bg-slate-200" aria-hidden="true" />}
              </div>
              <div className={`min-w-0 ${last ? 'pb-0' : 'pb-3'} pt-0.5`}>
                <p className="text-sm font-bold leading-snug text-slate-800">{it.label}</p>
                {it.detail && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{it.detail}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    </FigureFrame>
  )
}
