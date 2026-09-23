import { Box, Callout, Cap, DashFrame, FigSvg, RangeBar, Ring, Route, RouteTag, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, MARK, MARK_TEXT, MUTED, SEGMENT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 VLAN トンネリング時のフレーム — H25 午後Ⅰ 問3
 *
 * 上段は顧客αの SV1 から SV2 までの経路と、フレームを採った3か所（①②③）。
 * 下段はその3か所のフレームの並びで、フィールドの境目を破線で結んで
 * 「どこに何が差し込まれたか」を見せている（①→②が3本、②→③が5本。原図どおり）。
 * 原図は行の名前（①のフレーム）を左に1行で置くが、375px に収めるため2行に折った。
 *
 * 色について: 上段は構成図なので役割の3色を使う。NW 基盤の L2SW・L3SW は C 社の装置なので
 * device、顧客αの L2SW は顧客（グループ内の別会社）の装置なので outside、SV1・SV2 は host。
 * 下段はフレームの並びで役割が無いので、マスを全部同じ白にする（R6-G1-3 図2 と同じ）。
 * 網掛けだけは原図の情報（設問で伏せた所）なので灰色で残す。
 *
 * 設問2(3)は網掛けを分割してフィールド名を書かせるので、解説を開いたときは
 * 解答例の分け方（TPID｜TCI）を赤で描き込む。これは経路ではなく解答の描き込みなので、
 * §5.4 の検査5（経路が実在の線の上か）の対象外だと分かるよう data-role="answer" を付ける。
 */

const CELL = '#ffffff'
const EDGE = MUTED
const TEXT = '#334155'
/** 網掛け（原図で伏せてある所） */
const SHADE = '#e2e8f0'

/**
 * フレームの行の高さ。Ether Type/Length の2行が入る高さにする
 * （22 だと Meiryo UI の2行の文字の箱が 21.6 あり、上下の枠に触っていた）
 */
const ROW_H = 27

/** フレームの1マス */
function Field({
  x,
  y,
  w,
  h = ROW_H,
  lines,
  fill = CELL,
}: {
  x: number
  y: number
  w: number
  h?: number
  lines: string[]
  fill?: string
}) {
  const fs = 7 * FONT_SCALE
  const lh = fs + 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={EDGE} strokeWidth={1.1} />
      {lines.length > 0 && (
        <text x={x + w / 2} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={TEXT}>
          {lines.map((ln, i) => (
            <tspan key={i} x={x + w / 2} dy={i === 0 ? 0 : lh}>
              {ln}
            </tspan>
          ))}
        </text>
      )}
    </g>
  )
}

/** マスの定義: [左端 x, 幅, 文字] */
type Cell = [number, number, string[]]

const ET: string[] = ['Ether Type/', 'Length']

/** ①: DA｜SA｜Ether Type/Length｜DATA｜FCS */
const FRAME1: Cell[] = [
  [42, 24, ['DA']],
  [66, 24, ['SA']],
  [90, 60, ET],
  [150, 34, ['DATA']],
  [184, 24, ['FCS']],
]
/** ②: 顧客の VLAN タグ（TPID｜TCI）が SA の後ろに入る */
const FRAME2: Cell[] = [
  [42, 24, ['DA']],
  [66, 24, ['SA']],
  [90, 34, ['TPID']],
  [124, 26, ['TCI']],
  [150, 60, ET],
  [210, 34, ['DATA']],
  [244, 24, ['FCS']],
]
/** ③: SA の後ろに網掛け（設問で伏せた所）が入る */
const FRAME3: Cell[] = [
  [42, 24, ['DA']],
  [66, 24, ['SA']],
  [152, 34, ['TPID']],
  [186, 26, ['TCI']],
  [212, 60, ET],
  [272, 34, ['DATA']],
  [306, 24, ['FCS']],
]
/**
 * 網掛けの幅。解説を開いたときに解答の TPID と TCI を半分ずつに書き込むので、
 * 強調の文字（size 7.5）の TPID が半分に収まる幅にしてある
 */
const SHADE_X = 90
const SHADE_W = 62

const ROW1_Y = 62
const ROW2_Y = 111
const ROW3_Y = 160

/** フィールドの境目どうしを結ぶ破線（上の行の下辺 x → 下の行の上辺 x） */
const LINKS_12: [number, number][] = [
  [90, 150],
  [150, 210],
  [184, 244],
]
const LINKS_23: [number, number][] = [
  [90, 152],
  [124, 186],
  [150, 212],
  [210, 272],
  [244, 306],
]

function RowLabel({ y, num }: { y: number; num: string }) {
  return (
    <g>
      <Cap x={2} y={y + 10} text={`${num}の`} size={7} color={TEXT} bold />
      <Cap x={2} y={y + 23} text="フレーム" size={7} color={TEXT} bold />
    </g>
  )
}

