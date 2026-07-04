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

// 任意方向の線分上に進行方向の矢印（55%地点）。三角形のルータ間リンクで使う。
function ArrowOnSeg({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const t = 0.55
  const cx = x1 + (x2 - x1) * t
  const cy = y1 + (y2 - y1) * t
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const px = -uy
  const py = ux
  const h = 7
  const w = 5
  const tip = `${cx + ux * h},${cy + uy * h}`
  const b1 = `${cx - ux * h + px * w},${cy - uy * h + py * w}`
  const b2 = `${cx - ux * h - px * w},${cy - uy * h - py * w}`
  return <polygon points={`${tip} ${b1} ${b2}`} fill={color} />
}

export default function GraphTopology({ topology, focus, blockedLink }: Props) {
  const layout = useMemo(() => buildLayout(topology), [topology])
  const { nodes, pos, trunk, leafSegs, loop, spineEdges, zoneLabels, toneOf, height, trunkLabel } = layout

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

      {/* 枝（スイッチ／ルータ→端末の線）＋進行方向の矢印 */}
      {leafSegs.map((seg, i) => {
        const focused = isLinkFocused(seg.from, seg.to)
        const vertical = Math.abs(seg.x1 - seg.x2) < 6
        const down = seg.y2 >= seg.y1
        const mx = (seg.x1 + seg.x2) / 2
        const my = (seg.y1 + seg.y2) / 2
        // 斜めの枝（縦積みレイアウトでR1の上に並ぶ端末）は、進行方向に沿った角度付き矢印。
        const fa = focus.type === 'link' ? pos.get(focus.a) : undefined
        const fb = focus.type === 'link' ? pos.get(focus.b) : undefined
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
            {focused &&
              (vertical ? (
                down ? <ArrowDown x={mx} y={my} color={LINE_ACTIVE} /> : <ArrowUp x={mx} y={my} color={LINE_ACTIVE} />
              ) : fa && fb ? (
                <ArrowOnSeg x1={fa.x} y1={fa.y} x2={fb.x} y2={fb.y} color={LINE_ACTIVE} />
              ) : null)}
          </g>
        )
      })}

      {/* ルータ間リンク（三角形の辺）＋コストラベル・進行方向矢印・切断✕ */}
      {spineEdges.map((e, i) => {
        const focused = isLinkFocused(e.a, e.b)
        const isBlocked = !!blockedLink && samePair(blockedLink.a, blockedLink.b, e.a, e.b)
        const color = isBlocked ? LINE_BLOCK : focused ? LINE_ACTIVE : LINE_TRUNK
        const dir = focus.type === 'link' && focus.a === e.b // 逆向きフォーカスなら矢印も逆
        const [ax1, ay1, ax2, ay2] = dir ? [e.x2, e.y2, e.x1, e.y1] : [e.x1, e.y1, e.x2, e.y2]
        return (
          <g key={`sp${i}`}>
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={color}
              strokeWidth={focused || isBlocked ? 3.4 : 3}
              strokeDasharray={isBlocked ? '7 5' : undefined}
            />
            {focused && !isBlocked && <ArrowOnSeg x1={ax1} y1={ay1} x2={ax2} y2={ay2} color={LINE_ACTIVE} />}
            {isBlocked && (
              <text x={(e.x1 + e.x2) / 2} y={(e.y1 + e.y2) / 2 + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={LINE_BLOCK}>
                ✕
              </text>
            )}
            {e.label &&
              e.lines.map((ln, k) => (
                <text
                  key={k}
                  x={e.lx}
                  y={e.ly + k * 12}
                  textAnchor={e.lanchor}
                  fontSize="10"
                  fontWeight={focused ? 700 : 400}
                  fill={focused ? '#185fa5' : '#64748b'}
                >
                  {ln}
                </text>
              ))}
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

      {/* セグメント名ラベル（縦積みレイアウトで端末の上に表示・白チップで線と重ねない） */}
      {zoneLabels.map((z, i) => {
        const w = z.text.length * 9 + 6
        return (
          <g key={`zl${i}`}>
            <rect x={z.x - w / 2} y={z.y - 10} width={w} height={13} rx={3} fill="#ffffff" />
            <text x={z.x} y={z.y} textAnchor="middle" fontSize="10" fontWeight="700" fill={z.color}>
              {z.text}
            </text>
          </g>
        )
      })}

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

interface SpineEdge {
  a: string
  b: string
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
  lines: string[]
  lx: number
  ly: number
  lanchor: 'start' | 'middle' | 'end'
}

interface Layout {
  nodes: TopoNode[]
  pos: Map<string, Pos>
  trunk: { x1: number; x2: number; y: number } | null
  trunkLabel: string | null
  leafSegs: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[]
  loop: { a: string; b: string; leftPath: string; rightPath: string; xLeft: number; xRight: number; yMid: number } | null
  spineEdges: SpineEdge[]
  zoneLabels: { x: number; y: number; text: string; color: string }[]
  toneOf: (n: TopoNode) => string
  height: number
}

function buildLayout(topology: Topology): Layout {
  const { nodes, links, zones } = topology
  const zoneTone = new Map(zones.map((z) => [z.id, z.tone]))
  // leafIds はロールに関わらず葉として扱う（例: 境界ルータをISPの雲の枝にする）。
  const forcedLeaf = new Set(topology.leafIds ?? [])
  const isSpine = (n: TopoNode) => SPINE_ROLES.has(n.role) && !forcedLeaf.has(n.id)
  const spine = nodes.filter(isSpine)
  const leaves = nodes.filter((n) => !isSpine(n))

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
    isSpine(n) ? 'slate' : (n.zoneId && zoneTone.get(n.zoneId)) || 'sky'

  // 縦積み（spine を縦一列・上下＋左右に枝）: 経路表連動（第7章 §2）・境界の全体図（第8章 §1）。明示フラグ。
  if (topology.stack && spine.length >= 2 && !loopPair) {
    return buildStack({ spine, leavesOf, toneOf, links, edgeLabels: topology.edgeLabels ?? [], zones, allNodes: nodes })
  }

  // 三角形（ルータ3台が相互リンク）: OSPF の冗長2経路・コスト最短を描く。
  if (spine.length === 3 && !loopPair) {
    const [s0, s1, s2] = spine
    const tri =
      links.some((l) => samePair(l.a, l.b, s0.id, s1.id)) &&
      links.some((l) => samePair(l.a, l.b, s1.id, s2.id)) &&
      links.some((l) => samePair(l.a, l.b, s0.id, s2.id))
    if (tri) return buildTriangle({ nodes, spine, leavesOf, toneOf, links, edgeLabels: topology.edgeLabels ?? [] })
  }

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
    return { nodes, pos, trunk: null, trunkLabel: null, leafSegs, loop, spineEdges: [], zoneLabels: [], toneOf, height: maxBot + 14 }
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

  // 幹どうしの線のラベル。edgeLabels があればそれを優先（'' で非表示）、無ければ従来どおり「トランク」。
  const trunkEdgeLabel =
    spine.length >= 2 ? (topology.edgeLabels ?? []).find((e) => samePair(e.a, e.b, spine[0].id, spine[1].id))?.label : undefined

  return { nodes, pos, trunk, trunkLabel: trunk ? (trunkEdgeLabel ?? 'トランク') : null, leafSegs, loop: null, spineEdges: [], zoneLabels: [], toneOf, height: maxBottom + 14 }
}

// 三角形レイアウト: spine[0]=左上 / spine[2]=左下 / spine[1]=右中。端末は親の外側（上/下）へ。
function buildTriangle({
  nodes,
  spine,
  leavesOf,
  toneOf,
  links,
  edgeLabels,
}: {
  nodes: TopoNode[]
  spine: TopoNode[]
  leavesOf: (sid: string) => TopoNode[]
  toneOf: (n: TopoNode) => string
  links: Topology['links']
  edgeLabels: NonNullable<Topology['edgeLabels']>
}): Layout {
  const LX = 112
  const [r1, r2, r3] = spine
  const pos = new Map<string, Pos>()
  pos.set(r1.id, { x: LX, y: 122, w: SW_W, h: SW_H })
  pos.set(r3.id, { x: LX, y: 234, w: SW_W, h: SW_H })
  pos.set(r2.id, { x: 252, y: 178, w: SW_W, h: SW_H })
  const centerY = 178

  const leafSegs: Layout['leafSegs'] = []
  spine.forEach((s) => {
    const sp = pos.get(s.id)!
    const above = sp.y < centerY
    leavesOf(s.id).forEach((lf, i) => {
      if (above) {
        const y = sp.y - SW_H / 2 - 30 - i * (LEAF_H + 14) - LEAF_H / 2
        pos.set(lf.id, { x: sp.x, y, w: LEAF_W, h: LEAF_H })
        leafSegs.push({ from: s.id, to: lf.id, x1: sp.x, y1: y + LEAF_H / 2, x2: sp.x, y2: sp.y - SW_H / 2 })
      } else {
        const y = sp.y + SW_H / 2 + 30 + i * (LEAF_H + 14) + LEAF_H / 2
        pos.set(lf.id, { x: sp.x, y, w: LEAF_W, h: LEAF_H })
        leafSegs.push({ from: s.id, to: lf.id, x1: sp.x, y1: sp.y + SW_H / 2, x2: sp.x, y2: y - LEAF_H / 2 })
      }
    })
  })

  const spineEdges: SpineEdge[] = []
  const pairs: [TopoNode, TopoNode][] = [
    [r1, r2],
    [r2, r3],
    [r1, r3],
  ]
  pairs.forEach(([a, b]) => {
    if (!links.some((l) => samePair(l.a, l.b, a.id, b.id))) return
    const pa = pos.get(a.id)!
    const pb = pos.get(b.id)!
    const label = edgeLabels.find((e) => samePair(e.a, e.b, a.id, b.id))?.label
    const x1 = pa.x
    const y1 = pa.y
    const x2 = pb.x
    const y2 = pb.y
    const vertical = Math.abs(x1 - x2) < 8
    let lx: number
    let ly: number
    let lanchor: SpineEdge['lanchor']
    let lines: string[]
    if (vertical) {
      lx = Math.min(x1, x2) - 50
      ly = (y1 + y2) / 2 - 4
      lanchor = 'end'
      lines = label ? label.split('・') : []
    } else {
      const my = (y1 + y2) / 2
      lx = (x1 + x2) / 2
      ly = my < centerY ? my - 8 : my + 16
      lanchor = 'middle'
      lines = label ? [label] : []
    }
    spineEdges.push({ a: a.id, b: b.id, x1, y1, x2, y2, label, lines, lx, ly, lanchor })
  })

  const maxBot = Math.max(...[...pos.values()].map((p) => p.y + p.h / 2))
  return { nodes, pos, trunk: null, trunkLabel: null, leafSegs, loop: null, spineEdges, zoneLabels: [], toneOf, height: maxBot + 14 }
}

// 縦積みレイアウト: spine（ルータ等）を縦一列に並べ、最上段の端末は上・最下段の端末は下・
// 中間段の端末は左右の短い水平枝にする（最大2つ＝左・右）。経路が上→下へ素直に流れる。
// 第7章 §2（2段・経路表連動）と第8章 §1（4段・インターネット境界）で使用。2段時の描画は従来と同一。
function buildStack({
  spine,
  leavesOf,
  toneOf,
  links,
  edgeLabels,
  zones,
  allNodes,
}: {
  spine: TopoNode[]
  leavesOf: (sid: string) => TopoNode[]
  toneOf: (n: TopoNode) => string
  links: Topology['links']
  edgeLabels: NonNullable<Topology['edgeLabels']>
  zones: Topology['zones']
  allNodes: TopoNode[]
}): Layout {
  const cx = W / 2
  const zoneById = new Map(zones.map((z) => [z.id, z]))
  const pos = new Map<string, Pos>()
  const leafSegs: Layout['leafSegs'] = []
  const zoneLabels: Layout['zoneLabels'] = []

  const top = spine[0]
  const bot = spine[spine.length - 1]
  const topLeaves = leavesOf(top.id)
  const botLeaves = leavesOf(bot.id)

  const rowWidth = (n: number) => n * LEAF_W + (n - 1) * 12
  // 端末を横一列に並べる中心X
  const rowXs = (n: number) => {
    const start = cx - rowWidth(n) / 2 + LEAF_W / 2
    return Array.from({ length: n }, (_, i) => start + i * (LEAF_W + 12))
  }
  const pushZoneChip = (lf: TopoNode, x: number, leafY: number) => {
    const z = lf.zoneId ? zoneById.get(lf.zoneId) : undefined
    if (z) zoneLabels.push({ x, y: leafY - LEAF_H / 2 - 6, text: z.label, color: (TONE_COLOR[z.tone] ?? TONE_COLOR.slate).text })
  }

  const topLeafY = 14 + LEAF_H / 2 + 14 // ゾーンラベル分の余白を上に確保
  // 最上段に端末が無ければ上の余白を詰めて spine から始める
  const firstY = topLeaves.length > 0 ? topLeafY + LEAF_H / 2 + 34 + SW_H / 2 : 14 + SW_H / 2
  const spineY = (i: number) => firstY + i * (SW_H + 46)
  spine.forEach((s, i) => pos.set(s.id, { x: cx, y: spineY(i), w: SW_W, h: SW_H }))

  // 最上段の端末（上に横並び）
  const txs = rowXs(topLeaves.length)
  topLeaves.forEach((lf, i) => {
    const x = txs[i]
    pos.set(lf.id, { x, y: topLeafY, w: LEAF_W, h: LEAF_H })
    leafSegs.push({ from: top.id, to: lf.id, x1: x, y1: topLeafY + LEAF_H / 2, x2: cx, y2: firstY - SW_H / 2 })
    pushZoneChip(lf, x, topLeafY)
  })

  // 中間段の端末（左右の短い水平枝。幅を絞って320内に収める）
  const SIDE_W = 96
  spine.slice(1, -1).forEach((s, si) => {
    const y = spineY(si + 1)
    leavesOf(s.id).forEach((lf, i) => {
      const left = i % 2 === 0
      const x = left ? cx - 110 : cx + 110
      pos.set(lf.id, { x, y, w: SIDE_W, h: LEAF_H })
      leafSegs.push(
        left
          ? { from: s.id, to: lf.id, x1: x + SIDE_W / 2, y1: y, x2: cx - SW_W / 2, y2: y }
          : { from: s.id, to: lf.id, x1: cx + SW_W / 2, y1: y, x2: x - SIDE_W / 2, y2: y },
      )
      pushZoneChip(lf, x, y)
    })
  })

  // 最下段の端末（下に横並び）
  const botY = spineY(spine.length - 1)
  const botLeafY = botY + SW_H / 2 + 34 + LEAF_H / 2
  const bxs = rowXs(botLeaves.length)
  botLeaves.forEach((lf, i) => {
    const x = bxs[i]
    pos.set(lf.id, { x, y: botLeafY, w: LEAF_W, h: LEAF_H })
    leafSegs.push({ from: bot.id, to: lf.id, x1: cx, y1: botY + SW_H / 2, x2: x, y2: botLeafY - LEAF_H / 2 })
    pushZoneChip(lf, x, botLeafY)
  })

  // 隣接する spine 間のリンク（縦・単一）。ラベルは右側に1行で。
  const spineEdges: SpineEdge[] = []
  spine.slice(0, -1).forEach((a, i) => {
    const b = spine[i + 1]
    if (!links.some((l) => samePair(l.a, l.b, a.id, b.id))) return
    const label = edgeLabels.find((e) => samePair(e.a, e.b, a.id, b.id))?.label
    const y1 = spineY(i)
    const y2 = spineY(i + 1)
    spineEdges.push({
      a: a.id,
      b: b.id,
      x1: cx,
      y1,
      x2: cx,
      y2,
      label,
      lines: label ? [label] : [],
      lx: cx + 10,
      ly: (y1 + y2) / 2 + 4,
      lanchor: 'start',
    })
  })

  const maxBot = Math.max(...[...pos.values()].map((p) => p.y + p.h / 2))
  return { nodes: allNodes, pos, trunk: null, trunkLabel: null, leafSegs, loop: null, spineEdges, zoneLabels, toneOf, height: maxBot + 14 }
}

function shiftPathY(d: string, dy: number) {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return `M ${n[0]} ${n[1] + dy} Q ${n[2]} ${n[3] + dy} ${n[4]} ${n[5] + dy}`
}
