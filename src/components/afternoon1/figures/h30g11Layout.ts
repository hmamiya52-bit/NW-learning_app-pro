/**
 * H30 午後Ⅰ 問1 の図1・図2 で共通の座標。
 *
 * 原図は上の段に出張先・インターネット・G 社 SaaS、下の段に本社（左）と営業所（右、4枚重ね）を並べる（縦横比 1.9:1）。
 * 並びは組み直さずに 340 の幅へ入れるため、社内 PC の箱を「社内／PC」の2行にして本社の PC の列を詰め、
 * 営業所の重ねた枠のずれを 3 にした。本社のルータからインターネットへの線は、原図では右上へ斜めに引くが、
 * DMZ と SD-WAN コントローラの右を通すため縦の線にした。
 * 図2 は図1 から、グループウェアサーバを外し、IPsec ルータを SD-WAN ルータに替え、SD-WAN コントローラを足した図。
 * 座標だけを置き、コンポーネントは `H30G11Base.tsx` に置く（react-refresh/only-export-components のため）。
 */

import { TONE } from './tokens'

export type Rect = { x: number; y: number; w: number; h: number }
export type Pt = [number, number]

/** 箱の文字・札の文字の大きさと色（2枚で同じ） */
export const SIZE = 7.5
export const SMALL = 7
export const TEXT = '#334155'
export const HATCH = '#94a3b8'
/** 黒塗りの箱（原図の、G 社 SaaS 導入後に廃止する機器）の塗り。host の文字の色を塗りに使い、文字を白抜きにする */
export const RETIRE_FILL = TONE.host.text

/* ── 上の段 ─────────────────────────────────────── */
/**
 * 出張先の枠と PC（PC の中心の高さ 34 がインターネットの中心の高さ）。
 * PC に付ける強調の輪（箱の 3.5 外）が枠の名前に掛からないよう、名前を上に寄せる
 */
export const TRIP: Rect = { x: 30, y: 4, w: 40, h: 43 }
export const TRIP_PC: Rect = { x: 38, y: 25, w: 24, h: 18 }
export const INET = { cx: 168, cy: 34, rx: 64, ry: 12 }
/** G 社 SaaS の枠とグループウェアサーバ群 */
export const SAAS: Rect = { x: 264, y: 2, w: 70, h: 51 }
export const SAAS_SRV: Rect = { x: 268, y: 19, w: 62, h: 30 }
export const ROW_Y = 34

/* ── 本社 ─────────────────────────────────────── */
export const HQ: Rect = { x: 2, y: 62, w: 210, h: 209 }
/** FW と DMZ の段（中心の高さ 90） */
export const A_Y = 90
export const FW: Rect = { x: 68, y: 81, w: 26, h: 18 }
/** DMZ の枠。図1 はグループウェアサーバの分だけ高い。名前は右下 */
export const DMZ1: Rect = { x: 100, y: 71, w: 96, h: 76 }
export const DMZ2: Rect = { x: 100, y: 71, w: 96, h: 52 }
export const DMZ_SW: Rect = { x: 104, y: 81, w: 36, h: 18 }
export const PROXY: Rect = { x: 150, y: 75, w: 39, h: 30 }
export const GW: Rect = { x: 104, y: 113, w: 60, h: 30 }
/** 図2 の SD-WAN コントローラ（どこにも線が無い。原図どおり）。輪を付けても右の縦の線との間が空くよう、右の端を 195 にする */
export const CTRL: Rect = { x: 143, y: 129, w: 52, h: 30 }
/** L3SW とルータの段（中心の高さ 180） */
export const B_Y = 180
export const L3: Rect = { x: 63, y: 171, w: 36, h: 18 }
/** 本社のルータ（右の端は 208 にそろえる。図1 は IPsec ルータ、図2 は SD-WAN ルータ） */
export const HQ_IPSEC: Rect = { x: 172, y: 165, w: 36, h: 30 }
export const HQ_SDWAN: Rect = { x: 160, y: 165, w: 48, h: 30 }
/** 本社のルータからインターネットへの縦の線の x（DMZ と SD-WAN コントローラの右を通る） */
export const HQ_UP_X = 204
/** L2SW の段（中心の高さ 214）と社内 PC の段（2行の箱） */
export const C_Y = 214
export const HQ_L2: Rect[] = [
  { x: 25, y: 205, w: 36, h: 18 },
  { x: 101, y: 205, w: 36, h: 18 },
]
export const HQ_PC: Rect[] = [
  { x: 8, y: 237, w: 27, h: 30 },
  { x: 51, y: 237, w: 27, h: 30 },
  { x: 84, y: 237, w: 27, h: 30 },
  { x: 127, y: 237, w: 27, h: 30 },
]

