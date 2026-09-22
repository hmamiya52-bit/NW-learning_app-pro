import { useId } from 'react'

/**
 * 試験図を自作 SVG で描き直すための共通部品。
 *
 * 色は教科書の構成図（textbook/figures）と同じトーンを使い、アプリ全体で図の見た目を揃える。
 * すべての図はモバイル 375px（表示幅およそ 280px）で読めることを前提に、
 * viewBox 幅 340 を基準に設計する。
 */

export const TONE = {
  emerald: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
  violet: { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  sky: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  blue: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  amber: { fill: '#fffbeb', stroke: '#fbbf24', text: '#92400e' },
  rose: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239' },
  slate: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#334155' },
  white: { fill: '#ffffff', stroke: '#94a3b8', text: '#334155' },
} as const

export type ToneName = keyof typeof TONE

export const LINE = '#94a3b8'
export const FRAME = '#64748b'
export const SEGMENT = '#94a3b8'
export const FLOW = '#a855f7'
export const PEER = '#f59e0b'
export const MUTED = '#64748b'

/**
 * 図中の文字の倍率。
 *
 * 座標（箱の大きさ・線の位置）を触らずに、図の文字だけを一括で大きくするための1本のつまみ。
 * 個々の図が渡す size は「図の中での大小関係」を表し、実際の描画は size * FONT_SCALE になる。
 *
 * 上げすぎると箱から文字がはみ出す。変えたら 4 図すべてで、
 * text の bbox が親の箱と viewBox に収まっているか確かめること。
 */
export const FONT_SCALE = 1.2

/** 同一ページに複数の図が並ぶので、marker の id は図ごとに一意にする */
export function useFigureId(prefix: string) {
  return `${prefix}-${useId().replace(/:/g, '')}`
}
