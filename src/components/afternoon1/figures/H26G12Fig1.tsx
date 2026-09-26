import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, MARK, MARK_FILL, MARK_TEXT, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 Z社の現在のネットワーク構成（抜粋）— H26 午後Ⅰ 問2
 *
 * 機器の並び（右の列にインターネット・ルータ・SW1・SW2・L3SW、SW2 の左右に FW1・FW2、
 * 左上に DMZ、左下に SW3、下に2つの VLAN）と、どの箱がどの箱とつながるかは原図どおり。
 * 原図は横長なので、横の位置は原図の比率のまま縮め、文字が読める大きさになるよう縦の間隔を広げた。
 * VLAN の枠のラベル（企画部 VLAN・営業部 VLAN）は原図どおり枠の左端に2行で置く。
 *
 * 色は役割だけで決めている。ルータ・FW・L3SW・SW は device、サーバと PC は host、
 * インターネットは outside。
 *
 * 解説を開いたときは、SW3〜L3SW 間をトランク接続として赤でなぞり（設問2(1)）、
 * FW と IP で直接やり取りする機器（ルータ・DNS サーバと Web サーバ・L3SW）に輪を付け（設問2(5) a）、
 * SW4 に L3SW との入れ替えの吹き出しを付ける（設問3(1)）。
 */

const TEXT = '#334155'
/** 箱の文字の大きさ（Box の size） */
const SIZE = 8

/**
 * 経路に添える札。共通の RouteTag（高さ fs+6）は Meiryo UI だと文字が枠に触るので、
 * 高さを 2 足して文字を上下の中央に置く（H25G11Fig1 の Tag と同じ）。
 */
function Tag({ cx, cy, text, w }: { cx: number; cy: number; text: string; w: number }) {
  const fs = 7.5 * FONT_SCALE
  const h = fs + 8
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={MARK_FILL} stroke={MARK} strokeWidth={1} />
      <text x={cx} y={cy + fs * 0.415} textAnchor="middle" fontSize={fs} fontWeight={700} fill={MARK_TEXT}>
        {text}
      </text>
    </g>
  )
}

/** VLAN の枠の左端に置く2行のラベル（原図どおり） */
function VlanLabel({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g>
      <Cap x={x} y={y} text={name} size={7} color={TEXT} />
      <Cap x={x} y={y + 12} text="VLAN" size={7} color={TEXT} />
    </g>
  )
}

/**
 * PC の箱（幅 28）。cx は箱の中心。
 * 同じ組の2台は中心を 44 離し、あいだの「…」（全角 1em）の両側に 3px ずつ空ける
 */
function Pc({ cx, y }: { cx: number; y: number }) {
  return <Box x={cx - 14} y={y} w={28} h={18} tone="host" lines={['PC']} size={SIZE} />
}

/** SW3〜L3SW 間（企画部 VLAN と営業部 VLAN の両方を運ぶ1本） */
const TRUNK: [number, number][] = [
  [135, 157],
  [270, 157],
]

