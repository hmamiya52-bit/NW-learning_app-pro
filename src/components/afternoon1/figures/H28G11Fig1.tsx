import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, MUTED, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 A 社，B 社，P 社及び Q 社のネットワーク構成（抜粋）— H28 午後Ⅰ 問1
 *
 * 並びは原図どおり。上にインターネット、左に P 社（ISP）と A 社、右に Q 社（ISP）と B 社、
 * 略語の説明は右下。ISP のサービスネットワークは楕円で、中に MSV・DNS の箱を置く。
 * A 社の DMZ（x.y.z.0/29）と社内ネットワーク（172.16.0.0/16）、B 社の 192.168.1.0/24 は、
 * 原図と同じく端と接続点に小さな四角を付けた横線（セグメント）で描いた。
 * FW から DMZ へは原図どおり L 字の線でつなぐ。
 * インターネットと P 社・Q 社のあいだは、吹き出しを置けるよう原図より少し広く空けた。
 *
 * 色は役割だけで決めている。ISP（P 社・Q 社）のルータとサービスネットワーク、インターネットは
 * outside（持ち主が他社。R6-G1-2 の PE と同じ扱い）、A 社と B 社のルータ・FW は device、
 * メールサーバ・DNS サーバ・PC は持ち主によらず host。
 *
 * 解説を開いたときは、B 社の PC から MSV3 へのメールの道筋を赤でなぞり、宛先 25 番が止まる
 * ルータ4（設問2(2)）、587 番と 110 番を通す FW（設問2(5)）、MSV3 に輪を付ける。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5

/** セグメント（原図の横線）と、端・接続点の小さな四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={1.6} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 2} y={y - 2} width={4} height={4} fill={MUTED} />
      ))}
    </g>
  )
}

/** ISP のサービスネットワーク（楕円の上寄りに名前。中の箱は後から重ねる） */
function Cloud({ cx, cy }: { cx: number; cy: number }) {
  const t = TONE.outside
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={76} ry={24} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={t.text}>
        サービスネットワーク
      </text>
    </g>
  )
}

/** B 社の PC → Q 社 → インターネット → P 社 → A 社の MSV3（B 社から MSV3 へのメールの道筋） */
const B_TO_MSV3: [number, number][] = [
  [220, 245],
  [220, 236],
  [220, 224],
  [256, 224],
  [256, 210],
  [256, 201],
  [256, 192],
  [256, 158],
  [256, 149],
  [256, 140],
  [256, 132],
  [256, 108],
  [256, 84],
  [256, 78],
  [256, 69],
  [256, 60],
  [210, 26],
  [170, 16],
  [130, 26],
  [86, 60],
  [86, 69],
  [86, 78],
  [86, 84],
  [86, 108],
  [86, 132],
  [86, 140],
  [86, 149],
  [80, 158],
  [56, 192],
  [50, 201],
  [50, 210],
  [50, 224],
  [50, 233],
  [66, 233],
  [78, 233],
  [78, 256],
  [143, 256],
  [143, 242],
  [143, 233],
]

const LEGEND = ['FW：ファイアウォール', 'MSV1，MSV2，MSV3：メールサーバ', 'DNS1，DNS2，DNS3：DNS サーバ']

