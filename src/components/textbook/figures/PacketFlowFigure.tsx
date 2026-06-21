import type { PacketFlowFigure as PacketFlowFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import TopologyView from './TopologyView'
import { TONE } from './figureTokens'
import { useStepper } from './useStepper'

function HeaderRow({
  layer,
  tone,
  value,
  note,
}: {
  layer: string
  tone: 'emerald' | 'blue' | 'amber'
  value: string
  note?: string
}) {
  const t = TONE[tone]
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className={`flex-shrink-0 rounded-md border ${t.border} ${t.fill} px-2 py-0.5 text-[11px] font-black ${t.text}`}>
        {layer}
      </span>
      <span className="flex-1 text-xs font-bold text-slate-700">{value}</span>
      {note && <span className={`flex-shrink-0 text-[10px] font-bold ${t.text}`}>{note}</span>}
    </div>
  )
}

export default function PacketFlowFigure({ figure }: { figure: PacketFlowFigureData }) {
  const { index, next, prev, playing, togglePlay, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-400">
            ステップ {index + 1} / {count}
          </span>
        </div>
        <TopologyView topology={figure.topology} focus={step.focus} packetLabel={step.packetLabel} stepKey={index} />
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <HeaderRow layer="L2" tone="emerald" value={step.headers.l2} note={step.concept?.l2} />
        <div className="border-t border-slate-100" />
        <HeaderRow layer="L3" tone="blue" value={step.headers.l3} note={step.concept?.l3} />
        {step.headers.l4 && (
          <>
            <div className="border-t border-slate-100" />
            <HeaderRow layer="L4" tone="amber" value={step.headers.l4} note={step.concept?.l4} />
          </>
        )}
      </div>

      <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-slate-700">{step.explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} playing={playing} onPrev={prev} onNext={next} onTogglePlay={togglePlay} />
      </div>
    </FigureFrame>
  )
}