export default function H26G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={282} title="図1 Z社の現在のネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={4} y={32} w={332} h={230} label="Z社" />
      <DashFrame x={40} y={44} w={162} h={84} label="DMZ" color={MUTED} />
      <DashFrame x={8} y={180} w={248} h={32} color={MUTED} />
      <DashFrame x={76} y={224} w={256} h={32} color={MUTED} />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* インターネット → ルータ → SW1 → FW1・FW2 */}
      <Wire x1={270} y1={27} x2={270} y2={40} />
      <Wire x1={270} y1={58} x2={270} y2={72} />
      <Wire x1={262} y1={90} x2={232} y2={106} />
      <Wire x1={278} y1={90} x2={308} y2={106} />
      {/* フェールオーバリンク（FW1 ─ SW2 ─ FW2） */}
      <Wire x1={244} y1={115} x2={253} y2={115} />
      <Wire x1={287} y1={115} x2={296} y2={115} />
      {/* DMZ */}
      <Wire x1={146} y1={61} x2={160} y2={81} />
      <Wire x1={146} y1={109} x2={160} y2={89} />
      <Wire x1={194} y1={84} x2={220} y2={106} />
      <Wire x1={194} y1={88} x2={302} y2={106} />
      {/* FW1・FW2 → L3SW → SW3 */}
      <Wire x1={232} y1={124} x2={262} y2={148} />
      <Wire x1={308} y1={124} x2={278} y2={148} />
      <Wire x1={152} y1={157} x2={250} y2={157} />
      {/* SW3 の下（企画部へ2本、営業部へ2本） */}
      <Wire x1={126} y1={166} x2={60} y2={186} />
      <Wire x1={130} y1={166} x2={104} y2={186} />
      <Wire x1={135} y1={166} x2={135} y2={230} />
      <Wire x1={142} y1={166} x2={179} y2={230} />
      {/* L3SW の下（企画部へ2本、営業部へ2本） */}
      <Wire x1={258} y1={166} x2={190} y2={186} />
      <Wire x1={262} y1={166} x2={234} y2={186} />
      <Wire x1={266} y1={166} x2={266} y2={230} />
      <Wire x1={280} y1={166} x2={310} y2={230} />

      {/* ── 強調：輪と、トランク接続の区間（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={248} y={40} w={44} h={18} />
          <Ring x={80} y={52} w={66} h={66} />
          <Ring x={250} y={148} w={40} h={18} />
          <Route points={TRUNK} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={270} cy={15} rx={46} ry={12} tone="outside" lines={['インターネット']} size={7.5} />
      <Box x={248} y={40} w={44} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Box x={253} y={72} w={34} h={18} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={210} y={106} w={34} h={18} tone="device" lines={['FW1']} size={SIZE} />
      <Box x={253} y={106} w={34} h={18} tone="device" lines={['SW2']} size={SIZE} />
      <Box x={296} y={106} w={34} h={18} tone="device" lines={['FW2']} size={SIZE} />
      <Box x={80} y={52} w={66} h={18} tone="host" lines={['DNS サーバ']} size={7.5} />
      <Box x={80} y={100} w={66} h={18} tone="host" lines={['Web サーバ']} size={7.5} />
      <Box x={160} y={76} w={34} h={18} tone="device" lines={['SW4']} size={SIZE} />
      <Box x={118} y={148} w={34} h={18} tone="device" lines={['SW3']} size={SIZE} />
      <Box x={250} y={148} w={40} h={18} tone="device" lines={['L3SW']} size={SIZE} />

      {/* 企画部 VLAN */}
      <VlanLabel x={12} y={192} name="企画部" />
      <Pc cx={60} y={186} />
      <Cap x={82} y={198} text="…" anchor="middle" />
      <Pc cx={104} y={186} />
      <Pc cx={190} y={186} />
      <Cap x={212} y={198} text="…" anchor="middle" />
      <Pc cx={234} y={186} />

      {/* 営業部 VLAN */}
      <VlanLabel x={80} y={236} name="営業部" />
      <Pc cx={135} y={230} />
      <Cap x={157} y={242} text="…" anchor="middle" />
      <Pc cx={179} y={230} />
      <Pc cx={266} y={230} />
      <Cap x={288} y={242} text="…" anchor="middle" />
      <Pc cx={310} y={230} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Tag cx={201} cy={157} text="トランク" w={48} />
          <Callout
            x={40}
            y={4}
            w={156}
            lines={['仮想 FW 案で L3SW と入れ替え']}
            leader={[
              [177, 22.8],
              [177, 76],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={4} y={276} text="FW：ファイアウォール" size={7} color={MUTED} />
      <Cap x={104} y={276} text="L3SW：レイヤ3スイッチ" size={7} color={MUTED} />
      <Cap x={212} y={276} text="SW：レイヤ2スイッチ" size={7} color={MUTED} />
    </FigSvg>
  )
}
