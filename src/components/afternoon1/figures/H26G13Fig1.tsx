import { Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, MUTED, TONE } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 IB システムの構成（抜粋）— H26 午後Ⅰ 問3
 *
 * 原図はインターネット・FW・DMZ・内部セグメント・ルータ・業務セグメントを横一列に並べる。
 * 375px では文字が読めないので、ルータから先（勘定系システムと業務セグメント）を
 * 内部セグメントの下へ折り返した。どの機器がどのセグメントにつながるか、
 * セグメントの上の並び（DMZ は Web サーバ・DNS サーバ・FW、内部は FW・DNS サーバ・
 * データベースサーバ・ルータ）、重ね書きの枚数（Web サーバ3・DMZ の DNS サーバ2・
 * 内部の DNS サーバ3・データベースサーバ2）は原図どおり。
 *
 * 色は役割だけで決めている。FW とルータは device、サーバ・データベース・PC は host、
 * インターネットと勘定系システム（他行との共同センタで動く、IB システムの外）は outside。
 *
 * 解説を開いたときは、FW と両方の DNS サーバの組に輪を付け（設問2(2)・3(2)・3(3)）、
 * 内部セグメントから FW を通ってインターネットへ出る道筋を赤でなぞる（設問3(3)）。
 */

const TEXT = '#334155'
/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5
/** 重ね書きの1枚ごとのずらし幅 */
const STEP = 3

/** セグメントの線（原図の太い横線）と、機器がつながる所の小さな四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={2} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 1.8} y={y - 1.8} width={3.6} height={3.6} fill={MUTED} />
      ))}
    </g>
  )
}

/** 重ね書きの箱（原図どおり、後ろの枚数ぶん右下にずらして複数台を表す） */
function Stack({
  x,
  y,
  w,
  h,
  tone,
  lines,
  behind,
}: {
  x: number
  y: number
  w: number
  h: number
  tone: ToneName
  lines: string[]
  /** 後ろに重ねる枚数 */
  behind: number
}) {
  const t = TONE[tone]
  return (
    <g>
      {Array.from({ length: behind }, (_, i) => behind - i).map((k) => (
        <rect
          key={k}
          x={x + STEP * k}
          y={y + STEP * k}
          width={w}
          height={h}
          rx={2}
          fill={t.fill}
          stroke={t.stroke}
          strokeWidth={1.2}
        />
      ))}
      <Box x={x} y={y} w={w} h={h} tone={tone} lines={lines} size={SIZE} />
    </g>
  )
}

/** データベース（原図どおり横倒しの円筒）。文字は胴の部分に置く */
function Drum({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const t = TONE.host
  const e = 5
  const r = h / 2
  const fs = 7 * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + (w - e) / 2
  const startY = y + r + fs * 0.44 - lh / 2
  return (
    <g>
      <path
        d={`M${x + e},${y} L${x + w - e},${y} A${e},${r} 0 0 1 ${x + w - e},${y + h} L${x + e},${y + h} A${e},${r} 0 0 1 ${x + e},${y} Z`}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth={1.2}
      />
      <path d={`M${x + w - e},${y} A${e},${r} 0 0 0 ${x + w - e},${y + h}`} fill="none" stroke={t.stroke} strokeWidth={1.2} />
      <g>
        {/* 文字の置き場（胴の内側）。描画には出ないが、§5.4 の実測でこの枠との余白を測る */}
        <rect x={x + 2} y={y + 1} width={w - e - 4} height={h - 2} fill="none" stroke="none" />
        <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          <tspan x={cx} dy={0}>
            データ
          </tspan>
          <tspan x={cx} dy={lh}>
            ベース
          </tspan>
        </text>
      </g>
    </g>
  )
}

/** 内部セグメントからインターネットへ出る道筋（設問3(3)。逆向きに届く大きな ICMP も同じ所を通る） */
const OUTBOUND: [number, number][] = [
  [236, 44],
  [174, 44],
  [174, 17],
  [130, 17],
  [58, 17],
]

export default function H26G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={236} title="図1 IB システムの構成（抜粋）">
      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={88} y1={17} x2={112} y2={17} />
      {/* DMZ */}
      <Wire x1={130} y1={27} x2={130} y2={52} />
      <Wire x1={38} y1={52} x2={38} y2={64} />
      <Wire x1={106} y1={52} x2={106} y2={64} />
      <Bus x1={8} x2={160} y={52} taps={[38, 106, 130]} />
      {/* 内部セグメント */}
      <Poly
        points={[
          [148, 17],
          [174, 17],
          [174, 44],
        ]}
      />
      <Wire x1={204} y1={44} x2={204} y2={58} />
      <Wire x1={274} y1={44} x2={274} y2={58} />
      <Wire x1={262} y1={88} x2={262} y2={102} />
      <Wire x1={292} y1={91} x2={292} y2={102} />
      <Wire x1={319} y1={44} x2={319} y2={150} />
      <Bus x1={166} x2={334} y={44} taps={[174, 204, 274, 319]} />
      {/* ルータ ─ 勘定系システム（原図どおり稲妻の線） */}
      <Poly
        points={[
          [280, 160],
          [290, 156],
          [292, 164],
          [302, 160],
        ]}
      />
      {/* 業務セグメント */}
      <Wire x1={319} y1={170} x2={319} y2={196} />
      <Wire x1={140} y1={196} x2={140} y2={210} />
      <Wire x1={196} y1={196} x2={196} y2={210} />
      <Bus x1={108} x2={334} y={196} taps={[140, 196, 319]} />

      {/* ── 強調：輪と、内から外へ出る道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={112} y={7} w={36} h={20} />
          <Ring x={78} y={64} w={59} h={23} />
          <Ring x={176} y={58} w={62} h={26} />
          <Route points={OUTBOUND} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={46} cy={17} rx={42} ry={12} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box x={112} y={7} w={36} h={20} tone="device" lines={['FW']} size={SIZE} />

      {/* DMZ */}
      <Cap x={72} y={45} text="DMZ" anchor="middle" size={SIZE} color={TEXT} />
      <Stack x={10} y={64} w={56} h={20} tone="host" lines={['Web サーバ']} behind={2} />
      <Stack x={78} y={64} w={56} h={20} tone="host" lines={['DNS サーバ']} behind={1} />

      {/* 内部セグメント */}
      <Cap x={248} y={37} text="内部セグメント" anchor="middle" size={SIZE} color={TEXT} />
      <Stack x={176} y={58} w={56} h={20} tone="host" lines={['DNS サーバ']} behind={2} />
      <Stack x={244} y={58} w={60} h={30} tone="host" lines={['データベース', 'サーバ']} behind={1} />
      <Drum x={250} y={102} w={48} h={30} />

      {/* ルータ・勘定系システム・業務セグメント */}
      <Box x={302} y={150} w={34} h={20} tone="device" lines={['ルータ']} size={SIZE} />
      <Ell cx={246} cy={160} rx={34} ry={16} tone="outside" lines={['勘定系', 'システム']} size={7} />
      <Cap x={110} y={188} text="業務セグメント" size={SIZE} color={TEXT} />
      <Box x={124} y={210} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={168} y={223} text="…" anchor="middle" color={MUTED} />
      <Box x={180} y={210} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={190}
          y={2}
          w={124}
          lines={['内→外も FW で遮断・記録']}
          leader={[
            [190, 11.4],
            [151.5, 11.4],
          ]}
        />
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={228} text="FW：ファイアウォール" size={7} color={MUTED} />
    </FigSvg>
  )
}
