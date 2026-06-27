import type { LayerStatus, PacketFlowFigure as PacketFlowFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import GraphTopology from './GraphTopology'
import StepperControls from './StepperControls'
import TopologyView from './TopologyView'
import { TONE } from './figureTokens'
import { useStepper } from './useStepper'

const STATUS_CHIP: Record<LayerStatus, { text: string; cls: string }> = {
  change: { text: '変わる', cls: 'bg-amber-100 text-amber-800' },
  same: { text: 'そのまま', cls: 'bg-slate-100 text-slate-500' },
  strip: { text: '外す', cls: 'bg-rose-100 text-rose-700' },
}

function HeaderRow({
  layer,
  tone,
  value,
  status,
}: {
  layer: string
  tone: 'emerald' | 'blue' | 'amber'
  value: string
  status?: LayerStatus
}) {
  const t = TONE[tone]
  const chip = status ? STATUS_CHIP[status] : null
  const rowBg = status === 'change' ? 'bg-amber-50' : status === 'strip' ? 'bg-rose-50' : ''
  return (
    <div className={`flex h-10 items-center gap-2 px-3 ${rowBg}`}>
      <span className={`flex-shrink-0 rounded-md border ${t.border} ${t.fill} px-2 py-0.5 text-[11px] font-black ${t.text}`}>
        {layer}
      </span>
      <span className={`flex-1 text-xs font-bold ${status === 'strip' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
        {value}
      </span>
      {chip && <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black ${chip.cls}`}>{chip.text}</span>}
    </div>
  )
}

export default function PacketFlowFigure({ figure }: { figure: PacketFlowFigureData }) {
  const { index, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const sideTable = figure.sideTable

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-2.5 sm:px-3">
        {figure.topology.layout === 'graph' ? (
          <GraphTopology
            topology={figure.topology}
            focus={step.focus}
            packetLabel={step.packetLabel}
            stepKey={index}
            blockedLink={step.blockedLink}
          />
        ) : (
          <TopologyView topology={figure.topology} focus={step.focus} packetLabel={step.packetLabel} stepKey={index} />
        )}
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-black text-slate-500">
          このときのヘッダ（封筒のあて名）
        </div>
        <HeaderRow layer="L2" tone="emerald" value={step.headers.l2} status={step.status?.l2} />
        <div className="border-t border-slate-100" />
        <HeaderRow layer="L3" tone="blue" value={step.headers.l3} status={step.status?.l3} />
        {step.headers.l4 && (
          <>
            <div className="border-t border-slate-100" />
            <HeaderRow layer="L4" tone="amber" value={step.headers.l4} status={step.status?.l4} />
          </>
        )}
      </div>

      {sideTable && (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-black text-slate-500">
            {sideTable.title}
          </div>
          <table className="w-full table-fixed text-left text-[11px]">
            <thead className="bg-slate-50/60 text-slate-400">
              <tr>
                {sideTable.columns.map((c) => (
                  <th key={c.key} className="px-3 py-1 font-bold">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(step.tableRows ?? []).map((row, i) => {
                const hl = i === step.tableHighlightRow
                return (
                  <tr key={i} className={`border-t border-slate-100 ${hl ? 'bg-blue-50' : ''}`}>
                    {sideTable.columns.map((c) => (
                      <td
                        key={c.key}
                        className={`h-9 break-words px-3 align-middle font-bold ${hl ? 'text-blue-800' : 'text-slate-600'}`}
                      >
                        {row[c.key] ?? ''}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 flex h-12 items-start text-sm leading-relaxed text-slate-700">{step.explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
