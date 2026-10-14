import { Cap } from './primitives'
import { FONT_SCALE, FRAME, SEGMENT } from './tokens'

/**
 * R7 午後Ⅰ 問3 の図1・図2 で共通に使う部品。
 *
 * 2枚は J 社の中の並び（DMZ・FW と L3SW・サーバセグメント・内部セグメント）が同じだが、図2 は箱の名前に (A)〜(M) が付き、
 * 箱の大きさも変わるので、下絵は共有せず、囲みと「⋯」だけを部品にした（R3-G1-1 の `R3G11Parts.tsx` と同じ考え方）。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'

type Rect = { x: number; y: number; w: number; h: number }

/**
 * 名前を枠の内側の左上に置く囲み。名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする。
 * 名前を2行にするとき（図2 の「サーバ／セグメント」）は、ベースラインを 13.5 離す（§5.4）。
 */
export function Frame({ rect, lines, dashed = false }: { rect: Rect; lines: string[]; dashed?: boolean }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={dashed ? SEGMENT : FRAME}
        strokeWidth={dashed ? 1.1 : 1.3}
        strokeDasharray={dashed ? '5 3' : undefined}
      />
      <text x={x + 4} y={y + 3.5 + fs} fontSize={fs} fill={TEXT}>
        {lines.map((ln, i) => (
          <tspan key={i} x={x + 4} dy={i === 0 ? 0 : 13.5}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** 組のあいだの「⋯」（y はベースライン） */
export function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}
