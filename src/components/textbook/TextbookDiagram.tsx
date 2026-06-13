import { ArrowRight, Cable, Check, Monitor, Network, Router, Server } from 'lucide-react'
import type {
  ComparisonDiagram,
  LayerStackDiagram,
  NetworkFlowDiagram,
  PacketFrameDiagram,
  PacketFlowNodeRole,
  SegmentDiagram,
  SequenceDiagram,
  TextbookDiagram as TextbookDiagramData,
} from '../../data/textbookChapters'
import PacketFlowVisualizer from './PacketFlowVisualizer'
import TextbookRichText from './TextbookRichText'

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

const PACKET_FRAME_COLORS = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
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
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          <TextbookRichText text={description} />
        </p>
      </figcaption>
      <div className="p-4">{children}</div>
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-xs font-black text-slate-500">この図で見るところ</p>
        <ul className="mt-2 space-y-1.5">
          {points.map((point) => (
            <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-600">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" aria-hidden="true" />
              <span>
                <TextbookRichText text={point} />
              </span>
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
                <p className="mt-0.5 text-sm leading-relaxed">
                  <TextbookRichText text={layer.description} />
                </p>
                <p className="mt-1 text-xs font-bold opacity-80">
                  例: <TextbookRichText text={layer.example} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DiagramShell>
  )
}

function NetworkFlowDiagramView({ diagram }: { diagram: NetworkFlowDiagram }) {
  const positionedNodes = diagram.nodes.map((node, index) => ({
    ...node,
    x: [14, 38, 62, 86][index] ?? 14 + index * 22,
    y: 56,
  }))
  const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]))

  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="hidden sm:block">
        <div className="relative h-[310px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <div className="absolute bottom-3 left-3 top-3 w-[66%] rounded-lg border border-sky-200 bg-sky-50/70" />
          <div className="absolute bottom-3 right-3 top-3 w-[27%] rounded-lg border border-indigo-200 bg-indigo-50/70" />
          <div className="absolute left-6 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-sky-800 shadow-sm">
            社内LAN / VLAN 10 / 192.168.1.0/24
          </div>
          <div className="absolute right-6 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-indigo-800 shadow-sm">
            別ネットワーク
          </div>

          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {diagram.links.map((link) => {
              const from = nodeMap.get(link.from)
              const to = nodeMap.get(link.to)
              if (!from || !to) return null
              return (
                <line
                  key={`${link.from}-${link.to}`}
                  x1={`${from.x + 7}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x - 7}%`}
                  y2={`${to.y}%`}
                  stroke="#2563eb"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {diagram.links.map((link) => {
            const from = nodeMap.get(link.from)
            const to = nodeMap.get(link.to)
            if (!from || !to) return null
            return (
              <div
                key={`${link.from}-${link.to}-label`}
                className="absolute z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-blue-100 bg-white px-2 py-1 text-[11px] font-black text-blue-700 shadow-sm"
                style={{ left: `${(from.x + to.x) / 2}%`, top: '32%' }}
              >
                {link.label}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </div>
            )
          })}

          {positionedNodes.map((node) => (
            <div
              key={node.id}
              className="absolute w-[118px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-center shadow-sm"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <RoleIcon role={node.role} />
              </div>
              <p className="mt-2 text-sm font-black leading-tight text-slate-800">{node.label}</p>
              <p className="mt-1 text-[11px] font-bold leading-snug text-slate-500">{node.caption}</p>
            </div>
          ))}

          <div className="absolute bottom-5 left-6 right-6 grid gap-2 text-[11px] font-bold text-slate-600 md:grid-cols-3">
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">PCは最初に同じLAN内の次の相手を探す</div>
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">L2SWはMACアドレスで同じVLAN内を転送する</div>
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">ルータから先は別ネットワークとして経路を選ぶ</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:hidden">
        {diagram.nodes.map((node, index) => {
          const link = diagram.links[index]
          return (
            <div key={node.id}>
              <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                  <RoleIcon role={node.role} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{node.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{node.caption}</p>
                </div>
              </div>
              {link && (
                <div className="ml-5 flex items-center gap-2 py-2 text-xs font-black text-blue-700">
                  <span className="h-6 w-px bg-blue-200" />
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5 rotate-90" aria-hidden="true" />
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
                  <span>
                    <TextbookRichText text={item} />
                  </span>
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
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                <TextbookRichText text={step.body} />
              </p>
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
            <p className="mt-1 text-xs font-bold opacity-80">
              <TextbookRichText text={domain.description} />
            </p>
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

function PacketFrameDiagramView({ diagram }: { diagram: PacketFrameDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="space-y-3">
        {diagram.layers.map((layer, index) => (
          <div
            key={layer.title}
            className={`rounded-lg border px-4 py-3 ${PACKET_FRAME_COLORS[layer.accent]} ${index > 0 ? 'ml-3 sm:ml-8' : ''}`}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-black">{layer.title}</p>
              <p className="text-xs font-bold opacity-75">{layer.subtitle}</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {layer.fields.map((field) => (
                <div key={field} className="rounded-md bg-white/80 px-2.5 py-2 text-center text-xs font-black shadow-sm">
                  {field}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {diagram.notes.map((note) => (
          <div key={note.title} className={`rounded-lg border px-3 py-2 ${PACKET_FRAME_COLORS[note.accent]}`}>
            <p className="text-xs font-black">{note.title}</p>
            <p className="mt-1 text-xs leading-relaxed">
              <TextbookRichText text={note.body} />
            </p>
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
  if (diagram.type === 'packet-frame') return <PacketFrameDiagramView diagram={diagram} />
  return (
    <PacketFlowVisualizer
      scenario={diagram.scenario}
      title={diagram.title}
      description={diagram.description}
      points={diagram.points}
    />
  )
}
