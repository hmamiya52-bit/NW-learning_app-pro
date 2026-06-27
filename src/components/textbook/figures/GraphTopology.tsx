import { useEffect, useMemo, useState } from 'react'
import type { PacketStep, Topology, TopoNode } from '../../../data/textbook/types'

// links を実際に使う構成図描画。スイッチ／ルータ＝幹（spine）、PC等＝枝（leaf）。
// 冗長リンク（同じ2ノード間の2本）はループとして描き、ブロックされた1本は✕で表す。
// 座標は viewBox 内で算出し、SVGを width:100% で収める（横スクロールなし）。

const SPINE_ROLES = new Set(['switch', 'router', 'firewall', 'internet', 'cloud'])

// Tailwind 相当の生の色（SVG用）。tone→塗り/枠/文字。
const TONE_COLOR: Record<string, { fill: string; stroke: string; text: string }> = {
  emerald: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
  violet: { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  sky: { fill: '#f0f9ff', stroke: '#38bdf8', text: '#075985' },
  blue: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  amber: { fill: '#fffbeb', stroke: '#fbbf24', text: '#92400e' },
  rose: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239' },
  slate: { fill: '#f8fafc', stroke: '#cbd5e1', text: '#334155' },
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
const SPINE_W = 74
const SPINE_H = 34
const LEAF_W = 80
const LEAF_H = 42
const SPINE_Y = 40
const LEAF_Y = 132

function samePair(a: string, b: string, x: string, y: string) {
  return (a === x && b === y) || (a === y && b === x)
}

export default function GraphTopology({ topology, focus, packetLabel, stepKey, blockedLink }: Props) {
  const layout = useMemo(() => {
    const { nodes, links, zones } = topology
    const zoneTone = new Map(zones.map((z) => [z.id, z.tone]))
    const spine = nodes.filter((n) => SPINE_ROLES.has(n.role))
    const leaves = nodes.filter((n) => !SPINE_ROLES.has(n.role))

    // 各 leaf の親 spine（最初に link で結ばれている spine）
    const parentOf = new Map<string, string>()
    leaves.forEach((leaf) => {
      const link = links.find(
        (l) => (l.a === leaf.id && spine.some((s) => s.id === l.b)) || (l.b === leaf.id && spine.some((s) => s.id === l.a)),
      )
      if (link) parentOf.set(leaf.id, link.a === leaf.id ? link.b : link.a)
    })

    // spine 間リンクの本数（2本＝ループ）
    const spineLinks: { a: string; b: string; count: number }[] = []
    for (let i = 0; i < spine.length - 1; i++) {
      const a = spine[i].id
      const b = spine[i + 1].id
      const count = links.filter((l) => samePair(l.a, l.b, a, b)).length
      spineLinks.push({ a, b, count: Math.max(1, count) })
    }
    const hasLoop = spineLinks.some((sl) => sl.count >= 2)

    const pos = new Map<string, Pos>()
    const leafX = new Map<string, number>()

    if (spine.length === 2 && hasLoop) {
      // ループ配置: 2スイッチを横に近づけ、間に2本。leaf はその下。
      pos.set(spine[0].id, { x: 92, y: SPINE_Y, w: SPINE_W, h: SPINE_H })
      pos.set(spine[1].id, { x: 228, y: SPINE_Y, w: SPINE_W, h: SPINE_H })
      const byParent = new Map<string, TopoNode[]>()
      leaves.forEach((lf) => {
        const p = parentOf.get(lf.id) ?? spine[0].id
        byParent.set(p, [...(byParent.get(p) ?? []), lf])
      })
      byParent.forEach((lfs, p) => {
        const px = pos.get(p)!.x
        lfs.forEach((lf, i) => {
          const x = px + (i - (lfs.length - 1) / 2) * (LEAF_W + 10)
          pos.set(lf.id, { x, y: LEAF_Y, w: LEAF_W, h: LEAF_H })
          leafX.set(lf.id, x)
        })
      })
    } else {
      // ツリー配置: leaf を横に等間隔、spine はその子 leaf の平均 x の上に。
      const L = Math.max(1, leaves.length)
      leaves.forEach((lf, i) => {
        const x = ((i + 0.5) / L) * W
        pos.set(lf.id, { x, y: LEAF_Y, w: LEAF_W, h: LEAF_H })
        leafX.set(lf.id, x)
      })
      spine.forEach((s, i) => {
        const children = leaves.filter((lf) => parentOf.get(lf.id) === s.id)
        const x = children.length
          ? children.reduce((sum, c) => sum + leafX.get(c.id)!, 0) / children.length
          : ((i + 0.5) / spine.length) * W
        pos.set(s.id, { x, y: SPINE_Y, w: SPINE_W, h: SPINE_H })
      })
    }

    const leafLinks = leaves
      .filter((lf) => parentOf.has(lf.id))
      .map((lf) => ({ leaf: lf.id, spine: parentOf.get(lf.id)! }))

    const toneOf = (n: TopoNode): string =>
      SPINE_ROLES.has(n.role) ? 'slate' : (n.zoneId && zoneTone.get(n.zoneId)) || 'sky'

    const height = LEAF_Y + LEAF_H / 2 + 16
    return { nodes, spine, leaves, pos, spineLinks, leafLinks, toneOf, height }
  }, [topology])

  const { nodes, pos, spineLinks, leafLinks, toneOf, height } = layout

  const focusedNodeId = focus.type === 'node' ? focus.id : null
  const isLinkFocused = (a: string, b: string) =>
    focus.type === 'link' && samePair(focus.a, focus.b, a, b)
  const isBlocked = (a: string, b: string) => !!blockedLink && samePair(blockedLink.a, blockedLink.b, a, b)

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      style={{ width: '100%', maxWidth: 400, height: 'auto', display: 'block', margin: '0 auto' }}
      role="img"
    >
      {/* spine 間リンク（トランク or ループ） */}
      {spineLinks.map((sl, i) => {
        const pa = pos.get(sl.a)!
        const pb = pos.get(sl.b)!
        const x1 = pa.x + pa.w / 2
        const x2 = pb.x - pb.w / 2
        const focused = isLinkFocused(sl.a, sl.b)
        const blocked = isBlocked(sl.a, sl.b)
        if (sl.count >= 2) {
          // ループ: 2本の平行線。下の1本はブロック対象になりうる。
          const yTop = SPINE_Y - 7
          const yBot = SPINE_Y + 7
          return (
            <g key={`sl${i}`}>
              <line x1={x1} y1={yTop} x2={x2} y2={yTop} stroke={focused ? LINE_ACTIVE : LINE_TRUNK} strokeWidth={2.5} />
              <line
                x1={x1}
                y1={yBot}
                x2={x2}
                y2={yBot}
                stroke={blocked ? LINE_BLOCK : focused ? LINE_ACTIVE : LINE_TRUNK}
                strokeWidth={2.5}
                strokeDasharray={blocked ? '5 4' : undefined}
              />
              {blocked && (
                <text x={(x1 + x2) / 2} y={yBot + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={LINE_BLOCK}>
                  ✕
                </text>
              )}
            </g>
          )
        }
        return (
          <line
            key={`sl${i}`}
            x1={x1}
            y1={SPINE_Y}
            x2={x2}
            y2={SPINE_Y}
            stroke={focused ? LINE_ACTIVE : LINE_TRUNK}
            strokeWidth={2.5}
          />
        )
      })}

      {/* leaf リンク（spine から枝） */}
      {leafLinks.map((ll, i) => {
        const ps = pos.get(ll.spine)!
        const pl = pos.get(ll.leaf)!
        const focused = isLinkFocused(ll.spine, ll.leaf)
        return (
          <line
            key={`ll${i}`}
            x1={ps.x}
            y1={ps.y + ps.h / 2}
            x2={pl.x}
            y2={pl.y - pl.h / 2}
            stroke={focused ? LINE_ACTIVE : LINE_IDLE}
            strokeWidth={2}
          />
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
              rx={8}
              fill={fill}
              stroke={stroke}
              strokeWidth={focused ? 2 : 1.4}
            />
            <text
              x={p.x}
              y={n.sub ? p.y - 1 : p.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={textColor}
            >
              {n.label}
            </text>
            {n.sub && (
              <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize="9.5" fill={focused ? '#dbeafe' : '#64748b'}>
                {n.sub}
              </text>
            )}
          </g>
        )
      })}

      {focus.type === 'link' && (
        <TravelingDot
          key={stepKey}
          from={pos.get(focus.a)}
          to={pos.get(focus.b)}
          label={packetLabel}
          loop={spineLinks.find((sl) => samePair(sl.a, sl.b, focus.a, focus.b) && sl.count >= 2)}
          reverse={!!spineLinks.find((sl) => sl.a === focus.b && sl.b === focus.a)}
        />
      )}
    </svg>
  )
}

// 有限アニメ: マウント直後に start→end へ1回だけ transition。reduced-motion 時は即 end。
function TravelingDot({
  from,
  to,
  label,
  loop,
  reverse,
}: {
  from?: Pos
  to?: Pos
  label: string
  loop?: { count: number } | undefined
  reverse: boolean
}) {
  const [moved, setMoved] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (moved) return
    const t = window.setTimeout(() => setMoved(true), 60)
    return () => window.clearTimeout(t)
  }, [moved])
  if (!from || !to) return null

  // ループ時は往路=上の線、復路=下の線にずらして「回っている」ことを示す。
  const yOffset = loop ? (reverse ? 7 : -7) : 0
  const sx = from.x
  const sy = (from.y === to.y ? from.y : from.y + from.h / 2) + yOffset
  const ex = to.x
  const ey = (from.y === to.y ? to.y : to.y - to.h / 2) + yOffset
  const x = moved ? ex : sx
  const y = moved ? ey : sy

  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform .7s ease' }} aria-hidden="true">
      <rect x={-Math.max(16, label.length * 3.4)} y={-9} width={Math.max(32, label.length * 6.8)} height={18} rx={5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.6} />
      <text x={0} y={4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1d4ed8">
        {label}
      </text>
    </g>
  )
}
