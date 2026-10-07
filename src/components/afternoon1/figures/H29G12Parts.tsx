import { Box, Cap, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED } from './tokens'
import { B_DOTS, B_L2, B_PC1, B_PC2, B_PRINTER, B_PS, B_ROW_Y, B_UTM, BRANCH, BRANCH_STEP, SIZE, SMALL, TEXT } from './h29g12Layout'
import type { Rect } from './h29g12Layout'

/**
 * H29 午後Ⅰ 問2 の図1・図2 で共通の部品（支店の枠と中の機器、名前を枠の内側に置く囲み、重ねた枠の角の点）。
 * 座標は `h29g12Layout.ts`。支店の中は2枚で同じ並びで、端末の名前だけが違う（図1 は PC、図2 は TC）。
 * 各図が「囲み → 線 → 強調 → 箱」の順に並べられるよう、枠（BranchFrames）・線（BranchWires）・箱（BranchNodes）に分けてある。
 */

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 名前を枠の内側の左上か右上に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
export function Frame({ rect, label, at, fill = 'none' }: { rect: Rect; label?: string; at: 'tl' | 'tr'; fill?: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={FRAME} strokeWidth={1.3} />
      {label && (
        <text x={at === 'tl' ? x + 4 : x + w - 4} y={y + 3.5 + fs} textAnchor={at === 'tl' ? 'start' : 'end'} fontSize={fs} fill={TEXT}>
          {label}
        </text>
      )}
    </g>
  )
}

/** 斜めの点3つ（重ねた枠の角の「⋱」）。(x1, y1) から (x2, y2) までの対角線の上に並べる */
export function DiagDots({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      {[0.25, 0.5, 0.75].map((r) => (
        <circle key={r} cx={x1 + (x2 - x1) * r} cy={y1 + (y2 - y1) * r} r={0.7} fill={MUTED} />
      ))}
    </g>
  )
}

/** 支店の枠（2枚重ね。後ろの枠を白で塗って先に描き、手前の枠を白で重ねる。右下の角に「⋱」） */
export function BranchFrames() {
  const d = BRANCH_STEP
  return (
    <g>
      <rect x={BRANCH.x + d} y={BRANCH.y + d} width={BRANCH.w} height={BRANCH.h} fill="#ffffff" stroke={FRAME} strokeWidth={1.3} />
      <Frame rect={BRANCH} label="支店（各支店の従業員40人）" at="tl" fill="#ffffff" />
      <DiagDots x1={BRANCH.x + BRANCH.w} y1={bottom(BRANCH)} x2={BRANCH.x + BRANCH.w + d} y2={bottom(BRANCH) + d} />
    </g>
  )
}

/** 支店の中の線（プリンタとプリントサーバの USB は原図どおり太線） */
export function BranchWires() {
  return (
    <g>
      <Wire x1={mid(B_PC2)} y1={bottom(B_PC2)} x2={mid(B_L2)} y2={B_L2.y} />
      <Wire x1={B_PC1.x + 4} y1={bottom(B_PC1)} x2={B_L2.x + B_L2.w - 4} y2={B_L2.y} />
      <Wire x1={B_L2.x + B_L2.w} y1={B_ROW_Y} x2={B_UTM.x} y2={B_ROW_Y} />
      <Wire x1={B_PS.x + B_PS.w} y1={B_ROW_Y} x2={B_L2.x} y2={B_ROW_Y} />
      <Wire x1={mid(B_PRINTER)} y1={bottom(B_PRINTER)} x2={mid(B_PS)} y2={B_PS.y} width={3} />
    </g>
  )
}

/** 支店の中の機器（term は端末の名前。図1 は PC、図2 は TC） */
export function BranchNodes({ term }: { term: 'PC' | 'TC' }) {
  return (
    <g>
      <Box {...B_PRINTER} tone="host" lines={['プリンタ']} size={SIZE} />
      <Box {...B_PC2} tone="host" lines={[term]} size={SIZE} />
      <Box {...B_PC1} tone="host" lines={[term]} size={SIZE} />
      <Cap x={B_DOTS.x} y={B_DOTS.y} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
      <Box {...B_PS} tone="host" lines={['プリント', 'サーバ']} size={SIZE} />
      <Box {...B_L2} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...B_UTM} tone="device" lines={['UTM']} size={SIZE} />
    </g>
  )
}
