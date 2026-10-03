import { ArrowDefs, Box, Callout, Cap, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { Storage } from './H28G13Topology'
import { SIZE } from './h28g13Layout'
import { FONT_SCALE, LOGICAL, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 社内 - 社外間の正常時のメール転送経路 — H28 午後Ⅰ 問3
 *
 * 原図どおり左から インターネット（縦長の楕円・縦書き）→ MGW → 新 MSV → PC と並べる。
 * 新 MSV1 と新 MSV2 のあいだに共用ストレージ（横倒しの円筒）を置き、短い縦線で結ぶ。
 * 矢印はメールの SMTP 転送で、物理の線ではないので LOGICAL。原図の凡例どおり、
 * 実線が社内から社外宛て、破線が社外から社内宛て。交差する矢印（PC と新 MSV のあいだ、
 * 新 MSV2 → MGW1 と MGW2 → 新 MSV1）も原図どおり。
 *
 * 色は役割だけで決めている。MGW・新 MSV・PC・共用ストレージは host、インターネットは outside。
 *
 * 解説を開いたときは、社外からのメールの道筋（インターネット → MGW2 → 新 MSV1）をなぞり（設問2(1)）、
 * VRRP の2台（新 MSV1・新 MSV2）と共用ストレージに輪を付ける（設問2(1)(2)）。
 */

const MGW1 = { x: 70, y: 14, w: 48, h: 20 }
const MGW2 = { x: 70, y: 90, w: 48, h: 20 }
const MSV1 = { x: 162, y: 14, w: 56, h: 20 }
const MSV2 = { x: 162, y: 90, w: 56, h: 20 }
const SHARED = { x: 160, y: 44, w: 60, h: 36 }
const PC1 = { x: 282, y: 14, w: 40, h: 20 }
const PC2 = { x: 282, y: 90, w: 40, h: 20 }

/** インターネット（原図どおり縦長の楕円に縦書き） */
function Internet() {
  const t = TONE.outside
  return (
    <g>
      <ellipse cx={22} cy={62} rx={15} ry={48} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text
        x={22}
        y={62}
        writingMode="vertical-rl"
        textAnchor="middle"
        fontSize={SIZE * FONT_SCALE}
        fontWeight={700}
        fill={t.text}
      >
        インターネット
      </text>
    </g>
  )
}

/** 社内から社外宛ての SMTP 転送（実線の矢印） */
function Out({ points, arrow }: { points: [number, number][]; arrow: string }) {
  return <Poly points={points} color={LOGICAL} width={1.2} markerEnd={arrow} />
}

/** 社外から社内宛ての SMTP 転送（破線の矢印） */
function In({ points, arrow }: { points: [number, number][]; arrow: string }) {
  return <Poly points={points} color={LOGICAL} width={1.2} dash="4 3" markerEnd={arrow} />
}

/** 社外からのメール（破線）: インターネット → MGW2（矢頭の手前で止める） */
const IN_1: [number, number][] = [
  [28, 78],
  [35.6, 82],
  [62.9, 96.3],
]
/** MGW2 → 新 MSV1（転送先 VIP1。矢頭の手前で止める） */
const IN_2: [number, number][] = [
  [110, 100],
  [118, 94],
  [157.5, 36.6],
]

export default function H28G13Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('h28g13f2')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={184} title="図2 社内 - 社外間の正常時のメール転送経路">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 線（新 MSV と共用ストレージ）───────────────────── */}
      <Wire x1={190} y1={34} x2={190} y2={44} />
      <Wire x1={190} y1={80} x2={190} y2={90} />

      {/* ── 社内から社外宛て（実線）─────────────────────── */}
      <Out arrow={arrow} points={[[282, 24], [218, 24]]} />
      <Out arrow={arrow} points={[[282, 30], [218, 94]]} />
      <Out arrow={arrow} points={[[282, 94], [218, 30]]} />
      <Out arrow={arrow} points={[[282, 100], [218, 100]]} />
      <Out arrow={arrow} points={[[162, 24], [118, 24]]} />
      <Out arrow={arrow} points={[[162, 94], [118, 30]]} />
      <Out arrow={arrow} points={[[70, 24], [35.6, 42]]} />

      {/* ── 社外から社内宛て（破線）─────────────────────── */}
      <In arrow={arrow} points={[[35.6, 82], [70, 100]]} />
      <In arrow={arrow} points={[[118, 94], [162, 30]]} />

      {/* ── 強調：輪と、社外からのメールの道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring {...MSV1} />
          <Ring {...MSV2} />
          <Ring {...SHARED} rx={6} />
          <Route points={IN_1} />
          <Route points={IN_2} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Internet />
      <Box {...MGW1} tone="host" lines={['MGW1']} size={SIZE} />
      <Box {...MGW2} tone="host" lines={['MGW2']} size={SIZE} />
      <Box {...MSV1} tone="host" lines={['新MSV1']} size={SIZE} />
      <Storage {...SHARED} lines={['共用', 'ストレージ']} />
      <Box {...MSV2} tone="host" lines={['新MSV2']} size={SIZE} />
      <Box {...PC1} tone="host" lines={['PC']} size={SIZE} />
      <Box {...PC2} tone="host" lines={['PC']} size={SIZE} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout x={70} y={118} w={75} lines={['VIP1 は正常時', '新MSV1 が持つ']} />
          <Callout x={232} y={118} w={104} lines={['msvc は VIP1・VIP2', 'の2件で散らす']} />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={164} text="（凡例）" size={7} color={MUTED} />
      <Out arrow={arrow} points={[[46, 161], [70, 161]]} />
      <Cap x={72} y={164} text="：社内から社外宛てメールの SMTP 転送" size={7} color={MUTED} />
      <In arrow={arrow} points={[[46, 174], [70, 174]]} />
      <Cap x={72} y={177} text="：社外から社内宛てメールの SMTP 転送" size={7} color={MUTED} />
    </FigSvg>
  )
}
