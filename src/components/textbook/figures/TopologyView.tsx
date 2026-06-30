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
  zoneId?: string // 領域フォーカスで詳細表示する現在ゾーン
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
    <div className={`relative flex-shrink-0 ${narrow ? 'h-8 w-full' : 'h-8 min-w-[56px] flex-1'}`} aria-hidden="true">
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
  const iconBox = (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
        narrow ? 'h-8 w-8' : 'h-11 w-11'
      } ${focused ? 'border-blue-700 bg-blue-600' : `${tone.border} ${tone.fill}`}`}
    >
      <Icon className={`h-5 w-5 ${focused ? 'text-white' : tone.text}`} />
    </div>
  )

  // スマホは全幅カード（アイコン＋ラベル横並び）で横の死にスペースを埋める。
  if (narrow) {
    return (
      <div className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-1.5 ${focused ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}>
        {iconBox}
        <div className="min-w-0 text-left">
          <p className={`text-sm font-black leading-tight ${focused ? 'text-blue-800' : 'text-slate-800'}`}>{node.label}</p>
          {node.sub && <p className="text-[11px] leading-tight text-slate-500">{node.sub}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[84px] flex-shrink-0 flex-col items-center text-center">
      {iconBox}
      <p className={`mt-1 text-[11px] font-black leading-tight ${focused ? 'text-blue-800' : 'text-slate-800'}`}>{node.label}</p>
      {node.sub && <p className="text-[10px] leading-tight text-slate-500">{node.sub}</p>}
    </div>
  )
}

// 領域フォーカス: 上＝ゾーン地図（俯瞰・現在ゾーンを強調）／下＝現在ゾーンのノード詳細。
// 複数セグメントの構成図をスマホ1画面で「全体も現在地も」見せる（figure-spec §3.9）。
function deriveZoneId(topology: Topology, focus: PacketStep['focus']): string | undefined {
  if (focus.type === 'node') return topology.nodes.find((n) => n.id === focus.id)?.zoneId
  const b = topology.nodes.find((n) => n.id === focus.b)
  return b?.zoneId ?? topology.nodes.find((n) => n.id === focus.a)?.zoneId
}

function ZoneFocusView({ topology, focus, packetLabel, stepKey, zoneId }: Props) {
  const zones = topology.zones
  const curId = zoneId ?? deriveZoneId(topology, focus)
  const cur = zones.find((z) => z.id === curId) ?? zones[0]
  const zoneNodes = topology.nodes.filter((n) => n.zoneId === cur?.id)

  const focusedNodeId =
    focus.type === 'node'
      ? focus.id
      : zoneNodes.some((n) => n.id === focus.b)
        ? focus.b
        : zoneNodes.some((n) => n.id === focus.a)
          ? focus.a
          : null

  return (
    <div className="mx-auto w-full max-w-[360px]">
      {/* 俯瞰（ゾーン地図） */}
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
        <p className="mb-1.5 text-[10px] font-bold text-slate-400">ネットワーク全体（俯瞰）</p>
        <div className="flex items-stretch justify-center gap-1">
          {zones.map((z, i) => {
            const active = z.id === cur?.id
            const tone = TONE[z.tone]
            return (
              <div key={z.id} className="flex items-stretch" style={{ flex: '1 1 0', minWidth: 0 }}>
                {i > 0 && <div className="my-auto h-[2px] w-3 flex-shrink-0 bg-slate-300" aria-hidden="true" />}
                <div
                  className={`flex-1 rounded-lg border px-1 py-1 text-center ${
                    active ? `border-2 ${tone.border} ${tone.fill}` : 'border border-slate-200 bg-white'
                  }`}
                >
                  <p className={`truncate text-[11px] font-black ${active ? tone.text : 'text-slate-400'}`}>{z.label}</p>
                  {z.sub && <p className={`truncate text-[9px] ${active ? tone.text : 'text-slate-300'}`}>{z.sub}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 詳細（現在ゾーンのノード） */}
      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2">
        <p className="mb-1.5 text-[10px] font-bold text-sky-700">いまここ：{cur?.label}</p>
        <div className="flex flex-col items-stretch">
          {zoneNodes.map((node, ni) => {
            const items: React.ReactNode[] = []
            if (ni > 0) {
              const active = node.id === focusedNodeId && focus.type === 'link'
              items.push(
                <div key={`c-${node.id}`} className="relative mx-auto h-7 w-full" aria-hidden="true">
                  <div className={`absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full ${active ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  {active && <TravelingPacket key={stepKey} narrow label={packetLabel} reverse={false} />}
                </div>,
              )
            }
            items.push(<NodeCard key={node.id} node={node} narrow focused={node.id === focusedNodeId} />)
            return items
          })}
        </div>
      </div>
    </div>
  )
}

export default function TopologyView({ topology, focus, packetLabel, stepKey, zoneId }: Props) {
  // 横一列が収まらない幅（タブレット〜小型PC含む）では縦リフローにする。
  const narrow = useIsNarrow(720)
  const groups = useMemo(() => buildGroups(topology.nodes, topology.zones), [topology])

  if (topology.zoneFocus) {
    return <ZoneFocusView topology={topology} focus={focus} packetLabel={packetLabel} stepKey={stepKey} zoneId={zoneId} />
  }

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
              className={`relative flex ${narrow ? 'w-full flex-col' : 'flex-row flex-wrap'} items-center justify-center gap-1.5 rounded-xl border-2 border-dashed ${tone.border} ${tone.fill} px-2.5 pb-1.5 pt-5`}
            >
              <span className={`absolute -top-2.5 left-3 rounded bg-white px-1.5 text-[10px] font-black ${tone.text}`}>
                {group.zone.label}
              </span>
              {inner}
            </div>,
          )
        } else {
          items.push(
            <div key={group.key} className={`flex ${narrow ? 'w-full flex-col' : 'flex-row'} items-center gap-1.5`}>
              {inner}
            </div>,
          )
        }

        return items
      })}
    </div>
  )
}
