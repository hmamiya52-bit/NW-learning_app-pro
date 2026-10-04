import type { ReactNode } from 'react'
import { Box, Cap, Ell, Wire } from './primitives'
import {
  CAP,
  CTRL1,
  CTRL2,
  CTRL_SEG,
  CTRL_SRV,
  CTRL_SW,
  DMZ,
  DMZ_SW,
  EXT_MAIL,
  FACTORY,
  FTA,
  FTA_UP,
  FW,
  HATCH,
  HIST,
  INET,
  INT_MAIL,
  LDAP,
  MACHINE,
  MGMT_SEG,
  MGMT_SW,
  NPB,
  NPB_TO_CAP,
  NPB_TO_VIS,
  OA,
  OA_SW,
  OFFICE,
  OPE,
  PC1,
  PC2,
  PROXY,
  SENSOR,
  SIZE,
  STACK,
  TEXT,
  VIS,
} from './r4g11Layout'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ToneName } from './tokens'

/**
 * A 社ネットワークの構成（R4 午後Ⅰ 問1 の図1・図2 で共通の下絵）
 *
 * 図2 は図1 に FTA・NPB・可視化サーバ・キャプチャサーバ（原図の網掛け）を足した図なので、下絵をここに1つだけ持ち、
 * `proposed` で足す機器と線を出し分ける。座標は r4g11Layout.ts にあり、2枚が必ず同じ形になる。
 *
 * 色は役割だけで決めている。FW・L2SW・NPB は device、サーバ・PC・操作端末・データヒストリアン・FTA・
 * コントローラ・センサ・工作機械は host、インターネットは outside。
 * 原図の網掛け（ネットワーク更改によって追加される箇所）は、色ではなく斜線で残す。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 */

type Rect = { x: number; y: number; w: number; h: number }

/** 名前を枠の内側の下の隅に置く囲み（原図どおり。工場・事務所は実線、セグメント・DMZ は破線） */
function CornerFrame({
  rect,
  label,
  corner,
  solid = false,
}: {
  rect: Rect
  label: string
  corner: 'left' | 'right'
  solid?: boolean
}) {
  const { x, y, w, h } = rect
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={solid ? FRAME : SEGMENT}
        strokeWidth={solid ? 1.3 : 1.1}
        strokeDasharray={solid ? undefined : '5 3'}
      />
      <text
        x={corner === 'left' ? x + 4.5 : x + w - 5}
        y={y + h - 6}
        textAnchor={corner === 'left' ? 'start' : 'end'}
        fontSize={SIZE * FONT_SCALE}
        fill={TEXT}
      >
        {label}
      </text>
    </g>
  )
}

/** 網掛けの斜線。id は useFigureId で図ごとに一意にする */
function HatchPattern({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
      </pattern>
    </defs>
  )
}

/** 網掛けの箱（2行の名前も置ける）。役割の色の上に斜線を重ね、その上に文字を置く */
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
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={2} fill={`url(#${patternId})`} />
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

/** 斜めの点3つ（原図の重ね書きの角の「⋱」）。(x1, y1) から (x2, y2) までの対角線の上に並べる */
function DiagDots({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      {[0.25, 0.5, 0.75].map((r) => (
        <circle key={r} cx={x1 + (x2 - x1) * r} cy={y1 + (y2 - y1) * r} r={0.6} fill={MUTED} />
      ))}
    </g>
  )
}

/**
 * 重ね書きの機器（原図のセンサ・工作機械。複数台を、前の箱の右下に後ろの箱をずらして表す）。
 * 後ろの箱は文字を持たないので、前の箱とは別の `<g>` に置く（§5.4 の検査2 が文字を後ろの箱で測らないように）。
 * 角の「⋱」は原図どおり、右上・右下・左下の3か所。
 */
