import { useEffect, useMemo, useState } from 'react'
import { Mail } from 'lucide-react'
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

// ラベル付きパケットが回線上を1区間ぶん流れる（長い回線で余白を確保＝文字に重ならない／有限アニメ）。
function TravelingPacket({ narrow, label, reverse }: { narrow: boolean; label: string; reverse: boolean }) {
  const [moved, setMoved] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (moved) return
    const t = window.setTimeout(() => setMoved(true), 60)
    return () => window.clearTimeout(t)
  }, [moved])

  const start = reverse ? '82%' : '18%'
  const end = reverse ? '18%' : '82%'
  const pos = moved ? end : start
  const style = narrow
    ? { left: '50%', top: pos, transform: 'translate(-50%, -50%)', transition: 'top .7s ease' }
    : { top: '50%', left: pos, transform: 'translate(-50%, -50%)', transition: 'left .7s ease' }

  return (
    <span
      className="pointer-events-none absolute z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-md border-2 border-blue-500 bg-white px-1.5 py-0.5 text-[10px] font-black text-blue-700 shadow-sm"
      style={style}
      aria-hidden="true"
    >
      <Mail className="h-3 w-3" />
      {label}
    </span>
  )
}

function Connector({
  narrow,
  focused,
  packetLabel,
  stepKey,
  reverse,
}: {
  narrow: boolean
  focused: boolean
  packetLabel: string | null
  stepKey: number
  reverse: boolean
}) {
  return (
    <div className={`relative flex-shrink-0 ${narrow ? 'h-16 w-full' : 'h-8 min-w-[56px] flex-1'}`} aria-hidden="true">
      <div
        className={`absolute rounded-full transition-colors ${
          narrow ? 'left-1/2 top-0 h-full w-[3px] -translate-x-1/2' : 'left-0 top-1/2 h-[3px] w-full -translate-y-1/2'
        } ${focused ? 'bg-blue-500' : 'bg-slate-300'}`}
      />
      {packetLabel && <TravelingPacket key={stepKey} narrow={narrow} label={packetLabel} reverse={reverse} />}
    </div>
  )
}

function NodeCard({ node, narrow, focused }: { node: TopoNode; narrow: boolean; focused: boolean }) {
  const Icon = ROLE_ICON[node.role]
  const tone = TONE[ROLE_TONE[node.role]]
  return (
    <div className={`flex flex-shrink-0 flex-col items-center text-center ${narrow ? 'w-28' : 'w-[84px]'}`}>
      <div
        className={`flex items-center justify-center rounded-lg border-2 transition-colors ${
          narrow ? 'h-12 w-12' : 'h-11 w-11'
        } ${focused ? 'border-blue-700 bg-blue-600' : `${tone.border} ${tone.fill}`}`}
      >
        <Icon className={`${narrow ? 'h-6 w-6' : 'h-5 w-5'} ${focused ? 'text-white' : tone.text}`} />
      </div>
      <p className={`mt-1 text-[11px] font-black leading-tight ${focused ? 'text-blue-800' : 'text-slate-800'}`}>{node.label}</p>
      {node.sub && <p className="text-[10px] leading-tight text-slate-500">{node.sub}</p>}
    </div>
  )
}

export default function TopologyView({ topology, focus, packetLabel, stepKey }: Props) {
  // 横一列が収まらない幅（タブレット〜小型PC含む）では縦リフローにする。
  const narrow = useIsNarrow(720)
  const groups = useMemo(() => buildGroups(topology.nodes, topology.zones), [topology])

  // ノードの濃い青塗りは「機器内の処理」ステップ（node focus）だけ。リンク段は回線とパケットで示す。
  const focusedNodeId = focus.type === 'node' ? focus.id : null
  const isLinkFocused = (a: string, b: string) =>
    focus.type === 'link' && ((focus.a === a && focus.b === b) || (focus.a === b && focus.b === a))

  const flowDir = narrow ? 'flex-col' : 'flex-row flex-wrap'

  const renderConnector = (a: string, b: string, key: string) => {
    const focused = isLinkFocused(a, b)
    const reverse = focus.type === 'link' && focus.a === b
    return (
      <Connector
        key={key}
        narrow={narrow}
        focused={focused}
        packetLabel={focused ? packetLabel : null}
        stepKey={stepKey}
        reverse={reverse}
      />
    )
  }

  const renderNode = (node: TopoNode) => (
    <NodeCard key={node.id} node={node} narrow={narrow} focused={node.id === focusedNodeId} />
  )

  return (
    <div className={`flex ${flowDir} items-center justify-center gap-1.5`}>
      {groups.map((group, gi) => {
        const items: React.ReactNode[] = []
        if (gi > 0) {
          const prev = groups[gi - 1]
          items.push(renderConnector(prev.nodes[prev.nodes.length - 1].id, group.nodes[0].id, `ic-${gi}`))
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
              className={`relative flex ${narrow ? 'w-full flex-col' : 'flex-row flex-wrap'} items-center justify-center gap-1.5 rounded-xl border-2 border-dashed ${tone.border} ${tone.fill} px-3 pb-2 pt-5`}
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
