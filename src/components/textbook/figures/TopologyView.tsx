import { useEffect, useMemo, useState } from 'react'
import type { PacketStep, Topology, TopoNode, TopoZone } from '../../../data/textbook/types'
import { ROLE_ICON, ROLE_TONE, TONE } from './figureTokens'
import { useIsNarrow } from './useIsNarrow'

interface Props {
  topology: Topology
  focus: PacketStep['focus']
  packetLabel: string
  stepKey: number
}

interface Group {
  key: string
  zone?: TopoZone
  nodes: TopoNode[]
}

function buildGroups(nodes: TopoNode[], zones: TopoZone[]): Group[] {
  const zoneById = new Map(zones.map((z) => [z.id, z]))
  const groups: Group[] = []
  nodes.forEach((node, i) => {
    const last = groups[groups.length - 1]
    if (last && node.zoneId && last.zone?.id === node.zoneId) {
      last.nodes.push(node)
    } else {
      groups.push({ key: `g${i}`, zone: node.zoneId ? zoneById.get(node.zoneId) : undefined, nodes: [node] })
    }
  })
  return groups
}

function TravelingPacket({ narrow, label, reverse }: { narrow: boolean; label: string; reverse: boolean }) {
  // ステップごとに key で再マウントされる前提。reduced-motion なら初期から終点に置く。
  const [moved, setMoved] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (moved) return
    const t = window.setTimeout(() => setMoved(true), 50)
    return () => window.clearTimeout(t)
  }, [moved])

  const start = reverse ? '100%' : '0%'
  const end = reverse ? '0%' : '100%'
  const pos = moved ? end : start
  const style = narrow
    ? { left: '50%', top: pos, transform: 'translate(-50%, -50%)', transition: 'top .7s ease' }
    : { top: '50%', left: pos, transform: 'translate(-50%, -50%)', transition: 'left .7s ease' }

  return (
    <span
      className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-blue-300 bg-blue-50 px-1.5 py-0.5 text-[10px] font-black text-blue-700 shadow-sm"
      style={style}
    >
      {label}
    </span>
  )
}

function Connector({
  narrow,
  focused,
  packet,
  stepKey,
  reverse,
}: {
  narrow: boolean
  focused: boolean
  packet: string | null
  stepKey: number
  reverse: boolean
}) {
  return (
    <div className={`relative flex-shrink-0 ${narrow ? 'h-9 w-full' : 'h-8 min-w-[18px] flex-1'}`} aria-hidden="true">
      <div
        className={`absolute rounded-full transition-colors ${
          narrow ? 'left-1/2 top-0 h-full w-[3px] -translate-x-1/2' : 'left-0 top-1/2 h-[3px] w-full -translate-y-1/2'
        } ${focused ? 'bg-blue-500' : 'bg-slate-300'}`}
      />
      {packet && <TravelingPacket key={stepKey} narrow={narrow} label={packet} reverse={reverse} />}
    </div>
  )
}

function NodeCard({
  node,
  narrow,
  focused,
  badge,
}: {
  node: TopoNode
  narrow: boolean
  focused: boolean
  badge: string | null
}) {
  const Icon = ROLE_ICON[node.role]
  const tone = TONE[ROLE_TONE[node.role]]
  return (
    <div className={`relative flex flex-shrink-0 flex-col items-center text-center ${narrow ? 'w-28' : 'w-[82px]'}`}>
      {badge && (
        <span className="absolute -top-3 z-10 whitespace-nowrap rounded-md border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 shadow-sm">
          {badge}
        </span>
      )}
      <div
        className={`flex items-center justify-center rounded-lg border-2 transition-colors ${
          narrow ? 'h-12 w-12' : 'h-10 w-10'
        } ${focused ? 'border-blue-500 bg-blue-50' : `${tone.border} ${tone.fill}`}`}
      >
        <Icon className={`${narrow ? 'h-6 w-6' : 'h-5 w-5'} ${focused ? 'text-blue-700' : tone.text}`} />
      </div>
      <p className="mt-1 text-[11px] font-black leading-tight text-slate-800">{node.label}</p>
      {node.sub && <p className="text-[10px] leading-tight text-slate-500">{node.sub}</p>}
    </div>
  )
}

export default function TopologyView({ topology, focus, packetLabel, stepKey }: Props) {
  const narrow = useIsNarrow()
  const groups = useMemo(() => buildGroups(topology.nodes, topology.zones), [topology])

  const focusNodeIds = focus.type === 'node' ? [focus.id] : [focus.a, focus.b]
  const isLinkFocused = (a: string, b: string) =>
    focus.type === 'link' && ((focus.a === a && focus.b === b) || (focus.a === b && focus.b === a))

  const flowDir = narrow ? 'flex-col' : 'flex-row flex-wrap'

  const renderConnector = (a: string, b: string, key: string) => {
    const focused = isLinkFocused(a, b)
    // focus.a が右側ノード(b)なら戻り方向（ARP応答など）
    const reverse = focus.type === 'link' && focus.a === b
    return (
      <Connector
        key={key}
        narrow={narrow}
        focused={focused}
        packet={focused ? packetLabel : null}
        stepKey={stepKey}
        reverse={reverse}
      />
    )
  }

  const renderNode = (node: TopoNode) => {
    const focused = focusNodeIds.includes(node.id)
    const badge = focus.type === 'node' && focus.id === node.id ? packetLabel : null
    return <NodeCard key={node.id} node={node} narrow={narrow} focused={focused} badge={badge} />
  }

  return (
    <div className={`flex ${flowDir} items-center justify-center gap-1.5`}>
      {groups.map((group, gi) => {
        const items = []
        if (gi > 0) {
          const prev = groups[gi - 1]
          const from = prev.nodes[prev.nodes.length - 1]
          const to = group.nodes[0]
          items.push(renderConnector(from.id, to.id, `ic-${gi}`))
        }

        const inner: React.ReactNode[] = []
        group.nodes.forEach((node, ni) => {
          if (ni > 0) inner.push(renderConnector(group.nodes[ni - 1].id, node.id, `c-${group.key}-${ni}`))
          inner.push(renderNode(node))
        })

        if (group.zone) {
          const tone = TONE[group.zone.tone]
          items.push(
            <div
              key={group.key}
              className={`relative flex ${narrow ? 'w-full flex-col' : 'flex-row flex-wrap'} items-center justify-center gap-1.5 rounded-xl border-2 border-dashed ${tone.border} ${tone.fill} px-3 pb-2 pt-4`}
            >
              <span className={`absolute -top-2.5 left-3 rounded bg-white px-1.5 text-[10px] font-black ${tone.text}`}>
                {group.zone.label}
              </span>
              {inner}
            </div>,
          )
        } else {
          items.push(
            <div key={group.key} className={`flex ${narrow ? 'flex-col' : 'flex-row'} items-center gap-1.5`}>
              {inner}
            </div>,
          )
        }

        return items
      })}
    </div>
  )
}
