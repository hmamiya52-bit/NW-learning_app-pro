import { Box, Callout, Cap, DashFrame, FigSvg, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED, SEGMENT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 E 社のネットワーク構成（抜粋）— R1 午後Ⅰ 問3
 *
 * 原図の縦長の並び（上にサーバ室、下にフロア1・フロア2。L3SW0 から下りた2本の線が各フロアの L3SW へ入る）は、
 * 340 の幅にそのまま入るので組み直していない。サーバ室・フロアは原図どおり角の丸い太枠、LAN セグメントは破線の枠。
 * 凡例（破線の枠＝LAN セグメント、L2SW・L3SW）は原図どおりサーバ室の右に置き、注記1・2 は examFigures の note に置く。
 *
 * 色は役割だけで決めている。L3SW・L2SW は device、業務サーバ・メンテナンスサーバ・DHCP サーバ・PC 管理サーバ・PC は host。
 *
 * 解説を開いたときは、フロア1 の PC のセグメントから L3SW1・L3SW0 を通って DHCP サーバへ行く DHCP の中継の道筋をなぞり（設問1）、
 * L3SW1・L3SW2（中継する所。通信制限装置もここにつなぐ。設問3）と、メンテナンスサーバ・PC 管理サーバの組（設問4(1)）に輪を付ける。
 */

const SIZE = 7.5

/** サーバ室・フロアの枠（原図どおり角の丸い太枠。ラベルは左上） */
function Room({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={FRAME} strokeWidth={1.6} />
      <text x={x + 7} y={y + 15} fontSize={8.5 * FONT_SCALE} fontWeight={700} fill={FRAME}>
        {label}
      </text>
    </g>
  )
}

/** 「…」（原図の同じ機器の並びの省略。全角 1em なので、すき間は 16 取ってある） */
function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="…" anchor="middle" color={MUTED} />
}

/** フロアの中身（L3SW と、PC のセグメント2つ） */
function Floor({ y, l3, sw }: { y: number; l3: string; sw: [string, string, string, string] }) {
  const segY = y + 42
  const swY = segY + 8
  const pcY = segY + 42
  return (
    <g>
      <DashFrame x={70} y={segY} w={126} h={74} />
      <DashFrame x={202} y={segY} w={128} h={74} />
      {/* L3SW から4台の L2SW へ（原図どおり扇形） */}
      <Wire x1={186} y1={y + 28} x2={99} y2={swY} />
      <Wire x1={196} y1={y + 28} x2={161} y2={swY} />
      <Wire x1={206} y1={y + 28} x2={231} y2={swY} />
      <Wire x1={216} y1={y + 28} x2={293} y2={swY} />
      <Box x={178} y={y + 8} w={46} h={20} tone="device" lines={[l3]} size={SIZE} />
      <Box x={76} y={swY} w={46} h={20} tone="device" lines={[sw[0]]} size={SIZE} />
      <Dots x={130} y={swY + 13} />
      <Box x={138} y={swY} w={46} h={20} tone="device" lines={[sw[1]]} size={SIZE} />
      <Box x={208} y={swY} w={46} h={20} tone="device" lines={[sw[2]]} size={SIZE} />
      <Dots x={262} y={swY + 13} />
      <Box x={270} y={swY} w={46} h={20} tone="device" lines={[sw[3]]} size={SIZE} />
      <Box x={83} y={pcY} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Dots x={123} y={pcY + 13} />
      <Box x={131} y={pcY} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Box x={215} y={pcY} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Dots x={255} y={pcY + 13} />
      <Box x={263} y={pcY} w={32} h={20} tone="host" lines={['PC']} size={SIZE} />
    </g>
  )
}

/** DHCP の中継: フロア1 の L2SW11 → L3SW1 → L3SW0 → L2SW02 → DHCP サーバ */
const RELAY: [number, number][] = [
  [99, 256],
  [99, 246],
  [186, 224],
  [190, 214],
  [178, 214],
  [44, 214],
  [44, 106],
  [44, 96],
  [58, 100],
  [82, 116],
  [105, 118],
  [105, 140],
  [105, 150],
]

