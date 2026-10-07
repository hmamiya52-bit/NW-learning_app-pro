/**
 * H29 午後Ⅰ 問2 の図1・図2 で共通の座標（上の段の支店・インターネット・広域イーサ網と、そこから本社へ入る線）。
 *
 * 原図は左に支店（2枚重ね）、右に本社を並べ、あいだにインターネットと広域イーサ網を置く（縦横比 2.4:1）。
 * 本社の中（図2 は機器が3列に並び、下に VDI サーバ）だけで 340 の幅を使うので、支店を上の段に置き、本社を下に全幅で置いた。
 * 支店の中の2列（左に PC・⋮・PC とプリンタ、右に UTM・L2SW・プリントサーバ）は右へ 90 度回し、
 * 上の段にプリンタ・PC・⋯・PC、下の段にプリントサーバ・L2SW・UTM を並べた。UTM が支店の右下に来るので、
 * インターネットへの線は右へ、広域イーサ網への線は下へ出る（原図の右の辺から出る線を、そのまま回した向き）。
 * 広域イーサ網は支店の UTM の下、インターネットは支店の右に置く。広域イーサ網から本社への線は、楕円の左から
 * 本社の左の縁へ出て下り、L3SW（図2 は帯域制御装置）に左から入る（原図どおり左から入る）。
 * 座標だけを置き、コンポーネントは `H29G12Parts.tsx` に置く（react-refresh/only-export-components のため）。
 */

export type Rect = { x: number; y: number; w: number; h: number }

/** 箱の文字・札の文字の大きさと色（2枚で同じ） */
export const SIZE = 7.5
export const SMALL = 7
export const TEXT = '#334155'

/** 支店の手前の枠。後ろの枠は右下へずらして重ねる（原図どおり。右下の角に「⋱」） */
export const BRANCH: Rect = { x: 4, y: 4, w: 172, h: 96 }
export const BRANCH_STEP = 8

/** 支店の中。上の段は左からプリンタ・PC（L2SW の真上）・⋯・PC（UTM の真上） */
export const B_PRINTER: Rect = { x: 12, y: 24, w: 42, h: 18 }
export const B_PC2: Rect = { x: 82, y: 24, w: 24, h: 18 }
export const B_PC1: Rect = { x: 140, y: 24, w: 24, h: 18 }
/** 上の段の PC のあいだの「⋯」（原図の縦の「⋮」を回したもの） */
export const B_DOTS = { x: 123, y: 36 }
/** 下の段は左からプリントサーバ・L2SW・UTM（中心の高さ 74） */
export const B_PS: Rect = { x: 12, y: 59, w: 42, h: 30 }
export const B_L2: Rect = { x: 76, y: 65, w: 36, h: 18 }
export const B_UTM: Rect = { x: 136, y: 65, w: 32, h: 18 }
export const B_ROW_Y = 74

/** 広域イーサ網（支店の UTM の下）とインターネット（支店の右） */
export const WAN = { cx: 120, cy: 128, rx: 38, ry: 12 }
export const INET = { cx: 236, cy: 74, rx: 40, ry: 12 }

/** 支店から広域イーサ網への2本（手前の UTM の下の辺と、後ろの枠の下の辺から。端は楕円の中） */
export const WAN_LINES: [number, number][][] = [
  [
    [140, B_UTM.y + B_UTM.h],
    [140, 124],
  ],
  [
    [150, BRANCH.y + BRANCH.h + BRANCH_STEP],
    [150, 124],
  ],
]

/** 支店からインターネットへの2本（図1 だけ。手前の UTM の右の辺と、後ろの枠の右の辺から） */
export const INET_LINES: [number, number][][] = [
  [
    [B_UTM.x + B_UTM.w, 70],
    [206, 70],
  ],
  [
    [BRANCH.x + BRANCH.w + BRANCH_STEP, 80],
    [210, 80],
  ],
]

/** 本社の枠の左上と幅（高さは図ごとに違う）。名前は右上 */
export const HQ_X = 2
export const HQ_Y = 146
export const HQ_W = 336

/** 本社の UTM（2枚で同じ位置）と、インターネットからの線 */
export const HQ_UTM: Rect = { x: 134, y: 164, w: 32, h: 18 }
export const INET_TO_UTM: [number, number][] = [
  [218, 84],
  [160, HQ_UTM.y],
]

/** 広域イーサ網から本社へ：楕円の左から本社の左の縁（x 12）へ出て下り、高さ y で右へ曲がって x2 に入る */
export const WAN_X = 12
export const wanPath = (y: number, x2: number): [number, number][] => [
  [100, WAN.cy],
  [WAN_X, WAN.cy],
  [WAN_X, y],
  [x2, y],
]
