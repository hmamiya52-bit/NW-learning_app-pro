import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現在の営業支援システムのネットワーク構成（抜粋）— H27 午後Ⅰ 問3
 *
 * 原図はインターネット・モバイル端末・略語の説明を F 社の左の外に縦に並べ、F 社を右に置く。
 * 横に長く 375px では文字が読めないので、インターネットとモバイル端末を F 社の上に、
 * 略語の説明を下に移し、F 社を全幅にした。F 社の中の並び（上にルータ・SW1・FW、
 * 左下に内部 LAN、右下に DMZ）、FW から SW3 と SW2 へ分かれる2本の線、
 * 「F社」の文字が右上にあることは原図どおり。
 *
 * 色は役割だけで決めている。ルータ・SW・FW は device、サーバ・PC・モバイル端末は host、
 * インターネットは outside。
 *
 * 解説を開いたときは、社内の PC がインターネットへ出る道筋を赤でなぞり、
 * その道筋が通る SW1 と SW3 に輪を付け、通らない SW2 を吹き出しで指す（設問2(1)）。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5

/** 社内の PC ⇔ インターネット（ルータ → SW1 → FW → SW3 → PC。SW2 は通らない） */
const PC_TO_NET: [number, number][] = [
  [56, 17],
  [56, 28],
  [56, 48],
  [56, 57],
  [74, 57],
  [98, 57],
  [130, 57],
  [152, 57],
  [168, 57],
  [160, 66],
  [132, 104],
  [125, 113],
  [118, 122],
  [98, 144],
  [98, 153],
]

const LEGEND: [string, number, number][] = [
  ['SW：スイッチングハブ', 8, 192],
  ['FW：ファイアウォール', 120, 192],
  ['DB：データベース', 8, 204],
  ['RP：リバースプロキシ', 120, 204],
]

export default function H27G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={210} title="図1 現在の営業支援システムのネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={4} y={36} w={332} h={142} label="F社" labelAnchor="end" />
      <DashFrame x={8} y={76} w={184} h={96} label="内部 LAN" />
      <DashFrame x={200} y={76} w={132} h={96} label="DMZ" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={100} y1={17} x2={114} y2={17} />
      <Wire x1={56} y1={28} x2={56} y2={48} />
      <Wire x1={74} y1={57} x2={98} y2={57} />
      <Wire x1={130} y1={57} x2={152} y2={57} />
      {/* FW から内部 LAN（SW3）と DMZ（SW2）へ */}
      <Wire x1={160} y1={66} x2={132} y2={104} />
      <Wire x1={176} y1={66} x2={214} y2={116} />
      {/* 内部 LAN */}
      <Wire x1={56} y1={113} x2={108} y2={111} />
      <Wire x1={56} y1={151} x2={108} y2={119} />
      <Wire x1={118} y1={122} x2={98} y2={144} />
      <Wire x1={132} y1={122} x2={154} y2={144} />
      {/* DMZ */}
      <Wire x1={248} y1={117} x2={286} y2={109} />
      <Wire x1={248} y1={125} x2={286} y2={151} />

      {/* ── 強調：輪と、社内の PC がインターネットへ出る道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={98} y={48} w={32} h={18} />
          <Ring x={108} y={104} w={34} h={18} />
          <Route points={PC_TO_NET} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={56} cy={17} rx={44} ry={11} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box x={114} y={8} w={60} h={18} tone="host" lines={['モバイル端末']} size={SIZE} />
      <Box x={38} y={48} w={36} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Box x={98} y={48} w={32} h={18} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={152} y={48} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />

      {/* 内部 LAN */}
      <Box x={16} y={98} w={40} h={30} tone="host" lines={['Web', 'サーバ']} size={SIZE} />
      <Box x={16} y={136} w={40} h={30} tone="host" lines={['DB', 'サーバ']} size={SIZE} />
      <Box x={108} y={104} w={34} h={18} tone="device" lines={['SW3']} size={SIZE} />
      <Box x={84} y={144} w={28} h={18} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={126} y={156} text="…" anchor="middle" color={MUTED} />
      <Box x={140} y={144} w={28} h={18} tone="host" lines={['PC']} size={SIZE} />

      {/* DMZ */}
      <Box x={214} y={112} w={34} h={18} tone="device" lines={['SW2']} size={SIZE} />
      <Box x={286} y={94} w={40} h={30} tone="host" lines={['DNS', 'サーバ']} size={SIZE} />
      <Box x={286} y={136} w={40} h={30} tone="host" lines={['RP', 'サーバ']} size={SIZE} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={204}
          y={150}
          w={76}
          lines={['SW2 は通らない']}
          leader={[
            [226, 150],
            [226, 130],
          ]}
        />
      )}

      {/* ── 凡例（原図は F 社の左の外）──────────────────────── */}
      {LEGEND.map(([t, x, y]) => (
        <Cap key={t} x={x} y={y} text={t} size={7} color={MUTED} />
      ))}
    </FigSvg>
  )
}
