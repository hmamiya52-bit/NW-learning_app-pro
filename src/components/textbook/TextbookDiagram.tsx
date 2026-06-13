import { Cable, Check, Monitor, Network, Router, Server } from 'lucide-react'
import type {
  ComparisonDiagram,
  LayerStackDiagram,
  NetworkFlowDiagram,
  PacketFlowNodeRole,
  SegmentDiagram,
  SequenceDiagram,
  TextbookDiagram as TextbookDiagramData,
} from '../../data/textbookChapters'
import PacketFlowVisualizer from './PacketFlowVisualizer'

interface TextbookDiagramProps {
  diagram: TextbookDiagramData
}

const LAYER_COLORS = {
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
} as const

const COMPARISON_COLORS = {
  teal: 'border-teal-200 bg-teal-50 text-teal-900',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
} as const

const SEGMENT_COLORS = {
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  rose: 'border-rose-200 bg-rose-50 text-rose-900',
} as const

function RoleIcon({ role }: { role: PacketFlowNodeRole }) {
  if (role === 'pc') return <Monitor className="h-5 w-5" aria-hidden="true" />
  if (role === 'switch') return <Network className="h-5 w-5" aria-hidden="true" />
  if (role === 'router') return <Router className="h-5 w-5" aria-hidden="true" />
  if (role === 'server' || role === 'dns') return <Server className="h-5 w-5" aria-hidden="true" />
  return <Cable className="h-5 w-5" aria-hidden="true" />
}

function DiagramShell({
  title,
  description,
  points,
  children,
}: {
  title: string
  description: string
  points: string[]
  children: React.ReactNode
}) {
  return (
    <figure className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <figcaption className="border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-black text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </figcaption>
      <div className="p-4">{children}</div>
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-xs font-black text-slate-500">この図で見るところ</p>
        <ul className="mt-2 space-y-1.5">
          {points.map((point) => (
            <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-600">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

function LayerStackDiagramView({ diagram }: { diagram: LayerStackDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="space-y-2">
        {diagram.layers.map((layer) => (
          <div key={layer.label} className={`rounded-lg border px-4 py-3 ${LAYER_COLORS[layer.color]}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="inline-flex h-9 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/70 text-sm font-black">
                {layer.label}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black">{layer.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed">{layer.description}</p>
                <p className="mt-1 text-xs font-bold opacity-80">例: {layer.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DiagramShell>
  )
}

function NetworkFlowDiagramView({ diagram }: { diagram: NetworkFlowDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr))]">
        {diagram.nodes.map((node, index) => {
          const link = diagram.links[index]
          return (
            <div key={node.id} className="flex items-center gap-3 md:block">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                  <RoleIcon role={node.role} />
                </div>
                <p className="mt-2 text-sm font-black text-slate-800">{node.label}</p>
                <p className="mt-1 text-xs leading-snug text-slate-500">{node.caption}</p>
              </div>
              {link && (
                <div className="flex flex-1 items-center justify-center gap-2 text-xs font-bold text-slate-400 md:my-2">
                  <span className="h-px flex-1 bg-slate-200 md:hidden" />
                  <span className="whitespace-nowrap">{link.label}</span>
                  <span className="text-blue-500">→</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DiagramShell>
  )
}

function ComparisonDiagramView({ diagram }: { diagram: ComparisonDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="grid gap-3 md:grid-cols-2">
        {diagram.columns.map((column) => (
          <div key={column.title} className={`rounded-lg border px-4 py-3 ${COMPARISON_COLORS[column.accent]}`}>
            <p className="text-base font-black">{column.title}</p>
            <p className="mt-0.5 text-xs font-bold opacity-80">{column.subtitle}</p>
            <ul className="mt-3 space-y-2">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DiagramShell>
  )
}

function SequenceDiagramView({ diagram }: { diagram: SequenceDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <ol className="space-y-3">
        {diagram.steps.map((step) => (
          <li key={step.label} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">
              {step.label}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-sm font-black text-slate-800">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </DiagramShell>
  )
}

function SegmentDiagramView({ diagram }: { diagram: SegmentDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="grid gap-3 md:grid-cols-3">
        {diagram.domains.map((domain) => (
          <div key={domain.title} className={`rounded-lg border px-4 py-3 ${SEGMENT_COLORS[domain.accent]}`}>
            <p className="text-sm font-black">{domain.title}</p>
            <p className="mt-1 text-xs font-bold opacity-80">{domain.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {domain.members.map((member) => (
                <span key={member} className="rounded-md bg-white/75 px-2 py-1 text-xs font-bold shadow-sm">
                  {member}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DiagramShell>
  )
}

export default function TextbookDiagram({ diagram }: TextbookDiagramProps) {
  if (diagram.type === 'layer-stack') return <LayerStackDiagramView diagram={diagram} />
  if (diagram.type === 'network-flow') return <NetworkFlowDiagramView diagram={diagram} />
  if (diagram.type === 'comparison') return <ComparisonDiagramView diagram={diagram} />
  if (diagram.type === 'sequence') return <SequenceDiagramView diagram={diagram} />
  if (diagram.type === 'segment') return <SegmentDiagramView diagram={diagram} />
  return (
    <PacketFlowVisualizer
      scenario={diagram.scenario}
      title={diagram.title}
      description={diagram.description}
      points={diagram.points}
    />
  )
}
