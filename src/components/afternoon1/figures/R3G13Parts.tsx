import { Box, Cap, Wire } from './primitives'
import { DMZ, DMZ_SRV, FW, HATCH, L2SW0, ROUTER, SIZE, SRV, SRV_ROOM, TEXT } from './r3g13Layout'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE } from './tokens'
import type { ToneName } from './tokens'

/**
 * R3 午後Ⅰ 問3 の図1・図2 で共通の部品
 *
 * 本社のルータ・FW・DMZ・サーバ室は2枚で同じ位置なので、ここに1つだけ持つ（座標は r3g13Layout.ts）。
 * 描く順番（囲み → 線 → 強調の経路・輪 → ノード → 強調の文字）を守れるよう、囲み（HqFrames）・線（HqWires）・
 * 箱（HqNodes）を分けてある。営業所の重ねた枠と、網掛けの箱（PoE 対応製品）もここに置く。
 */

/** 「…」（原図の同じ機器の並びの省略。全角 1em なので、箱のすき間は 16 以上取る） */
export function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="…" anchor="middle" color={MUTED} />
}

/** 斜めの「⋱」（原図の、重ねた営業所の枠の角にある点） */
function DiagDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 2, 4].map((d) => (
        <circle key={d} cx={x + d} cy={y + d} r={0.6} fill={MUTED} />
      ))}
    </g>
  )
}

/**
 * 営業所の枠（原図どおり2枚重ね。前が「営業所1」、後ろが「営業所5」）。
 * 前の枠の名前は下の辺の近く（原図どおり）、後ろの枠の名前は、前の枠からはみ出した下の帯に置く。
 * 角の「⋱」は、前の枠の右上と左下、後ろの枠の右下の3か所（原図どおり）。
 */
export function OfficeFrame({
  x,
  y,
  w,
  h,
  dx,
  dy,
  label1,
  label5,
}: {
  x: number
  y: number
  w: number
  h: number
  /** 後ろの枠のずれ */
  dx: number
  dy: number
  /** 「営業所1」の位置（anchor は middle か start） */
  label1: { x: number; y: number; anchor: 'start' | 'middle' }
  /** 「営業所5」の位置（anchor は middle） */
  label5: { x: number; y: number }
}) {
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <g>
        <rect x={x + dx} y={y + dy} width={w} height={h} fill="#ffffff" stroke={FRAME} strokeWidth={1.3} />
        <text x={label5.x} y={label5.y} textAnchor="middle" fontSize={fs} fill={FRAME}>
          営業所5
        </text>
      </g>
      <g>
        <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={FRAME} strokeWidth={1.3} />
        <text x={label1.x} y={label1.y} textAnchor={label1.anchor} fontSize={fs} fill={FRAME}>
          営業所1
        </text>
      </g>
      <DiagDots x={x + w + 1.5} y={y + 2} />
      <DiagDots x={x + 1.5} y={y + h + 2} />
      <DiagDots x={x + dx + w - 7.5} y={y + h + 3} />
    </g>
  )
}

/** 網掛けの斜線（原図の網掛け＝PoE 対応製品）。id は useFigureId で図ごとに一意にする */
export function HatchPattern({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
      </pattern>
    </defs>
  )
}

/** 網掛けの箱。役割の色の上に斜線を重ね、その上に文字を置く */
export function HatchBox({
  x,
  y,
  w,
  h,
  tone,
  label,
  patternId,
}: {
  x: number
  y: number
  w: number
  h: number
  tone: ToneName
  label: string
  patternId: string
}) {
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={2} fill={`url(#${patternId})`} />
      <text x={x + w / 2} y={y + h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 名前を枠の内側の隅に置く破線の囲み（DMZ は右下、サーバ室は右上。原図どおり） */
function CornerFrame({
  x,
  y,
  w,
  h,
  label,
  corner,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  corner: 'top' | 'bottom'
}) {
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="5 3" />
      <text
        x={x + w - 5}
        y={corner === 'top' ? y + 4 + fs : y + h - 5}
        textAnchor="end"
        fontSize={fs}
        fill={TEXT}
      >
        {label}
      </text>
    </g>
  )
}

/** 本社の右側の囲み（DMZ・サーバ室） */
export function HqFrames() {
  return (
    <g>
      <CornerFrame {...DMZ} label="DMZ" corner="bottom" />
      <CornerFrame {...SRV_ROOM} label="サーバ室" corner="top" />
    </g>
  )
}

/** 本社の右側の線（ルータ―FW、FW―L2SW0、L2SW0―DMZ のサーバ3台） */
export function HqWires() {
  const rx = ROUTER.x + ROUTER.w / 2
  const sy = DMZ_SRV[0].y + DMZ_SRV[0].h
  return (
    <g>
      <Wire x1={rx} y1={ROUTER.y + ROUTER.h} x2={rx} y2={FW.y} />
      <Wire x1={FW.x + FW.w} y1={FW.y + FW.h / 2} x2={L2SW0.x} y2={L2SW0.y + L2SW0.h / 2} />
      {DMZ_SRV.map((b, i) => (
        <Wire key={b.x} x1={L2SW0.x + 9 + i * 10} y1={L2SW0.y} x2={b.x + b.w / 2} y2={sy} />
      ))}
    </g>
  )
}

/** 本社の右側の箱（ルータ・FW・DMZ のサーバと L2SW0・サーバ室のサーバ） */
export function HqNodes() {
  return (
    <g>
      <Box {...ROUTER} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      {DMZ_SRV.map(({ lines, ...b }) => (
        <Box key={lines[0]} {...b} tone="host" lines={lines} size={SIZE} />
      ))}
      <Box {...L2SW0} tone="device" lines={['L2SW0']} size={SIZE} />
      {SRV.map(({ lines, ...b }) => (
        <Box key={lines[0]} {...b} tone="host" lines={lines} size={SIZE} />
      ))}
    </g>
  )
}
