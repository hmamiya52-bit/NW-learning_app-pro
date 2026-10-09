/**
 * H30 午後Ⅰ 問3 の図1・図2 で共通の定数と、業務サーバの重ね書きへの線の計算。
 * 2枚は機器の並びが違う（図1 は専用線とルータ1〜3、図2 は IP-VPN・インターネット・FW2・FW3）ので座標は各図に置き、
 * ここには大きさと色、部品が使う計算だけを置く（react-refresh/only-export-components のため、部品は `H30G13Parts.tsx`）。
 */

export type Rect = { x: number; y: number; w: number; h: number }
export type Pt = [number, number]

/** 箱の文字・札の文字の大きさと色（2枚で同じ） */
export const SIZE = 7.5
export const SMALL = 7
export const TEXT = '#334155'
export const HATCH = '#94a3b8'

/** 業務サーバの重ね書き（原図は3枚。後ろの枚は右上へ STACK_STEP ずつずらす） */
export const STACK_STEP = 4
export const STACK_BEHIND = 2

/**
 * L3SW から業務サーバの3枚へ下ろす縦の線（原図どおり、左から手前・2枚目・3枚目の箱の上辺へ）。
 * front は手前の箱、fromY は L3SW の下辺。
 */
export function stackFeeds(front: Rect, fromY: number): Pt[][] {
  return [0, 1, 2].map((k) => [
    [front.x + 8 + STACK_STEP * k, fromY],
    [front.x + 8 + STACK_STEP * k, front.y - STACK_STEP * k],
  ])
}