export default function H28G11Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={330} title="図1 A 社，B 社，P 社及び Q 社のネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame x={4} y={54} w={164} h={110} label="P社" />
      <DashFrame x={176} y={54} w={160} h={110} label="Q社" />
      <DashFrame x={4} y={172} w={164} h={154} label="A社" />
      <DashFrame x={176} y={172} w={160} h={92} label="B社" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={130} y1={26} x2={86} y2={60} />
      <Wire x1={210} y1={26} x2={256} y2={60} />
      {/* P 社・Q 社 */}
      <Wire x1={86} y1={78} x2={86} y2={84} />
      <Wire x1={86} y1={132} x2={86} y2={140} />
      <Wire x1={256} y1={78} x2={256} y2={84} />
      <Wire x1={256} y1={132} x2={256} y2={140} />
      {/* ルータ2 → ルータ3（専用線）、ルータ5 → ルータ6（注記2） */}
      <Wire x1={80} y1={158} x2={56} y2={192} />
      <Wire x1={256} y1={158} x2={256} y2={192} />
      {/* A 社 */}
      <Wire x1={50} y1={210} x2={50} y2={224} />
      <Poly
        points={[
          [66, 233],
          [78, 233],
          [78, 256],
        ]}
      />
      <Wire x1={101} y1={242} x2={101} y2={256} />
      <Wire x1={143} y1={242} x2={143} y2={256} />
      <Bus x1={72} x2={164} y={256} taps={[78, 101, 143]} />
      <Wire x1={50} y1={242} x2={50} y2={294} />
      <Wire x1={128} y1={294} x2={128} y2={302} />
      <Bus x1={12} x2={152} y={294} taps={[50, 128]} />
      {/* B 社 */}
      <Wire x1={256} y1={210} x2={256} y2={224} />
      <Wire x1={220} y1={224} x2={220} y2={236} />
      <Bus x1={196} x2={306} y={224} taps={[220, 256]} />

      {/* ── 強調：輪と、B 社の PC から MSV3 への道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={232} y={60} w={48} h={18} />
          <Ring x={34} y={224} w={32} h={18} />
          <Ring x={126} y={224} w={34} h={18} />
          <Route points={B_TO_MSV3} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={170} cy={16} rx={164} ry={11} tone="outside" lines={['インターネット']} size={SIZE} />

      {/* P 社 */}
      <Box x={62} y={60} w={48} h={18} tone="outside" lines={['ルータ1']} size={SIZE} />
      <Cloud cx={86} cy={108} />
      <Box x={50} y={106} w={34} h={18} tone="host" lines={['MSV1']} size={SIZE} />
      <Box x={88} y={106} w={34} h={18} tone="host" lines={['DNS1']} size={SIZE} />
      <Box x={62} y={140} w={48} h={18} tone="outside" lines={['ルータ2']} size={SIZE} />

      {/* Q 社 */}
      <Box x={232} y={60} w={48} h={18} tone="outside" lines={['ルータ4']} size={SIZE} />
      <Cloud cx={256} cy={108} />
      <Box x={220} y={106} w={34} h={18} tone="host" lines={['MSV2']} size={SIZE} />
      <Box x={258} y={106} w={34} h={18} tone="host" lines={['DNS2']} size={SIZE} />
      <Box x={232} y={140} w={48} h={18} tone="outside" lines={['ルータ5']} size={SIZE} />

      {/* A 社 */}
      <Box x={26} y={192} w={48} h={18} tone="device" lines={['ルータ3']} size={SIZE} />
      <Box x={34} y={224} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />
      <Box x={84} y={224} w={34} h={18} tone="host" lines={['DNS3']} size={SIZE} />
      <Box x={126} y={224} w={34} h={18} tone="host" lines={['MSV3']} size={SIZE} />
      <Cap x={80} y={268} text="DMZ" size={7} color={MUTED} />
      <Cap x={110} y={268} text="x.y.z.0/29" size={7} color={MUTED} />
      <Cap x={96} y={287} text="172.16.0.0/16" size={7} color={MUTED} />
      <Cap x={12} y={308} text="社内ネットワーク" size={7} color={MUTED} />
      <Box x={112} y={302} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />

      {/* B 社 */}
      <Box x={232} y={192} w={48} h={18} tone="device" lines={['ルータ6']} size={SIZE} />
      <Box x={204} y={236} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={244} y={238} text="192.168.1.0/24" size={7} color={MUTED} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={244}
            y={30}
            w={87}
            lines={['25 番はここで止まる']}
            leader={[
              [262, 48.8],
              [262, 60],
            ]}
          />
          <Callout
            x={84}
            y={191}
            w={66}
            lines={['587・110 番', 'を通す']}
            leader={[
              [84, 214],
              [64, 224],
            ]}
          />
        </g>
      )}

      {/* ── 凡例（原図どおり右下）─────────────────────────── */}
      {LEGEND.map((t, i) => (
        <Cap key={t} x={180} y={282 + i * 12} text={t} size={7} color={MUTED} />
      ))}
    </FigSvg>
  )
}
