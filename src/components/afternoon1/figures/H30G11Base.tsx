import type { ReactNode } from 'react'
import { Box, Cap, Ell, Poly, Wire } from './primitives'
import {
  A_Y,
  B_Y,
  BR,
  BR_IPSEC,
  BR_L2,
  BR_L2_TO_PC,
  BR_LINES,
  BR_PC,
  BR_RT_TO_L2,
  BR_SDWAN,
  BR_STEP,
  CTRL,
  DMZ1,
  DMZ2,
  DMZ_SW,
  FW,
  GW,
  HATCH,
  HQ,
  HQ_IPSEC,
  HQ_L2,
  HQ_L2_TO_PC,
  HQ_L3_TO_L2,
  HQ_PC,
  HQ_SDWAN,
  HQ_UP,
  INET,
  INET_TO_FW,
  L3,
  PROXY,
  RETIRE_FILL,
  ROW_Y,
  SAAS,
  SAAS_SRV,
  SIZE,
  SMALL,
  TEXT,
  TRIP,
  TRIP_PC,
} from './h30g11Layout'
import type { Rect } from './h30g11Layout'
import { FONT_SCALE, FRAME, SEGMENT, TONE, useFigureId } from './tokens'
import type { ToneName } from './tokens'

/**
 * F 社のネットワーク構成（H30 午後Ⅰ 問1 の図1・図2 で共通の下絵）
 *
 * 図2 は図1 から、グループウェアサーバを外し、本社と営業所の IPsec ルータを SD-WAN ルータに替え、SD-WAN コントローラを足した図。
 * 下絵をここに1つだけ持ち、`sdwan` で出し分ける。座標は h30g11Layout.ts にあり、2枚が必ず同じ形になる。
 *
 * 色は役割だけで決めている。FW・L2SW・L3SW・IPsec ルータ・SD-WAN ルータ・SD-WAN コントローラ（本社に置く F 社の装置）は device、
 * プロキシサーバ・グループウェアサーバ・社内 PC・出張先の PC・G 社のグループウェアサーバ群は host、インターネットは outside。
 * 図1 の網掛け（G 社 SaaS の導入で追加する構成）は、役割の色の上に斜線を重ねて残す。黒塗り（導入後に廃止する機器）は、
 * 役割の色（host）を反転した濃い塗りに白抜きの文字で残す（色相を変えないので、役割は変わらない）。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 */

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 名前を枠の内側の上の真ん中に置く破線の枠（出張先・G 社 SaaS）。hatch を渡すと網掛けにする */
function TopFrame({ rect, label, hatch }: { rect: Rect; label: string; hatch?: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={hatch ? `url(#${hatch})` : 'none'}
        stroke={SEGMENT}
        strokeWidth={1.1}
        strokeDasharray="4 3"
      />
      <text x={x + w / 2} y={y + 3.5 + fs} textAnchor="middle" fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 名前を枠の内側の左上に置く実線の枠（本社・営業所）。営業所の手前の枠は白で塗って後ろの枠を隠す */
function Frame({ rect, label, fill = 'none' }: { rect: Rect; label: string; fill?: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={FRAME} strokeWidth={1.3} />
      <text x={x + 4} y={y + 3.5 + fs} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** DMZ の破線の枠（名前は右下。ベースラインは下辺の 6 上） */
function DmzFrame({ rect }: { rect: Rect }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="4 3" />
      <text x={x + w - 4} y={y + h - 6} textAnchor="end" fontSize={fs} fill={TEXT}>
        DMZ
      </text>
    </g>
  )
}

/** 網掛けの箱（原図の、G 社 SaaS の導入で追加する構成）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({ rect, tone, lines, patternId }: { rect: Rect; tone: ToneName; lines: string[]; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.8} y={y + 0.8} width={w - 1.6} height={h - 1.6} rx={2} fill={`url(#${patternId})`} />
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

/** 黒塗りの箱（原図の、G 社 SaaS 導入後に廃止する機器）。host を反転した濃い塗りに白抜きの文字 */
function RetireBox({ rect, lines }: { rect: Rect; lines: string[] }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={RETIRE_FILL} stroke={RETIRE_FILL} strokeWidth={1.2} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill="#ffffff">
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** 営業所の枠（4枚重ね。後ろの3枚を白で塗って奥から描き、手前の枠を白で重ねる） */
function BranchFrames() {
  return (
    <g>
      {[3, 2, 1].map((k) => (
        <rect
          key={k}
          x={BR.x + BR_STEP * k}
          y={BR.y - BR_STEP * k}
          width={BR.w}
          height={BR.h}
          fill="#ffffff"
          stroke={FRAME}
          strokeWidth={1.3}
        />
      ))}
      <Frame rect={BR} label="営業所" fill="#ffffff" />
    </g>
  )
}

/** 社内 PC の列の「⋯」 */
function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}

export default function H30G11Base({
  sdwan = false,
  underlay,
  overlay,
}: {
  /** 図2（SD-WAN ルータを使用した構成案）なら true */
  sdwan?: boolean
  /** 強調の経路・輪（線とノードのあいだに描く） */
  underlay?: ReactNode
  /** 強調の文字（ノードの後に描く） */
  overlay?: ReactNode
}) {
  const hatch = useFigureId('h30g11-hatch')
  const hqRt = sdwan ? HQ_SDWAN : HQ_IPSEC
  const brRt = sdwan ? BR_SDWAN : BR_IPSEC
  const rtLines = sdwan ? ['SD-WAN', 'ルータ'] : ['IPsec', 'ルータ']
  return (
    <g>
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <TopFrame rect={TRIP} label="出張先" hatch={sdwan ? undefined : hatch} />
      <TopFrame rect={SAAS} label="G社SaaS" hatch={sdwan ? undefined : hatch} />
      <Frame rect={HQ} label="本社" />
      <DmzFrame rect={sdwan ? DMZ2 : DMZ1} />
      <BranchFrames />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 上の段 */}
      <Wire x1={TRIP_PC.x + TRIP_PC.w} y1={ROW_Y} x2={110} y2={ROW_Y} />
      <Wire x1={226} y1={ROW_Y} x2={SAAS_SRV.x} y2={ROW_Y} />
      {/* インターネットから本社（FW とルータ）と営業所へ */}
      <Poly points={INET_TO_FW} />
      <Poly points={HQ_UP} />
      {BR_LINES.map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      {/* 本社 */}
      <Wire x1={FW.x + FW.w} y1={A_Y} x2={DMZ_SW.x} y2={A_Y} />
      <Wire x1={DMZ_SW.x + DMZ_SW.w} y1={A_Y} x2={PROXY.x} y2={A_Y} />
      {!sdwan && <Wire x1={mid(DMZ_SW)} y1={bottom(DMZ_SW)} x2={mid(DMZ_SW)} y2={GW.y} />}
      <Wire x1={mid(FW)} y1={bottom(FW)} x2={mid(FW)} y2={L3.y} />
      <Wire x1={L3.x + L3.w} y1={B_Y} x2={hqRt.x} y2={B_Y} />
      {[...HQ_L3_TO_L2, ...HQ_L2_TO_PC].map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      {/* 営業所 */}
      {[...BR_RT_TO_L2, ...BR_L2_TO_PC].map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      {sdwan ? (
        <>
          <Box {...TRIP_PC} tone="host" lines={['PC']} size={SIZE} />
          <Box {...SAAS_SRV} tone="host" lines={['グループウェア', 'サーバ群']} size={SIZE} />
        </>
      ) : (
        <>
          <HatchBox rect={TRIP_PC} tone="host" lines={['PC']} patternId={hatch} />
          <HatchBox rect={SAAS_SRV} tone="host" lines={['グループウェア', 'サーバ群']} patternId={hatch} />
        </>
      )}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      {/* 本社 */}
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Box {...DMZ_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      {!sdwan && <RetireBox rect={GW} lines={['グループウェア', 'サーバ']} />}
      {sdwan && <Box {...CTRL} tone="device" lines={['SD-WAN', 'コントローラ']} size={SIZE} />}
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...hqRt} tone="device" lines={rtLines} size={SIZE} />
      {HQ_L2.map((r) => (
        <Box key={r.x} {...r} tone="device" lines={['L2SW']} size={SIZE} />
      ))}
      <Dots x={81} y={217} />
      {HQ_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['社内', 'PC']} size={SIZE} />
      ))}
      <Dots x={43} y={255} />
      <Dots x={119} y={255} />
      {/* 営業所 */}
      <Box {...brRt} tone="device" lines={rtLines} size={SIZE} />
      {BR_L2.map((r) => (
        <Box key={r.x} {...r} tone="device" lines={['L2SW']} size={SIZE} />
      ))}
      <Dots x={281} y={217} />
      {BR_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['社内', 'PC']} size={SIZE} />
      ))}
      <Dots x={256} y={255} />

      {overlay}
    </g>
  )
}
