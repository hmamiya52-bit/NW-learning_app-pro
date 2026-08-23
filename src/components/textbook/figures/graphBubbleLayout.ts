import type { PacketStep } from '../../../data/textbook/types'

// 吹き出し（宛先・送信元）の置き場所を決める。
//
// 以前は対象の y を `Math.max(44, Math.min(172, anchorY))` と一律にクランプしていた。図高が
// 380 を超える図では下半分のステップで吹き出しが対象から離れて浮くため、第9・10・20章の
// 大きい図では吹き出しそのものを使えなかった（図解仕様 §7.1）。
//
// 実測すると、塞がれていた歩の多く（第10章LB y=271・第20章LB y=363・第20章境界ルータ y=203）は
// 左脇が上から下まで完全に空いており、クランプは「その高さに本当に何かあるか」という
// ローカルに計算できる判定を、図全体へ一律にかけた代物だった。ここでは実際の障害物と
// 当たり判定し、空いていれば実アンカーの高さへ置く。
//
// 逆に第9章の三方向FW図では、実アンカー（y=202）の左脇にDMZの白チップとWebサーバの箱があり、
// クランプは結果として正しく働いていた。当たり判定にすると、そこは今までどおり避けて置かれる。

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface BoxPos {
  x: number
  y: number
  w: number
  h: number
}

// GraphTopology の Layout がそのまま満たす形（構造的部分型）。レイアウト計算を
// このモジュールへ持ち込まないため、必要な項目だけを受け取る。
export interface BubbleLayoutInput {
  pos: Map<string, BoxPos>
  zoneLabels: { x: number; y: number; text: string }[]
  height: number
  vipPill?: { x: number; y: number } | null
  pairIds?: string[]
  bundle?: { bracket: Rect } | null
  tunnel?: unknown
}

const W = 320
const SW_W = 92
const BUBBLE_H = 28
const BUBBLE_GAP = 4
// 障害物との間に空ける最小の隙間。0 にすると白チップやノードの縁にぴったり接して描かれ、
// 隣り合っているのか重なっているのか読み取れなくなる。
const CLEARANCE = 3

/**
 * 吹き出しが覆ってはいけない要素。
 *
 * ノード箱・ゾーン名の白チップ・仮想IPピル・ペアの状態チップ・LAGのブラケット。
 * 線とそのラベルは含めない（吹き出しは線をまたいでよい）。
 */
export function obstaclesOf(layout: BubbleLayoutInput): Rect[] {
  const out: Rect[] = []
  for (const p of layout.pos.values()) out.push({ x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h })
  for (const z of layout.zoneLabels) {
    const w = z.text.length * 9 + 6
    out.push({ x: z.x - w / 2, y: z.y - 10, w, h: 13 })
  }
  if (layout.vipPill) out.push({ x: layout.vipPill.x - 40, y: layout.vipPill.y - 15, w: 80, h: 30 })
  for (const id of layout.pairIds ?? []) {
    const p = layout.pos.get(id)
    if (p) out.push({ x: p.x - 22, y: p.y + p.h / 2 + 4, w: 44, h: 16 })
  }
  if (layout.bundle) out.push(layout.bundle.bracket)
  return out
}

/** x が [x1, x2] に掛かる障害物から、置けない y の区間を作る（開始順）。 */
function blockedYRanges(obstacles: Rect[], x1: number, x2: number): [number, number][] {
  const out: [number, number][] = []
  for (const o of obstacles) {
    if (o.x + o.w <= x1 || o.x >= x2) continue
    out.push([o.y - CLEARANCE, o.y + o.h + CLEARANCE])
  }
  return out.sort((a, b) => a[0] - b[0])
}

/** [lo, hi] の中で高さ h が収まる空きを探し、target に最も近い上端を返す。無ければ null。 */
function nearestFreeTop(blocked: [number, number][], lo: number, hi: number, h: number, target: number): number | null {
  const gaps: [number, number][] = []
  let cur = lo
  for (const [a, b] of blocked) {
    if (b <= cur) continue
    if (a > cur) gaps.push([cur, Math.min(a, hi)])
    cur = Math.max(cur, b)
    if (cur >= hi) break
  }
  if (cur < hi) gaps.push([cur, hi])
  let best: number | null = null
  let bestDist = Infinity
  for (const [a, b] of gaps) {
    if (b - a < h) continue
    const top = Math.max(a, Math.min(b - h, target))
    const dist = Math.abs(top - target)
    if (dist < bestDist) {
      bestDist = dist
      best = top
    }
  }
  return best
}

/**
 * 吹き出しの矩形を決める。覆ってはいけないものを避けたうえで、実アンカーに最も近い高さへ置く。
 * 返り値の `rects` は上から順（`bubbles` と同じ並び）。置けない場合は null。
 */
export function bubbleRects(
  layout: BubbleLayoutInput,
  obstacles: Rect[],
  focus: PacketStep['focus'],
  bubbles: string[],
): { rightEdge: number; rects: Rect[] } | null {
  // トンネル図の二重IPは帯の下の箱に出す＝この脇置きは使わない。
  if (layout.tunnel || bubbles.length === 0) return null
  const { pos, height } = layout
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
  // 中央縦spineのノード列に食い込ませない＝ノード非被覆。
  rightEdge = Math.min(rightEdge, W / 2 - SW_W / 2 - 6)
  const n = bubbles.length
  const totalH = n * BUBBLE_H + (n - 1) * BUBBLE_GAP
  const widths = bubbles.map((label) => {
    const m = label.match(/^(送信元|宛先) (.+)$/)
    const value = m ? m[2] : label
    return Math.min(120, Math.max(70, Math.round(value.length * 5.8) + 16))
  })
  const leftMost = Math.max(4, rightEdge - Math.max(...widths))
  const blocked = blockedYRanges(obstacles, leftMost, rightEdge)
  const free = nearestFreeTop(blocked, 14, height - 14, totalH, anchorY - totalH / 2)
  // どこにも空きが無い図では従来どおり上半分へ寄せる（回帰させない最後の手段）。
  const top =
    free ?? Math.max(14, Math.min(height - 14 - totalH, Math.max(44, Math.min(172, anchorY)) - totalH / 2))
  const rects = widths.map((bw, i) => {
    const x = Math.max(4, rightEdge - bw)
    return { x, y: top + i * (BUBBLE_H + BUBBLE_GAP), w: rightEdge - x, h: BUBBLE_H }
  })
  return { rightEdge, rects }
}