/* ── 営業所（4枚重ね。後ろの枠は右上へ 3 ずつずらす） ───────────── */
export const BR: Rect = { x: 217, y: 159, w: 111, h: 112 }
export const BR_STEP = 3
export const BR_IPSEC: Rect = { x: 263, y: 165, w: 36, h: 30 }
export const BR_SDWAN: Rect = { x: 257, y: 165, w: 48, h: 30 }
export const BR_L2: Rect[] = [
  { x: 238, y: 205, w: 36, h: 18 },
  { x: 288, y: 205, w: 36, h: 18 },
]
export const BR_PC: Rect[] = [
  { x: 221, y: 237, w: 27, h: 30 },
  { x: 264, y: 237, w: 27, h: 30 },
]

/* ── 線 ─────────────────────────────────────── */
const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** インターネットから FW へ（楕円の左下から） */
export const INET_TO_FW: Pt[] = [
  [124, 40],
  [mid(FW), FW.y],
]
/** 本社のルータからインターネットへ（端は楕円の中とルータの箱の中） */
export const HQ_UP: Pt[] = [
  [HQ_UP_X, 168],
  [HQ_UP_X, 41],
]
/**
 * インターネットから営業所への平行な4本。1本目は手前の枠のルータへ、2〜4本目は後ろの枠の上辺で止める（原図どおり）。
 * 始点は楕円の中で横に 5 ずつずらし、傾きはそろえる。
 */
const BR_START_X = 212
const BR_START_Y = 37
const BR_END: Pt = [mid(BR_IPSEC), 170]
const SLOPE = (BR_END[0] - BR_START_X) / (BR_END[1] - BR_START_Y)
export const BR_LINES: Pt[][] = [0, 1, 2, 3].map((k) => {
  const sx = BR_START_X + 5 * k
  if (k === 0) return [[sx, BR_START_Y], BR_END]
  const ey = BR.y - BR_STEP * k
  return [
    [sx, BR_START_Y],
    [+(sx + SLOPE * (ey - BR_START_Y)).toFixed(1), ey],
  ]
})

/** L3SW から2台の L2SW へ、L2SW から社内 PC へ（本社） */
export const HQ_L3_TO_L2: Pt[][] = [
  [
    [75, bottom(L3)],
    [mid(HQ_L2[0]), HQ_L2[0].y],
  ],
  [
    [87, bottom(L3)],
    [mid(HQ_L2[1]), HQ_L2[1].y],
  ],
]
export const HQ_L2_TO_PC: Pt[][] = HQ_PC.map((pc, i) => {
  const sw = HQ_L2[i < 2 ? 0 : 1]
  return [
    [mid(sw) + (i % 2 === 0 ? -6 : 6), bottom(sw)],
    [mid(pc), pc.y],
  ]
})
/** 営業所のルータから2台の L2SW へ、左の L2SW から社内 PC へ */
export const BR_RT_TO_L2: Pt[][] = [
  [
    [mid(BR_IPSEC) - 8, bottom(BR_IPSEC)],
    [mid(BR_L2[0]), BR_L2[0].y],
  ],
  [
    [mid(BR_IPSEC) + 8, bottom(BR_IPSEC)],
    [mid(BR_L2[1]), BR_L2[1].y],
  ],
]
export const BR_L2_TO_PC: Pt[][] = BR_PC.map((pc, i) => [
  [mid(BR_L2[0]) + (i === 0 ? -6 : 6), bottom(BR_L2[0])],
  [mid(pc), pc.y],
])
