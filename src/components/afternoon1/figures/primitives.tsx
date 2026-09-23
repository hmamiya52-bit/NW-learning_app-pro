import {
  TONE,
  FONT_SCALE,
  FRAME,
  LINE,
  MARK,
  MARK_FILL,
  MARK_TEXT,
  MUTED,
  SEGMENT,
  estimateWidth,
} from './tokens'
import type { ToneName } from './tokens'

/** 試験図の描画部品。定数とフックは tokens.ts にある（Fast Refresh のため分離）。 */

/**
 * 図の外枠。width 100% で伸縮し、モバイルでも横スクロールを出さない。
 *
 * ただし上限を付けないと、デスクトップ（図の枠が 640px 前後）で viewBox 幅 340 が
 * 1.9 倍に拡大され、図の文字（9前後）が本文（12-13px）より大きくなって釣り合わない。
 * 1.2 倍で頭打ちにして、図の文字がおよそ 11-12px に収まるようにする（FONT_SCALE と対で調整する）。
 */
const MAX_SCALE = 1.2

/**
 * 文字を箱・楕円の中央に置くための、ベースラインの下げ量（フォントサイズ比）。
 * 文字の視覚的な中心はベースラインより上にあるので、その差の半分だけ下げる。
 * 0.36 だと上に寄りすぎて、2行ラベルが箱の上辺に触っていた（実測から 0.44）。
 */
const BASELINE = 0.44

/** 囲み（DashFrame / SolidFrame）のラベルの既定サイズ。ラベル位置の計算にも使う */
const LABEL_SIZE = 8.5

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
  tone,
  lines,
  size = 9,
  rx = 2,
}: {
  x: number
  y: number
  w: number
  h: number
  /** 役割で選ぶ。見た目の好みで選ばない（tokens.ts の TONE を読むこと） */
  tone: ToneName
  lines: string[]
  size?: number
  rx?: number
}) {
  const t = TONE[tone]
  const cx = x + w / 2
  const fs = size * FONT_SCALE
  const lh = fs + 2.5
  const startY = y + h / 2 + fs * BASELINE - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
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
  tone,
  lines,
  size = 9,
  rotate,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  /** 役割で選ぶ。見た目の好みで選ばない（tokens.ts の TONE を読むこと） */
  tone: ToneName
  lines: string[]
  size?: number
  rotate?: number
}) {
  const t = TONE[tone]
  const fs = size * FONT_SCALE
  const lh = fs + 2.5
  const startY = cy + fs * BASELINE - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text
        x={cx}
        y={startY}
        textAnchor="middle"
        fontSize={fs}
        fontWeight={700}
        fill={t.text}
        transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined}
      >
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
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
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size * FONT_SCALE}
      fill={color}
      fontWeight={bold ? 700 : 400}
    >
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
          y={y + 3 + LABEL_SIZE * FONT_SCALE * 1.12}
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
          y={y + 4 + LABEL_SIZE * FONT_SCALE * 1.12}
          text={label}
          anchor={labelAnchor}
          color={FRAME}
          bold
        />
      )}
    </g>
  )
}

/* ────────────────────────────────────────────────────────────────
 * 強調（解説を開いたときだけ重ねる書き込み）
 *
 * 原則: **図がもともと持っている文字を絶対に隠さない**。
 *   - Route と Ring はノードより先に描く。箱・楕円が後から上に乗るので、
 *     中の文字に重なりようがない
 *   - RouteTag と Callout は文字を持つので、空いている場所にしか置けない。
 *     置いたら §5.4 の実測で、既存の text の bbox と重なっていないことを確かめる
 * ──────────────────────────────────────────────────────────────── */

/**
 * 強調したい経路。**ノードより先に**描くこと（後からノードが上に乗り、ラベルを隠さない）。
 * 既存の細い接続線の上をなぞる形になる。
 */
export function Route({
  points,
  width = 4,
  dash,
  soft = false,
}: {
  points: [number, number][]
  width?: number
  dash?: string
  /** 対比のために「こちらではない方」を描くとき。細く薄くする */
  soft?: boolean
}) {
  return (
    <polyline
      points={points.map(([x, y]) => `${x},${y}`).join(' ')}
      fill="none"
      stroke={MARK}
      strokeWidth={soft ? width * 0.6 : width}
      strokeDasharray={dash}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={soft ? 0.45 : 0.85}
    />
  )
}

/** 箱を囲む強調の輪。**箱より先に**描く（箱が上に乗るので中の文字は無傷） */
export function Ring({
  x,
  y,
  w,
  h,
  rx = 2,
  pad = 3.5,
}: {
  x: number
  y: number
  w: number
  h: number
  rx?: number
  pad?: number
}) {
  return (
    <rect
      x={x - pad}
      y={y - pad}
      width={w + pad * 2}
      height={h + pad * 2}
      rx={rx + pad}
      fill={MARK_FILL}
      stroke={MARK}
      strokeWidth={1.6}
    />
  )
}

/** 楕円を囲む強調の輪。**楕円より先に**描く */
export function RingEll({
  cx,
  cy,
  rx,
  ry,
  pad = 3.5,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  pad?: number
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx + pad}
      ry={ry + pad}
      fill={MARK_FILL}
      stroke={MARK}
      strokeWidth={1.6}
    />
  )
}

/**
 * 経路の上に置く小さな札。線だけを隠すので、図中の文字には触れない。
 * cx・cy は札の中心。w を省くと文字数から見積もる（全角1.0em／半角0.55em）。
 */
export function RouteTag({
  cx,
  cy,
  text,
  size = 7.5,
  w,
}: {
  cx: number
  cy: number
  text: string
  size?: number
  w?: number
}) {
  const fs = size * FONT_SCALE
  const width = w ?? estimateWidth(text, fs) + 7
  const height = fs + 6
  return (
    <g>
      <rect
        x={cx - width / 2}
        y={cy - height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill={MARK_FILL}
        stroke={MARK}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + fs * 0.36}
        textAnchor="middle"
        fontSize={fs}
        fontWeight={700}
        fill={MARK_TEXT}
      >
        {text}
      </text>
    </g>
  )
}

/**
 * 吹き出し。x・y は左上。**空いている場所にしか置かないこと**（図中の文字を隠さない）。
 * leader は吹き出しから対象へ引く線で、最後の点に小さな丸が付く。
 */
export function Callout({
  x,
  y,
  w,
  lines,
  size = 7.5,
  leader,
}: {
  x: number
  y: number
  w: number
  lines: string[]
  size?: number
  leader?: [number, number][]
}) {
  const fs = size * FONT_SCALE
  const lh = fs + 2.8
  const h = lines.length * lh + 7
  const tip = leader?.[leader.length - 1]
  return (
    <g>
      {leader && leader.length >= 2 && (
        <polyline
          points={leader.map(([px, py]) => `${px},${py}`).join(' ')}
          fill="none"
          stroke={MARK}
          strokeWidth={1.1}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={MARK_FILL}
        stroke={MARK}
        strokeWidth={1.2}
      />
      <text x={x + 5} y={y + 5 + fs} fontSize={fs} fontWeight={700} fill={MARK_TEXT}>
        {lines.map((ln, i) => (
          <tspan key={i} x={x + 5} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
      {tip && <circle cx={tip[0]} cy={tip[1]} r={2} fill={MARK} />}
    </g>
  )
}
