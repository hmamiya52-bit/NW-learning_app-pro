import { Mail } from 'lucide-react'
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
  const { index, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]

  const labelOf = (id: string) => figure.topology.nodes.find((n) => n.id === id)?.label ?? id
  const action =
    step.focus.type === 'link'
      ? `${labelOf(step.focus.a)} → ${labelOf(step.focus.b)}`
      : `${labelOf(step.focus.id)} の中`

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* いま何が流れているか（図の上に固定表示。動く封筒には文字を載せない） */}
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-blue-50 px-3 py-2">
        <span className="inline-flex items-center gap-1 text-xs font-black text-blue-800">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          {step.packetLabel}
        </span>
        <span className="text-xs font-bold text-blue-700">{action}</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-4 sm:px-3">
        <TopologyView topology={figure.topology} focus={step.focus} stepKey={index} />
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
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