function Stack({ rect, label }: { rect: Rect; label: string }) {
  const { x, y, w, h } = rect
  const { dx, dy } = STACK
  const t = TONE.host
  return (
    <g>
      <g>
        <rect x={x + dx} y={y + dy} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      </g>
      <Box {...rect} tone="host" lines={[label]} size={SIZE} />
      <DiagDots x1={x + w} y1={y} x2={x + w + dx} y2={y + dy} />
      <DiagDots x1={x + w} y1={y + h} x2={x + w + dx} y2={y + h + dy} />
      <DiagDots x1={x} y1={y + h} x2={x + dx} y2={y + h + dy} />
    </g>
  )
}

/**
 * コントローラから重ね書きの機器への2本の線（複数台につながることを表す。原図どおり左は斜め、右は縦）。
 * あいだの「…」は文字なので、ノードと一緒に後から置く（StackDots）
 */
function StackWires({ ctrl, stack }: { ctrl: Rect; stack: Rect }) {
  const top = ctrl.y + ctrl.h
  return (
    <g>
      <Wire x1={ctrl.x + 8} y1={top} x2={stack.x + 7} y2={stack.y} />
      <Wire x1={ctrl.x + 22} y1={top} x2={ctrl.x + 22} y2={stack.y} />
    </g>
  )
}

/** StackWires の2本のあいだの「…」 */
function StackDots({ ctrl, stack }: { ctrl: Rect; stack: Rect }) {
  return <Cap x={ctrl.x + 15} y={stack.y - 4} text="…" anchor="middle" color={MUTED} />
}

/** 縦の「⋮」（原図の PC と PC のあいだの省略） */
function VDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 5, 10].map((d) => (
        <circle key={d} cx={x} cy={y + d} r={0.9} fill={MUTED} />
      ))}
    </g>
  )
}

function Line({ points }: { points: [number, number][] }) {
  const [[x1, y1], [x2, y2]] = points
  return <Wire x1={x1} y1={y1} x2={x2} y2={y2} />
}

