import { ArrowDefs, Box, Callout, Cap, FigSvg, Ring, Route } from './primitives'
import { FONT_SCALE, LINE, LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 FW の負荷分散の基本構成 — H27 午後Ⅰ 問2
 *
 * 機器の並び（機器a・ルータa・LBa・FW1／FW2・LBb・ルータb・機器b）、4つのサブネットと境目の破線
 * （ルータa・FW・ルータb の上を通る）、(A)・(B) の矢印、注記1・注記2 とルーティング情報の表は原図どおり。
 * 注記2 は「次のとおり」と表を指すので、注記と表も図の中に置いて順番を保つ。
 *
 * 色は役割だけで決めている。ルータ・LB・FW は device、機器a・機器b は host
 * （通信の両端。原図では装置の種類を示していないが、TCP コネクションの端点なので host にした）。
 * (A)・(B) の矢印はパケットの向きを示す書き込みなので LOGICAL で太く描く。
 *
 * 解説を開いたときは、FW2 を経由するセッションの道筋を赤でなぞり、ルータa の経路表の行に輪を付け、
 * LBa が宛先 MAC アドレスを書き換えること（設問2(1)）と、戻りも LBb が FW2 を選ぶこと（設問2(3)）を
 * 吹き出しで示す。
 */

const TEXT = '#334155'
/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5
/** 本線の上下の中心 */
const MID = 62

/** サブネットの境目（ルータa・FW・ルータb の中心） */
const BORDERS = [63, 172, 273]
const SUBNETS: { x: number; label: string }[] = [
  { x: 31.5, label: 'サブネット a1' },
  { x: 117.5, label: 'サブネット a2' },
  { x: 222.5, label: 'サブネット b2' },
  { x: 306.5, label: 'サブネット b1' },
]

/** 注記2 のルーティング情報（表の左端・列の幅・行の高さ） */
const TABLE_X = 60
const COLS = [70, 90, 70]
const ROW_H = 18
const TABLE_Y = 140
const TABLE: string[][] = [
  ['ルータ名', '宛先', 'ゲートウェイ'],
  ['ルータa', 'サブネット b1', 'FW1'],
  ['ルータb', 'サブネット a1', 'FW1'],
]

/** 表のマス（枠と文字を1つの g にまとめ、§5.4 の検査2 で余白を測れるようにする） */
function Cell({ x, y, w, text, bold }: { x: number; y: number; w: number; text: string; bold?: boolean }) {
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={ROW_H} fill="#ffffff" stroke={MUTED} strokeWidth={1} />
      <text x={x + w / 2} y={y + ROW_H / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={bold ? 700 : 400} fill={TEXT}>
        {text}
      </text>
    </g>
  )
}

/** FW2 を経由するセッションの道筋（ルータa → LBa → FW2 → LBb → ルータb） */
const SESSION: [number, number][] = [
  [82, MID],
  [104, MID],
  [119, MID],
  [134, 66],
  [156, 79],
  [172, 81],
  [188, 79],
  [210, 66],
  [225, MID],
  [240, MID],
  [254, MID],
]

export default function H27G12Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('h27g12-fig2')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={200} title="図2 FW の負荷分散の基本構成">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── サブネットの名前と境目 ───────────────────────── */}
      {SUBNETS.map((s) => (
        <Cap key={s.label} x={s.x} y={13} text={s.label} anchor="middle" size={SIZE} color={TEXT} />
      ))}
      {BORDERS.map((x) => (
        <line key={x} x1={x} y1={20} x2={x} y2={104} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      {[
        [35, MID, 44, MID],
        [82, MID, 104, MID],
        [134, 58, 156, 45],
        [134, 66, 156, 79],
        [188, 45, 210, 58],
        [188, 79, 210, 66],
        [240, MID, 254, MID],
        [292, MID, 304, MID],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={1.2} />
      ))}

      {/* ── 強調：セッションの道筋と、経路表の行の輪（ノード・表より先）── */}
      {highlight && (
        <g>
          <Route points={SESSION} />
          <Ring x={TABLE_X} y={TABLE_Y + ROW_H} w={COLS[0] + COLS[1] + COLS[2]} h={ROW_H} pad={2} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={2} y={53} w={33} h={18} tone="host" lines={['機器a']} size={SIZE} />
      <Box x={44} y={53} w={38} h={18} tone="device" lines={['ルータa']} size={SIZE} />
      <Box x={104} y={53} w={30} h={18} tone="device" lines={['LBa']} size={SIZE} />
      <Box x={156} y={34} w={32} h={18} tone="device" lines={['FW1']} size={SIZE} />
      <Box x={156} y={72} w={32} h={18} tone="device" lines={['FW2']} size={SIZE} />
      <Box x={210} y={53} w={30} h={18} tone="device" lines={['LBb']} size={SIZE} />
      <Box x={254} y={53} w={38} h={18} tone="device" lines={['ルータb']} size={SIZE} />
      <Box x={304} y={53} w={33} h={18} tone="host" lines={['機器b']} size={SIZE} />

      {/* (A)・(B) の矢印（パケットの向き） */}
      <line x1={76} y1={84} x2={100} y2={84} stroke={LOGICAL} strokeWidth={2.2} markerEnd={arrow} />
      <Cap x={86} y={100} text="(A)" anchor="middle" size={SIZE} color={TEXT} />
      <line x1={124} y1={80} x2={146} y2={88} stroke={LOGICAL} strokeWidth={2.2} markerEnd={arrow} />
      <Cap x={130} y={100} text="(B)" anchor="middle" size={SIZE} color={TEXT} />

      {/* ── 注記と、ルータのルーティング情報（注記2）──────────── */}
      <Cap x={6} y={118} text="注記1 (A)，(B) は設問 2 (1) で使用する。" size={7} color={MUTED} />
      <Cap x={6} y={131} text="注記2 各ルータのルーティング情報は次のとおりである。" size={7} color={MUTED} />
      {TABLE.map((row, r) =>
        row.map((text, c) => (
          <Cell
            key={`${r}-${c}`}
            x={TABLE_X + COLS.slice(0, c).reduce((a, b) => a + b, 0)}
            y={TABLE_Y + r * ROW_H}
            w={COLS[c]}
            text={text}
            bold={r === 0}
          />
        )),
      )}

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={68}
            y={20}
            w={72}
            lines={['宛先 MAC を', 'FW2 に書き換え']}
            leader={[
              [112, 50.6],
              [112, 53],
            ]}
          />
          <Callout
            x={200}
            y={94}
            w={66}
            lines={['戻りも FW2 を', 'LBb が選ぶ']}
            leader={[
              [225, 94],
              [225, 71],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