export default function H25G13Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={232} title="図2 VLAN トンネリング時のフレーム">
      {/* ── 上段：囲み ─────────────────────────────── */}
      <DashFrame x={2} y={2} w={84} h={48} label="顧客α" color={SEGMENT} />
      <SolidFrame x={100} y={2} w={140} h={48} label="NW基盤" />
      <DashFrame x={250} y={2} w={88} h={48} label="顧客α" color={SEGMENT} />

      {/* ── 強調：DA と SA の列（3つのフレームを通して。線とマスより先に敷く）── */}
      {highlight && <Ring x={42} y={ROW1_Y} w={48} h={ROW3_Y + ROW_H - ROW1_Y} />}

      {/* ── 上段：線 ─────────────────────────────── */}
      <Wire x1={32} y1={36} x2={48} y2={36} />
      <Wire x1={82} y1={36} x2={106} y2={36} />
      <Wire x1={140} y1={36} x2={150} y2={36} />
      <Wire x1={184} y1={36} x2={202} y2={36} />
      <Wire x1={236} y1={36} x2={256} y2={36} />
      <Wire x1={290} y1={36} x2={304} y2={36} />

      {/* ── 下段：フィールドの対応（破線）─────────────── */}
      {LINKS_12.map(([a, b], i) => (
        <Wire key={`a${i}`} x1={a} y1={ROW1_Y + ROW_H} x2={b} y2={ROW2_Y} dash="3 2" />
      ))}
      {LINKS_23.map(([a, b], i) => (
        <Wire key={`b${i}`} x1={a} y1={ROW2_Y + ROW_H} x2={b} y2={ROW3_Y} dash="3 2" />
      ))}

      {/* ── 強調：SV1 から SV2 まで同じフレームが運ばれる道筋と、途中の L3SW ── */}
      {highlight && (
        <g>
          <Route
            points={[
              [19, 36],
              [318, 36],
            ]}
          />
          <Ring x={150} y={28} w={34} h={16} pad={2.5} />
        </g>
      )}

      {/* ── 上段：ノード ─────────────────────────────── */}
      <Box x={6} y={28} w={26} h={16} tone="host" lines={['SV1']} size={7} />
      <Box x={48} y={28} w={34} h={16} tone="outside" lines={['L2SW']} size={7} />
      <Box x={106} y={28} w={34} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={150} y={28} w={34} h={16} tone="device" lines={['L3SW']} size={7} />
      <Box x={202} y={28} w={34} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={256} y={28} w={34} h={16} tone="outside" lines={['L2SW']} size={7} />
      <Box x={304} y={28} w={28} h={16} tone="host" lines={['SV2']} size={7} />
      <Cap x={40} y={26} text="①" anchor="middle" size={7.5} color={TEXT} bold />
      <Cap x={93} y={26} text="②" anchor="middle" size={7.5} color={TEXT} bold />
      <Cap x={193} y={26} text="③" anchor="middle" size={7.5} color={TEXT} bold />

      {/* ── 下段：フレーム ─────────────────────────────── */}
      <RowLabel y={ROW1_Y} num="①" />
      {FRAME1.map(([x, w, lines], i) => (
        <Field key={`f1${i}`} x={x} y={ROW1_Y} w={w} lines={lines} />
      ))}
      <RowLabel y={ROW2_Y} num="②" />
      {FRAME2.map(([x, w, lines], i) => (
        <Field key={`f2${i}`} x={x} y={ROW2_Y} w={w} lines={lines} />
      ))}
      <RowLabel y={ROW3_Y} num="③" />
      {FRAME3.map(([x, w, lines], i) => (
        <Field key={`f3${i}`} x={x} y={ROW3_Y} w={w} lines={lines} />
      ))}
      <Field x={SHADE_X} y={ROW3_Y} w={SHADE_W} lines={[]} fill={SHADE} />

      {/* ── 強調：網掛けの分け方（設問2(3)の解答の描き込み）と、タグ1つ分の範囲 ── */}
      {highlight && (
        <g>
          <g data-role="answer">
            <line
              x1={SHADE_X + SHADE_W / 2}
              y1={ROW3_Y}
              x2={SHADE_X + SHADE_W / 2}
              y2={ROW3_Y + ROW_H}
              stroke={MARK}
              strokeWidth={1.4}
              strokeDasharray="3 2"
            />
            <text
              x={SHADE_X + SHADE_W / 4}
              y={ROW3_Y + ROW_H / 2 + 9 * 0.36}
              textAnchor="middle"
              fontSize={7.5 * FONT_SCALE}
              fontWeight={700}
              fill={MARK_TEXT}
            >
              TPID
            </text>
            <text
              x={SHADE_X + (SHADE_W * 3) / 4}
              y={ROW3_Y + ROW_H / 2 + 9 * 0.36}
              textAnchor="middle"
              fontSize={7.5 * FONT_SCALE}
              fontWeight={700}
              fill={MARK_TEXT}
            >
              TCI
            </text>
          </g>
          <RangeBar x1={90} x2={150} y={100} />
          <RouteTag cx={120} cy={100} text="32 ビット" w={50} />
          <Callout
            x={6}
            y={198}
            w={100}
            lines={['DA・SA は①〜③とも', 'SV2・SV1 のまま']}
            leader={[
              [56, 198],
              [56, 190.5],
            ]}
          />
          <Callout
            x={112}
            y={198}
            w={88}
            lines={['NW 基盤が付ける', '外側の VLAN タグ']}
            leader={[
              [118, 198],
              [110, 188],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