export default function R1G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={456} title="図1 E 社のネットワーク構成（抜粋）">
      {/* ── 強調：メンテナンスサーバと PC 管理サーバの組の輪（2台1組なので線より先に敷く）── */}
      {highlight && <Ring x={142} y={102} w={68} h={70} rx={4} />}

      {/* ── 囲み ───────────────────────────────────── */}
      <Room x={4} y={4} w={218} h={178} label="サーバ室" />
      <DashFrame x={74} y={24} w={142} h={70} />
      <DashFrame x={74} y={100} w={142} h={76} />
      <Room x={64} y={196} w={272} h={122} label="フロア1" />
      <Room x={64} y={328} w={272} h={122} label="フロア2" />

      {/* ── 線：サーバ室 ───────────────────────────────── */}
      <Wire x1={104} y1={60} x2={104} y2={68} />
      <Wire x1={160} y1={60} x2={124} y2={68} />
      <Wire x1={58} y1={92} x2={82} y2={80} />
      <Wire x1={58} y1={100} x2={82} y2={116} />
      <Wire x1={128} y1={118} x2={144} y2={118} />
      <Wire x1={105} y1={128} x2={105} y2={140} />
      <Wire x1={124} y1={128} x2={148} y2={140} />
      {/* L3SW0 から各フロアの L3SW へ（原図どおり下りてから右へ） */}
      <Wire x1={44} y1={106} x2={44} y2={214} />
      <Wire x1={44} y1={214} x2={178} y2={214} />
      <Wire x1={24} y1={106} x2={24} y2={346} />
      <Wire x1={24} y1={346} x2={178} y2={346} />

      {/* ── 強調：DHCP の中継の道筋と、L3SW1・L3SW2 の輪（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={178} y={204} w={46} h={20} />
          <Ring x={178} y={336} w={46} h={20} />
          <Route points={RELAY} />
        </g>
      )}

      {/* ── ノード：サーバ室 ─────────────────────────────── */}
      <Box x={82} y={30} w={44} h={30} tone="host" lines={['業務', 'サーバ']} size={SIZE} />
      <Dots x={136} y={48} />
      <Box x={146} y={30} w={44} h={30} tone="host" lines={['業務', 'サーバ']} size={SIZE} />
      <Box x={82} y={68} w={46} h={20} tone="device" lines={['L2SW01']} size={SIZE} />
      <Box x={12} y={86} w={46} h={20} tone="device" lines={['L3SW0']} size={SIZE} />
      <Box x={82} y={108} w={46} h={20} tone="device" lines={['L2SW02']} size={SIZE} />
      <Box x={144} y={104} w={64} h={30} tone="host" lines={['メンテナンス', 'サーバ']} size={SIZE} />
      <Box x={82} y={140} w={46} h={30} tone="host" lines={['DHCP', 'サーバ']} size={SIZE} />
      <Box x={144} y={140} w={46} h={30} tone="host" lines={['PC管理', 'サーバ']} size={SIZE} />

      {/* ── ノード：フロア1・フロア2 ──────────────────────── */}
      <Floor y={196} l3="L3SW1" sw={['L2SW11', 'L2SW15', 'L2SW21', 'L2SW25']} />
      <Floor y={328} l3="L3SW2" sw={['L2SW31', 'L2SW35', 'L2SW41', 'L2SW45']} />

      {/* ── 凡例（原図どおりサーバ室の右）──────────────────── */}
      <rect x={230} y={14} width={22} height={11} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="3 2" />
      <Cap x={255} y={23} text="：LANセグメント" size={7} color={MUTED} />
      <Cap x={230} y={39} text="L2SW：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={230} y={52} text="L3SW：レイヤ3スイッチ" size={7} color={MUTED} />

      {/* ── 強調の文字（凡例の下の空き）──────────────────── */}
      {highlight && (
        <g>
          <Callout x={230} y={68} w={100} lines={['L3SW1・L3SW2 が', 'DHCP を中継する']} />
          <Callout
            x={230}
            y={122}
            w={100}
            lines={['対処用から通す', 'のはこの2台']}
            leader={[
              [230, 137],
              [213.5, 137],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
