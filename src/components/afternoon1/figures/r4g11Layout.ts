/**
 * R4 午後Ⅰ 問1 の A 社ネットワークの座標（図1 と図2 で共通）
 *
 * 図2（ベンダが提案した構成）は、図1（現状）に FTA・NPB・可視化サーバ・キャプチャサーバを足した図なので、
 * 座標を1か所に置いて両方から参照する。ここを直せば2枚とも同じように動く。
 *
 * 原図は 工場（左）と 事務所（右）を横に並べ、インターネットを上に置く（縦横比およそ 2.2:1）。
 * そのままでは箱の文字が入らないので、事務所を上、工場を下に積んだ。
 * 図2 で工場から事務所へ渡る線（FTA → OA の L2SW、NPB → 可視化サーバ・キャプチャサーバ）が交わらないよう、
 *   - 事務所の FW と OA の L2SW を真ん中に寄せ、可視化サーバとキャプチャサーバを OA の左下に置く
 *   - 工場の NPB を制御セグメントの L2SW の上に、FTA を管理セグメントの左上に置く
 * 左右の並び（制御セグメントが左で管理セグメントが右、FW の右に DMZ、OA の L2SW の右にサーバの列）は原図どおり。
 */

type Rect = { x: number; y: number; w: number; h: number }

/** 箱の文字の大きさ（Box の size） */
export const SIZE = 7.5
/** 凡例の文字の大きさ */
export const SMALL = 7
/** 囲みのラベルの色 */
export const TEXT = '#334155'
/** 網掛けの斜線の色 */
export const HATCH = '#94a3b8'

export const INET = { cx: 164, cy: 15, rx: 36, ry: 11 }

/* ── 事務所 ─────────────────────────────────────── */
export const OFFICE: Rect = { x: 2, y: 32, w: 336, h: 251 }
export const FW: Rect = { x: 150, y: 49, w: 28, h: 18 }
export const DMZ: Rect = { x: 192, y: 38, w: 142, h: 79 }
export const DMZ_SW: Rect = { x: 202, y: 49, w: 36, h: 18 }
export const EXT_MAIL: Rect = { x: 274, y: 43, w: 52, h: 30 }
export const PROXY: Rect = { x: 274, y: 81, w: 38, h: 30 }
export const OA: Rect = { x: 6, y: 124, w: 328, h: 138 }
export const OA_SW: Rect = { x: 146, y: 136, w: 36, h: 18 }
export const INT_MAIL: Rect = { x: 274, y: 130, w: 52, h: 30 }
export const LDAP: Rect = { x: 290, y: 166, w: 36, h: 30 }
export const PC1: Rect = { x: 302, y: 202, w: 24, h: 18 }
export const PC2: Rect = { x: 302, y: 238, w: 24, h: 18 }
/** 図2 で足す可視化サーバ・キャプチャサーバ */
export const VIS: Rect = { x: 76, y: 210, w: 36, h: 30 }
export const CAP: Rect = { x: 120, y: 210, w: 44, h: 30 }

/* ── 工場 ───────────────────────────────────────── */
export const FACTORY: Rect = { x: 2, y: 292, w: 336, h: 173 }
export const CTRL_SEG: Rect = { x: 6, y: 298, w: 154, h: 149 }
export const MGMT_SEG: Rect = { x: 174, y: 298, w: 160, h: 149 }
export const CTRL1: Rect = { x: 18, y: 306, w: 52, h: 18 }
export const CTRL2: Rect = { x: 18, y: 380, w: 52, h: 18 }
/** 重ね書きの前の箱（後ろの箱は STACK だけ右下にずらす） */
export const SENSOR: Rect = { x: 12, y: 340, w: 32, h: 18 }
export const MACHINE: Rect = { x: 12, y: 414, w: 46, h: 18 }
export const STACK = { dx: 10, dy: 7 }
export const CTRL_SW: Rect = { x: 90, y: 343, w: 36, h: 18 }
/** 制御サーバ（制御セグメントの右の辺と管理セグメントの左の辺にまたがる） */
export const CTRL_SRV: Rect = { x: 150, y: 337, w: 34, h: 30 }
export const MGMT_SW: Rect = { x: 229, y: 343, w: 36, h: 18 }
export const OPE: Rect = { x: 224, y: 314, w: 46, h: 18 }
export const HIST: Rect = { x: 278, y: 302, w: 50, h: 30 }
/** 図2 で足す NPB・FTA */
export const NPB: Rect = { x: 93, y: 306, w: 30, h: 18 }
export const FTA: Rect = { x: 186, y: 314, w: 30, h: 18 }

/* ── 線の端（図2 の工場から事務所へ渡る線） ───────────── */
/** FTA の上辺 → OA の L2SW の下辺 */
export const FTA_UP: [number, number][] = [
  [201, 314],
  [176, 154],
]
/** NPB の上辺 → 可視化サーバ・キャプチャサーバの下辺 */
export const NPB_TO_VIS: [number, number][] = [
  [100, 306],
  [94, 240],
]
export const NPB_TO_CAP: [number, number][] = [
  [116, 306],
  [142, 240],
]
