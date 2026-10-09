import { Box, Cap } from './primitives'
import { HATCH, SIZE, SMALL, STACK_BEHIND, STACK_STEP, TEXT } from './h30g13Layout'
import type { Rect } from './h30g13Layout'
import { FONT_SCALE, FRAME, SEGMENT, TONE } from './tokens'
import type { ToneName } from './tokens'

/**
 * H30 午後Ⅰ 問3 の図1・図2 で共通の部品（拠点の枠、DMZ の点線の枠、業務サーバの重ね書き、網掛けの箱、PC の組の「⋯」）。
 * 座標は各図に置き、大きさと色は `h30g13Layout.ts` にある。
 */

/** 名前を枠の内側の左上か右上に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
export function Frame({ rect, label, at = 'tl', labelX }: { rect: Rect; label: string; at?: 'tl' | 'tr'; labelX?: number }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  const tx = labelX ?? (at === 'tl' ? x + 4 : x + w - 4)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={tx} y={y + 3.5 + fs} textAnchor={labelX === undefined && at === 'tr' ? 'end' : 'start'} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** DMZ の点線の枠（原図の点線。名前は左上） */
export function DmzFrame({ rect }: { rect: Rect }) {
  const { x, y, w, h } = rect
  const fs = SMALL * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="1.5 2" />
      <text x={x + 3.5} y={y + 3 + fs} fontSize={fs} fill={TEXT}>
        DMZ
      </text>
    </g>
  )
}

/** 業務サーバの重ね書き（3枚。後ろの2枚を右上へずらして先に描き、手前の箱に名前を書く） */
export function ServerStack({ front }: { front: Rect }) {
  const t = TONE.host
  return (
    <g>
      <g>
        {Array.from({ length: STACK_BEHIND }, (_, i) => STACK_BEHIND - i).map((k) => (
          <rect
            key={k}
            x={front.x + STACK_STEP * k}
            y={front.y - STACK_STEP * k}
            width={front.w}
            height={front.h}
            rx={2}
            fill={t.fill}
            stroke={t.stroke}
            strokeWidth={1.2}
          />
        ))}
      </g>
      <Box {...front} tone="host" lines={['業務', 'サーバ']} size={SIZE} />
    </g>
  )
}

/** 網掛けの箱（原図の、追加された機器）。役割の色の上に斜線を重ね、その上に文字を置く */
export function HatchBox({ rect, tone, label, patternId }: { rect: Rect; tone: ToneName; label: string; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.8} y={y + 0.8} width={w - 1.6} height={h - 1.6} rx={2} fill={`url(#${patternId})`} />
      <text x={x + w / 2} y={y + h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 網掛けの斜線の模様（id は図ごとに `useFigureId` で作って渡す） */
export function HatchPattern({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
      </pattern>
    </defs>
  )
}

/** PC の組のあいだの「⋯」 */
export function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}
