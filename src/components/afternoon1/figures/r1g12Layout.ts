/**
 * R1 午後Ⅰ 問2 の Web システムの座標（図1 と図3 で共通）
 *
 * 原図は 利用者 → インターネット → FW → Web システム を横一列に並べる（375px では文字が読めない）。
 * 上の段に 利用者・インターネット・FW・内部LAN を置き、下の段の Web システムの中は、FW から下りた所の L2SW から
 * 左へ向かって並べる（図1 は DNS サーバと Web サーバ1、図3 は DNS サーバ・LB・L2SW・Web サーバ1〜8）。
 * 図3 は上に T 社 WAF サービスが加わるので、全体を下へずらす。どちらの図でも同じ機器は同じ横の位置に来る。
 */

type Rect = { x: number; y: number; w: number; h: number }

/** 箱の文字の大きさ（Box の size）。図1・図3 で共通 */
export const SIZE = 7.5
/** IP アドレス・FQDN・回線の名前などの文字色 */
export const TEXT = '#334155'

export function layout(changed: boolean) {
  /** 上の段の基準（図3 は T 社 WAF サービスのぶん下げる） */
  const Y0 = changed ? 26 : 2
  /** 下の段（Web システムの枠）の上辺 */
  const FT = Y0 + 86
  const rect = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h })
  return {
    Y0,
    FT,
    /** Web システムの枠（図1 は原図どおり L2SW とサーバ2台だけを囲む幅） */
    frame: changed ? rect(4, FT, 332, 122) : rect(172, FT, 164, 104),
    waf: rect(66, 2, 80, 18),
    browser: rect(4, Y0 + 15, 42, 30),
    internet: { cx: 106, cy: Y0 + 30, rx: 40, ry: 13 },
    fw: rect(170, Y0 + 20, 32, 20),
    lan: rect(162, Y0 + 56, 48, 18),
    l2swA: rect(290, FT + 36, 36, 20),
    dns: rect(182, FT + 20, 58, 20),
    /** 図1 の Web サーバ1（図3 では同じ所に LB が来る） */
    web1: rect(182, FT + 64, 58, 20),
    lb: rect(200, FT + 64, 40, 20),
    l2swB: rect(120, FT + 64, 36, 20),
    srv1: rect(10, FT + 44, 60, 20),
    srv8: rect(10, FT + 90, 60, 20),
  }
}
