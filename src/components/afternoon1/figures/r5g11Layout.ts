/**
 * R5 午後Ⅰ 問1 の図1・図4 の座標（コンポーネントは R5G11Base.tsx）
 *
 * 2枚とも G 社データセンターの中は同じ形（左にルータ・FW・L3SW の列とその下のサーバセグメント、右に DMZ）。
 * 図4 は左に J 社クラウドが加わり、DMZ の Web サーバが無くなる。原図の図4 は J 社クラウドと G 社データセンターを
 * 横に並べる（縦横比 3.3:1）。340 の幅に横に並べるため、データセンターの中を詰めて右に寄せた。
 * 図1 は原図どおりデータセンターを真ん中に置く。データセンターの中の座標は `dc(x0)` で、左端だけが2枚で違う。
 */

export const SIZE = 7.5
export const SMALL = 7
export const TEXT = '#334155'

export type Rect = { x: number; y: number; w: number; h: number }

/** 図1 と図4 のデータセンターの左端 */
export const DC_X_FIG1 = 86
export const DC_X_FIG4 = 170

/** G 社データセンターの中（x0 は枠の左端） */
export function dc(x0: number) {
  return {
    frame: { x: x0, y: 34, w: 168, h: 198 },
    /** ルータ・FW・L3SW・サーバセグメントの L2SW の列の中心 */
    cx: x0 + 43,
    router: { x: x0 + 26, y: 42, w: 34, h: 18 },
    fw: { x: x0 + 29, y: 74, w: 28, h: 18 },
    l3sw: { x: x0 + 25, y: 106, w: 36, h: 18 },
    seg: { x: x0 + 3, y: 138, w: 80, h: 90 },
    segSw: { x: x0 + 25, y: 146, w: 36, h: 18 },
    ap: [
      { x: x0 + 7, y: 176, w: 32, h: 30 },
      { x: x0 + 47, y: 176, w: 32, h: 30 },
    ],
    dmz: { x: x0 + 89, y: 64, w: 76, h: 94 },
    dmzSw: { x: x0 + 109, y: 74, w: 36, h: 18 },
    web: { x: x0 + 93, y: 106, w: 32, h: 30 },
    dns: { x: x0 + 129, y: 106, w: 32, h: 30 },
  }
}

export type Dc = ReturnType<typeof dc>

/** インターネット（図1 はルータの真上、図4 は2つの枠のあいだの上） */
export const INET_FIG1 = { cx: DC_X_FIG1 + 43, cy: 15, rx: 36, ry: 11 }
export const INET_FIG4 = { cx: 152, cy: 15, rx: 36, ry: 11 }

/** J 社クラウド（図4 だけ）と、その中の G 社用 VPC セグメント */
export const CLOUD: Rect = { x: 2, y: 34, w: 135, h: 122 }
export const VPC: Rect = { x: 5, y: 61, w: 129, h: 92 }
/** 仮想 LB は VPC セグメントの枠の上辺にまたがる（原図どおり） */
export const VLB: Rect = { x: 71, y: 52, w: 42, h: 18 }
/** 仮想セグメント（原図の、黒い四角が並ぶ横の太線） */
export const BUS = { y: 86, x1: 9, x2: 130 }
export const VWEB: Rect[] = [
  { x: 8, y: 100, w: 32, h: 30 },
  { x: 55, y: 100, w: 32, h: 30 },
]
export const VROUTER: Rect = { x: 97, y: 100, w: 32, h: 30 }
/** 専用線の高さ（仮想ルータと L3SW の真ん中） */
export const LINE_Y = 115
