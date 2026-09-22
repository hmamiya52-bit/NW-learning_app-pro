import { TONE, FRAME, LINE, MUTED, SEGMENT } from './tokens'
import type { ToneName } from './tokens'

/** 試験図の描画部品。定数とフックは tokens.ts にある（Fast Refresh のため分離）。 */

/**
 * 図の外枠。width 100% で伸縮し、モバイルでも横スクロールを出さない。
 *
 * ただし上限を付けないと、デスクトップ（図の枠が 640px 前後）で viewBox 幅 340 が
 * 1.9 倍に拡大され、図の文字（9前後）が本文（12-13px）より大きくなって釣り合わない。
 * 1.3 倍で頭打ちにして、図の文字がおよそ 11-12px に収まるようにする。
 */
const MAX_SCALE = 1.3

export function FigSvg({
  w,
  h,
  title,
  children,
}: {
  w: number
  h: number
  title: string
  children: React.ReactNode
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      style={{
        height: 'auto',
        display: 'block',
        maxWidth: Math.round(w * MAX_SCALE),
        margin: '0 auto',
      }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {children}
    </svg>
  )
}

/** 矢頭の定義。figureId でスコープを分ける */
export function ArrowDefs({ figureId, colors }: { figureId: string; colors: string[] }) {
  return (
    <defs>
      {colors.map((c, i) => (
        <marker
          key={i}
          id={`${figureId}-arrow-${i}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={c} />
        </marker>
      ))}
    </defs>
  )
}

/** 装置・ノードの箱 */
export function Box({
  x,
  y,
  w,
  h,
  tone = 'white',
  lines,
  size = 9,
  rx = 2,
}: {
  x: number
  y: number
  w: number
  h: number
  tone?: ToneName
  lines: string[]
  size?: number
  rx?: number
}) {
  const t = TONE[tone]
  const cx = x + w / 2
  const startY = y + h / 2 + size * 0.36 - ((lines.length - 1) * (size + 2.5)) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={size} fontWeight={700} fill={t.text}>
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : size + 2.5}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** AS・ISP・インターネットなどの楕円 */
export function Ell({
  cx,
  cy,
  rx,
  ry,
  tone = 'white',
  lines,
  size = 9,
  rotate,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  tone?: ToneName
  lines: string[]
  size?: number
  rotate?: number
}) {
  const t = TONE[tone]
  const startY = cy + size * 0.36 - ((lines.length - 1) * (size + 2.5)) / 2
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text
        x={cx}
        y={startY}
        textAnchor="middle"
        fontSize={size}
        fontWeight={700}
        fill={t.text}
        transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined}
      >
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : size + 2.5}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** 装置間の接続線 */
export function Wire({
  x1,
  y1,
  x2,
  y2,
  color = LINE,
  width = 1.2,
  dash,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  width?: number
  dash?: string
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} />
  )
}

/** 折れ線（矢印つきにもできる） */
export function Poly({
  points,
  color = LINE,
  width = 1.2,
  dash,
  markerEnd,
  markerStart,
}: {
  points: [number, number][]
  color?: string
  width?: number
  dash?: string
  markerEnd?: string
  markerStart?: string
}) {
  return (
    <polyline
      points={points.map(([x, y]) => `${x},${y}`).join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  )
}

/** 枠外の見出し・補足ラベル */
export function Cap({
  x,
  y,
  text,
  anchor = 'start',
  size = 8.5,
  color = MUTED,
  bold = false,
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
  size?: number
  color?: string
  bold?: boolean
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} fontWeight={bold ? 700 : 400}>
      {text}
    </text>
  )
}

/** 破線の囲み（セグメント・E社CDN など）。ラベルは枠の内側に置く */
export function DashFrame({
  x,
  y,
  w,
  h,
  label,
  labelAnchor = 'start',
  color = SEGMENT,
}: {
  x: number
  y: number
  w: number
  h: number
  label?: string
  labelAnchor?: 'start' | 'end'
  color?: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeDasharray="5 3"
      />
      {label && (
        <Cap
          x={labelAnchor === 'end' ? x + w - 5 : x + 5}
          y={y + 11}
          text={label}
          anchor={labelAnchor}
          color={color}
          bold
        />
      )}
    </g>
  )
}

/** 実線の囲み（D社データセンター・E社POP など） */
export function SolidFrame({
  x,
  y,
  w,
  h,
  label,
  labelAnchor = 'start',
}: {
  x: number
  y: number
  w: number
  h: number
  label?: string
  labelAnchor?: 'start' | 'end'
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      {label && (
        <Cap
          x={labelAnchor === 'end' ? x + w - 6 : x + 6}
          y={y + 12}
          text={label}
          anchor={labelAnchor}
          color={FRAME}
          bold
        />
      )}
    </g>
  )
}

/** 図の下に置く凡例の行 */
export function LegendRow({ children }: { children: React.ReactNode }) {
  return <g>{children}</g>
}