export default function R4G11Base({
  proposed = false,
  underlay,
  overlay,
}: {
  /** 図2（ベンダが提案した構成）。FTA・NPB・可視化サーバ・キャプチャサーバと、それらの線を足す */
  proposed?: boolean
  /** 線とノードのあいだに差し込むもの（強調の経路・輪） */
  underlay?: ReactNode
  /** ノードの上に重ねるもの（強調の文字） */
  overlay?: ReactNode
}) {
  const hatch = useFigureId('r4g11-hatch')
  const fx = FW.x + FW.w / 2
  const sx = OA_SW.x + OA_SW.w
  return (
    <g>
      <HatchPattern id={hatch} />

      {/* ── 囲み ───────────────────────────────────── */}
      <CornerFrame rect={OFFICE} label="事務所" corner="left" solid />
      <CornerFrame rect={DMZ} label="DMZ" corner="left" />
      <CornerFrame rect={OA} label="OAセグメント" corner="left" />
      <CornerFrame rect={FACTORY} label="工場" corner="left" solid />
      <CornerFrame rect={CTRL_SEG} label="制御セグメント" corner="right" />
      <CornerFrame rect={MGMT_SEG} label="管理セグメント" corner="left" />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* インターネット ― FW ― DMZ の L2SW ― 外部メールサーバ・プロキシサーバ */}
      <Wire x1={fx} y1={INET.cy + INET.ry} x2={fx} y2={FW.y} />
      <Wire x1={FW.x + FW.w} y1={58} x2={DMZ_SW.x} y2={58} />
      <Wire x1={DMZ_SW.x + DMZ_SW.w} y1={58} x2={EXT_MAIL.x} y2={58} />
      <Wire x1={DMZ_SW.x + DMZ_SW.w} y1={64} x2={PROXY.x} y2={96} />
      {/* FW ― OA の L2SW ― 内部メールサーバ・LDAP サーバ・PC */}
      <Wire x1={fx} y1={FW.y + FW.h} x2={fx} y2={OA_SW.y} />
      <Wire x1={sx} y1={139} x2={INT_MAIL.x} y2={145} />
      <Wire x1={sx} y1={143} x2={LDAP.x} y2={181} />
      <Wire x1={sx} y1={147} x2={PC1.x} y2={211} />
      <Wire x1={sx} y1={151} x2={PC2.x} y2={247} />
      {/* 制御セグメント: コントローラ ― L2SW ― 制御サーバ ― 管理セグメントの L2SW */}
      <StackWires ctrl={CTRL1} stack={SENSOR} />
      <StackWires ctrl={CTRL2} stack={MACHINE} />
      <Wire x1={CTRL1.x + CTRL1.w} y1={315} x2={96} y2={CTRL_SW.y} />
      <Wire x1={CTRL2.x + CTRL2.w} y1={389} x2={96} y2={CTRL_SW.y + CTRL_SW.h} />
      <Wire x1={CTRL_SW.x + CTRL_SW.w} y1={352} x2={CTRL_SRV.x} y2={352} />
      <Wire x1={CTRL_SRV.x + CTRL_SRV.w} y1={352} x2={MGMT_SW.x} y2={352} />
      {/* 管理セグメント: L2SW ― 操作端末・データヒストリアン */}
      <Wire x1={247} y1={MGMT_SW.y} x2={247} y2={OPE.y + OPE.h} />
      <Wire x1={261} y1={MGMT_SW.y} x2={296} y2={HIST.y + HIST.h} />
      {proposed && (
        <g>
          {/* FTA は管理セグメントの L2SW と OA の L2SW の両方につながる */}
          <Wire x1={233} y1={MGMT_SW.y} x2={208} y2={FTA.y + FTA.h} />
          <Line points={FTA_UP} />
          {/* NPB は制御セグメントの L2SW のミラーポートから受け、可視化サーバ・キャプチャサーバへ送る */}
          <Wire x1={108} y1={CTRL_SW.y} x2={108} y2={NPB.y + NPB.h} />
          <Line points={NPB_TO_VIS} />
          <Line points={NPB_TO_CAP} />
          <Wire x1={152} y1={OA_SW.y + OA_SW.h} x2={100} y2={VIS.y} />
          <Wire x1={160} y1={OA_SW.y + OA_SW.h} x2={146} y2={CAP.y} />
        </g>
      )}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Box {...DMZ_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...EXT_MAIL} tone="host" lines={['外部メール', 'サーバ']} size={SIZE} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box {...OA_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...INT_MAIL} tone="host" lines={['内部メール', 'サーバ']} size={SIZE} />
      <Box {...LDAP} tone="host" lines={['LDAP', 'サーバ']} size={SIZE} />
      <Box {...PC1} tone="host" lines={['PC']} size={SIZE} />
      <VDots x={PC1.x + PC1.w / 2} y={224} />
      <Box {...PC2} tone="host" lines={['PC']} size={SIZE} />

      <Box {...CTRL1} tone="host" lines={['コントローラ']} size={SIZE} />
      <Stack rect={SENSOR} label="センサ" />
      <Box {...CTRL2} tone="host" lines={['コントローラ']} size={SIZE} />
      <Stack rect={MACHINE} label="工作機械" />
      <StackDots ctrl={CTRL1} stack={SENSOR} />
      <StackDots ctrl={CTRL2} stack={MACHINE} />
      <Box {...CTRL_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...CTRL_SRV} tone="host" lines={['制御', 'サーバ']} size={SIZE} />
      <Box {...MGMT_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...OPE} tone="host" lines={['操作端末']} size={SIZE} />
      <Box {...HIST} tone="host" lines={['データ', 'ヒストリアン']} size={SIZE} />

      {proposed && (
        <g>
          <HatchBox rect={FTA} tone="host" lines={['FTA']} patternId={hatch} />
          <HatchBox rect={NPB} tone="device" lines={['NPB']} patternId={hatch} />
          <HatchBox rect={VIS} tone="host" lines={['可視化', 'サーバ']} patternId={hatch} />
          <HatchBox rect={CAP} tone="host" lines={['キャプチャ', 'サーバ']} patternId={hatch} />
        </g>
      )}

      {overlay}
    </g>
  )
}
