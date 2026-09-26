import { Box, Cap, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 C 氏が検討した A 社のシステム構成（抜粋）— H27 午後Ⅰ 問1
 *
 * 機器の並び（上にルータ、その下に SW1 と SW2、SW1 の下に PC、SW2 の下に営業サーバと広告サーバ、
 * SW2 の右に LB・SSO サーバ1・SSO サーバ2・内部 DNS サーバ）と、どの箱がどの箱とつながるかは原図どおり。
 * 原図は枠の右の外に略語の説明を置くが、375px に収めるため枠の下へ移した。
 *
 * 色は役割だけで決めている。ルータ・SW・LB は device、サーバと PC は host。
 * 原図の網掛け（注記: 導入検討中の機器）は色ではなく斜線で残す（H25G11Fig1 と同じ）。
 *
 * 解説を開いたときは、PC から VIP アドレス（LB）へ届き、SW2 を通って SSO サーバ1 へ振り分けられる
 * 要求の道筋を赤でなぞり、LB・SSO サーバの組・内部 DNS サーバに輪を付ける（空欄エ・オ、設問4）。
 */

const TEXT = '#334155'
/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5
/** 網掛けの斜線の色（原図の網掛けを表す。役割の色ではない） */
const HATCH = '#94a3b8'

/** 網掛けの箱（導入検討中の機器）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({
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

/** PC から VIP アドレス（LB）までの要求の道筋 */
const TO_LB: [number, number][] = [
  [30, 112],
  [52, 76],
  [60, 66],
  [66, 56],
  [122, 32],
  [136, 22],
  [150, 32],
  [164, 56],
  [170, 66],
  [190, 59],
  [270, 28],
  [299, 22],
]
/** LB から SW2 を折り返して SSO サーバ1 へ（DSR では宛先 IP は VIP のまま、MAC アドレスだけ変えて渡す） */
const TO_SSO: [number, number][] = [
  [299, 22],
  [270, 28],
  [190, 59],
  [190, 63],
  [254, 54],
  [291, 54],
]

export default function H27G11Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h27g11-hatch')
  return (
    <FigSvg w={340} h={170} title="図1 C 氏が検討した A 社のシステム構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={4} y={4} w={332} h={146} label="A社" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={122} y1={32} x2={66} y2={56} />
      <Wire x1={150} y1={32} x2={164} y2={56} />
      <Wire x1={52} y1={76} x2={30} y2={112} />
      <Wire x1={68} y1={76} x2={80} y2={112} />
      <Wire x1={162} y1={76} x2={146} y2={108} />
      <Wire x1={178} y1={76} x2={182} y2={108} />
      <Wire x1={190} y1={59} x2={270} y2={28} />
      <Wire x1={190} y1={63} x2={254} y2={54} />
      <Wire x1={190} y1={67} x2={254} y2={82} />
      <Wire x1={190} y1={71} x2={246} y2={118} />

      {/* ── 強調：輪と、要求の道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={270} y={12} w={58} h={20} />
          <Ring x={254} y={44} w={74} h={48} />
          <Ring x={246} y={112} w={82} h={20} />
          <Route points={TO_LB} />
          <Route points={TO_SSO} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={112} y={12} w={48} h={20} tone="device" lines={['ルータ']} size={SIZE} />
      <Box x={40} y={56} w={40} h={20} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={150} y={56} w={40} h={20} tone="device" lines={['SW2']} size={SIZE} />
      <Box x={10} y={112} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={54} y={125} text="…" anchor="middle" color={MUTED} />
      <Box x={66} y={112} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Box x={124} y={108} w={36} h={32} tone="host" lines={['営業', 'サーバ']} size={SIZE} />
      <Box x={166} y={108} w={36} h={32} tone="host" lines={['広告', 'サーバ']} size={SIZE} />

      <Cap x={264} y={21} text="VIP アドレス" anchor="end" size={SIZE} color={TEXT} />
      <HatchBox x={270} y={12} w={58} h={20} tone="device" label="LB" patternId={hatch} />
      <HatchBox x={254} y={44} w={74} h={20} tone="host" label="SSO サーバ1" patternId={hatch} />
      <HatchBox x={254} y={72} w={74} h={20} tone="host" label="SSO サーバ2" patternId={hatch} />
      <Box x={246} y={112} w={82} h={20} tone="host" lines={['内部 DNS サーバ']} size={SIZE} />

      {/* ── 凡例（原図は枠の右の外）──────────────────── */}
      <Cap x={6} y={164} text="SW1，SW2：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={170} y={164} text="VIP アドレス：仮想 IP アドレス" size={7} color={MUTED} />
    </FigSvg>
  )
}
