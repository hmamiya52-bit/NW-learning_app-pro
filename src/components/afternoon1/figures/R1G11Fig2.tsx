import { Box, Callout, Cap, FigSvg, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 監視方法を追加した後の管理ネットワークの構成案（抜粋）— R1 午後Ⅰ 問1
 *
 * 原図の並びのまま 340 の幅に入るので組み直していない。左に監視装置 M と L2SWz2・L2SWz1、
 * 右に コアルータ・L3SW・L2SW の2列。実線は顧客のデータが流れるネットワーク、点線は監視のためのネットワーク
 * （R4-G1-2 図2 と同じく MUTED の細い点線）。● は監視対象装置の管理 IF で、原図どおり各装置の角に置く。
 * L2SWz2 からの点線は、管理 IF（●）ではなくコアルータの箱そのもの（顧客のデータが流れる側の IF）へつながる。
 * L2SWz1 からコアルータ2 の管理 IF への点線は、原図どおり曲線で描く。
 *
 * 色は役割だけで決めている。L2SWz1・L2SWz2・コアルータ・L3SW・L2SW は device、監視装置 M は host。
 *
 * 解説を開いたときは、追加する監視の道筋（M → L2SWz2 → コアルータ1 → L3SW1）をなぞり、L2SWz2 と L3SW1 に輪を付ける（設問2(3)）。
 */

const SIZE = 7.5
/** 管理 IF（原図の黒い丸） */
const DOT = '#334155'
/** 監視のためのネットワーク（原図の点線） */
const DOTTED = '1.5 2.5'

function Mon({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <Wire x1={x1} y1={y1} x2={x2} y2={y2} color={MUTED} width={1} dash={DOTTED} />
}

/** 追加する監視: M → L2SWz2 → コアルータ1 → L3SW1 */
const PING: [number, number][] = [
  [24, 60],
  [24, 50],
  [64, 22],
  [88, 22],
  [112, 28],
  [176, 50],
  [176, 60],
  [160, 60],
  [160, 124],
]

export default function R1G11Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={268} title="図2 監視方法を追加した後の管理ネットワークの構成案（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <g>
        <rect x={4} y={4} width={332} height={202} fill="none" stroke={FRAME} strokeWidth={1.3} />
        <text x={10} y={201} fontSize={8.5 * FONT_SCALE} fontWeight={700} fill={FRAME}>
          ビル3階
        </text>
      </g>

      {/* ── 線：顧客のデータが流れるネットワーク（実線）────── */}
      <Wire x1={190} y1={60} x2={256} y2={60} width={1.6} />
      <Wire x1={160} y1={70} x2={160} y2={168} width={1.6} />
      <Wire x1={287} y1={70} x2={287} y2={168} width={1.6} />
      <Wire x1={182} y1={124} x2={266} y2={124} width={1.6} />
      <Wire x1={182} y1={178} x2={266} y2={178} width={1.6} />

      {/* ── 線：監視を行うために必要なネットワーク（点線）──── */}
      <Mon x1={24} y1={50} x2={64} y2={22} />
      <Mon x1={24} y1={70} x2={64} y2={146} />
      <Mon x1={112} y1={28} x2={176} y2={50} />
      <Mon x1={112} y1={18} x2={290} y2={50} />
      <Mon x1={92} y1={140} x2={130} y2={70} />
      <path d="M100,140 C120,98 236,104 256,70" fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray={DOTTED} />
      <Mon x1={112} y1={145} x2={140} y2={134} />
      <Mon x1={112} y1={149} x2={266} y2={134} />
      <Mon x1={112} y1={153} x2={266} y2={168} />
      <Mon x1={112} y1={157} x2={140} y2={168} />

      {/* ── 強調：輪と、追加する監視の道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={64} y={12} w={48} h={20} />
          <Ring x={140} y={114} w={42} h={20} />
          <Route points={PING} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={14} y={50} w={20} h={20} tone="host" lines={['M']} size={SIZE} />
      <Box x={64} y={12} w={48} h={20} tone="device" lines={['L2SWz2']} size={SIZE} />
      <Box x={64} y={140} w={48} h={20} tone="device" lines={['L2SWz1']} size={SIZE} />
      <Box x={130} y={50} w={60} h={20} tone="device" lines={['コアルータ1']} size={SIZE} />
      <Box x={256} y={50} w={60} h={20} tone="device" lines={['コアルータ2']} size={SIZE} />
      <Box x={140} y={114} w={42} h={20} tone="device" lines={['L3SW1']} size={SIZE} />
      <Box x={266} y={114} w={42} h={20} tone="device" lines={['L3SW2']} size={SIZE} />
      <Box x={140} y={168} w={42} h={20} tone="device" lines={['L2SW1']} size={SIZE} />
      <Box x={266} y={168} w={42} h={20} tone="device" lines={['L2SW2']} size={SIZE} />
      {/* 管理 IF（●） */}
      {(
        [
          [130, 70],
          [256, 70],
          [140, 134],
          [266, 134],
          [140, 168],
          [266, 168],
        ] as [number, number][]
      ).map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.6} fill={DOT} />
      ))}

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={20}
          y={170}
          w={100}
          lines={['管理 IF しか見えない']}
          leader={[
            [88, 170],
            [88, 160],
          ]}
        />
      )}

      {/* ── 注記（原図は図の下）──────────────────────────── */}
      <Cap x={6} y={222} text="注記1" size={7} color={MUTED} />
      <circle cx={39} cy={219} r={3.2} fill={DOT} />
      <Cap x={46} y={222} text="は，監視対象装置の管理 IF を示す。" size={7} color={MUTED} />
      <Cap x={6} y={235} text="注記2" size={7} color={MUTED} />
      <Wire x1={32} y1={232} x2={50} y2={232} width={1.6} />
      <Cap x={53} y={235} text="は，顧客のデータが流れるネットワークを示す。" size={7} color={MUTED} />
      <Cap x={6} y={248} text="注記3" size={7} color={MUTED} />
      <Wire x1={32} y1={245} x2={50} y2={245} color={MUTED} width={1} dash={DOTTED} />
      <Cap x={53} y={248} text="は，監視を行うために必要なネットワークを示す。" size={7} color={MUTED} />
      <Cap x={6} y={260} text="注記4 ISP とビル4階の構成は省略している。" size={7} color={MUTED} />
    </FigSvg>
  )
}
