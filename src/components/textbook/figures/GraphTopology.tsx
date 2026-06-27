import { useMemo } from 'react'
import type { PacketStep, Topology, TopoNode } from '../../../data/textbook/types'

// links を実際に使う構成図描画。スイッチ／ルータ＝幹、PC等＝枝（スイッチの下/上に縦積み）。
// 冗長リンク（同じ2ノード間の2本）は縦並びスイッチ＋曲線2本のループで描く。
// 動きは「アクティブな線・アークの強調＋進行方向の矢印」で表す（ノードを覆う吹き出しは使わない）。

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
const LINE_TRUNK = '#94a3b8'
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

function ArrowDown({ x, y, color }: { x: number; y: number; color: string }) {
  return <polygon points={`${x - 5.5},${y - 5} ${x + 5.5},${y - 5} ${x},${y + 6}`} fill={color} />
}
function ArrowUp({ x, y, color }: { x: number; y: number; color: string }) {
  return <polygon points={`${x - 5.5},${y + 5} ${x + 5.5},${y + 5} ${x},${y - 6}`} fill={color} />
}

export default function GraphTopology({ topology, focus, blockedLink }: Props) {
  const layout = useMemo(() => buildLayout(topology), [topology])
  const { nodes, pos, trunk, leafSegs, loop, toneOf, height, trunkLabel } = layout

  const focusedNodeId = focus.type === 'node' ? focus.id : null
  const isLinkFocused = (a: string, b: string) =>
    focus.type === 'link' && samePair(focus.a, focus.b, a, b)

  const loopFwd = loop && focus.type === 'link' && focus.a === loop.a && focus.b === loop.b
  const loopRev = loop && focus.type === 'link' && focus.a === loop.b && focus.b === loop.a
  const blocked = !!blockedLink && loop && samePair(blockedLink.a, blockedLink.b, loop.a, loop.b)

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '0 auto' }}
      role="img"
    >
      {/* トランク（幹どうしの線・ツリー時） */}
      {trunk && (
        <>
          <line x1={trunk.x1} y1={trunk.y} x2={trunk.x2} y2={trunk.y} stroke={LINE_TRUNK} strokeWidth={2.5} />
          {trunkLabel && (
            <text x={(trunk.x1 + trunk.x2) / 2} y={trunk.y - 7} textAnchor="middle" fontSize="10" fill="#64748b">
              {trunkLabel}
            </text>
          )}
        </>
      )}

      {/* 枝（スイッチ→端末の線）＋進行方向の矢印 */}
      {leafSegs.map((seg, i) => {
        const focused = isLinkFocused(seg.from, seg.to)
        const down = seg.y2 >= seg.y1
        const mx = (seg.x1 + seg.x2) / 2
        const my = (seg.y1 + seg.y2) / 2
        return (
          <g key={`seg${i}`}>
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={focused ? LINE_ACTIVE : LINE_IDLE}
              strokeWidth={focused ? 3 : 2}
            />
            {focused && (down ? <ArrowDown x={mx} y={my} color={LINE_ACTIVE} /> : <ArrowUp x={mx} y={my} color={LINE_ACTIVE} />)}
          </g>
        )
      })}

      {/* ループ（曲線2本）＋方向矢印・ブロック✕ */}
      {loop && (
        <>
          <path
            d={loop.leftPath}
            fill="none"
            stroke={loopFwd ? LINE_ACTIVE : LINE_TRUNK}
            strokeWidth={loopFwd ? 3.4 : 3}
          />
          <path
            d={loop.rightPath}
            fill="none"
            stroke={blocked ? LINE_BLOCK : loopRev ? LINE_ACTIVE : LINE_TRUNK}
            strokeWidth={blocked || loopRev ? 3.4 : 3}
            strokeDasharray={blocked ? '7 5' : undefined}
          />
          {loopFwd && <ArrowDown x={loop.xLeft} y={loop.yMid} color={LINE_ACTIVE} />}
          {loopRev && <ArrowUp x={loop.xRight} y={loop.yMid} color={LINE_ACTIVE} />}
          {blocked && (
            <text x={loop.xRight} y={loop.yMid + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={LINE_BLOCK}>
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
            <text x={p.x} y={n.sub ? p.y - 2 : p.y + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={textColor}>
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
    </svg>
  )
}

interface Layout {
  nodes: TopoNode[]
  pos: Map<string, Pos>
  trunk: { x1: number; x2: number; y: number } | null
  trunkLabel: string | null
  leafSegs: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[]
  loop: { a: string; b: string; leftPath: string; rightPath: string; xLeft: number; xRight: number; yMid: number } | null
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
    // ループ配置: スイッチ縦並び＋大きめの曲線2本。sw1 の枝は上、sw2 の枝は下。
    const cx = W / 2
    const sw1 = spine[0]
    const sw2 = spine[1]
    const sw1y = 100
    const sw2y = 192
    pos.set(sw1.id, { x: cx, y: sw1y, w: SW_W, h: SW_H })
    pos.set(sw2.id, { x: cx, y: sw2y, w: SW_W, h: SW_H })
    leavesOf(sw1.id).forEach((lf, i) => {
      const y = sw1y - SW_H / 2 - 30 - i * (LEAF_H + 16) - LEAF_H / 2
      pos.set(lf.id, { x: cx, y, w: LEAF_W, h: LEAF_H })
      leafSegs.push({ from: sw1.id, to: lf.id, x1: cx, y1: y + LEAF_H / 2, x2: cx, y2: sw1y - SW_H / 2 })
    })
    leavesOf(sw2.id).forEach((lf, i) => {
      const y = sw2y + SW_H / 2 + 30 + i * (LEAF_H + 16) + LEAF_H / 2
      pos.set(lf.id, { x: cx, y, w: LEAF_W, h: LEAF_H })
      leafSegs.push({ from: sw2.id, to: lf.id, x1: cx, y1: sw2y + SW_H / 2, x2: cx, y2: y - LEAF_H / 2 })
    })
    const topY = sw1y + SW_H / 2
    const botY = sw2y - SW_H / 2
    const yMid = (topY + botY) / 2
    const bulge = 54
    const loop = {
      a: sw1.id,
      b: sw2.id,
      leftPath: `M ${cx} ${topY} Q ${cx - bulge} ${yMid} ${cx} ${botY}`,
      rightPath: `M ${cx} ${topY} Q ${cx + bulge} ${yMid} ${cx} ${botY}`,
      xLeft: cx - bulge * 0.92,
      xRight: cx + bulge * 0.92,
      yMid,
    }
    const minTop = Math.min(...[...pos.values()].map((p) => p.y - p.h / 2))
    const offset = minTop < 12 ? 12 - minTop : 0
    if (offset) {
      pos.forEach((p) => (p.y += offset))
      leafSegs.forEach((s) => {
        s.y1 += offset
        s.y2 += offset
      })
      loop.leftPath = shiftPathY(loop.leftPath, offset)
      loop.rightPath = shiftPathY(loop.rightPath, offset)
      loop.yMid += offset
    }
    const maxBot = Math.max(...[...pos.values()].map((p) => p.y + p.h / 2))
    return { nodes, pos, trunk: null, trunkLabel: null, leafSegs, loop, toneOf, height: maxBot + 14 }
  }

  // ツリー配置: スイッチを横一列、その下に端末を縦積み。
  const swY = 36
  const nSpine = Math.max(1, spine.length)
  const spineX = (i: number) => ((i + 0.5) / nSpine) * W
  spine.forEach((s, i) => pos.set(s.id, { x: spineX(i), y: swY, w: SW_W, h: SW_H }))
  let maxBottom = swY + SW_H / 2
  spine.forEach((s, i) => {
    const x = spineX(i)
    let prevBottom = swY + SW_H / 2
    let prevId = s.id
    leavesOf(s.id).forEach((lf, k) => {
      const y = swY + SW_H / 2 + 30 + k * (LEAF_H + 20) + LEAF_H / 2
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

  return { nodes, pos, trunk, trunkLabel: trunk ? 'トランク' : null, leafSegs, loop: null, toneOf, height: maxBottom + 14 }
}

function shiftPathY(d: string, dy: number) {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return `M ${n[0]} ${n[1] + dy} Q ${n[2]} ${n[3] + dy} ${n[4]} ${n[5] + dy}`
}
