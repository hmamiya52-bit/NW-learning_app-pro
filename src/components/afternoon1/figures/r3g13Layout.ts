/**
 * R3 午後Ⅰ 問3 の図1・図2 で共通の座標
 *
 * 原図は 営業所 → 広域イーサ網 → 本社 の横一列（およそ 2.6:1）で、340 の幅には入らない。
 * 営業所を上に、公衆電話網と広域イーサ網を真ん中の段に、本社を下に積んだ。
 * 本社のうち、ルータ・FW・DMZ・サーバ室・L2SW01・L2SW02 は2枚で同じ位置に置く（ここで共有する）。
 * 図ごとに違うもの（図1 の PBX・IP-GW・TEL、図2 の IPsec ルータ・ITEL・ポートの記号、L3SW0 の形）は各図に置く。
 */

export const SIZE = 7.5
/** 凡例の文字 */
export const SMALL = 7
export const TEXT = '#334155'
/** 網掛けの斜線の色（原図の網掛け＝PoE 対応製品。役割の色ではない） */
export const HATCH = '#94a3b8'

/** 本社の枠の上端（2枚で同じ） */
export const HQ_Y = 250
/** 真ん中の段の楕円（公衆電話網・広域イーサ網）の中心の高さ */
export const MID_CY = 230
/** インターネット（2枚で同じ位置。真下にルータ） */
export const INET = { cx: 210, cy: 20, rx: 34, ry: 11 }

/** ルータ・FW */
export const ROUTER = { x: 186, y: 266, w: 30, h: 18 }
export const FW = { x: 186, y: 308, w: 30, h: 18 }

/** DMZ（右上。サーバ3台の下に L2SW0） */
export const DMZ = { x: 222, y: 258, w: 114, h: 84 }
export const DMZ_SRV = [
  { x: 225, y: 264, w: 31, h: 30, lines: ['Web', 'サーバ'] },
  { x: 260, y: 264, w: 31, h: 30, lines: ['DNS', 'サーバ'] },
  { x: 295, y: 264, w: 38, h: 30, lines: ['プロキシ', 'サーバ'] },
]
export const L2SW0 = { x: 255, y: 308, w: 40, h: 18 }

/** サーバ室（DMZ の下。サーバ3台を縦に並べる） */
export const SRV_ROOM = { x: 222, y: 350, w: 114, h: 114 }
export const SRV = [
  { x: 238, y: 358, w: 36, h: 30, lines: ['ファイル', 'サーバ'] },
  { x: 238, y: 392, w: 36, h: 30, lines: ['業務', 'サーバ'] },
  { x: 238, y: 426, w: 36, h: 30, lines: ['eLN', 'サーバ'] },
]

/** 本社の L2SW02（左）・L2SW01（右）。PC・ITEL はこの中心の左右に置く */
export const L2SW02 = { x: 37, y: 398, w: 46, h: 18 }
export const L2SW01 = { x: 117, y: 398, w: 46, h: 18 }
/** L2SW02・L2SW01 の中心 */
export const LAN_CX = [60, 140] as const
/** L2SW の下の段の上端（図1 は PC、図2 は ITEL） */
export const LAN_ROW1 = 432
