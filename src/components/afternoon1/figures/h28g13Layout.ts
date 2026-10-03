/**
 * H28 午後Ⅰ 問3 の D 社ネットワークの座標（図1 と図3 で共通）
 *
 * 図3（移行中 NW）は、図1（現行 NW）の MSV を旧 MSV と呼び替え、新 MSV 2台と共用ストレージを
 * 下に足した図なので、座標を1か所に置いて両方から参照する。ここを直せば2枚とも同じように動く。
 *
 * 原図の並び（左にストレージと MSV・LDAP、中央に DNS・ルータ・FW・L3SW・PC、右に DMZ）は
 * 340 の幅にそのまま入るので、組み直していない。
 */

type Rect = { x: number; y: number; w: number; h: number }

/** 箱の文字の大きさ（Box の size）。図1〜図3 で共通 */
export const SIZE = 7.5

export const D: Record<string, Rect> = {
  router: { x: 180, y: 38, w: 34, h: 20 },
  fw: { x: 180, y: 68, w: 34, h: 20 },
  l3sw: { x: 176, y: 98, w: 42, h: 20 },
  dns1: { x: 86, y: 38, w: 40, h: 20 },
  dns2: { x: 132, y: 38, w: 40, h: 20 },
  ldap: { x: 66, y: 68, w: 46, h: 20 },

  /** DMZ（破線の囲み）と、その中の機器 */
  dmz: { x: 228, y: 32, w: 108, h: 92 },
  sw: { x: 238, y: 68, w: 32, h: 20 },
  dns3: { x: 290, y: 40, w: 42, h: 20 },
  mgw1: { x: 290, y: 68, w: 42, h: 20 },
  mgw2: { x: 290, y: 96, w: 42, h: 20 },

  /** MSV1〜3 とストレージ（原図どおり MSV2 は縦の点で省略） */
  storage1: { x: 4, y: 98, w: 56, h: 20 },
  msv1: { x: 66, y: 98, w: 46, h: 20 },
  storage3: { x: 4, y: 142, w: 56, h: 20 },
  msv3: { x: 66, y: 142, w: 46, h: 20 },

  /** PC … PC（「…」は全角 1em なので、すき間を 16 取る） */
  pc1: { x: 158, y: 142, w: 32, h: 20 },
  pc2: { x: 206, y: 142, w: 32, h: 20 },

  /** 図3 だけにある新 MSV と共用ストレージ */
  newMsv1: { x: 66, y: 168, w: 46, h: 20 },
  newMsv2: { x: 66, y: 194, w: 46, h: 20 },
  shared: { x: 4, y: 168, w: 56, h: 46 },
}

/** インターネット（ルータの真上の横長の楕円） */
export const INTERNET = { cx: 197, cy: 16, rx: 40, ry: 12 }

/** L3SW の左の縁。左側の機器（DNS1・DNS2・LDAP・MSV）からの線がここに集まる（原図どおり放射状） */
export const HUB: [number, number] = [178, 108]

/** 箱の右の縁の真ん中（L3SW へ向かう線の出どころ） */
export function rightMid(r: Rect): [number, number] {
  return [r.x + r.w, r.y + r.h / 2]
}
