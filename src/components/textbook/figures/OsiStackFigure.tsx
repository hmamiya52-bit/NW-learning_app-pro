import type { OsiStackFigure as OsiStackFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import { TONE } from './figureTokens'

export default function OsiStackFigure({ figure }: { figure: OsiStackFigureData }) {
  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="space-y-1.5">
        {figure.layers.map((layer) => {
          const tone = TONE[layer.tone]
          const dim = layer.highlight === false
          return (
            <div
              key={layer.label}
              className={`flex items-stretch overflow-hidden rounded-lg border ${
                dim ? 'border-slate-200 bg-slate-50 opacity-60' : `${tone.border} ${tone.fill}`
              }`}
            >
              <div
                className={`flex w-12 flex-shrink-0 items-center justify-center text-sm font-black ${
                  dim ? 'bg-slate-100 text-slate-500' : `${tone.soft} ${tone.text}`
                }`}
              >
                {layer.label}
              </div>
              <div className="min-w-0 flex-1 px-3 py-2">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className={`text-sm font-black ${dim ? 'text-slate-600' : 'text-slate-800'}`}>{layer.name}</p>
                  <p className="text-[11px] font-bold text-slate-500">{layer.example}</p>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{layer.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </FigureFrame>
  )
}
