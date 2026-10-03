/**
 * R3 午後Ⅰ 問2 の図1・図2 で共通の座標
 *
 * 図2（統合後）は、図1（D 社の現行）の下に E 社を足し、OSPF エリアの網掛けとフロア間接続の破線を重ねた図。
 * 同じ機器が2枚で同じ位置に来るよう、座標をここに1か所だけ置く（下絵は R3G12Base.tsx）。
 *
 * 原図は 支社1〜3 と G 社 VPC を上の段に横に並べ、下の段に本社（図2 は E 社と本社）を置く。
 * 340 の幅では上の段に4つ入らないので、上の段を支社1〜3 だけにし、G 社 VPC とインターネットを
 * 広域イーサ網の右に下ろした。図2 の E 社は本社の下に置き、フロア間接続の破線は左の端を下りる。
 */

export const SIZE = 7.5
/** アドレス・凡例・OSPF エリアの名前の文字 */
export const SMALL = 7
export const TEXT = '#334155'
/** OSPF エリアの網掛け（原図の灰色の範囲。役割の色ではない） */
export const AREA = '#e8ecf1'

/** 支社1〜3 の枠（左端の x） */
export const BR_X = [2, 117, 232] as const
export const BR = { y: 4, w: 106, h: 112 }

/** 支社の枠の中の並び。x0 は枠の左端 */
export function branch(x0: number) {
  return {
    pc: [
      { x: x0 + 12, y: 26, w: 30, h: 18 },
      { x: x0 + 64, y: 26, w: 30, h: 18 },
    ],
    sw: [
      { x: x0 + 7, y: 54, w: 40, h: 18 },
      { x: x0 + 59, y: 54, w: 40, h: 18 },
    ],
    l3: { x: x0 + 32, y: 90, w: 42, h: 18 },
  }
}

/** 広域イーサ網 */
export const WAN = { cx: 132, cy: 140, rx: 80, ry: 13 }

/** G 社 VPC（雲）と中の機器 */
export const VPC = { x: 246, y: 122, w: 92, h: 78 }
export const VSRV = { x: 294, y: 128, w: 32, h: 30 }
export const BUS = { y: 168, x1: 252, x2: 332, gw: 275, srv: 310 }
export const VPCGW = { x: 252, y: 184, w: 46, h: 18 }
export const INET = { cx: 275, cy: 228, rx: 34, ry: 11 }

/** 本社 */
export const HQ = { x: 30, y: 262, w: 308 }
export const ROUTER = { x: 116, y: 282, w: 32, h: 18 }
export const FW = { x: 260, y: 282, w: 30, h: 18 }

/**
 * 本社と E 社の LAN の並び（横長の L2SW、L3SW 2台、L2SW 4台、PC）。y0 は横長の L2SW の上端。
 * 本社は L2SW7・L3SW4・L3SW5・L2SW8〜11、E 社は L2SW12・L3SW6・L3SW7・L2SW13〜16。
 */
export function lan(y0: number, wide: boolean) {
  const swW = wide ? 46 : 40
  const cx = [70, 130, 229, 289]
  return {
    bar: { x: 40, y: y0, w: 288, h: 18 },
    l3: [
      { x: 79, y: y0 + 32, w: 42, h: 18 },
      { x: 237, y: y0 + 32, w: 42, h: 18 },
    ],
    cx,
    sw: cx.map((c, i) => ({ x: c - (i < 2 ? swW : 46) / 2, y: y0 + 72, w: i < 2 ? swW : 46, h: 18 })),
    pc: cx.map((c) => ({ x: c - 15, y: y0 + 100, w: 30, h: 18 })),
  }
}

/** 本社の LAN（L2SW7 の上端） */
export const HQ_LAN = 314
/** E 社の枠と LAN（L2SW12 の上端） */
export const ESHA = { x: 30, y: 466, w: 308, h: 164 }
export const E_LAN = 490

/** フロア間接続（支社1 の L3SW1 の左から左の端を下り、E 社の L3SW6 の左へ） */
export const FLOOR_LINK: [number, number][] = [
  [34, 99],
  [14, 99],
  [14, 531],
  [79, 531],
]
