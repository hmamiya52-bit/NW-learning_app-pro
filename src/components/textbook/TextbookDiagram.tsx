import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowRight, Cable, Check, ChevronLeft, ChevronRight, Monitor, Network, Pause, Play, RotateCcw, Router, Server } from 'lucide-react'
import type {
  AddressRoleTableDiagram,
  ComparisonDiagram,
  DiagnosticMapDiagram,
  EncapsulationDiagram,
  ExamNetworkDiagram,
  ExamNetworkStep,
  LayerStackDiagram,
  NetworkFlowDiagram,
  PacketFrameDiagram,
  PacketFlowNodeRole,
  SegmentDiagram,
  SequenceDiagram,
  TextbookDiagram as TextbookDiagramData,
  VlanDesignDiagram,
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

const DIAGNOSTIC_COLORS = {
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
} as const

const PACKET_FRAME_COLORS = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
} as const

const ADDRESS_TABLE_COLORS = {
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-50 text-blue-800 border-blue-200',
  amber: 'bg-amber-50 text-amber-900 border-amber-200',
} as const

const EXAM_TONES = {
  slate: { fill: '#f8fafc', stroke: '#334155', text: '#0f172a', link: '#475569' },
  sky: { fill: '#eff6ff', stroke: '#2563eb', text: '#1e3a8a', link: '#2563eb' },
  blue: { fill: '#eef2ff', stroke: '#4f46e5', text: '#312e81', link: '#4f46e5' },
  emerald: { fill: '#ecfdf5', stroke: '#059669', text: '#064e3b', link: '#059669' },
  amber: { fill: '#fffbeb', stroke: '#d97706', text: '#78350f', link: '#d97706' },
  rose: { fill: '#fff1f2', stroke: '#e11d48', text: '#881337', link: '#e11d48' },
  violet: { fill: '#f5f3ff', stroke: '#7c3aed', text: '#4c1d95', link: '#7c3aed' },
} as const

const ROLE_TONES: Record<PacketFlowNodeRole, keyof typeof EXAM_TONES> = {
  pc: 'sky',
  switch: 'emerald',
  router: 'blue',
  server: 'amber',
  dns: 'violet',
  firewall: 'rose',
  internet: 'slate',
}

function RoleIcon({ role }: { role: PacketFlowNodeRole }) {
  if (role === 'pc') return <Monitor className="h-5 w-5" aria-hidden="true" />
  if (role === 'switch') return <Network className="h-5 w-5" aria-hidden="true" />
  if (role === 'router') return <Router className="h-5 w-5" aria-hidden="true" />
  if (role === 'server' || role === 'dns') return <Server className="h-5 w-5" aria-hidden="true" />
  return <Cable className="h-5 w-5" aria-hidden="true" />
}

