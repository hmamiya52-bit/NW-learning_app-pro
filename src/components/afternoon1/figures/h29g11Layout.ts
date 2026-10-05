/**
 * H29 午後Ⅰ 問1 の図1・図2 で共通の座標（上の段のインターネットと顧客3社）。
 *
 * 原図は左に顧客3社（E 社が手前、F 社・G 社が奥）、右に H 社を並べる。H 社の下の段（各社のサーバ機器と開発 LAN）だけで
 * 340 の幅をほぼ使い切るので、インターネットと顧客3社を上の段に置き、H 社を下に全幅で置いた。顧客 E 社の中の縦の列
 * （ルータから PC まで）は左へ 90 度回して横に並べ、インターネットからの線は左から入れる。2枚とも同じ位置にする。
 * 座標だけを置き、コンポーネントは置かない（react-refresh/only-export-components のため）。
 */

export type Rect = { x: number; y: number; w: number; h: number }

/** 上の段の左のインターネット */
export const INET = { cx: 60, cy: 24, rx: 56, ry: 14 }

/** 手前の顧客 E 社の枠。F 社・G 社は右上へずらして奥に重ねる（名前は上の帯に出る） */
export const CUST_E: Rect = { x: 120, y: 40, w: 208, h: 82 }
export const CUST_STEP = { dx: 5, dy: -16 }

/** k=0 が E 社、1 が F 社、2 が G 社 */
export const custFrame = (k: number): Rect => ({
  x: CUST_E.x + CUST_STEP.dx * k,
  y: CUST_E.y + CUST_STEP.dy * k,
  w: CUST_E.w,
  h: CUST_E.h,
})

/** 顧客 E 社の中の横の列の高さ（中心）と、インターネットから入る線 */
export const CUST_ROW_Y = 67

/** インターネットから顧客3社への線（奥の G 社が上、手前の E 社が下。E 社はルータまで延ばす） */
export const custLines = (routerX: number): [number, number][][] => [
  [
    [110, 18],
    [CUST_E.x + 2 * CUST_STEP.dx, CUST_E.y + 2 * CUST_STEP.dy + 7],
  ],
  [
    [114, 28],
    [CUST_E.x + CUST_STEP.dx, CUST_E.y + CUST_STEP.dy + 7],
  ],
  [
    [100, 34],
    [CUST_E.x, CUST_ROW_Y],
    [routerX, CUST_ROW_Y],
  ],
]

/** H 社の下の段の3社の列（左端の x）。サブネットの札（size 7 で 70.6）が入る幅にする */
export const NET_XS = [14, 94, 174]
export const NET_W = 76
