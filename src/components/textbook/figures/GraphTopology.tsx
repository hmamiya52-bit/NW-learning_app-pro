import { useEffect, useMemo, useState } from 'react'
import type { PacketStep, Topology, TopoNode } from '../../../data/textbook/types'

// links を実際に使う構成図描画。スイッチ／ルータ＝幹、PC等＝枝（スイッチの下に縦積み）。
// 冗長リンク（同じ2ノード間の2本）は縦並びスイッチ＋曲線2本のループで描く。ブロックは破線＋✕。
// 座標は viewBox 内で算出し、SVGを width:100% で収める（横スクロールなし）。

const SPINE_ROLES = new Set(['switch', 'router', 'firewall', 'internet', 'cloud'])

const TONE_COLOR: Record<string, { fill: string; stroke: string; text: string }> = {
  emerald: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
  violet: { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  sky: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  blue: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  amber: { fill: '#fffbeb', stroke: '#fbbf24', text: '#92400e' },
  rose: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239' },
  slate: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#334155' },
}
const FOCUS = { fill: '#2563eb', stroke: '#1d4ed8', text: '#ffffff' }
const LINE_IDLE = '#cbd5e1'
const LINE_ACTIVE = '#2563eb'
const LINE_TRUNK = '#64748b'
const LINE_BLOCK = '#f43f5e'

interface Pos {
  x: number
  y: number
  w: number
  h: number
}

interface Props {
  topology: Topology
  focus: PacketStep['focus']
  packetLabel: string
  stepKey: number
  blockedLink?: { a: string; b: string }
}

const W = 320
const SW_W = 92
const SW_H = 34
const LEAF_W = 104
const LEAF_H = 44

function samePair(a: string, b: string, x: string, y: string) {
  return (a === x && b === y) || (a === y && b === x)
}

export default function GraphTopology({ topology, focus, packetLabel, stepKey, blockedLink }: Props) {
  const layout = useMemo(() => buildLayout(topology), [topology])
  const { nodes, pos, trunk, leafSegs, loop, toneOf, height, trunkLabel } = layout

  const focusedNodeId = focus.type === 'node' ? focus.id : null
  const isLinkFocused = (a: string, b: string) =>
    focus.type === 'link' && samePair(focus.a, focus.b, a, b)

  const sLinkFocusedFwd = loop && focus.type === 'link' && focus.a === loop.a && focus.b === loop.b
  const sLinkFocusedRev = loop && focus.type === 'link' && focus.a === loop.b && focus.b === loop.a
  const blocked = !!blockedLink && loop && samePair(blockedLink.a, blockedLink.b, loop.a, loop.b)

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block', margin: '0 auto' }}
      role="img"
    >
      {/* トランク（幹どうしの線・ツリー時） */}
      {trunk && (
        <>
          <line x1={trunk.x1} y1={trunk.y} x2={trunk.x2} y2={trunk.y} stroke={LINE_TRUNK} strokeWidth={2.5} />
          {trunkLabel && (
            <text x={(trunk.x1 + trunk.x2) / 2} y={trunk.y - 6} textAnchor="middle" fontSize="10" fill="#64748b">
              {trunkLabel}
            </text>
          )}
        </>
      )}

      {/* 枝（スイッチ→端末の縦線） */}
      {leafSegs.map((seg, i) => {
        const focused = isLinkFocused(seg.from, seg.to)
        return (
          <line
            key={`seg${i}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={focused ? LINE_ACTIVE : LINE_IDLE}
            strokeWidth={2}
          />
        )
      })}

      {/* ループ（曲線2本） */}
      {loop && (
        <>
          <path
            d={loop.leftPath}
            fill="none"
            stroke={sLinkFocusedFwd ? LINE_ACTIVE : LINE_TRUNK}
            strokeWidth={2.6}
          />
          <path
            d={loop.rightPath}
            fill="none"
            stroke={blocked ? LINE_BLOCK : sLinkFocusedRev ? LINE_ACTIVE : LINE_TRUNK}
            strokeWidth={2.6}
            strokeDasharray={blocked ? '6 5' : undefined}
          />
          {blocked && (
            <text x={loop.xMark} y={loop.yMark + 6} textAnchor="middle" fontSize="17" fontWeight="700" fill={LINE_BLOCK}>
              ✕
            </text>
          )}
        </>
      )}

      {/* ノード */}
      {nodes.map((n) => {
        const p = pos.get(n.id)
        if (!p) return null
        const focused = n.id === focusedNodeId
        const tone = TONE_COLOR[toneOf(n)] ?? TONE_COLOR.slate
        const fill = focused ? FOCUS.fill : tone.fill
        const stroke = focused ? FOCUS.stroke : tone.stroke
        const textColor = focused ? FOCUS.text : tone.text
        return (
          <g key={n.id}>
            <rect
              x={p.x - p.w / 2}
              y={p.y - p.h / 2}
              width={p.w}
              height={p.h}
              rx={9}
              fill={fill}
              stroke={stroke}
              strokeWidth={focused ? 2.4 : 1.6}
            />
            <text
              x={p.x}
              y={n.sub ? p.y - 2 : p.y + 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={textColor}
            >
              {n.label}
            </text>
            {n.sub && (
              <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize="10" fill={focused ? '#dbeafe' : '#64748b'}>
                {n.sub}
              </text>
            )}
          </g>
        )
      })}

      {/* 移動するパケット（有限アニメ・現在ステップのみ） */}
      {focus.type === 'link' && (
        <TravelingDot
          key={stepKey}
          label={packetLabel}
          travel={resolveTravel(focus, pos, loop, sLinkFocusedFwd || false, sLinkFocusedRev || false)}
        />
      )}
    </svg>
  )
}

interface Layout {
  nodes: TopoNode[]
  pos: Map<string, Pos>
  mode: 'tree' | 'loop'
  trunk: { x1: number; x2: number; y: number } | null
  trunkLabel: string | null
  leafSegs: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[]
  loop: { a: string; b: string; leftPath: string; rightPath: string; xMark: number; yMark: number } | null
  toneOf: (n: TopoNode) => string
  height: number
}

function buildLayout(topology: Topology): Layout {
  const { nodes, links, zones } = topology
  const zoneTone = new Map(zones.map((z) => [z.id, z.tone]))
  const spine = nodes.filter((n) => SPINE_ROLES.has(n.role))
  const leaves = nodes.filter((n) => !SPINE_ROLES.has(n.role))

  const parentOf = new Map<string, string>()
  leaves.forEach((leaf) => {
    const link = links.find(
      (l) => (l.a === leaf.id && spine.some((s) => s.id === l.b)) || (l.b === leaf.id && spine.some((s) => s.id === l.a)),
    )
    if (link) parentOf.set(leaf.id, link.a === leaf.id ? link.b : link.a)
  })

  const leavesOf = (sid: string) => leaves.filter((lf) => parentOf.get(lf.id) === sid)

  // spine 間に2本のリンクがあればループ
  let loopPair: { a: string; b: string } | null = null
  if (spine.length === 2) {
    const a = spine[0].id
    const b = spine[1].id
    if (links.filter((l) => samePair(l.a, l.b, a, b)).length >= 2) loopPair = { a, b }
  }

  const toneOf = (n: TopoNode): string =>
    SPINE_ROLES.has(n.role) ? 'slate' : (n.zoneId && zoneTone.get(n.zoneId)) || 'sky'

  const pos = new Map<string, Pos>()
  const leafSegs: Layout['leafSegs'] = []

  if (loopPair) {
    // ループ配置: スイッチ縦並び＋曲線2本。sw1 の枝は上、sw2 の枝は下。
    const cx = W / 2
    const sw1 = spine[0]
    const sw2 = spine[1]
    const sw1y = 92
    const sw2y = 172
    pos.set(sw1.id, { x: cx, y: sw1y, w: SW_W, h: SW_H })
    pos.set(sw2.id, { x: cx, y: sw2y, w: SW_W, h: SW_H })
    // sw1 の枝（上方向に積む）
    leavesOf(sw1.id).forEach((lf, i) => {
      const y = sw1y - SW_H / 2 - 22 - i * (LEAF_H + 16) - LEAF_H / 2
      pos.set(lf.id, { x: cx, y, w: LEAF_W, h: LEAF_H })
      leafSegs.push({ from: sw1.id, to: lf.id, x1: cx, y1: sw1y - SW_H / 2, x2: cx, y2: y + LEAF_H / 2 })
    })
    // sw2 の枝（下方向に積む）
    leavesOf(sw2.id).forEach((lf, i) => {
      const y = sw2y + SW_H / 2 + 22 + i * (LEAF_H + 16) + LEAF_H / 2
      pos.set(lf.id, { x: cx, y, w: LEAF_W, h: LEAF_H })
      leafSegs.push({ from: sw2.id, to: lf.id, x1: cx, y1: sw2y + SW_H / 2, x2: cx, y2: y - LEAF_H / 2 })
    })
    const topY = sw1y + SW_H / 2
    const botY = sw2y - SW_H / 2
    const midY = (topY + botY) / 2
    const bulge = 66
    const loop = {
      a: sw1.id,
      b: sw2.id,
      leftPath: `M ${cx} ${topY} Q ${cx - bulge} ${midY} ${cx} ${botY}`,
      rightPath: `M ${cx} ${topY} Q ${cx + bulge} ${midY} ${cx} ${botY}`,
      xMark: cx + bulge * 0.78,
      yMark: midY,
    }
    const minLeafTop = Math.min(sw1y, ...[...pos.values()].map((p) => p.y - p.h / 2))
    const maxLeafBot = Math.max(sw2y + SW_H / 2, ...[...pos.values()].map((p) => p.y + p.h / 2))
    // viewBox は 0 始まりにそろえる（上方向の枝があれば下げる）
    const offset = minLeafTop < 10 ? 10 - minLeafTop : 0
    if (offset) {
      pos.forEach((p) => (p.y += offset))
      leafSegs.forEach((s) => {
        s.y1 += offset
        s.y2 += offset
      })
      loop.leftPath = shiftPathY(loop.leftPath, offset)
      loop.rightPath = shiftPathY(loop.rightPath, offset)
      loop.yMark += offset
    }
    return { nodes, pos, mode: 'loop', trunk: null, trunkLabel: null, leafSegs, loop, toneOf, height: maxLeafBot + offset + 12 }
  }

  // ツリー配置: スイッチを横一列、その下に端末を縦積み。
  const swY = 34
  const nSpine = Math.max(1, spine.length)
  const spineX = (i: number) => ((i + 0.5) / nSpine) * W
  spine.forEach((s, i) => pos.set(s.id, { x: spineX(i), y: swY, w: SW_W, h: SW_H }))
  let maxBottom = swY + SW_H / 2
  spine.forEach((s, i) => {
    const x = spineX(i)
    let prevBottom = swY + SW_H / 2
    let prevId = s.id
    leavesOf(s.id).forEach((lf, k) => {
      const y = swY + SW_H / 2 + 26 + k * (LEAF_H + 18) + LEAF_H / 2
      pos.set(lf.id, { x, y, w: LEAF_W, h: LEAF_H })
      leafSegs.push({ from: prevId, to: lf.id, x1: x, y1: prevBottom, x2: x, y2: y - LEAF_H / 2 })
      prevBottom = y + LEAF_H / 2
      prevId = lf.id
      maxBottom = Math.max(maxBottom, y + LEAF_H / 2)
    })
  })

  let trunk: Layout['trunk'] = null
  if (spine.length >= 2) {
    const p0 = pos.get(spine[0].id)!
    const p1 = pos.get(spine[1].id)!
    trunk = { x1: p0.x + p0.w / 2, x2: p1.x - p1.w / 2, y: swY }
  }

  return { nodes, pos, mode: 'tree', trunk, trunkLabel: trunk ? 'トランク' : null, leafSegs, loop: null, toneOf, height: maxBottom + 12 }
}

function shiftPathY(d: string, dy: number) {
  // "M x y Q x y x y" の y 値（偶数番目の数値）を +dy する単純シフト
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return `M ${n[0]} ${n[1] + dy} Q ${n[2]} ${n[3] + dy} ${n[4]} ${n[5] + dy}`
}

interface Travel {
  sx: number
  sy: number
  ex: number
  ey: number
}

function resolveTravel(
  focus: { type: 'link'; a: string; b: string },
  pos: Map<string, Pos>,
  loop: Layout['loop'],
  fwd: boolean,
  rev: boolean,
): Travel | null {
  // ループの幹リンクは曲線の左右に沿って縦移動（往路=左・復路=右）
  if (loop && (fwd || rev)) {
    const pa = pos.get(loop.a)!
    const pb = pos.get(loop.b)!
    const topY = pa.y + pa.h / 2
    const botY = pb.y - pb.h / 2
    const offX = 40
    if (fwd) return { sx: pa.x - offX, sy: topY, ex: pb.x - offX, ey: botY }
    return { sx: pb.x + offX, sy: botY, ex: pa.x + offX, ey: topY }
  }
  const pa = pos.get(focus.a)
  const pb = pos.get(focus.b)
  if (!pa || !pb) return null
  return { sx: pa.x, sy: pa.y, ex: pb.x, ey: pb.y }
}

function TravelingDot({ label, travel }: { label: string; travel: Travel | null }) {
  const [moved, setMoved] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (moved) return
    const t = window.setTimeout(() => setMoved(true), 60)
    return () => window.clearTimeout(t)
  }, [moved])
  if (!travel) return null
  const x = moved ? travel.ex : travel.sx
  const y = moved ? travel.ey : travel.sy
  const halfW = Math.max(18, label.length * 3.6)
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform .7s ease' }} aria-hidden="true">
      <rect x={-halfW} y={-9} width={halfW * 2} height={18} rx={5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.6} />
      <text x={0} y={4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
        {label}
      </text>
    </g>
  )
}