function compactLabelLines(label: string, maxLines = 2): string[] {
  const trimmed = label.trim()
  if (!trimmed) return []
  if (trimmed.length <= 6 && !trimmed.includes(' ')) return [trimmed]
  if (/^[A-Za-z0-9-]+$/.test(trimmed) && trimmed.length <= 9) return [trimmed]

  if (trimmed.includes('/')) {
    const [first, ...rest] = trimmed.split('/')
    return [`${first}/`, rest.join('/')].filter(Boolean).slice(0, maxLines)
  }

  if (trimmed.includes(' ')) {
    return trimmed.split(/\s+/).filter(Boolean).slice(0, maxLines)
  }

  const alphaPrefix = trimmed.match(/^([A-Za-z0-9]+)(.+)$/)
  if (alphaPrefix && alphaPrefix[1].length >= 3 && alphaPrefix[2].length >= 2) {
    return [alphaPrefix[1], alphaPrefix[2]].slice(0, maxLines)
  }

  const splitAt = Math.ceil(trimmed.length / 2)
  return [trimmed.slice(0, splitAt), trimmed.slice(splitAt)].filter(Boolean).slice(0, maxLines)
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
      <figcaption className="border-b border-slate-200 px-3 py-3 sm:px-4">
        <p className="text-sm font-black text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          <TextbookRichText text={description} />
        </p>
      </figcaption>
      <div className="p-3 sm:p-4">{children}</div>
      <div className="border-t border-slate-100 px-3 py-3 sm:px-4">
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
      <div className="hidden lg:block">
        <div className="relative h-[310px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <div className="absolute bottom-3 left-3 top-3 w-[66%] rounded-lg border border-sky-200 bg-sky-50/70" />
          <div className="absolute bottom-3 right-3 top-3 w-[27%] rounded-lg border border-indigo-200 bg-indigo-50/70" />
          <div className="absolute left-6 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-sky-800 shadow-sm">
            社内LAN / 192.168.1.0/24
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
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">PCはIPパケットに次ホップ宛てのL2ヘッダを付加する</div>
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">L2SWはフレームを同じLAN内で転送する</div>
            <div className="rounded-lg bg-white/85 px-3 py-2 shadow-sm">ルータはL2ヘッダを取り外し、IPを見て、次のL2ヘッダを付加する</div>
          </div>
        </div>
      </div>

      <div className="-mx-2 lg:hidden">
        <svg
          className="h-auto w-full rounded-lg border border-slate-200 bg-white"
          viewBox="0 0 360 184"
          role="img"
          aria-label={`${diagram.title}のスマホ用構成図`}
        >
          <rect x="10" y="12" width="228" height="136" rx="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="6 4" />
          <rect x="246" y="12" width="104" height="136" rx="8" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.4" strokeDasharray="6 4" />
          <text x="24" y="32" fill="#1e3a8a" fontSize="11" fontWeight="900">社内LAN</text>
          <text x="258" y="32" fill="#312e81" fontSize="11" fontWeight="900">別ネットワーク</text>

          {diagram.links.map((link) => {
            const from = nodeMap.get(link.from)
            const to = nodeMap.get(link.to)
            if (!from || !to) return null
            const labelX = ((from.x + to.x) / 2 / 100) * 360
            return (
              <g key={`${link.from}-${link.to}-mobile`}>
                <line
                  x1={`${from.x + 7}%`}
                  y1="112"
                  x2={`${to.x - 7}%`}
                  y2="112"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1={`${from.x + 7}%`}
                  y1="112"
                  x2={`${to.x - 7}%`}
                  y2="112"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x={labelX - 32} y="78" width="64" height="18" rx="5" fill="#ffffff" stroke="#dbeafe" />
                <text x={labelX} y="91" textAnchor="middle" fill="#1d4ed8" fontSize="8" fontWeight="900">
                  {link.label}
                </text>
              </g>
            )
          })}

          {positionedNodes.map((node) => {
            const x = (node.x / 100) * 360
            const lines = compactLabelLines(node.label)
            return (
              <g key={node.id}>
                <rect x={x - 30} y="91" width="60" height="42" rx="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.6" />
                {lines.map((line, index) => (
                  <text
                    key={`${node.id}-${line}`}
                    x={x}
                    y={111 + index * 11 - (lines.length - 1) * 5}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="9.3"
                    fontWeight="900"
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>
      </div>
    </DiagramShell>
  )
}

function ComparisonDiagramView({ diagram }: { diagram: ComparisonDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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

function AddressRoleTableDiagramView({ diagram }: { diagram: AddressRoleTableDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="space-y-3 lg:hidden">
        {diagram.rows.map((row) => (
          <section key={row.name} className={`rounded-lg border px-3 py-3 ${ADDRESS_TABLE_COLORS[row.accent]}`}>
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black">{row.name}</h4>
              <span className="rounded-md bg-white/75 px-2 py-1 text-[11px] font-black shadow-sm">{row.layer}</span>
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              {[
                ['入る場所', row.header],
                ['識別するもの', row.identifies],
                ['有効範囲', row.scope],
                ['例', row.example],
                ['構成図での読み方', row.examHint],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white/75 px-2.5 py-2 shadow-sm">
                  <dt className="font-black opacity-70">{label}</dt>
                  <dd className="mt-1 font-bold leading-relaxed text-slate-800">
                    <TextbookRichText text={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="whitespace-nowrap px-3 py-2 font-black">項目</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">層</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">入る場所</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">識別するもの</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">有効範囲</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">例</th>
              <th className="whitespace-nowrap px-3 py-2 font-black">構成図での読み方</th>
            </tr>
          </thead>
          <tbody>
            {diagram.rows.map((row) => (
              <tr key={row.name} className="border-b border-slate-100 align-top last:border-b-0">
                <th className="w-28 px-3 py-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 font-black ${ADDRESS_TABLE_COLORS[row.accent]}`}>
                    {row.name}
                  </span>
                </th>
                <td className="px-3 py-3 font-black text-slate-800">{row.layer}</td>
                <td className="px-3 py-3 leading-relaxed text-slate-700">
                  <TextbookRichText text={row.header} />
                </td>
                <td className="px-3 py-3 leading-relaxed text-slate-700">
                  <TextbookRichText text={row.identifies} />
                </td>
                <td className="px-3 py-3 leading-relaxed text-slate-700">
                  <TextbookRichText text={row.scope} />
                </td>
                <td className="px-3 py-3 font-bold leading-relaxed text-slate-800">
                  <TextbookRichText text={row.example} />
                </td>
                <td className="px-3 py-3 leading-relaxed text-slate-700">
                  <TextbookRichText text={row.examHint} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className="space-y-3" data-testid="packet-frame-diagram">
        {diagram.layers.map((layer, index) => (
          <div
            key={layer.title}
            className={`rounded-lg border px-4 py-3 ${PACKET_FRAME_COLORS[layer.accent]} ${index > 0 ? 'ml-3 sm:ml-8' : ''}`}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-black">{layer.title}</p>
              <p className="text-xs font-bold opacity-75">{layer.subtitle}</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {layer.fields.map((field) => (
                <div key={field} className="rounded-md bg-white/80 px-2.5 py-2 text-center text-xs font-black leading-snug shadow-sm">
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

function EncapsulationDiagramView({ diagram }: { diagram: EncapsulationDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="grid gap-3 md:grid-cols-4">
        {diagram.stages.map((stage, index) => (
          <div
            key={stage.label}
            className="textbook-encapsulation-stage rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            style={{ animationDelay: `${index * 160}ms` }}
          >
            <p className="text-xs font-black text-blue-700">{stage.label}</p>
            <p className="mt-1 text-sm font-black text-slate-800">{stage.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              <TextbookRichText text={stage.description} />
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stage.parts.map((part) => (
                <span key={part.label} className={`rounded-md border px-2 py-1 text-[11px] font-black ${PACKET_FRAME_COLORS[part.accent]}`}>
                  {part.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {diagram.routeNotes.map((note) => (
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

function VlanDesignDiagramView({ diagram }: { diagram: VlanDesignDiagram }) {
  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="space-y-4" data-testid="vlan-design-diagram">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs font-black text-slate-500">物理構成</p>
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            {diagram.physical.map((device) => (
              <div key={device.label} className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <RoleIcon role={device.role} />
                </div>
                <p className="mt-2 text-sm font-black text-slate-800">{device.label}</p>
                <p className="mt-1 text-[11px] font-bold leading-relaxed text-slate-500">{device.caption}</p>
                {device.vlan && (
                  <p className="mt-2 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700">{device.vlan}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs font-black text-amber-900">{diagram.trunk.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              <TextbookRichText text={diagram.trunk.description} />
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <p className="text-xs font-black text-slate-500">論理構成</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {diagram.logical.map((domain) => (
              <div key={domain.title} className={`rounded-lg border px-4 py-3 ${SEGMENT_COLORS[domain.accent]}`}>
                <p className="text-sm font-black">{domain.title}</p>
                <p className="mt-1 text-xs font-bold opacity-80">{domain.subnet}</p>
                <p className="mt-2 text-xs leading-relaxed">
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
        </div>
      </div>
    </DiagramShell>
  )
}

function DiagnosticMapDiagramView({ diagram }: { diagram: DiagnosticMapDiagram }) {
  const viewBox = { width: 720, height: 250 }
  const nodeWidth = diagram.path.length >= 5 ? 94 : 108
  const nodeHeight = 54
  const centers = diagram.path.map((node) => ({
    node,
    x: 36 + node.x * 6.48,
    y: 58 + node.y * 1.72,
  }))
  const centerById = new Map(centers.map((item) => [item.node.id, item]))
  const motionPoints = diagram.links.flatMap((link, index) => {
    const from = centerById.get(link.from)
    const to = centerById.get(link.to)
    if (!from || !to) return []
    if (index === 0) return [from, to]
    return [from, to]
  })
  const motionPath = motionPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const mobileViewBox = { width: 320, height: diagram.path.length >= 5 ? 292 : 252 }
  const mobileNodeWidth = diagram.path.length >= 5 ? 74 : 72
  const mobileNodeHeight = 48
  const mobileCenters = diagram.path.map((node) => ({
    node,
    x: 28 + node.x * 2.64,
    y: 50 + node.y * 1.75,
  }))
  const mobileCenterById = new Map(mobileCenters.map((item) => [item.node.id, item]))
  const mobileMotionPoints = diagram.links.flatMap((link, index) => {
    const from = mobileCenterById.get(link.from)
    const to = mobileCenterById.get(link.to)
    if (!from || !to) return []
    if (index === 0) return [from, to]
    return [from, to]
  })
  const mobileMotionPath = mobileMotionPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')

  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      <div className="space-y-3" data-testid="diagnostic-map-diagram">
        <svg
          className="h-auto w-full rounded-lg border border-slate-200 bg-white sm:hidden"
          viewBox={`0 0 ${mobileViewBox.width} ${mobileViewBox.height}`}
          role="img"
          aria-label={`${diagram.title}の読解マップ`}
        >
          <rect
            x="10"
            y="10"
            width={mobileViewBox.width - 20}
            height={mobileViewBox.height - 20}
            rx="12"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="1.8"
            strokeDasharray="8 6"
          />
          <text x="24" y="36" fill="#0f172a" fontSize="14" fontWeight="900">
            読む順番を構成図で確認
          </text>
          <text x="24" y="56" fill="#64748b" fontSize="10.5" fontWeight="700">
            青い点が、見る場所を順番にたどります
          </text>

          {diagram.links.map((link, index) => {
            const from = mobileCenterById.get(link.from)
            const next = mobileCenterById.get(link.to)
            if (!from || !next) return null
            const { x, y } = from
            const laneTone = EXAM_TONES[link.tone ?? (index % 2 === 0 ? 'blue' : 'emerald')]
            const label = link.label
            const labelLines = compactLabelLines(label, 2)
            const labelWidth = 112
            const labelHeight = labelLines.length > 1 ? 31 : 23
            const isVertical = Math.abs(next.y - y) > Math.abs(next.x - x)
            const midX = (x + next.x) / 2
            const midY = (y + next.y) / 2
            const rawLabelY = isVertical ? midY : index % 2 === 0 ? Math.min(y, next.y) - 30 : Math.max(y, next.y) + 30
            const labelX = Math.min(Math.max(midX, labelWidth / 2 + 12), mobileViewBox.width - labelWidth / 2 - 12)
            const labelY = Math.min(Math.max(rawLabelY, 78), mobileViewBox.height - 40)
            const showLabel = Math.abs(next.y - y) < 6
            return (
              <g key={`${link.from}-${link.to}-mobile`}>
                <line
                  x1={x}
                  y1={y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#ffffff"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <line
                  x1={x}
                  y1={y}
                  x2={next.x}
                  y2={next.y}
                  stroke={laneTone.link}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {showLabel && (
                  <g>
                    <rect
                      x={labelX - labelWidth / 2}
                      y={labelY - labelHeight / 2}
                      width={labelWidth}
                      height={labelHeight}
                      rx="7"
                      fill="#ffffff"
                      stroke="#dbe4ef"
                    />
                    {labelLines.map((line, lineIndex) => (
                      <text
                        key={`${link.from}-${link.to}-${line}-mobile`}
                        x={labelX}
                        y={labelY + 3 + (lineIndex - (labelLines.length - 1) / 2) * 10}
                        textAnchor="middle"
                        fill={laneTone.text}
                        fontSize="10"
                        fontWeight="900"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                )}
              </g>
            )
          })}

          {mobileMotionPath && (
            <g aria-hidden="true">
              <circle r="12" fill="#2563eb" opacity="0.14">
                <animateMotion dur="5.2s" repeatCount="indefinite" path={mobileMotionPath} />
              </circle>
              <circle r="5" fill="#2563eb">
                <animateMotion dur="5.2s" repeatCount="indefinite" path={mobileMotionPath} />
              </circle>
            </g>
          )}

          {mobileCenters.map(({ node, x, y }) => {
            const tone = EXAM_TONES[node.tone ?? ROLE_TONES[node.role]]
            const labelLines = compactLabelLines(node.label)
            return (
              <g key={`${node.id}-mobile`}>
                <rect
                  x={x - mobileNodeWidth / 2 + 3}
                  y={y - mobileNodeHeight / 2 + 4}
                  width={mobileNodeWidth}
                  height={mobileNodeHeight}
                  rx="9"
                  fill="#0f172a"
                  fillOpacity="0.08"
                />
                <rect
                  x={x - mobileNodeWidth / 2}
                  y={y - mobileNodeHeight / 2}
                  width={mobileNodeWidth}
                  height={mobileNodeHeight}
                  rx="9"
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth="2"
                />
                {labelLines.map((line, index) => (
                  <text
                    key={`${node.id}-${line}-mobile`}
                    x={x}
                    y={y + 4 + index * 11 - (labelLines.length - 1) * 5.5}
                    textAnchor="middle"
                    fill={tone.text}
                    fontSize={labelLines.some((item) => item.length >= 7) ? 10.5 : 12}
                    fontWeight="900"
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>

        <svg
          className="hidden h-auto w-full rounded-lg border border-slate-200 bg-white sm:block"
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          role="img"
          aria-label={`${diagram.title}の読解マップ`}
        >
          <rect x="18" y="18" width="684" height="206" rx="12" fill="#f8fafc" stroke="#334155" strokeWidth="2" strokeDasharray="10 7" />
          <text x="38" y="44" fill="#0f172a" fontSize="16" fontWeight="900">
            構成図から答案根拠までをつなぐ
          </text>
          <text x="38" y="68" fill="#64748b" fontSize="12" fontWeight="700">
            経路、判断材料、観測点を対応付けて読む
          </text>

          {diagram.links.map((link, index) => {
            const from = centerById.get(link.from)
            const next = centerById.get(link.to)
            if (!from || !next) return null
            const { x, y } = from
            const laneTone = EXAM_TONES[link.tone ?? (index % 2 === 0 ? 'blue' : 'emerald')]
            const label = link.label
            const labelX = (x + next.x) / 2
            const labelY = Math.abs(next.y - y) > 8 ? (y + next.y) / 2 - 16 : y - 32
            return (
              <g key={`${link.from}-${link.to}`}>
                <line
                  x1={x}
                  y1={y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#ffffff"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <line
                  x1={x}
                  y1={y}
                  x2={next.x}
                  y2={next.y}
                  stroke={laneTone.link}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect x={labelX - 48} y={labelY - 11} width="96" height="22" rx="7" fill="#ffffff" stroke="#dbe4ef" />
                <text x={labelX} y={labelY + 4} textAnchor="middle" fill={laneTone.text} fontSize="10" fontWeight="900">
                  {label}
                </text>
              </g>
            )
          })}

          {motionPath && (
            <g aria-hidden="true">
              <circle r="12" fill="#2563eb" opacity="0.14">
                <animateMotion dur="5.2s" repeatCount="indefinite" path={motionPath} />
              </circle>
              <circle r="5" fill="#2563eb">
                <animateMotion dur="5.2s" repeatCount="indefinite" path={motionPath} />
              </circle>
            </g>
          )}

          {centers.map(({ node, x, y }) => {
            const tone = EXAM_TONES[node.tone ?? ROLE_TONES[node.role]]
            const labelLines = compactLabelLines(node.label)
            return (
              <g key={node.id}>
                <rect
                  x={x - nodeWidth / 2 + 4}
                  y={y - nodeHeight / 2 + 5}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="9"
                  fill="#0f172a"
                  fillOpacity="0.08"
                />
                <rect
                  x={x - nodeWidth / 2}
                  y={y - nodeHeight / 2}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="9"
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth="2"
                />
                {labelLines.map((line, index) => (
                  <text
                    key={`${node.id}-${line}`}
                    x={x}
                    y={y + 4 + index * 12 - (labelLines.length - 1) * 6}
                    textAnchor="middle"
                    fill={tone.text}
                    fontSize={labelLines.some((item) => item.length >= 7) ? 11 : 13}
                    fontWeight="900"
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {diagram.lanes.map((lane, index) => (
            <section key={lane.title} className={`rounded-lg border px-3 py-3 ${DIAGNOSTIC_COLORS[lane.accent]}`}>
              <div className="flex items-start gap-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white/75 text-xs font-black shadow-sm">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-black leading-snug">{lane.title}</h4>
                  <p className="mt-0.5 text-[11px] font-bold opacity-75">{lane.subtitle}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5">
                {lane.items.map((item) => (
                  <li key={item} className="rounded-md bg-white/75 px-2 py-1.5 text-xs font-bold leading-relaxed shadow-sm">
                    <TextbookRichText text={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </DiagramShell>
  )
}

function SvgText({
  x,
  y,
  lines,
  size = 15,
  weight = 700,
  anchor = 'middle',
  color = '#0f172a',
}: {
  x: number
  y: number
  lines: string[]
  size?: number
  weight?: number
  anchor?: 'start' | 'middle' | 'end'
  color?: string
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={weight}>
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : size + 4}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function SvgBadge({
  x,
  y,
  label,
  color,
}: {
  x: number
  y: number
  label: string
  color: string
}) {
  const width = Math.min(Math.max(label.length * 12 + 22, 62), 150)

  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 15}
        width={width}
        height="26"
        rx="7"
        fill="#ffffff"
        fillOpacity="0.96"
        stroke="#dbe4ef"
        strokeWidth="1.2"
      />
      <text x={x} y={y + 3} textAnchor="middle" fill={color} fontSize="11" fontWeight="900">
        {label}
      </text>
    </g>
  )
}

function nodeCaptionLines(caption?: string): string[] {
  return caption ? caption.split('\n').filter(Boolean).slice(0, 2) : []
}

function SvgNodeLabel({
  x,
  y,
  width,
  height,
  label,
  caption,
  color,
}: {
  x: number
  y: number
  width: number
  height: number
  label: string
  caption?: string
  color: string
}) {
  const captionLines = nodeCaptionLines(caption)
  const labelY = y + (captionLines.length > 0 ? height / 2 - 6 : height / 2 + 5)

  return (
    <text textAnchor="middle" fill={color}>
      <tspan x={x + width / 2} y={labelY} fontSize="14" fontWeight="900">
        {label}
      </tspan>
      {captionLines.map((line, index) => (
        <tspan key={`${label}-${line}-${index}`} x={x + width / 2} dy={index === 0 ? 18 : 14} fontSize="10.5" fontWeight="700">
          {line}
        </tspan>
      ))}
    </text>
  )
}

function linkTouchesNode(linkId: string, nodeId: string): boolean {
  return linkId.startsWith(`link-${nodeId}-`) || linkId.endsWith(`-${nodeId}`)
}

function MobileExamNetworkDiagram({
  diagram,
  currentStep,
}: {
  diagram: ExamNetworkDiagram
  currentStep?: ExamNetworkStep
}) {
  const activeLinkIds = new Set(currentStep?.activeLinkIds ?? [])
  const scopeZone = diagram.zones.find((zone) => zone.id === 'scope')
  const sideZones = diagram.zones.filter((zone) => zone.id === 'client-side' || zone.id === 'service-side')
  const viewBox = { width: 360, height: 220 }
  const nodeWidth = 58
  const nodeHeight = 42
  const scalePoint = (point: { x: number; y: number }) => ({
    x: 20 + (point.x / diagram.viewBox.width) * 320,
    y: 34 + (point.y / diagram.viewBox.height) * 152,
  })
  const nodeCenters = diagram.nodes.map((node) => ({
    node,
    ...scalePoint({ x: node.x + node.width / 2, y: node.y + node.height / 2 }),
  }))

  return (
    <div className="-mx-3 lg:hidden" data-testid="mobile-exam-network-diagram">
      <svg
        className="h-auto w-full rounded-lg border border-slate-200 bg-white"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label={`${diagram.title}のスマホ用構成図`}
      >
        <rect x="8" y="8" width="344" height="202" rx="8" fill="#f8fafc" stroke="#334155" strokeWidth="1.6" strokeDasharray="7 5" />
        {scopeZone && (
          <text x="22" y="28" fill="#0f172a" fontSize="12" fontWeight="900">
            {scopeZone.label}
          </text>
        )}
        {sideZones.map((zone) => {
          const tone = EXAM_TONES[zone.tone ?? 'slate']
          const isService = zone.id === 'service-side'
          return (
            <g key={zone.id}>
              <rect
                x={isService ? 202 : 14}
                y="50"
                width={isService ? 140 : 150}
                height="112"
                rx="7"
                fill={tone.fill}
                stroke={tone.stroke}
                strokeWidth="1.4"
                strokeDasharray="6 4"
              />
              <text x={isService ? 214 : 26} y="68" fill={tone.text} fontSize="11" fontWeight="900">
                {zone.label}
              </text>
              {zone.caption && (
                <text x={isService ? 214 : 26} y="84" fill={tone.text} fontSize="7.5" fontWeight="700">
                  {zone.caption}
                </text>
              )}
            </g>
          )
        })}

        {diagram.links.map((link) => {
          const active = activeLinkIds.has(link.id)
          const tone = EXAM_TONES[link.tone ?? 'slate']
          const points = link.points.map(scalePoint)
          const labelPoint = scalePoint(link.labelPosition ?? link.points[Math.floor(link.points.length / 2)])
          const label = active && currentStep ? currentStep.packetLabel : link.label
          const badgeWidth = Math.min(Math.max((label?.length ?? 0) * 6.2 + 16, 40), 70)
          const mostlyHorizontal = points.length >= 2 && Math.abs(points[0].y - points[points.length - 1].y) < 6
          return (
            <g key={link.id}>
              <polyline
                points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                fill="none"
                stroke="#ffffff"
                strokeWidth={active ? 7 : 5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                fill="none"
                stroke={active ? '#2563eb' : tone.link}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={link.dashed ? '6 6' : undefined}
              />
              {label && mostlyHorizontal && (
                <g>
                  <rect x={labelPoint.x - badgeWidth / 2} y={labelPoint.y - 9} width={badgeWidth} height="18" rx="5" fill="#ffffff" stroke="#dbe4ef" />
                  <text x={labelPoint.x} y={labelPoint.y + 4} textAnchor="middle" fill={active ? '#1d4ed8' : tone.text} fontSize="8" fontWeight="900">
                    {label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {nodeCenters.map(({ node, x, y }) => {
          const tone = EXAM_TONES[node.tone ?? ROLE_TONES[node.role]]
          const active = currentStep?.activeLinkIds.some((linkId) => linkTouchesNode(linkId, node.id))
          const labelLines = compactLabelLines(node.label)
          const labelSize = labelLines.some((line) => line.length >= 7) ? 8.8 : 10
          return (
            <g key={node.id}>
              <rect
                x={x - nodeWidth / 2 + 3}
                y={y - nodeHeight / 2 + 4}
                width={nodeWidth}
                height={nodeHeight}
                rx="7"
                fill="#0f172a"
                fillOpacity="0.08"
              />
              <rect
                x={x - nodeWidth / 2}
                y={y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="7"
                fill={active ? '#dbeafe' : tone.fill}
                stroke={active ? '#2563eb' : tone.stroke}
                strokeWidth={active ? 2.4 : 1.8}
              />
              {labelLines.map((line, index) => (
                <text
                  key={`${node.id}-${line}`}
                  x={x}
                  y={y + 4 + index * 11 - (labelLines.length - 1) * 5}
                  textAnchor="middle"
                  fill={tone.text}
                  fontSize={labelSize}
                  fontWeight="900"
                >
                  {line}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function CaptureValue({ value }: { value: string }) {
  const pieces = value.split(' / ')
  if (pieces.length <= 1) {
    return <TextbookRichText text={value} />
  }

  return (
    <span className="space-y-0.5">
      {pieces.map((piece) => (
        <span key={piece} className="block">
          <TextbookRichText text={piece} />
        </span>
      ))}
    </span>
  )
}

function ExamNetworkCapture({ step }: { step: ExamNetworkStep }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-blue-700">{step.capture.point}</p>
          <h5 className="mt-1 text-sm font-black leading-snug text-slate-800">{step.title}</h5>
        </div>
        <span className="mt-0.5 flex-shrink-0 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-black text-white">
          {step.packetLabel}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        <TextbookRichText text={step.description} />
      </p>
      <p className="mt-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold leading-relaxed text-blue-900">
        <TextbookRichText text={step.deviceAction} />
      </p>
      <p className="mt-3 text-xs font-black text-slate-500">キャプチャ風表示（この区間で見る主な値）</p>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {[
          ['L2', step.capture.l2],
          ['L3', step.capture.l3],
          ['L4', step.capture.l4],
          ['注目点', step.capture.note],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[58px_minmax(0,1fr)] border-b border-slate-100 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)]">
            <div className="bg-slate-50 px-2.5 py-2 text-xs font-black text-slate-500 sm:px-3">{label}</div>
            <div className="min-w-0 px-2.5 py-2 text-xs font-bold leading-relaxed text-slate-800 sm:px-3">
              <CaptureValue value={value} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExamNetworkDiagramView({ diagram }: { diagram: ExamNetworkDiagram }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const currentStep = diagram.steps?.[stepIndex]
  const activeLinkIds = new Set(currentStep?.activeLinkIds ?? [])
  const hasSteps = Boolean(diagram.steps?.length)

  useEffect(() => {
    if (!isPlaying || !diagram.steps) return undefined
    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        if (!diagram.steps || current >= diagram.steps.length - 1) {
          setIsPlaying(false)
          return current
        }
        return current + 1
      })
    }, 4300)
    return () => window.clearTimeout(timer)
  }, [diagram.steps, isPlaying, stepIndex])

  const goPrevious = () => {
    setIsPlaying(false)
    setStepIndex((current) => Math.max(0, current - 1))
  }

  const goNext = () => {
    const steps = diagram.steps
    if (!steps) return
    setIsPlaying(false)
    setStepIndex((current) => Math.min(steps.length - 1, current + 1))
  }

  const restart = () => {
    setIsPlaying(false)
    setStepIndex(0)
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (diagram.steps && stepIndex >= diagram.steps.length - 1) {
      setStepIndex(0)
    }
    setIsPlaying(true)
  }

  const packetStyle = currentStep
    ? ({
        '--exam-packet-from-x': `${(currentStep.packet.from.x / diagram.viewBox.width) * 100}%`,
        '--exam-packet-from-y': `${(currentStep.packet.from.y / diagram.viewBox.height) * 100}%`,
        '--exam-packet-to-x': `${(currentStep.packet.to.x / diagram.viewBox.width) * 100}%`,
        '--exam-packet-to-y': `${(currentStep.packet.to.y / diagram.viewBox.height) * 100}%`,
      } as CSSProperties)
    : undefined

  return (
    <DiagramShell title={diagram.title} description={diagram.description} points={diagram.points}>
      {diagram.mobileOptimized && <MobileExamNetworkDiagram diagram={diagram} currentStep={currentStep} />}

      <div className={`${diagram.mobileOptimized ? 'hidden lg:block' : ''} overflow-x-auto pb-1`} data-testid="exam-network-diagram">
        <div
          className="relative min-w-[760px] overflow-hidden rounded-lg border border-slate-300 bg-white"
          style={{ aspectRatio: `${diagram.viewBox.width} / ${diagram.viewBox.height}` }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${diagram.viewBox.width} ${diagram.viewBox.height}`}
            role="img"
            aria-label={diagram.title}
          >
            <rect x="0" y="0" width={diagram.viewBox.width} height={diagram.viewBox.height} fill="#ffffff" />
            {diagram.zones.map((zone) => {
              const tone = EXAM_TONES[zone.tone ?? 'slate']
              if (zone.kind === 'cloud') {
                return (
                  <g key={zone.id}>
                    <ellipse
                      cx={zone.x + zone.width / 2}
                      cy={zone.y + zone.height / 2}
                      rx={zone.width / 2}
                      ry={zone.height / 2}
                      fill={tone.fill}
                      stroke={tone.stroke}
                      strokeWidth="2"
                    />
                    <SvgText x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 2} lines={[zone.label]} size={18} color={tone.text} />
                    {zone.caption && (
                      <SvgText
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 + 22}
                        lines={[zone.caption]}
                        size={12}
                        weight={600}
                        color={tone.text}
                      />
                    )}
                  </g>
                )
              }

              return (
                <g key={zone.id}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="8"
                    fill={tone.fill}
                    stroke={tone.stroke}
                    strokeWidth="2.2"
                    strokeDasharray={zone.kind === 'dashed' ? '10 7' : undefined}
                    strokeLinejoin="round"
                  />
                  <SvgText x={zone.x + 18} y={zone.y + 24} lines={[zone.label]} size={16} anchor="start" color={tone.text} />
                  {zone.caption && (
                    <SvgText
                      x={zone.x + 20}
                      y={zone.y + 48}
                      lines={[zone.caption]}
                      size={12}
                      weight={600}
                      anchor="start"
                      color={tone.text}
                    />
                  )}
                </g>
              )
            })}

            {diagram.links.map((link) => {
              const active = activeLinkIds.has(link.id)
              const tone = EXAM_TONES[link.tone ?? 'slate']
              const labelPoint = link.labelPosition ?? link.points[Math.floor(link.points.length / 2)]
              return (
                <g key={link.id}>
                  <polyline
                    points={link.points.map((point) => `${point.x},${point.y}`).join(' ')}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={active ? 10 : 8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={link.points.map((point) => `${point.x},${point.y}`).join(' ')}
                    fill="none"
                    stroke={active ? '#2563eb' : tone.link}
                    strokeWidth={active ? 5.5 : 3.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={link.dashed ? '8 8' : undefined}
                  />
                  {link.label && (
                    <SvgBadge x={labelPoint.x} y={labelPoint.y} label={link.label} color={active ? '#1d4ed8' : tone.text} />
                  )}
                </g>
              )
            })}

            {diagram.nodes.map((node) => {
              const active = currentStep?.activeLinkIds.some((linkId) => linkTouchesNode(linkId, node.id))
              const tone = EXAM_TONES[node.tone ?? ROLE_TONES[node.role]]
              return (
                <g key={node.id}>
                  <rect
                    x={node.x + 4}
                    y={node.y + 5}
                    width={node.width}
                    height={node.height}
                    rx="8"
                    fill="#0f172a"
                    fillOpacity="0.08"
                  />
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="8"
                    fill={active ? '#dbeafe' : tone.fill}
                    stroke={active ? '#2563eb' : tone.stroke}
                    strokeWidth={active ? 3 : 2}
                  />
                  <SvgNodeLabel
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    label={node.label}
                    caption={node.caption}
                    color={tone.text}
                  />
                </g>
              )
            })}
          </svg>

          {currentStep && packetStyle && (
            <div
              key={currentStep.id}
              className="textbook-exam-packet absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={packetStyle}
              aria-hidden="true"
            >
              <span className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-black text-blue-700 shadow-lg shadow-blue-100">
                {currentStep.packetLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {hasSteps && diagram.steps && currentStep && (
        <div className="mt-4 space-y-3">
          <ExamNetworkCapture step={currentStep} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="前のステップ"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              前へ
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
              title={isPlaying ? '一時停止' : '再生'}
            >
              {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {isPlaying ? '停止' : '再生'}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={stepIndex >= diagram.steps.length - 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="次のステップ"
            >
              次へ
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
              title="最初から"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              最初から
            </button>
            <span className="ml-1 text-xs font-bold text-slate-500">
              STEP {stepIndex + 1} / {diagram.steps.length}
            </span>
          </div>
        </div>
      )}
    </DiagramShell>
  )
}

export default function TextbookDiagram({ diagram }: TextbookDiagramProps) {
  if (diagram.type === 'layer-stack') return <LayerStackDiagramView diagram={diagram} />
  if (diagram.type === 'network-flow') return <NetworkFlowDiagramView diagram={diagram} />
  if (diagram.type === 'comparison') return <ComparisonDiagramView diagram={diagram} />
  if (diagram.type === 'address-role-table') return <AddressRoleTableDiagramView diagram={diagram} />
  if (diagram.type === 'sequence') return <SequenceDiagramView diagram={diagram} />
  if (diagram.type === 'segment') return <SegmentDiagramView diagram={diagram} />
  if (diagram.type === 'packet-frame') return <PacketFrameDiagramView diagram={diagram} />
  if (diagram.type === 'encapsulation-flow') return <EncapsulationDiagramView diagram={diagram} />
  if (diagram.type === 'vlan-design') return <VlanDesignDiagramView diagram={diagram} />
  if (diagram.type === 'diagnostic-map') return <DiagnosticMapDiagramView diagram={diagram} />
  if (diagram.type === 'exam-network') return <ExamNetworkDiagramView diagram={diagram} />
  return (
    <PacketFlowVisualizer
      scenario={diagram.scenario}
      title={diagram.title}
      description={diagram.description}
      points={diagram.points}
    />
  )
}
