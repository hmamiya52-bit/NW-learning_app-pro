import { useMemo } from 'react'
import type { PacketStep, Topology, TopoNode } from '../../../data/textbook/types'

// links を実際に使う構成図描画。スイッチ／ルータ＝幹、PC等＝枝（スイッチの下/上に縦積み）。
// 冗長リンク（同じ2ノード間の2本）は縦並びスイッチ＋曲線2本のループで描く。
// 動きは「アクティブな線・アークの強調＋進行方向の矢印」で表す（ノードを覆う吹き出しは使わない）。

const SPINE_ROLES = new Set(['switch', 'router', 'firewall', 'internet', 'cloud', 'lb', 'proxy'])

const TONE_COLOR: Record<string, { fill: string; stroke: string; text: string }> = {
  emerald: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
  violet: { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  sky: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  blue: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  amber: { fill: '#fffbeb', stroke: '#fbbf24', text: '#92400e' },
  rose: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239' },
  slate: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#334155' },
}
// pair/bundle（第11章）は spine もロール色で塗る（既存モードは spine=slate のまま）。
const ROLE_TONE_LOCAL: Record<string, string> = {
  pc: 'sky',
  switch: 'emerald',
  router: 'blue',
  server: 'amber',
  dns: 'violet',
  firewall: 'rose',
  internet: 'slate',
  cloud: 'slate',
  lb: 'blue',
  proxy: 'violet',
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
  verdict?: 'pass' | 'block'
  bubbles?: string[]
  downNodes?: string[]
  pairActive?: string
}

// 停止中ノードの灰色トーン（第10章LBヘルスチェック・第11章フェイルオーバー）。
const DOWN = { fill: '#f8fafc', stroke: '#cbd5e1', text: '#94a3b8', sub: '#cbd5e1' }

// FWの通過/遮断チップ（第9章）。ノードを覆わず、右脇（幅が足りなければ左脇）に置く。
const VERDICT_STYLE = {
  pass: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46', label: '通過 ✓' },
  block: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239', label: '遮断 ✕' },
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

export default function GraphTopology({ topology, focus, blockedLink, verdict, bubbles, downNodes, pairActive }: Props) {
  const layout = useMemo(() => buildLayout(topology), [topology])
  const { nodes, pos, trunk, leafSegs, loop, spineEdges, zoneLabels, toneOf, height, trunkLabel, pairIds, vipPill, bundle, tunnel } = layout

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

      {/* 枝（スイッチ／ルータ／FW→端末の線）＋進行方向の矢印・遮断✕ */}
      {leafSegs.map((seg, i) => {
        const focused = isLinkFocused(seg.from, seg.to)
        // 停止したペアノード（VRRPの故障ルータ）につながる枝は、両方まとめて遮断表示にする。
        const touchesDownPair =
          !!pairIds &&
          ((downNodes?.includes(seg.from) && pairIds.includes(seg.from)) ||
            (downNodes?.includes(seg.to) && pairIds.includes(seg.to)))
        const isBlocked =
          (!!blockedLink && samePair(blockedLink.a, blockedLink.b, seg.from, seg.to)) || touchesDownPair
        const vertical = Math.abs(seg.x1 - seg.x2) < 6
        const down = seg.y2 >= seg.y1
        const mx = (seg.x1 + seg.x2) / 2
        const my = (seg.y1 + seg.y2) / 2
        // 斜めの枝（三方向FWでFW→端末など）は、進行方向に沿った角度付き矢印。
        const fa = focus.type === 'link' ? pos.get(focus.a) : undefined
        const fb = focus.type === 'link' ? pos.get(focus.b) : undefined
        return (
          <g key={`seg${i}`}>
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={isBlocked ? LINE_BLOCK : focused ? LINE_ACTIVE : LINE_IDLE}
              strokeWidth={isBlocked ? 3.4 : focused ? 3 : 2}
              strokeDasharray={isBlocked ? '7 5' : undefined}
            />
            {isBlocked && (
              <text x={mx} y={my + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={LINE_BLOCK}>
                ✕
              </text>
            )}
            {focused &&
              !isBlocked &&
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

      {/* リンク束ね（LAG）: 近接した平行リンク＋点線ブラケット。片方停止は上側リンクに ✕。 */}
      {bundle &&
        (() => {
          const focused = isLinkFocused(bundle.a, bundle.b)
          const blockedBundle = !!blockedLink && samePair(blockedLink.a, blockedLink.b, bundle.a, bundle.b)
          return (
            <g>
              <rect
                x={bundle.bracket.x}
                y={bundle.bracket.y}
                width={bundle.bracket.w}
                height={bundle.bracket.h}
                rx={8}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.4}
                strokeDasharray="5 4"
              />
              {bundle.note && (
                <text x={bundle.bracket.x + bundle.bracket.w / 2} y={bundle.bracket.y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                  {bundle.note}
                </text>
              )}
              {bundle.links.map((ln, i) => {
                const isBlocked = blockedBundle && i === 0
                const color = isBlocked ? LINE_BLOCK : focused ? LINE_ACTIVE : LINE_TRUNK
                return (
                  <g key={`bl${i}`}>
                    <line
                      x1={ln.x1}
                      y1={ln.y1}
                      x2={ln.x2}
                      y2={ln.y2}
                      stroke={color}
                      strokeWidth={isBlocked ? 3.4 : 3}
                      strokeDasharray={isBlocked ? '7 5' : undefined}
                    />
                    {isBlocked && (
                      <text x={(ln.x1 + ln.x2) / 2} y={ln.y1 + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={LINE_BLOCK}>
                        ✕
                      </text>
                    )}
                  </g>
                )
              })}
              {bundle.ground.map((g, i) => (
                <text key={`bg${i}`} x={g.x} y={g.y} textAnchor="middle" fontSize="9" fill="#94a3b8">
                  {g.text}
                </text>
              ))}
              {(bundle.bwFull || bundle.bwReduced) && (
                <text x={W / 2} y={bundle.bwY} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                  {blockedBundle ? bundle.bwReduced : bundle.bwFull}
                </text>
              )}
            </g>
          )
        })()}

      {/* 拠点間トンネル（VPN）: 2ルータ間の暗号トンネルの帯＋二重IPの箱。focus が {a,b} のとき帯を強調。 */}
      {tunnel &&
        (() => {
          const focused = isLinkFocused(tunnel.a, tunnel.b)
          const { x, y, w, h } = tunnel.band
          return (
            <g>
              {tunnel.note && (
                <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#5b21b6">
                  {tunnel.note}
                </text>
              )}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={16}
                fill="#f5f3ff"
                stroke="#a78bfa"
                strokeWidth={focused ? 2.8 : 2}
                strokeDasharray={focused ? undefined : '6 4'}
              />
              <text x={x + w / 2} y={y + h / 2 - 1} textAnchor="middle" fontSize="11" fontWeight="800" fill="#5b21b6">
                暗号化
              </text>
              <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize="8" fill="#a78bfa">
                元パケットを丸ごと
              </text>
              {bubbles && bubbles.length > 0 && (
                <g>
                  {(() => {
                    const nb = Math.min(2, bubbles.length)
                    const bh = nb === 1 ? 24 : 40
                    const bw = 202
                    const bx2 = W / 2 - bw / 2
                    const by = tunnel.bubbleY - bh / 2
                    return (
                      <>
                        <rect x={bx2} y={by} width={bw} height={bh} rx={8} fill="#ffffff" stroke="#e2e8f0" strokeWidth={1} />
                        {bubbles.slice(0, 2).map((b, i) => (
                          <text
                            key={i}
                            x={W / 2}
                            y={nb === 1 ? tunnel.bubbleY + 3 : by + 15 + i * 15}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="700"
                            fill={i === 0 ? '#5b21b6' : '#1d4ed8'}
                          >
                            {b}
                          </text>
                        ))}
                      </>
                    )
                  })()}
                </g>
              )}
            </g>
          )
        })()}

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
        const isDown = !!downNodes?.includes(n.id)
        const tone = TONE_COLOR[toneOf(n)] ?? TONE_COLOR.slate
        const fill = isDown ? DOWN.fill : focused ? FOCUS.fill : tone.fill
        const stroke = isDown ? DOWN.stroke : focused ? FOCUS.stroke : tone.stroke
        const textColor = isDown ? DOWN.text : focused ? FOCUS.text : tone.text
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
              <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize="10" fill={isDown ? DOWN.sub : focused ? '#dbeafe' : '#64748b'}>
                {n.sub}
              </text>
            )}
          </g>
        )
      })}

      {/* 仮想IP（VRRPのVIP）ピル。ペアと端末の間に固定表示（PCのGW＝この仮想IP）。 */}
      {vipPill && (
        <g>
          <rect x={vipPill.x - 40} y={vipPill.y - 15} width={80} height={30} rx={6} fill="#ffffff" stroke="#60a5fa" strokeWidth={1.4} />
          <text x={vipPill.x} y={vipPill.y - 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#3b82f6">
            仮想IP
          </text>
          <text x={vipPill.x} y={vipPill.y + 9} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1d4ed8">
            {vipPill.text}
          </text>
        </g>
      )}

      {/* ペアの状態チップ（稼働中／待機中／故障）。downNodes＝故障、pairActive＝稼働中、他＝待機中。 */}
      {pairIds?.map((id) => {
        const p = pos.get(id)
        if (!p) return null
        const st = downNodes?.includes(id)
          ? { t: '故障', fill: '#fff1f2', stroke: '#fecdd3', text: '#9f1239' }
          : id === pairActive
            ? { t: '稼働中', fill: '#dbeafe', stroke: '#93c5fd', text: '#1d4ed8' }
            : { t: '待機中', fill: '#f1f5f9', stroke: '#cbd5e1', text: '#475569' }
        const cyp = p.y + p.h / 2 + 12
        return (
          <g key={`st${id}`}>
            <rect x={p.x - 22} y={cyp - 8} width={44} height={16} rx={8} fill={st.fill} stroke={st.stroke} strokeWidth={1} />
            <text x={p.x} y={cyp + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={st.text}>
              {st.t}
            </text>
          </g>
        )
      })}

      {/* FWの判定チップ（通過/遮断）。フォーカス中のノード脇に置く（ノードは覆わない）。 */}
      {verdict &&
        focusedNodeId &&
        (() => {
          const p = pos.get(focusedNodeId)
          if (!p) return null
          const v = VERDICT_STYLE[verdict]
          const cw = 54
          const ch = 20
          let chipX = p.x + p.w / 2 + 8
          if (chipX + cw > W) chipX = p.x - p.w / 2 - 8 - cw
          const chipY = p.y - ch / 2
          return (
            <g>
              <rect x={chipX} y={chipY} width={cw} height={ch} rx={10} fill={v.fill} stroke={v.stroke} strokeWidth={1.4} />
              <text x={chipX + cw / 2} y={chipY + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill={v.text}>
                {v.label}
              </text>
            </g>
          )
        })()}

      {/* パケットの宛先/送信元の吹き出し（graph図・中央縦spine向け）。アクティブ対象の左脇に固定し、
          ノード列（左端）に食い込ませない＝ノード非被覆。右脇は verdict チップ専用。 */}
      {!tunnel &&
        bubbles &&
        bubbles.length > 0 &&
        (() => {
          let anchorY: number
          let rightEdge: number
          if (focus.type === 'node') {
            const p = pos.get(focus.id)
            if (!p) return null
            anchorY = p.y
            rightEdge = p.x - p.w / 2 - 6
          } else {
            const pa = pos.get(focus.a)
            const pb = pos.get(focus.b)
            if (!pa || !pb) return null
            anchorY = (pa.y + pb.y) / 2
            rightEdge = (pa.x + pb.x) / 2 - 8
          }
          rightEdge = Math.min(rightEdge, W / 2 - SW_W / 2 - 6)
          anchorY = Math.max(44, Math.min(172, anchorY))
          const BH = 28
          const GAP = 4
          const n = bubbles.length
          const totalH = n * BH + (n - 1) * GAP
          const top = Math.max(14, Math.min(height - 14 - totalH, anchorY - totalH / 2))
          return bubbles.map((label, i) => {
            const m = label.match(/^(送信元|宛先) (.+)$/)
            const value = m ? m[2] : label
            const bw = Math.min(120, Math.max(70, Math.round(value.length * 5.8) + 16))
            const x = Math.max(4, rightEdge - bw)
            const by = top + i * (BH + GAP)
            const cy = by + BH / 2
            const midX = (x + rightEdge) / 2
            return (
              <g key={`bub${i}`}>
                <polygon points={`${rightEdge},${cy - 6} ${rightEdge},${cy + 6} ${rightEdge + 6},${cy}`} fill="#60a5fa" />
                <rect x={x} y={by} width={rightEdge - x} height={BH} rx={6} fill="#ffffff" stroke="#60a5fa" strokeWidth={1.4} />
                {m ? (
                  <>
                    <text x={midX} y={by + 11} textAnchor="middle" fontSize="9" fontWeight="800" fill="#3b82f6">
                      {m[1]}
                    </text>
                    <text x={midX} y={by + 23} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1d4ed8">
                      {m[2]}
                    </text>
                  </>
                ) : (
                  <text x={midX} y={by + 18} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1d4ed8">
                    {label}
                  </text>
                )}
              </g>
            )
          })
        })()}
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
  // pair（VRRP）: 冗長ペアのノードid・中央の仮想IPピル。
  pairIds?: string[]
  vipPill?: { x: number; y: number; text: string } | null
  // bundle（LAG）: 束ねた平行リンク・点線ブラケット・接地ラベル。
  bundle?: {
    a: string
    b: string
    links: { x1: number; y1: number; x2: number; y2: number }[]
    bracket: { x: number; y: number; w: number; h: number }
    note?: string
    ground: { x: number; y: number; text: string }[]
    bwFull?: string
    bwReduced?: string
    bwY: number
  } | null
  // tunnel（拠点間VPN）: 2ルータ間の暗号トンネルの帯・見出し・二重IPの箱位置。
  tunnel?: {
    a: string
    b: string
    band: { x: number; y: number; w: number; h: number }
    note?: string
    bubbleY: number
  } | null
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

  // 冗長ペア（VRRP）／リンク束ね（LAG）は専用レイアウト。loopPair 判定より前に返す（bundle の2リンクを loop 扱いにしない）。
  if (topology.pair && spine.length >= 3) {
    return buildPair({ spine, leaves, links, allNodes: nodes, vip: topology.vip })
  }
  if (topology.bundle && spine.length >= 2) {
    return buildBundle({ spine, links, allNodes: nodes, note: topology.bundleNote, bandwidth: topology.bundleBandwidth })
  }
  if (topology.tunnel && spine.length >= 2) {
    return buildTunnel({ spine, leaves, links, allNodes: nodes, note: topology.tunnelNote })
  }

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

  // 三方向FW（spine 縦一列＋最下段から zone ごとに左右の列へ枝分かれ）: 第9章 内部/DMZ/外部の三層境界。
  if (topology.tiers && spine.length >= 2 && !loopPair) {
    return buildTiers({ spine, leavesOf, toneOf, links, edgeLabels: topology.edgeLabels ?? [], zones, allNodes: nodes })
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
  })
  // 同一ゾーンの複数末端（LBのWebサーバプール等）は、ゾーンラベルを1つに集約して中央に置く。
  const botSameZone = botLeaves.length >= 2 && botLeaves.every((l) => l.zoneId && l.zoneId === botLeaves[0].zoneId)
  if (botSameZone) {
    const z = zoneById.get(botLeaves[0].zoneId!)
    if (z) zoneLabels.push({ x: cx, y: botLeafY - LEAF_H / 2 - 6, text: z.label, color: (TONE_COLOR[z.tone] ?? TONE_COLOR.slate).text })
  } else {
    botLeaves.forEach((lf, i) => pushZoneChip(lf, bxs[i], botLeafY))
  }

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

// 三方向FWレイアウト: spine（インターネット→境界ルータ→FW）を縦一列に並べ、最下段のノード（FW）から
// zone ごとに左右の列へ枝分かれ（列は zone の初出順に左→右。左＝DMZ列・右＝内部列）。列内は縦に積む。
// 上=外部・下=内部の向き規約。第9章 内部/DMZ/外部の三層境界。
function buildTiers({
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

  // spine を縦一列（第9章は インターネット→境界ルータ→FW の3段）。
  const firstY = 26
  const spineGap = SW_H + 30
  const spineY = (i: number) => firstY + i * spineGap
  spine.forEach((s, i) => pos.set(s.id, { x: cx, y: spineY(i), w: SW_W, h: SW_H }))

  const bot = spine[spine.length - 1]
  const botY = spineY(spine.length - 1)

  // 最下段（FW）の直下の端末を zone ごとに列にまとめる。
  const directLeaves = leavesOf(bot.id)
  const groups = new Map<string, TopoNode[]>()
  const zoneOrder: string[] = []
  directLeaves.forEach((lf) => {
    const z = lf.zoneId ?? '_'
    if (!groups.has(z)) {
      groups.set(z, [])
      zoneOrder.push(z)
    }
    groups.get(z)!.push(lf)
  })
  const nCol = zoneOrder.length
  const colXs =
    nCol <= 1 ? [cx] : nCol === 2 ? [66, 254] : Array.from({ length: nCol }, (_, i) => ((i + 0.5) / nCol) * W)

  const colTopY = botY + SW_H / 2 + 57 + LEAF_H / 2 // FW下端から列の先頭までの枝の長さ＝57
  zoneOrder.forEach((zid, ci) => {
    const x = colXs[ci]
    const arr = groups.get(zid)!
    let y = colTopY
    arr.forEach((node, ni) => {
      pos.set(node.id, { x, y, w: LEAF_W, h: LEAF_H })
      if (ni === 0) {
        // FW から列の先頭へ斜めの枝
        leafSegs.push({ from: bot.id, to: node.id, x1: cx, y1: botY + SW_H / 2, x2: x, y2: y - LEAF_H / 2 })
        const z = zoneById.get(zid)
        if (z)
          zoneLabels.push({ x, y: y - LEAF_H / 2 - 6, text: z.label, color: (TONE_COLOR[z.tone] ?? TONE_COLOR.slate).text })
      } else {
        // 同じ列の1つ上の端末から縦の枝
        leafSegs.push({
          from: arr[ni - 1].id,
          to: node.id,
          x1: x,
          y1: y - (LEAF_H + 16) + LEAF_H / 2,
          x2: x,
          y2: y - LEAF_H / 2,
        })
      }
      y += LEAF_H + 16
    })
  })

  // spine 間リンク（インターネット–境界ルータ, 境界ルータ–FW）縦・単一。ラベルは右側に。
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

// 冗長ペア（VRRP）レイアウト: 上=共有先（インターネット等）を中央、中段に2台の冗長ペアを左右、下=端末（PC）を中央。
// 仮想IP（VIP）はペアと端末の間に固定表示。稼働/待機/故障は本体の render 側で色＋状態チップにする。
// 第11章 機器の冗長。上=外部・下=内部の向き規約に従う。
function buildPair({
  spine,
  leaves,
  links,
  allNodes,
  vip,
}: {
  spine: TopoNode[]
  leaves: TopoNode[]
  links: Topology['links']
  allNodes: TopoNode[]
  vip?: string
}): Layout {
  const cx = W / 2
  const pos = new Map<string, Pos>()
  const leafSegs: Layout['leafSegs'] = []

  // 下段の端末（PC）＝ペア2台の両方につながる葉。ペア＝その端末につながる spine、上段＝残りの spine。
  const bottom = leaves[0]
  const pairNodes = spine.filter((s) => bottom && links.some((l) => samePair(l.a, l.b, s.id, bottom.id)))
  const topNode = spine.find((s) => !pairNodes.some((p) => p.id === s.id)) ?? spine[0]
  const [r1, r2] = pairNodes

  const topY = 34
  const pairY = 142
  const botY = 250
  pos.set(topNode.id, { x: cx, y: topY, w: SW_W, h: SW_H })
  if (r1) pos.set(r1.id, { x: 66, y: pairY, w: SW_W, h: SW_H })
  if (r2) pos.set(r2.id, { x: 254, y: pairY, w: SW_W, h: SW_H })
  if (bottom) pos.set(bottom.id, { x: cx, y: botY, w: LEAF_W, h: LEAF_H })

  const pushSeg = (from: string, to: string) => {
    const pf = pos.get(from)
    const pt = pos.get(to)
    if (!pf || !pt) return
    leafSegs.push({ from, to, x1: pf.x, y1: pf.y + pf.h / 2, x2: pt.x, y2: pt.y - pt.h / 2 })
  }
  if (r1) pushSeg(topNode.id, r1.id)
  if (r2) pushSeg(topNode.id, r2.id)
  if (r1 && bottom) pushSeg(r1.id, bottom.id)
  if (r2 && bottom) pushSeg(r2.id, bottom.id)

  const toneOf = (n: TopoNode) => ROLE_TONE_LOCAL[n.role] ?? 'slate'
  const maxBot = botY + LEAF_H / 2
  return {
    nodes: allNodes,
    pos,
    trunk: null,
    trunkLabel: null,
    leafSegs,
    loop: null,
    spineEdges: [],
    zoneLabels: [],
    toneOf,
    height: maxBot + 16,
    pairIds: pairNodes.map((p) => p.id),
    vipPill: vip ? { x: cx, y: 198, text: vip } : null,
  }
}

// リンク束ね（LAG）レイアウト: 2台の機器を左右に置き、その間の複数リンクを近接した平行線で描く。
// 点線ブラケットで「1本の論理リンク」を示し、片方の停止は blockedLink で上側リンクに ✕。
function buildBundle({
  spine,
  links,
  allNodes,
  note,
  bandwidth,
}: {
  spine: TopoNode[]
  links: Topology['links']
  allNodes: TopoNode[]
  note?: string
  bandwidth?: { full: string; reduced: string }
}): Layout {
  const [a, b] = spine
  const ay = 100
  const ax = 70
  const bx = 250
  const pos = new Map<string, Pos>()
  pos.set(a.id, { x: ax, y: ay, w: SW_W, h: SW_H })
  pos.set(b.id, { x: bx, y: ay, w: SW_W, h: SW_H })

  const n = links.filter((l) => samePair(l.a, l.b, a.id, b.id)).length || 2
  const x1 = ax + SW_W / 2
  const x2 = bx - SW_W / 2
  const ys = n >= 3 ? [82, 100, 118] : [88, 112]
  const blinks = ys.map((y) => ({ x1, y1: y, x2, y2: y }))
  const top = Math.min(...ys)
  const bottomY = Math.max(...ys)
  const bracket = { x: x1 - 4, y: top - 8, w: x2 - x1 + 8, h: bottomY - top + 16 }
  const bwY = ay + SW_H / 2 + 33 // 端末側/上位側ラベルの下に帯域を1行

  const toneOf = (nd: TopoNode) => ROLE_TONE_LOCAL[nd.role] ?? 'slate'
  return {
    nodes: allNodes,
    pos,
    trunk: null,
    trunkLabel: null,
    leafSegs: [],
    loop: null,
    spineEdges: [],
    zoneLabels: [],
    toneOf,
    height: bwY + 14,
    bundle: {
      a: a.id,
      b: b.id,
      links: blinks,
      bracket,
      note,
      ground: [
        { x: ax, y: ay + SW_H / 2 + 17, text: '（端末側）' },
        { x: bx, y: ay + SW_H / 2 + 17, text: '（上位側）' },
      ],
      bwFull: bandwidth?.full,
      bwReduced: bandwidth?.reduced,
      bwY,
    },
  }
}

// 拠点間トンネル（VPN）レイアウト: 2台の拠点ルータを横に置き、間を暗号トンネルの帯で結ぶ。端末は各ルータの真下。
// 帯（a—b リンク）はステップの focus が {a,b} のとき強調。二重IPは bubbles を帯の下の箱に出す。
function buildTunnel({
  spine,
  leaves,
  links,
  allNodes,
  note,
}: {
  spine: TopoNode[]
  leaves: TopoNode[]
  links: Topology['links']
  allNodes: TopoNode[]
  note?: string
}): Layout {
  const [a, b] = spine
  const ay = 71
  const rh = 38
  const ax = 57
  const bx = 263
  const rw = 94
  const pos = new Map<string, Pos>()
  const leafSegs: Layout['leafSegs'] = []
  pos.set(a.id, { x: ax, y: ay, w: rw, h: rh })
  pos.set(b.id, { x: bx, y: ay, w: rw, h: rh })

  const pcY = 169
  const pw = 94
  const ph = 34
  const leafOf = (sid: string) => leaves.find((lf) => links.some((l) => samePair(l.a, l.b, lf.id, sid)))
  const la = leafOf(a.id)
  const lb = leafOf(b.id)
  if (la) {
    pos.set(la.id, { x: ax, y: pcY, w: pw, h: ph })
    leafSegs.push({ from: a.id, to: la.id, x1: ax, y1: ay + rh / 2, x2: ax, y2: pcY - ph / 2 })
  }
  if (lb) {
    pos.set(lb.id, { x: bx, y: pcY, w: pw, h: ph })
    leafSegs.push({ from: b.id, to: lb.id, x1: bx, y1: ay + rh / 2, x2: bx, y2: pcY - ph / 2 })
  }

  const toneOf = (n: TopoNode) => ROLE_TONE_LOCAL[n.role] ?? 'slate'
  return {
    nodes: allNodes,
    pos,
    trunk: null,
    trunkLabel: null,
    leafSegs,
    loop: null,
    spineEdges: [],
    zoneLabels: [],
    toneOf,
    height: pcY + ph / 2 + 14,
    tunnel: { a: a.id, b: b.id, band: { x: 104, y: 52, w: 112, h: 38 }, note, bubbleY: 116 },
  }
}

function shiftPathY(d: string, dy: number) {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return `M ${n[0]} ${n[1] + dy} Q ${n[2]} ${n[3] + dy} ${n[4]} ${n[5] + dy}`
}
